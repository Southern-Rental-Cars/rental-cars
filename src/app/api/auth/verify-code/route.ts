// app/api/auth/verify-code/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, code, password } = await req.json();

  try {
    const verification = await prisma.verificationCode.findUnique({
      where: { email, code },
    });

    // If no matching code or code expired, return error
    if (!verification || verification.expires_at < new Date()) {
      return NextResponse.json({ message: 'Invalid or expired code' }, { status: 400 });
    }

    // Create the user in the User table
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        admin: false,
      },
    });

    // Remove the verification code record from VerificationCode
    await prisma.verificationCode.delete({ where: { email } });

    return NextResponse.json({ message: 'Email verified and account successfully created' });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ message: 'Verification failed' }, { status: 500 });
  }
}
