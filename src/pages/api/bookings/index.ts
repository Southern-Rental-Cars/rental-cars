// File: /pages/api/bookings/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Define TypeScript interfaces for request body
interface ExtraRequest {
  extra_id: number;
  quantity: number;
}

interface BookingRequestBody {
  car_id: number;
  user_id?: number;
  start_date: string;
  end_date: string;
  status?: string;
  extras: ExtraRequest[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { car_id, user_id, start_date, end_date, status, extras } = req.body as BookingRequestBody;

    try {
      // Validate input
      if (!car_id || !start_date || !end_date || !extras || !Array.isArray(extras)) {
        return res.status(400).json({ error: 'Missing required fields or invalid extras format.' });
      }

      // Start a transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Check if the car exists
        const car = await prisma.cars.findUnique({
          where: { id: car_id },
        });

        if (!car) {
          throw new Error('Car not found.');
        }

        // Check for overlapping active bookings for the same car
        const overlappingBooking = await prisma.bookings.findFirst({
          where: {
            car_id: car_id,
            status: 'active',
            OR: [
              {
                start_date: {
                  lte: new Date(end_date),
                },
                end_date: {
                  gte: new Date(start_date),
                },
              },
            ],
          },
        });

        if (overlappingBooking) {
          throw new Error('This car is booked for the selected dates.');
        }

        // Validate and update available_quantity for each extra
        for (const extra of extras) {
          const { extra_id, quantity } = extra;

          if (!extra_id || !quantity || quantity <= 0) {
            throw new Error('Invalid extra_id or quantity.');
          }

          const extraRecord = await prisma.extras.findUnique({
            where: { id: extra_id },
            select: { available_quantity: true, name: true },
          });

          if (!extraRecord) {
            throw new Error(`Extra with id ${extra_id} is not available.`);
          }

          if (extraRecord.available_quantity < quantity) {
            throw new Error(
              `${extraRecord.name} is unavailable in the requested quantity. Available quantity: ${extraRecord.available_quantity}`
            );
          }

          // Decrement available_quantity
          await prisma.extras.update({
            where: { id: extra_id },
            data: {
              available_quantity: { decrement: quantity },
            },
          });
        }

        // Proceed to create booking
        const newBooking = await prisma.bookings.create({
          data: {
            car_id,
            user_id,
            start_date: new Date(start_date),
            end_date: new Date(end_date),
            status: status || 'active',
            booking_extras: {
              create: extras.map((extra) => ({
                extra_id: extra.extra_id,
                quantity: extra.quantity,
              })),
            },
          },
          include: {
            booking_extras: true,
          },
        });

        return newBooking;
      });

      // Respond with the newly created booking
      res.status(201).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error creating booking:', message);
      res.status(400).json({ error: message || 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const bookings = await prisma.bookings.findMany({
        include: {
          booking_extras: {
            include: {
              extras: true,
            },
          },
        },
      });

      res.status(200).json(bookings);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error('Error fetching bookings:', message);
      res.status(500).json({ error: message || 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
