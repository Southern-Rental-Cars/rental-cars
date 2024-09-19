// File: /pages/api/extras/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract the 'id' from the query parameters
    const { id } = req.query;

    // Validate that 'id' is a string
    if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    // Use a switch statement to handle different HTTP methods
    switch (req.method) {
        case 'GET':
            await handleGet(req, res, id);
            break;
        case 'PUT':
            await handlePut(req, res, id);
            break;
        case 'DELETE':
            await handleDelete(req, res, id);
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

// Handler for GET requests to fetch an extra by ID
async function handleGet(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        const extra = await prisma.extras.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!extra) {
            return res.status(404).json({ error: 'Extra not found' });
        }

        res.status(200).json(extra);
    } catch (error) {
        console.error('Error fetching extra:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}

// Handler for PUT requests to update an extra by ID
async function handlePut(req: NextApiRequest, res: NextApiResponse, id: string) {
    const {
        name,
        description,
        available_quantity,
        price_type,
        price_amount,
    } = req.body;

    // Check if at least one field is provided for update
    if (
        name === undefined &&
        description === undefined &&
        available_quantity === undefined &&
        price_type === undefined &&
        price_amount === undefined
    ) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }

    try {
        await prisma.extras.update({
            where: { id: parseInt(id, 10) },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(available_quantity !== undefined && {
                    available_quantity: parseInt(available_quantity, 10),
                }),
                ...(price_type !== undefined && { price_type }),
                ...(price_amount !== undefined && {
                    price_amount: parseInt(price_amount, 10),
                }),
            },
        });

        res.status(204).end();
    } catch (error) {
        console.error('Error updating extra:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Extra not found' });
            } else {
                res.status(500).json({ error: 'Database error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
}

// Handler for DELETE requests to delete an extra by ID
async function handleDelete(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        await prisma.extras.delete({
            where: { id: parseInt(id, 10) },
        });

        res.status(200).json({ id: parseInt(id, 10) });
    } catch (error) {
        console.error('Error deleting extra:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Extra not found' });
            } else {
                res.status(500).json({ error: 'Database error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
}
