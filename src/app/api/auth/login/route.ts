import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Ensure this path points to your Prisma client instance
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Define the expected response types
type Data = {
    message: string;
    token?: string;  // Token sent back to client for future authentication
    user?: {
        id: number;
        email: string;
        full_name: string;
    };
    error?: string;
};

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        // Find the user by email
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            return NextResponse.json({ message: 'User with this email does not exist.' }, { status: 400 });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, existingUser.password_hash);
        if (!passwordMatch) {
            return NextResponse.json({ message: 'Incorrect password.' }, { status: 400 });
        }

        // Generate JWT token if password matches
        const token = jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            process.env.JWT_SECRET as string, // Ensure this is set in your environment variables
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Return success response with JWT token
        return NextResponse.json({
            message: 'Login successful.',
            token, // Send the token to the client
            user: {
                id: existingUser.id,
                email: existingUser.email,
                full_name: existingUser.full_name || 'Default Name',
            },
        }, { status: 200 });

    } catch (error) {
        console.error('Error during login:', error);
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return NextResponse.json({ message: 'An error occurred.', error: errorMessage }, { status: 500 });
    }
}

// Handle unsupported methods
export function GET() {
    return NextResponse.json({ message: 'Method not allowed.' }, { status: 405 });
}
