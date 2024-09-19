import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Asynchronous function which handles HTTP requests 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, description, available_quantity, price_type, price_amount  } = req.body;
        try {
            // Create a new extra using Prisma
            const newExtra = await prisma.extras.create({
                data: {
                    name,
                    description,
                    available_quantity,
                    price_type,
                    price_amount,
                },
            });

            // Respond with the newly created extra
            res.status(201).json(newExtra);
        } catch (err) {
            // Catch errors if they occur here
            console.error('Error checking out: ', err);
            res.status(500).json({ error: 'Internal Server Error '});
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed'});
    }
}
