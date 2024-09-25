import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, description, total_quantity, price_type, price_amount } = req.body;
        
        try {
            // Create a new extra without date requirements
            const newExtra = await prisma.extras.create({
                data: {
                    name,
                    description,
                    total_quantity, // This can represent overall available stock or used by default
                    price_type,
                    price_amount,
                },
            });

            res.status(201).json(newExtra);
        } catch (err) {
            console.error('Error creating extra:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method === 'GET') {
        try {
            // Fetch all extras without date filtering
            const extras = await prisma.extras.findMany();
            res.status(200).json(extras);
        } catch (err) {
            console.error('Error fetching extras:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
