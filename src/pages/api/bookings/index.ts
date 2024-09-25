import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Step 1: Validate booking input
async function validateBookingInput(car_id: number, user_id: number, start_date: string, end_date: string) {
  if (!car_id || !user_id || !start_date || !end_date) {
    throw new Error('Missing required fields.');
  }
}

// Step 2: Check for overlapping car bookings
async function checkOverlappingBookings(res: NextApiResponse, car_id: number, start_date: string, end_date: string) {
  const overlappingBooking = await prisma.bookings.findFirst({
    where: {
      car_id: car_id,
      status: 'active',
      OR: [
        { start_date: { lte: new Date(end_date) }, end_date: { gte: new Date(start_date) } },
      ],
    },
  });

  if (overlappingBooking) {
    return res.status(400).json({ error: 'This car is booked for the selected dates.' });
  }
}


// Step 3: Check if extras are available for the entire date range
async function checkExtrasAvailability(res: NextApiResponse, extras: any[], start_date: string, end_date: string) {
  console.log('Checking extras availability:', extras);

  for (const extra of extras) {
    const { id, quantity } = extra;  // Changed to `id` as per the log structure

    // Fetch the total available quantity of the extra
    const extraDetails = await prisma.extras.findUnique({
      where: { id: id },  // Use `id` instead of `extra_id`
      select: { name: true, total_quantity: true },
    });

    if (!extraDetails) {
      return res.status(404).json({ error: `Extra with ID ${id} not found.` });
    }

    const extraName = extraDetails.name;

    // Check if there are enough extras available across the requested date range
    let currentDate = new Date(start_date);
    const endDate = new Date(end_date);

    while (currentDate <= endDate) {
      // Aggregate the total quantity of the extra already booked in the current date range
      const totalBookedQuantity = await prisma.booking_extras.aggregate({
        _sum: { quantity: true },
        where: {
          extra_id: id,  // Use `id` here as well
          bookings: {
            OR: [
              { start_date: { lte: currentDate }, end_date: { gte: currentDate } },
            ],
          },
        },
      });

      const bookedQuantity = totalBookedQuantity._sum.quantity || 0;

      // Check if adding this booking would exceed the total available quantity
      if (bookedQuantity + quantity > extraDetails.total_quantity) {
        return res.status(400).json({
          error: `Not enough ${extraName} available on ${currentDate.toDateString()}. Requested: ${quantity}, Available: ${extraDetails.total_quantity - bookedQuantity}`
        });
      }

      // Move to the next day in the range
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return res.status(200).json({ message: 'All extras are available.' });
}



// Step 4: Create the booking with extras
async function createBooking(car_id: number, user_id: number, start_date: string, end_date: string, total_price: string, extras: any[]) {
  return await prisma.bookings.create({
    data: {
      car_id,
      user_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price: parseFloat(total_price),
      status: 'active',
      booking_extras: {
        create: extras.map((extra) => ({
          extra_id: extra.id,
          quantity: extra.quantity,
        })),
      },
    },
    include: {
      booking_extras: true,
    },
  });
}

// Main handler for booking creation
async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { car_id, user_id, start_date, end_date, total_price, extras = [] } = req.body;

  try {
    // Step 1: Validate booking input
    await validateBookingInput(car_id, user_id, start_date, end_date);

    // Step 2: Check for overlapping car bookings
    await checkOverlappingBookings(res, car_id, start_date, end_date); // Pass 'res' here

    // Step 3: Check if extras are available across the entire date range
    await checkExtrasAvailability(res, extras, start_date, end_date);

    // Step 4: Create the booking with extras
    const newBooking = await createBooking(car_id, user_id, start_date, end_date, total_price, extras);

    // Respond with the newly created booking
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ error: error.message });
  }
}

// Step 5: Retrieve bookings for a user
async function getBookingsByUser(user_id: number) {
  return await prisma.bookings.findMany({
    where: { user_id },
    include: {
      cars: true, // Include car details in the booking
      booking_extras: {
        include: {
          extras: true, // Include extra details
        },
      },
    },
  });
}

// Main handler for retrieving user bookings
async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const bookings = await getBookingsByUser(parseInt(user_id as string));
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user.' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
}

// Main API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await handlePostRequest(req, res);
  } else if (req.method === 'GET') {
    await handleGetRequest(req, res);
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
