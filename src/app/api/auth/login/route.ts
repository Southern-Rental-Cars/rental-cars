import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
const jwtExpiry = process.env.JWT_EXPIRY || '1d'; // Default to 1 day if not defined

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find the user in the database
        const user = await prisma.user.findUnique({ where: { email } });
        
        // Check if the user exists and validate the password
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return NextResponse.json(
                { message: 'Invalid email or password.' }, 
                { status: 401 }
            );
        }

        // Generate the JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_access },
            jwtSecret,
            {
                expiresIn: jwtExpiry,
                algorithm: 'HS256' // Specify algorithm explicitly
            }
        );

        // Set the httpOnly cookie with the token
        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
            }
        });
        
        response.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production only
        });

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json(
            {
                message: 'Server error occurred. Contact company or try again.'
            },
            { status: 500 }
        );
    }
}
