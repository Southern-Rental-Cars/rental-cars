import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path to your Prisma client if needed

// Step 1: Validate booking input
async function validateBookingInput(car_id: number, user_id: number, start_date: string, end_date: string) {
  if (!car_id || !user_id || !start_date || !end_date) {
    throw new Error('Missing required fields.');
  }
}

// Step 2: Check for overlapping car bookings
async function checkOverlappingBookings(car_id: number, start_date: string, end_date: string) {
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
    throw new Error('This car is booked for the selected dates.');
  }
}

// Step 3: Check if extras are available for the entire date range
async function checkExtrasAvailability(extras: any[], start_date: string, end_date: string) {
  for (const extra of extras) {
    const { extra_id, quantity } = extra;
    // Fetch the total available quantity of the extra
    const extraDetails = await prisma.extras.findUnique({
      where: { id: extra_id },
      select: { name: true, total_quantity: true },
    });

    if (!extraDetails) {
      throw new Error(`Extra with ID ${extra_id} not found.`);
    }

    const extraName = extraDetails.name;
    let currentDate = new Date(start_date);
    const endDate = new Date(end_date);

    while (currentDate <= endDate) {
      const totalBookedQuantity = await prisma.booking_extras.aggregate({
        _sum: { quantity: true },
        where: {
          extra_id: extra_id,
          bookings: {
            OR: [
              { start_date: { lte: currentDate }, end_date: { gte: currentDate } },
            ],
          },
        },
      });

      const bookedQuantity = totalBookedQuantity._sum.quantity || 0;

      if (bookedQuantity + quantity > extraDetails.total_quantity) {
        throw new Error(
          `Not enough ${extraName} available on ${currentDate.toDateString()}. Requested: ${quantity}, Available: ${extraDetails.total_quantity - bookedQuantity}`
        );
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
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
          extra_id: extra.extra_id,
          quantity: extra.quantity,
        })),
      },
    },
    include: {
      booking_extras: true,
    },
  });
}

// POST handler: Create a new booking
export async function POST(req: Request) { 

  try {
    const { car_id, user_id, start_date, end_date, total_price, extras = [] } = await req.json();
    // Step 1: Validate booking input

    await validateBookingInput(car_id, user_id, start_date, end_date);

    // Step 2: Check for overlapping car bookings
    await checkOverlappingBookings(car_id, start_date, end_date);

    // Step 3: Check if extras are available
    await checkExtrasAvailability(extras, start_date, end_date);

    // Step 4: Create the booking with extras
    const newBooking = await createBooking(car_id, user_id, start_date, end_date, total_price, extras);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Step 5: Retrieve bookings for a user
async function getBookingsByUser(user_id: number) {
  return await prisma.bookings.findMany({
    where: { user_id },
    include: {
      cars: true,
      booking_extras: {
        include: {
          extras: true,
        },
      },
    },
  });
}

// GET handler: Fetch bookings for a specific user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  try {
    const bookings = await getBookingsByUser(parseInt(user_id));
    if (bookings.length === 0) {
      return NextResponse.json({ message: 'No bookings found for this user.' }, { status: 404 });
    }
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}
