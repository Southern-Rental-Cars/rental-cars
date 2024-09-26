import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client
import { start } from 'repl';

// Utility function to validate a date string
function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Return false if date is Invalid
}

// Helper function to check extras availability
async function checkExtrasAvailability(
  
  extras: { id: number; quantity: number }[],
  start_date: Date,
  end_date: Date
) {
  const availabilityQuantity: { [key: number]: { available_quantity: number } } = {};

  for (const extra of extras) {
    const { id } = extra;

    // Fetch the total available quantity of the extra
    const extraDetails = await prisma.extras.findUnique({
      where: { id: id },
      select: { name: true, total_quantity: true },
    });

    if (!extraDetails) {
      return NextResponse.json({ error: `Extra with ID ${id} not found.` }, { status: 404 });
    }

    let totalBookedQuantity = 0;
    let currentDate = new Date(start_date);
    const endDateObject = new Date(end_date);
    // Check availability for each day in the range
    while (currentDate <= endDateObject) {
      const bookedQuantityResult = await prisma.booking_extras.aggregate({
        _sum: { quantity: true },
        where: {
          extra_id: id,
          bookings: {
            OR: [
              { start_date: { lte: currentDate }, end_date: { gte: currentDate } },
            ],
            status: 'active',  // Ensure only 'active' bookings are counted
          },
        },
      });

      const bookedQuantity = bookedQuantityResult._sum.quantity || 0;
      totalBookedQuantity = Math.max(totalBookedQuantity, bookedQuantity);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const availableQuantity = extraDetails.total_quantity - totalBookedQuantity;

    availabilityQuantity[id] = {
      available_quantity: availableQuantity,
    };
  }

  return availabilityQuantity;
}

// Handler for the POST request
export async function POST(req: Request) {
  try {
    const { start_date, end_date, extras } = await req.json();
    console.log("Availability for start_date:", start_date); // Log start_date
    console.log("End_date:", end_date); // Log end_date

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


// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
