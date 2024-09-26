import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client

// GET /api/vehicles/:id - Fetch car details by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Prisma query to fetch car details and associated images
    const car = await prisma.cars.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        car_name: true,
        make: true,
        model: true,
        year: true,
        type: true,
        mpg: true,
        gas_type: true,
        num_doors: true,
        num_seats: true,
        long_description: true,
        short_description: true,
        features: true,
        extras: true,
        guidelines: true,
        faqs: true, // This will be parsed if it's a string
        price: true,
        turo_url: true,
        car_images: {
          select: {
            image_url: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Parse the `faqs` field if it's a string
    const parsedFAQs = typeof car.faqs === 'string' ? JSON.parse(car.faqs) : car.faqs;

    // Format the response
    const response = {
      ...car,
      faqs: parsedFAQs,
      image_url: car.car_images.map((img) => img.image_url),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Error fetching car details:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/vehicles/:id - Delete a car by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Prisma query to delete the car by ID
    const deletedCar = await prisma.cars.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(deletedCar, { status: 200 });
  } catch (err) {
    console.error('Error deleting car:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
