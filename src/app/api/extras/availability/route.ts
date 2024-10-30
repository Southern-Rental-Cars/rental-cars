import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client

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
    const availabilityResults = await checkExtrasAvailability(extras, startDateObj, endDateObj);
    
    return NextResponse.json(availabilityResults, { status: 200 });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ error: 'An error occurred while checking availability.' }, { status: 500 });
  }
}

// Helper function to check extras availability
async function checkExtrasAvailability(
  extras: { id: number; quantity: number }[],
  start_date: Date,
  end_date: Date
) {
  const availabilityQuantity: { [key: number]: { available_quantity: number | string } } = {};

  for (const extra of extras) {
    const { id } = extra;

    // Fetch the total quantity and price_type of the extra
    const extraDetails = await prisma.extra.findUnique({
      where: { id: id },
      select: { name: true, total_quantity: true, price_type: true }, // Fetch price_type
    });

    if (!extraDetails) {
      return NextResponse.json({ error: `Extra with ID ${id} not found.` }, { status: 404 });
    }

    // If the extra is a non-tangible type (TRIP), it's always available
    if (extraDetails.price_type === 'TRIP') {
      availabilityQuantity[id] = {
        available_quantity: 999, // 999 represents always available
      };
      continue; // Skip the rest of the loop for non-tangible extras
    }

    // For tangible extras (e.g., DAILY), check availability
    let totalBookedQuantity = 0;
    let currentDate = new Date(start_date);
    const endDateObject = new Date(end_date);

    // Check availability for each day in the range
    while (currentDate <= endDateObject) {
      const bookedQuantityResult = await prisma.bookingExtra.aggregate({
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

      const bookedQuantity = bookedQuantityResult._sum.quantity || 0;
      totalBookedQuantity = Math.max(totalBookedQuantity, bookedQuantity);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate the available quantity
    const availableQuantity = extraDetails.total_quantity - totalBookedQuantity;
    availabilityQuantity[id] = {
      available_quantity: availableQuantity,
    };
  }

  return availabilityQuantity;
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