// app/api/auth/resend-verification/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { sendVerificationEmail } from '@/utils/verification/sendVerificationEmail';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.email_verified) {
      return NextResponse.json(
        { message: 'Verification is not needed or user does not exist.' },
        { status: 400 }
      );
    }

    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.upsert({
      where: { user_id: user.id },
      update: { token: verificationToken, expiresAt: tokenExpiresAt },
      create: { user_id: user.id, expires_at: tokenExpiresAt },
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: 'Verification email resent. Please check your email.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
