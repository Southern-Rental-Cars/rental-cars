import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client

// POST /api/vehicles - Create a new vehicle
export async function POST(req: Request) {
  try {
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
    } = await req.json(); // Parse request body

    const newCar = await prisma.cars.create({
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
        price: parseInt(price, 10), // Ensure price is stored as an integer
        turo_url,
        gas_type,
        num_doors,
        num_seats,
        car_images: {
          create: {
            image_url,
          },
        },
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (err) {
    console.error('Error creating car:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/vehicles - Fetch all vehicles
export async function GET() {
  try {
    const cars = await prisma.cars.findMany({
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
        price: true, // Fetch price as an integer
        turo_url: true,
        num_doors: true,
        num_seats: true,
        car_images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    const formattedCars = cars.map((car) => ({
      ...car,
      price: parseInt(car.price.toString(), 10), // Ensure price is returned as an integer
      image_url: car.car_images[0]?.image_url || '',
    }));

    return NextResponse.json(formattedCars, { status: 200 });
  } catch (err) {
    console.error('Error fetching cars:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
