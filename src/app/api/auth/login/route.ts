import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Update this to the correct path for prisma instance
import { NextResponse } from 'next/server';

// Define the expected response types
type Data = {
    message: string;
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

        // Return successful login response
        return NextResponse.json({
            message: 'Login successful.',
            user: {
                id: existingUser.id,
                email: existingUser.email,
                full_name: existingUser.full_name || 'Default Name',
            },
        }, { status: 200 });
        
    } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return NextResponse.json({ message: 'An error occurred.', error: errorMessage }, { status: 500 });
    }
}

// This handles other non-supported methods like GET, DELETE, etc.
export function GET() {
    return NextResponse.json({ message: 'Method not allowed.' }, { status: 405 });
}
