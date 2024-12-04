import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/utils/emailHelpers/emailHelpers';
import { verifyRecaptcha } from '@/utils/google/captcha';

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}

const jwtExpiry = process.env.JWT_EXPIRY || '1d'; // Default to 1 day if not defined

export async function POST(req: Request) {
    try {
        const { email, recaptchaToken } = await req.json();
        // Validate the email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { message: 'Invalid request. Email is required.' },
                { status: 400 }
            );
        }

        // Validate the reCAPTCHA token
        if (!recaptchaToken || typeof recaptchaToken !== 'string') {
            return NextResponse.json(
                { message: 'Invalid request. reCAPTCHA token is required.' },
                { status: 400 }
            );
        }

        const isHuman = await verifyRecaptcha(recaptchaToken);

        if (!isHuman) {
            return NextResponse.json(
                { message: 'Failed reCAPTCHA verification.' },
                { status: 403 }
            );
        }

        // Check if user exists in the database
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Always respond with the same message to prevent user enumeration
            return NextResponse.json(
                { message: 'If the email exists, a reset link has been sent' }
            );
        }

        // Create a JWT token for password reset
        const token = jwt.sign(
            { email, purpose: 'forgot-password' }, // Payload
            jwtSecret, // Secret key
            { expiresIn: jwtExpiry } // Options object
        );

        // Send password reset email
        await sendPasswordResetEmail(email, token);

        return NextResponse.json({ message: 'If the email exists, a reset link has been sent' });
    } catch (error) {
        console.error('Error on forgot password:', error);
        return NextResponse.json(
            { message: 'Server error. Please try again.' },
            { status: 500 }
        );
    }
}
