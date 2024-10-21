import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path to your Prisma client if needed

// POST handler: Create a new booking
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
    // Validate required fields
    if (!vehicle_id || !user_id || !start_date || !end_date || !paypal_order_id || !paypal_transaction_id) { throw new Error('Missing required fields.'); }    
    // Check for overlapping car bookings
    await validateBooking(parseInt(vehicle_id), start_date, end_date);
    // Create the vehicle booking with PayPal details
    const newBooking = await createBooking(
      parseInt(vehicle_id),
      user_id,
      start_date,
      end_date,
      total_price,
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid
    );

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET handler: Get bookings for a specific user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  try {
    const bookings = await getBookingsFromUser(parseInt(user_id));
    if (bookings.length === 0) {
      return NextResponse.json({ message: 'No bookings found for this user.', bookings: [] }, { status: 200 });
    }
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
}

async function validateBooking(vehicle_id: number, start_date: string, end_date: string) {
  try {
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      throw new Error('Invalid start or end date provided.');
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        vehicle_id: vehicle_id,
        status: 'active',
        OR: [
          { start_date: { lte: endDateObj }, end_date: { gte: startDateObj } },
        ],
      },
    });
    if (existingBooking) {
      throw new Error('This car is already booked for the selected dates.');
    }
  } catch (error) {
    console.error('Error checking overlapping bookings:', error);
    throw error;
  }
}

// Create the booking with extras
async function createBooking(
  vehicle_id: number,
  user_id: number,
  start_date: string,
  end_date: string,
  total_price: string,
  extras: any[],
  paypal_order_id: string,
  paypal_transaction_id: string,
  is_paid: boolean
) {
  return await prisma.booking.create({
    data: {
      vehicle_id,
      user_id,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      total_price: parseFloat(total_price),
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

// Retrieve bookings for a user
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

