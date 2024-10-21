import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client import

// POST Request: Create new Vehicle
//--------------------------------------------------------------
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      mpg, make, model, year, type, short_description, long_description,
      features, extras, guidelines, faqs, price, turo_url, gas_type, num_doors, num_seats, image_url,
    } = data;

    const vehicle = await prisma.vehicle.create({
      data: {
        mpg,
        make,
        model,
        year,
        type,
        short_description,
        long_description,
        features,
        extras,
        guidelines,
        faqs,
        price: parseFloat(price), // Store price as a float
        turo_url,
        gas_type,
        num_doors,
        num_seats,
        vehicleImages: {
          create: { image_url }, // Link car images to the car
        },
      },
    });

    return NextResponse.json(vehicle, { status: 201 });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET Request: Fetch All or Available Vehicles
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

// Services: Fetch Vehicles from Database
//--------------------------------------------------------------

// Fetch all (no date filter)
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

// Fetch vehicles with date
async function fetchAvailableVehicles(startDate: string, endDate: string) {
  try {
    const availableVehicles = await prisma.vehicle.findMany({
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
    return NextResponse.json(formatVehicleData(availableVehicles), { status: 200 });
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return NextResponse.json({ error: 'Error fetching vehicles' }, { status: 500 });
  }
}

// Utility Function
//--------------------------------------------------------------
// Utility to centralize car field selection for consistency
function vehicleSelectionFields() {
  return {
    id: true,
    mpg: true,
    make: true,
    model: true,
    year: true,
    type: true,
    short_description: true,
    long_description: true,
    features: true,
    extras: true,
    guidelines: true,
    faqs: true,
    price: true,
    turo_url: true,
    num_doors: true,
    num_seats: true,
    gas_type: true,
    vehicleImages: {
      select: { image_url: true }, // Select image URL for each car
    },
  };
}

// Utility to format car data by converting price to float and fetching first image URL.
const formatVehicleData = (vehicles: any[]) => {
  return vehicles.map((vehicle) => ({
    ...vehicle,
    price: parseFloat(vehicle.price.toString()), // Ensure price is returned as a float
    image_url: vehicle.vehicleImages[0]?.image_url || '', // Use first image or fallback to an empty string
  }));
};