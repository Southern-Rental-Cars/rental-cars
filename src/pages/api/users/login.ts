import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
    message: string;
    user?: any;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            const existingUser = await prisma.users.findUnique({ where: { email } });
            if (!existingUser) {
                return res.status(400).json({ message: 'User with this email does not exist.' });
            }

            const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Incorrect password.' });
            }

            return res.status(200).json({
                message: 'Login successful.',
                user: {
                    id: existingUser.id,
                    email: existingUser.email,
                    full_name: existingUser.full_name,
                }
            });
        } catch (error) {
            // Ensure that error is treated as an Error object
            const errorMessage = (error as Error).message || 'Unknown error occurred';
            return res.status(500).json({ message: 'An error occurred.', error: errorMessage });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
