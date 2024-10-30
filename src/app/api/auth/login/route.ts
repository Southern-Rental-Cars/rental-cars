import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Ensure this path points to your Prisma client instance
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        // Validate input
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ message: 'User with this email does not exist.' }, { status: 401 });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return NextResponse.json({ message: 'Incorrect password.' }, { status: 401 });
        }
        
        // Generate JWT token if password matches
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email 
            }, 
            jwtSecret as string, // Ensure this is set in your environment variables
            { expiresIn: '1d' } // Token expires in 1 day
        );
        console.log("dog: " + token);

        // Return success response with JWT token
        return NextResponse.json({
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name || 'N/A',
                }
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error during login:', error);
        const errorMessage = (error as Error).message || 'Unknown error occurred';
        return NextResponse.json({ message: 'An error occurred.', error: errorMessage }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
  
  export async function PATCH() {
    return GET();
  }
  
  export async function DELETE() {
    return GET();
  }
  