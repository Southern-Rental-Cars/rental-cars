import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendVerificationEmail } from '@/utils/emailHelpers/emailHelpers';
import { verifyRecaptcha } from '@/utils/google/captcha';

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit random number
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log("REGISTERING")
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Invalid request. Please provide all required fields.' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'If the email exists, a verification code has been sent.' },
        { status: 200 } // Always return 200 to prevent user enumeration
      );
    }

    // Generate a verification code and expiration time
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

    // Store the verification code in the database
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code: verificationCode, expires_at: expiresAt },
      create: { email, code: verificationCode, expires_at: expiresAt },
    });

    // Send the verification code via email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: 'If the email exists, a verification code has been sent.' },
      { status: 200 } // Consistent response for both cases
    );
  } catch (error) {
    console.error('Error during registration:', error);

    // Avoid leaking internal implementation details
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
