// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendVerificationEmail } from '@/utils/verification/sendVerificationEmail';

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // Check if the email already exists in the User table
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    // Generate a 6-digit verification code and expiration time
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Expires in 15 minutes

    // Store the verification code in VerificationCode table
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code: verificationCode, expires_at: expiresAt },
      create: { email, code: verificationCode, expires_at: expiresAt },
    });

    // Send the code via email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { message: 'Verification code sent. Please check your email.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
