import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

/**
 * Handler for POST: Create booking
 */
export async function POST(req: Request) {
  try {
    // Retrieve user_id and role from custom headers set by middleware
    const user_id = req.headers.get('x-user-id');
    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
    }

    const {
      vehicle_id,
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
      start_date,
      end_date,
      total_price,
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
    const booking = await createBooking({
      vehicle_id: parseInt(vehicle_id),
      user_id: user_id,
      start_date,
      end_date,
      total_price: parseFloat(total_price),
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * Handler for GET: Retrieve bookings for a specific user
 */
export async function GET(req: Request) {
  // Retrieve user_id from custom headers set by middleware
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const bookings = await getBookingsForUser(user_id);

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

  const bookingExists = await prisma.booking.findFirst({
    where: {
      vehicle_id,
      OR: [
        { start_date: { lte: endDateObj }, end_date: { gte: startDateObj } },
      ],
    },
  });

  if (bookingExists) {
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
  user_id: string,
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
async function getBookingsForUser(user_id: string) {
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
