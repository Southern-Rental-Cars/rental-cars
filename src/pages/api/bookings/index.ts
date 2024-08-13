import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { car_id, start_date, end_date, status } = req.body;

        try {
            // Create a new booking using Prisma
            const newBooking = await prisma.bookings.create({
                data: {
                    car_id,
                    start_date: new Date(start_date), // Ensure date strings are converted to Date objects
                    end_date: new Date(end_date),     // Ensure date strings are converted to Date objects
                    status: status || 'active',       // Default to 'active' if status is not provided
                },
            });

            // Respond with the newly created booking
            res.status(201).json(newBooking);
        } catch (err) {
            console.error('Error creating booking:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            await prisma.$disconnect();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}