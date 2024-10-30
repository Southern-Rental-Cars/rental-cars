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
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        type: true,
        mpg: true,
        gas_type: true,
        num_doors: true,
        num_seats: true,
        short_description: true,
        features: true,
        extras: true,
        guidelines: true,
        faqs: true, // This will be parsed if it's a string
        price: true,
        thumbnail: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Parse the `faqs` field if it's a string
    const parsedFAQs = typeof vehicle.faqs === 'string' ? JSON.parse(vehicle.faqs) : vehicle.faqs;

    // Format the response
    const response = {
      ...vehicle,
      faqs: parsedFAQs,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error('Error fetching vehicle details:', err);
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
    const vehicle = await prisma.vehicle.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json(vehicle, { status: 200 });
  } catch (err) {
    console.error('Error deleting car:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// put /api/vehicle/:id - Update a vehicle by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Check if the vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }
    
    const body = await req.json();

    // Construct the `data` object dynamically
    const data: any = {};

    // Optional updates based on the fields present in the request body
    if (body.short_description) data.short_description = body.short_description;
    if (body.make) data.make = body.make;
    if (body.model) data.model = body.model;
    if (body.year) data.year = body.year;
    if (body.type) data.type = body.type;
    if (body.features) data.features = body.features;
    if (body.guidelines) data.guidelines = body.guidelines;
    if (body.price) data.price = parseFloat(body.price);
    if (body.gas_type) data.gas_type = body.gas_type;
    if (body.mpg) data.mpg = body.mpg;
    if (body.num_doors) data.num_doors = body.num_doors;
    if (body.num_seats) data.num_seats = body.num_seats;
    if (body.thumbnail) data.thumbnail = body.thumbnail;
    if (body.faqs) data.faqs = body.faqs;

    // For extras, handle separately to avoid overwriting other fields
    if (body.extras && Array.isArray(body.extras) && body.extras.every(Number.isInteger)) {
      data.extras = {
        connect: body.extras.map((extraId: number) => ({ id: extraId })), // Connect extras without removing existing ones
      };
    }

    // Update the vehicle with the constructed data object
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (err) {
    console.error('Error updating vehicle:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}