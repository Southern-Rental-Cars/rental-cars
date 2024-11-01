import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
const jwtExpiry = process.env.JWT_EXPIRY;
if (!jwtExpiry) {
    throw new Error("JWT_EXPIRY is not defined in environment variables.");
}

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find the user and validate password
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
        }

        // Generate the token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            jwtSecret,
            { expiresIn: jwtExpiry }
        );

        // Set the httpOnly cookie with the token, configuring it differently for dev vs. prod
        const response = NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, full_name: user.full_name } });
        response.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 86400, // 1 day in seconds
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production only
        });

        return response;

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({ message: 'Server error occurred. Contact company or try again.', error: error.message }, { status: 500 });
    }
}