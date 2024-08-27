import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    try {
        if (req.method === 'GET') {
            // Prisma query to fetch car details and associated images
            const car = await prisma.cars.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    car_name: true,
                    make: true,
                    model: true,
                    year: true,
                    type: true,
                    mpg: true,
                    gas_type: true,
                    num_doors: true,
                    num_seats: true,
                    long_description: true,
                    short_description: true,
                    features: true,
                    extras: true,
                    guidelines: true,
                    faqs: true,
                    price: true,
                    turo_url: true,
                    car_images: {
                        select: {
                            image_url: true,
                        },
                    },
                },
            });

            if (!car) {
                return res.status(404).json({ error: 'Car not found' });
            }

            // Format the response to match the expected output
            const response = {
                ...car,
                image_url: car.car_images.map((img) => img.image_url),
            };

            // Send the response
            res.status(200).json(response);
        } else if (req.method === 'DELETE') {
            // Prisma query to delete the car by id
            const deletedCar = await prisma.cars.delete({
                where: { id: parseInt(id) },
            });

            // Send the deleted car's data as a confirmation response
            res.status(200).json(deletedCar);
        } else {
            // Method not allowed
            res.setHeader('Allow', ['GET', 'DELETE']);
            res.status(405).json({ error: `Method ${req.method} not allowed` });
        }
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}
