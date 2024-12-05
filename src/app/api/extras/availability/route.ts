import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Adjust the path to your prisma client

// Handler for the POST request
export async function POST(req: Request) {
  try {
    const { start_date, end_date, extras } = await req.json();
    // Validate request body
    if (!start_date || !end_date || !extras) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Validate start_date and end_date
    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return NextResponse.json({ error: 'Invalid date format.' }, { status: 400 });
    }

    // Parse start_date and end_date as valid Date objects
    const startDateObj = new Date(start_date);
    const endDateObj = new Date(end_date);
    if (startDateObj > endDateObj) {
      return NextResponse.json({ error: 'Start date cannot be later than end date.' }, { status: 400 });
    }

    // Check the extras availability
    const data = await checkExtrasAvailability(extras, startDateObj, endDateObj);
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'An error occurred while checking availability.' }, { status: 500 });
  }
}

// Helper function to check availability of extras
async function checkExtrasAvailability(
  extras: { id: number; quantity: number }[],
  startDate: Date,
  endDate: Date
) {
  const availability: { [extraId: number]: { available_quantity: number | string } } = {};

  for (const extra of extras) {
    const { id: extraId } = extra;

    // Retrieve extra details
    const extraInfo = await prisma.extra.findUnique({
      where: { id: extraId },
      select: { total_quantity: true },
    });

    if (!extraInfo) {
      return NextResponse.json({ error: `Extra with ID ${extraId} not found.` }, { status: 404 });
    }

    // If the extra is non-tangible (TRIP), it's always available
    if (extraInfo.total_quantity === null) {
      availability[extraId] = { available_quantity: 999 }; // 999 = always available
      continue;
    }

    // Calculate total quantity booked within the date range
    const totalBooked = await prisma.bookingExtra.aggregate({
      _sum: { quantity: true },
      where: {
        extra_id: extraId,
        booking: {
          start_date: { lte: endDate },
          end_date: { gte: startDate },
        },
      },
    });

    const bookedQuantity = totalBooked._sum.quantity || 0;
    const availableQuantity = Math.max(extraInfo.total_quantity - bookedQuantity, 0);

    // Set available quantity for the extra
    availability[extraId] = { available_quantity: availableQuantity };
  }

  return availability;
}


// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

// Utility function to validate a date string
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Return false if date is Invalid
}