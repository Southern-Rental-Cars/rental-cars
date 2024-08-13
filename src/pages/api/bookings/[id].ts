import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extracts the id parameter from the query string
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        // Fetch bookings by car_id using Prisma
        const bookings = await prisma.bookings.findMany({
            where: {
                car_id: parseInt(id),
            },
            select: {
                id: true,
                start_date: true,
                end_date: true,
                status: true,
            },
        });

        // Sends a 200 OK response with the data retrieved from the database
        res.status(200).json(bookings);
    } catch (err) {
        // Catch errors if they occur here
        console.error('Error fetching booking:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
