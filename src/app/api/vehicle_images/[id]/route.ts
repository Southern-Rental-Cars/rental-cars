// app/api/vehicle-images/[imageId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

interface Params {
  imageId: string;
}

// GET: Retrieve all images for a specific vehicle
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  
  try {
    const vehicleImages = await prisma.vehicleImage.findMany({
      where: {
        vehicle_id: parseInt(id),
      },
    });
    return NextResponse.json(vehicleImages, { status: 200 });
  } catch (error) {
    console.error('Error fetching vehicle images:', error);
    return NextResponse.json({ message: 'Error fetching vehicle images' }, { status: 500 });
  }
}

// DELETE: Delete a specific image by imageId
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Delete the image with the given ID
    await prisma.vehicleImage.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error code for "Record not found"
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }
    console.error('Error deleting vehicle image:', error);
    return NextResponse.json({ message: 'Error deleting vehicle image' }, { status: 500 });
  }
}

// PATCH: Update image URL of a specific image by imageId
export async function PATCH(request: Request, { params }: { params: Params }) {
  const { imageId } = params;

  const { image_url } = await request.json();

  if (!image_url) {
    return NextResponse.json({ message: 'Image URL is required for update' }, { status: 400 });
  }

  try {
    const updatedImage = await prisma.vehicleImage.update({
      where: {
        id: Number(imageId),
      },
      data: {
        image_url,
      },
    });
    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error('Error updating vehicle image:', error);
    return NextResponse.json({ message: 'Error updating vehicle image' }, { status: 500 });
  }
}