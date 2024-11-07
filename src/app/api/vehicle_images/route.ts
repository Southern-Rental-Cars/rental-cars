// app/api/vehicle-images/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Ensure the path is correct for your Prisma client

// POST handler for adding a new vehicle image
export async function POST(request: Request) {
  try {
    // Parse the JSON body from the request
    const { vehicle_id, image_url } = await request.json();

    // Validation: check if both vehicle_id and image_url are provided
    if (!vehicle_id || !image_url) {
      return NextResponse.json({ message: 'vehicle_id and image_url are required' }, { status: 400 });
    }

    const vehicleExists = await prisma.vehicle.findUnique({where : {id: vehicle_id}});
    if (!vehicleExists) {
      return NextResponse.json({message: "Vehicle not found. Invalid vehicle_id"}, {status: 404});
    }
    
    // Create the new VehicleImage in the database
    const newImage = await prisma.vehicleImage.create({
      data: {
        vehicle_id,
        image_url,
      },
    });

    // Return success response with the created image record
    return NextResponse.json({ message: 'Image added successfully', data: newImage }, { status: 201 });

  } catch (error) {
    console.error('Error adding vehicle image:', error);
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}