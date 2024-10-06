import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// PUT handler to update a booking
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { start_date, end_date, status } = await req.json();
  const id = params.id;

  if (!start_date && !end_date && !status) {
    return NextResponse.json({ error: 'No update fields provided' }, { status: 400 });
  }

  try {
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Fetch the existing booking and its extras
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(id) },
        include: { bookingExtras: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // If status is being updated to 'completed', increment available_quantity
      if (status && status === 'completed' && booking.status !== 'completed') {
        for (const bookingExtra of booking.bookingExtras) {
          if (bookingExtra.extra_id !== null && bookingExtra.quantity !== null) {
            await prisma.extra.update({
              where: { id: bookingExtra.extra_id },
              data: {
                total_quantity: { increment: bookingExtra.quantity },
              },
            });
          }
        }
      }

      // Update the booking
      await prisma.booking.update({
        where: {
          id: parseInt(id),
        },
        data: {
          ...(start_date && { start_date: new Date(start_date) }),
          ...(end_date && { end_date: new Date(end_date) }),
          ...(status && { status }),
        },
      });
    });

    return NextResponse.json({ message: 'Booking updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Error updating booking:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      } else {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    } else {
      const message = error instanceof Error ? error.message : 'Internal Server Error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE handler to cancel a booking
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Fetch the booking and its related booking_extras
    const booking = await prisma.booking.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        bookingExtras: true, // Include the booking_extras in the query
      },
    });

    // If booking not found, return 404
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Check if the booking is already canceled to prevent double-cancellation
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is already canceled' }, { status: 400 });
    }

    // Increment the available_quantity for each extra in booking_extras
    for (const bookingExtra of booking.bookingExtras) {
      if (bookingExtra.extra_id && bookingExtra.quantity) {
        await prisma.extra.update({
          where: { id: bookingExtra.extra_id },
          data: {
            total_quantity: {
              increment: bookingExtra.quantity, // Increment by the quantity in booking_extras
            },
          },
        });
      }
    }

    // Update the booking status to "CANCEL"
    const updatedBooking = await prisma.booking.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: 'CANCEL',  // Update the status field to "CANCEL"
      },
    });

    return NextResponse.json({ message: 'Booking cancelled successfully', booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error cancelling booking:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      } else {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}

// GET handler to retrieve a Booking by its ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // Fetch the booking by its ID
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: {
        car: true, // Include car details
        bookingExtras: {
          include: {
            extra: true, // Include details about each extra
          },
        },
      },
    });

    // Check if the booking exists
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

