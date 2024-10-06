import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path to your Prisma client if needed

async function validateBooking(car_id: number, start_date: string, end_date: string) {
  try {
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error('Invalid start or end date provided.');
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        car_id: car_id,
        status: 'active',
        OR: [
          { start_date: { lte: endDateObj }, end_date: { gte: startDateObj } },
        ],
      },
    });

    if (overlappingBooking) {
      throw new Error('This car is already booked for the selected dates.');
    }
  } catch (error) {
    console.error('Error checking overlapping bookings:', error);
    throw error;
  }
}

async function searchExtrasAvailability(extras: any[], start_date: string, end_date: string) {

  for (const extra of extras) {
    const { id, quantity } = extra;

    // Fetch the total available quantity of the extra
    const extraDetails = await prisma.extra.findUnique({
      where: { id: id },
      select: { name: true, total_quantity: true },
    });

    if (!extraDetails) {
      throw new Error(`Extra with ID ${id} not found.`);
    }

    const extraName = extraDetails.name;
    let currentDate = new Date(start_date);
    const endDate = new Date(end_date);

    while (currentDate <= endDate) {
      const totalBookedQuantity = await prisma.bookingExtra.aggregate({
        _sum: { quantity: true },
        where: {
          extra_id: id,
          booking: {
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
async function createBooking(car_id: number, car_name: string, user_id: number, start_date: string, end_date: string, total_price: string, extras: any[]) {
  return await prisma.booking.create({
    data: {
      car_id,
      car_name,
      user_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price: parseFloat(total_price),
      status: 'active',
      bookingExtras: {
        create: extras.map((extra) => ({
          extra_id: extra.id,
          extra_name: extra.name,
          quantity: extra.quantity,
        })),
      },
    },
    include: {
      bookingExtras: true,
    },
  });
}

// POST handler: Create a new booking
export async function POST(req: Request) { 
  try {
    const { car_id, car_name, user_id, start_date, end_date, total_price, extras } = await req.json();
    if (!car_id || !user_id || !start_date || !end_date) {
      throw new Error('Missing required fields.');
    }    
    // Check for overlapping car bookings
    await validateBooking(parseInt(car_id), start_date, end_date);
    // Check if extras are available
    //sawait searchExtrasAvailability(extras, start_date, end_date);
    // Create the vehicle (and extras) booking
    const newBooking = await createBooking(parseInt(car_id), car_name, user_id, start_date, end_date, total_price, extras);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Step 5: Retrieve bookings for a user
async function getBookingsByUser(user_id: number) {
  return await prisma.booking.findMany({
    where: { user_id },
    include: {
      car: true,
      bookingExtras: {
        include: {
          extra: true,
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
      return NextResponse.json({ message: 'No bookings found for this user.', bookings: [] }, { status: 200 });
    }
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}
