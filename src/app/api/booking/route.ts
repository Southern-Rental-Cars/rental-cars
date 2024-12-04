import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendBookingConfirmationEmail } from '@/utils/emailHelpers/emailHelpers';

/**
 * Handler for POST: Create booking
 */
export async function POST(req: Request) {
  try {
    // Get user info from header
    const user_id = req.headers.get('x-user-id');
    const user_email = req.headers.get('x-user-email');

    if (!user_id) {
      return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
    }

    // Request payload
    const {
      vehicle_id,
      start_date,
      end_date,
      total_price,
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
      delivery_required,
      delivery_type,
      delivery_address,
    } = await req.json();

    // Required fields
    const missingFields = getMissingFields({
      vehicle_id,
      start_date,
      end_date,
      total_price,
      paypal_order_id,
      paypal_transaction_id,
    });

    if (missingFields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    // Validate input date format
    const parsedStartDate = new Date(start_date);
    const parsedEndDate = new Date(end_date);
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for start_date or end_date' }, { status: 400 });
    }

    // Validate booking dates and check for date overlap (client prevents date overlap)
    await validateBooking(vehicle_id, parsedStartDate, parsedEndDate);

    // Set the correct delivery address based on delivery type
    const finalDeliveryAddress =
      delivery_type === 'IAH'
        ? 'George Bush Intercontinental Airport, 2800 N Terminal Rd, Houston, TX 77032'
        : delivery_address;

    // Create new booking in db
    const booking = await createBooking({
      vehicle_id: parseInt(vehicle_id),
      user_id,
      start_date: parsedStartDate,
      end_date: parsedEndDate,
      total_price: parseFloat(total_price),
      extras,
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
      delivery_required,
      delivery_type,
      delivery_address: finalDeliveryAddress,
    });

    // Send confirmation email
    if (user_email) {
      await sendBookingConfirmationEmail({
        email: user_email,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        vehicle: booking.vehicle,
        extras: booking.bookingExtras,
        totalPayment: total_price,
        bookingId: booking.id,
        delivery_required,
        delivery_type,
        delivery_address: finalDeliveryAddress,
      });
    }

    // Success
    return NextResponse.json(booking, { status: 201 });

    // Fail
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking. Please try again later.' }, { status: 500 });
  }
}


/**
 * Helper function to validate booking dates and check for overlap
 */
async function validateBooking(vehicle_id: number, start_date: Date, end_date: Date) {
  const bookingExists = await prisma.booking.findFirst({
    where: {
      vehicle_id,
      OR: [
        { start_date: { lte: end_date }, end_date: { gte: start_date } },
      ],
    },
  });

  if (bookingExists) {
    throw new Error('This vehicle is already booked for the selected dates.');
  }
}

/**
 * Helper function to create a new booking with extras and delivery details
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
  is_paid,
  delivery_required,
  delivery_type,
  delivery_address,
}: {
  vehicle_id: number;
  user_id: string;
  start_date: Date;
  end_date: Date;
  total_price: number;
  extras: any[];
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
  delivery_required: boolean;
  delivery_type: string | null;
  delivery_address: string | null;

}) {
  return await prisma.booking.create({
    data: {
      vehicle_id,
      user_id,
      start_date,
      end_date,
      total_price,
      paypal_order_id,
      paypal_transaction_id,
      is_paid,
      delivery_required,
      delivery_type,
      delivery_address,
      bookingExtras: {
        create: extras.map((extra) => ({
          extra_id: extra.id,
          extra_name: extra.name,
          quantity: extra.quantity,
        })),
      },
    },
    include: {
      vehicle: true,
      bookingExtras: true,
    },
  });
}

/**
 * Handler for GET: Retrieve bookings for a specific user
 */
export async function GET(req: Request) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const bookings = await getBookingsForUser(user_id);
    return NextResponse.json(bookings.length ? bookings : [], { status: 200 });
  } catch (error: any) {
    console.error('Error retrieving bookings:', error);
    return NextResponse.json({ error: 'Failed to retrieve bookings' }, { status: 500 });
  }
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
  return Object.keys(fields).filter((field) => fields[field] === undefined || fields[field] === null);
}
