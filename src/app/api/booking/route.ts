import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma client if needed

/**
 * Handler for POST: Create a new booking
 */
export async function POST(req: Request) { 
  try {
    const {
      vehicle_id,
      user_id,
      start_date,
      end_date,
      total_price,
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid
    } = await req.json();

    // Collect missing fields for validation
    const missingFields = getMissingFields({
      vehicle_id,
      user_id,
      start_date,
      end_date,
      paypal_order_id,
      paypal_transaction_id,
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate booking dates
    await validateBooking(vehicle_id, start_date, end_date);

    // Create the booking in the database
    const newBooking = await createBooking({
      vehicle_id: parseInt(vehicle_id),
      user_id: parseInt(user_id),
      start_date,
      end_date,
      total_price: parseFloat(total_price),
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * Handler for GET: Retrieve bookings for a specific user
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  try {
    const bookings = await getBookingsFromUser(parseInt(user_id));

    if (bookings.length === 0) {
      return NextResponse.json(
        { message: 'No bookings found for this user.', bookings: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Error retrieving bookings:', error);
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}

/**
 * Helper function to validate booking dates and check for overlap
 */
async function validateBooking(vehicle_id: number, start_date: string, end_date: string) {
  const startDateObj = new Date(start_date);
  const endDateObj = new Date(end_date);

  if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
    throw new Error('Invalid start or end date provided.');
  }

  const existingBooking = await prisma.booking.findFirst({
    where: {
      vehicle_id,
      status: 'active',
      OR: [
        { start_date: { lte: endDateObj }, end_date: { gte: startDateObj } },
      ],
    },
  });

  if (existingBooking) {
    throw new Error('This vehicle is already booked for the selected dates.');
  }
}

/**
 * Helper function to create a new booking with extras
 */
async function createBooking({
  vehicle_id,
  user_id,
  start_date,
  end_date,
  total_price,
  extras,
  paypal_order_id,
  paypal_transaction_id,
  is_paid
}: {
  vehicle_id: number,
  user_id: number,
  start_date: string,
  end_date: string,
  total_price: number,
  extras: any[],
  paypal_order_id: string,
  paypal_transaction_id: string,
  is_paid: boolean,
}) {
  return await prisma.booking.create({
    data: {
      vehicle_id,
      user_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price,
      status: 'active',
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
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

/**
 * Helper function to retrieve bookings for a specific user
 */
async function getBookingsFromUser(user_id: number) {
  return await prisma.booking.findMany({
    where: { user_id },
    include: {
      vehicle: true,
      bookingExtras: {
        include: {
          extra: true,
        },
      },
    },
  });
}

/**
 * Utility function to check for missing required fields
 */
function getMissingFields(fields: Record<string, any>) {
  return Object.keys(fields).filter((field) => !fields[field]);
}
