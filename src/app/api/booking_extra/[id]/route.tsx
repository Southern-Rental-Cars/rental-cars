import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Ensure prisma client is set up correctly

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Validate the ID
  const bookingExtraId = id;

  try {
    // Fetch the BookingExtra by ID, excluding the `Booking` relation
    const bookingExtra = await prisma.bookingExtra.findUnique({
      where: { id: bookingExtraId },
      select: {
        id: true,
        extra_id: true,
        extra_name: true, 
        quantity: true,
        extra: true, // Assuming you want to return extra details, not the booking
      },
    });

    // If the BookingExtra is not found, return a 404
    if (!bookingExtra) {
      return NextResponse.json({ error: 'Extra Booking not found' }, { status: 404 });
    }

    // Return the fetched BookingExtra
    return NextResponse.json(bookingExtra, { status: 200 });
  } catch (error) {
    console.error('Error fetching extra booking information:', error);
    return NextResponse.json({ error: 'Failed to fetch extra booking information' }, { status: 500 });
  }
}
