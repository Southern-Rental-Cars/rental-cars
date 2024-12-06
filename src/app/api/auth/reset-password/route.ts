import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

export async function POST(req: Request) {
    try {
        const { password, token } = await req.json();

        // Validate and decode the token
        let decodedToken: any;
        try {
            decodedToken = jwt.verify(token, jwtSecret as string);
        } catch (err) {
            console.error('Invalid or expired token:', err);
            return NextResponse.json(
                { message: 'Invalid or expired token.' },
                { status: 400 }
            );
        }

        const { email, purpose } = decodedToken;

        // Ensure the token's purpose is correct
        if (purpose !== 'forgot-password') {
            console.error('Invalid token purpose.');
            return NextResponse.json(
                { message: 'Invalid token purpose.' },
                { status: 400 }
            );
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('User not found for email:', email);
            return NextResponse.json(
                { message: 'Invalid token.' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword },
        });

        return NextResponse.json(
            { message: 'Password successfully reset' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resetting password:', error);
        return NextResponse.json(
            { message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
