import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Prisma client import

// Create vehicle
//--------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      make, model, year, type, short_description,
      features, extras, guidelines, faqs, price, gas_type, mpg, num_doors, num_seats, thumbnail,
    } = body;

    const vehicle = await prisma.vehicle.create({
      data: {
        mpg,
        make,
        model,
        year,
        type,
        short_description,
        features,
        extras,
        guidelines,
        faqs,
        price: parseFloat(price), // Store price as a float
        gas_type,
        num_doors,
        num_seats,
        thumbnail,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fetch all or available vehicles
//--------------------------------------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    // Validate date range
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return NextResponse.json(
          { error: 'Invalid date range: start date is after end date' },
          { status: 400 }
        );
      }
      return await fetchAvailableVehicles(startDate, endDate); // Fetch available cars
    }
    return await fetchAllVehicles(); // Fetch all cars if no date range provided
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fetch Vehicles
//--------------------------------------------------------------

async function fetchAllVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      select: vehicleSelectionFields(), // Use utility for selecting fields
    });
    return NextResponse.json(formatVehicleData(vehicles), { status: 200 });
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    return NextResponse.json({ error: 'Error fetching vehicles' }, { status: 500 });
  }
}

// Fetch vehicles filtering by booking date
async function fetchAvailableVehicles(startDate: string, endDate: string) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        bookings: {
          none: {
            OR: [
              {
                start_date: { lte: new Date(endDate) },  // Booking ends after start
                end_date: { gte: new Date(startDate) },  // Booking starts before end
              },
            ],
          },
        },
      },
      select: vehicleSelectionFields(), // Use utility for selecting fields
    });
    return NextResponse.json(formatVehicleData(vehicles), { status: 200 });
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return NextResponse.json({ error: 'Error fetching vehicles' }, { status: 500 });
  }
}

// Utility to centralize car field selection for consistency
//--------------------------------------------------------------
function vehicleSelectionFields() {
  return {
    id: true,
    mpg: true,
    make: true,
    model: true,
    year: true,
    type: true,
    short_description: true,
    features: true,
    extras: true,
    guidelines: true,
    faqs: true,
    price: true,
    num_doors: true,
    num_seats: true,
    gas_type: true,
    thumbnail: true
  };
}

// Utility to format vehicle data by converting price to float and transforming `faqs` to an array
const formatVehicleData = (vehicles: any[]) => {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    price: parseFloat(vehicle.price.toString()), // Ensure price is returned as a float
    faqs: vehicle.faqs
      ? Object.entries(vehicle.faqs).map(([question, answer]) => ({ question, answer }))
      : [], // Transform `faqs` object to array, or return empty array if `faqs` is undefined
  }));
};