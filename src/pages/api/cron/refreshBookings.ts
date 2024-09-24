// File: /pages/api/cron/updateBookings.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Only allow POST requests from Vercel's cron job
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Current date and time
    const now = new Date();

    // Start a transaction to ensure atomicity
    const updatedBookings = await prisma.$transaction(async (prisma) => {
      // Find all active bookings where end_date has passed and not yet processed
      const bookingsToComplete = await prisma.bookings.findMany({
        where: {
          status: 'active',
          end_date: {
            lte: now, // end_date is less than or equal to now
          },
        },
        include: {
          booking_extras: true,
        },
      });

      if (bookingsToComplete.length === 0) {
        console.log('No bookings to process at this time.');
        return [];
      }

      // Iterate through each booking and process it
      const results = await Promise.all(
        bookingsToComplete.map(async (booking) => {
          // Update the booking's status to 'completed'
          const updatedBooking = await prisma.bookings.update({
            where: { id: booking.id },
            data: {
              status: 'completed',
              updated_at: now,
            },
          });

          // Iterate through each booking_extra to increment available_quantity
          await Promise.all(
            booking.booking_extras.map(async (bookingExtra) => {
              if (bookingExtra.extra_id && bookingExtra.quantity) {
                await prisma.extras.update({
                  where: { id: bookingExtra.extra_id },
                  data: {
                    available_quantity: {
                      increment: bookingExtra.quantity,
                    },
                  },
                });
              }
            })
          );

          return updatedBooking;
        })
      );

      return results;
    });

    res.status(200).json({
      message: `Processed ${updatedBookings.length} bookings.`,
      bookings: updatedBookings,
    });
  } catch (error) {
    console.error('Error processing bookings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
