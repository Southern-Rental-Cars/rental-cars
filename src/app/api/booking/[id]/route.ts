import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Prisma } from '@prisma/client';

// PUT handler to update a booking
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { start_date, end_date, status } = await req.json();
  const id = params.id;

  if (!start_date && !end_date && !status) {
    return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
  }

  try {
    // Start transaction to ensure consistency
    await prisma.$transaction(async (transaction) => {
      const booking = await transaction.booking.findUnique({
        where: { id },
        include: { bookingExtras: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // If the status is 'completed', increment the available quantity for extras
      if (status === 'completed') {
        await incrementAvailableQuantity(transaction, booking.bookingExtras);
      }

      // Update booking details
      await transaction.booking.update({
        where: { id },
        data: {
          ...(start_date && { start_date: new Date(start_date) }),
          ...(end_date && { end_date: new Date(end_date) }),
          ...(status && { status }),
        },
      });
    });

    return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });
  } catch (error) {
    return handlePrismaError(error, 'Error updating booking');
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    // Find the booking with associated extras
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { bookingExtras: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Increment available quantity for each extra in the booking
    /*await prisma.$transaction(async (transaction) => {
      await incrementAvailableQuantity(transaction, booking.bookingExtras);
      await transaction.booking.delete({
        where: { id },
      });
    });*/

    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    return handlePrismaError(error, 'Error cancelling booking');
  } finally {
    await prisma.$disconnect();
  }
}

// GET handler to retrieve a Booking by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Fetch the booking with vehicle and extras details
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        vehicle: true,
        bookingExtras: {
          include: {
            extra: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return handlePrismaError(error, 'Error retrieving booking');
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Helper function to increment available quantity for extras
 */
async function incrementAvailableQuantity(transaction: Prisma.TransactionClient, bookingExtras: any[]) {
  for (const bookingExtra of bookingExtras) {
    if (bookingExtra.extra_id && bookingExtra.quantity) {
      await transaction.extra.update({
        where: { id: bookingExtra.extra_id },
        data: {
          total_quantity: { increment: bookingExtra.quantity },
        },
      });
    }
  }
}

/**
 * Helper function to handle Prisma and generic errors
 */
function handlePrismaError(error: any, defaultMessage: string) {
  console.error(defaultMessage, error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  return NextResponse.json({ error: message }, { status: 500 });
}
