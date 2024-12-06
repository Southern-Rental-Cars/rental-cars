import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { verifyRecaptcha } from '@/utils/google/captcha';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
const jwtExpiry = process.env.JWT_EXPIRY || '1d'; // Default to 1 day if not defined

export async function POST(req: Request) {
    try {
        const { email, password, captchaToken } = await req.json();

        // Find user in db
        const user = await prisma.user.findUnique({ where: { email } });

        // Verify user exists and validate password
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return NextResponse.json(
                { message: 'Wrong email or password' },
                { status: 401 }
            );
        }

        // Validate CAPTCHA
        const isCaptchaValid = await verifyRecaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json(
                { message: 'CAPTCHA verification failed. Please try again.' },
                { status: 403 }
            );
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, admin: user.admin },
            jwtSecret as string,
            {
                expiresIn: jwtExpiry,
                algorithm: 'HS256', // Specify algorithm explicitly
            }
        );

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                admin: user.admin,
                is_billing_complete: user.is_billing_complete,
                is_license_complete: user.is_license_complete,
                phone: user.phone,
            },
        });

        // Set cookie with jwt
        response.cookies.set('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            secure: process.env.NODE_ENV === 'production', // Use HTTPS in production only
            maxAge: 3 * 24 * 60 * 60, // 3 days in seconds
        });

        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            {
                message: 'Server error. Please try again.',
            },
            { status: 500 }
        );
    }
}
