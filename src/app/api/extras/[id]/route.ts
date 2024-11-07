import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Adjust the path to your prisma client import
import { Prisma } from '@prisma/client';

// Utility function to parse and validate the ID
function parseId(id: string | string[] | undefined) {
  if (!id || Array.isArray(id)) {
    throw new Error('Invalid ID');
  }
  return parseInt(id, 10);
}

// Handler for GET requests to fetch an extra by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const extraId = parseId(id);
    const extra = await prisma.extra.findUnique({
      where: { id: extraId },
    });

    if (!extra) {
      return NextResponse.json({ error: 'Extra not found' }, { status: 404 });
    }

    return NextResponse.json(extra);
  } catch (error) {
    console.error('Error fetching extra:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Handler for PUT requests to update an extra by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, description, total_quantity, price_type, price_amount } = await req.json();

  try {
    const extraId = parseId(id);

    // Check if at least one field is provided for update
    if (
      name === undefined &&
      description === undefined &&
      total_quantity === undefined &&
      price_type === undefined &&
      price_amount === undefined
    ) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    // Update the extra with the provided fields
    await prisma.extra.update({
      where: { id: extraId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(total_quantity !== undefined && {
          total_quantity: parseInt(total_quantity, 10),
        }),
        ...(price_type !== undefined && { price_type }),
        ...(price_amount !== undefined && {
          price_amount: parseInt(price_amount, 10),
        }),
      },
    });

    return NextResponse.json({ message: 'Extra updated successfully' }, { status: 204 });
  } catch (error) {
    console.error('Error updating extra:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Extra not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Handler for DELETE requests to delete an extra by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const extraId = parseId(id);

    await prisma.extra.delete({
      where: { id: extraId },
    });

    return NextResponse.json({ id: extraId }, { status: 200 });
  } catch (error) {
    console.error('Error deleting extra:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Extra not found' }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
