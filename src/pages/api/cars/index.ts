import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        car_name,
        mpg,
        make,
        model,
        year,
        type,
        short_description,
        long_description,
        features,
        extras,
        guidelines,
        faqs,
        price,
        turo_url,
        gas_type,
        num_doors,
        num_seats,
        image_url,
      } = req.body;

      // Create a new car entry in the database
      const newCar = await prisma.cars.create({
        data: {
          car_name,
          mpg,
          make,
          model,
          year,
          type,
          short_description,
          long_description,
          features,
          extras,
          guidelines,
          faqs,
          price,
          turo_url,
          gas_type,
          num_doors,
          num_seats,
          car_images: {
            create: {
              image_url,
            },
          },
        },
      });

      res.status(201).json(newCar);
    } catch (err) {
      console.error('Error creating car:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'GET') {
    try {
      const cars = await prisma.cars.findMany({
        select: {
          car_name: true,
          mpg: true,
          make: true,
          model: true,
          year: true,
          type: true,
          short_description: true,
          turo_url: true,
          car_images: {
            select: {
              image_url: true,
            },
          },
        },
      });

      const formattedCars = cars.map((car) => ({
        ...car,
        image_url: car.car_images[0]?.image_url || '',
      }));

      res.status(200).json(formattedCars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
