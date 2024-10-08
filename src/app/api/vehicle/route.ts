import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client import

// Utility function to format car data
const formatCarData = (cars: any[]) => {
  return cars.map((car) => ({
    ...car,
    price: parseFloat(car.price.toString()), // Ensure price is returned as a float
    image_url: car.carImages[0]?.image_url || '', // Use first image or fallback to an empty string
  }));
};

// POST /api/vehicle - Create a new vehicle
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      car_name,
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
      price,
      turo_url,
      gas_type,
      num_doors,
      num_seats,
      image_url,
    } = data;

    const newCar = await prisma.car.create({
      data: {
        car_name,
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
        carImages: {
          create: { image_url }, // Link car images to the car
        },
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/vehicle - Fetch all vehicles or available vehicles based on the date range
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');

    // Validation: Return 400 if start date is after end date
    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (parsedStartDate > parsedEndDate) {
        return NextResponse.json(
          { error: 'Invalid date range: start date is after end date' },
          { status: 400 }
        );
      }

      return await fetchAvailableVehicles(startDate, endDate); // Fetch available vehicles based on the date range
    } else {
      return await fetchAllVehicles(); // Fetch all vehicles if no dates provided
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fetch all vehicles without any date filtering
async function fetchAllVehicles() {
  try {
    const cars = await prisma.car.findMany({
      select: {
        id: true,
        car_name: true,
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
        carImages: {
          select: { image_url: true }, // Select image URL for each car
        },
      },
    });

    return NextResponse.json(formatCarData(cars), { status: 200 });
  } catch (error) {
    console.error('Error fetching all vehicles:', error);
    throw new Error('Error fetching all vehicles');
  }
}

// Fetch available vehicles based on a provided date range
async function fetchAvailableVehicles(startDate: string, endDate: string) {
  try {
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Ensure no bookings overlap with the given date range
    const availableCars = await prisma.car.findMany({
      where: {
        bookings: {
          none: {
            OR: [
              {
                start_date: {
                  lte: parsedEndDate, // Booking starts before or on the end date
                },
                end_date: {
                  gte: parsedStartDate, // Booking ends after or on the start date
                },
              },
            ],
          },
        },
      },
      select: {
        id: true,
        car_name: true,
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
        carImages: {
          select: { image_url: true }, // Select image URL for each car
        },
      },
    });

    return NextResponse.json(formatCarData(availableCars), { status: 200 });
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
