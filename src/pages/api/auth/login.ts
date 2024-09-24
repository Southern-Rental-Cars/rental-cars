// File: /pages/api/auth/login.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

type Data = {
    message: string;
    user?: {
        id: number;
        email: string;
        full_name: string;
    };
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }

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
                    full_name: existingUser.full_name || 'Default Name',
                },
            });
        } catch (error) {
            const errorMessage = (error as Error).message || 'Unknown error occurred';
            return res.status(500).json({ message: 'An error occurred.', error: errorMessage });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed.' });
    }
}
