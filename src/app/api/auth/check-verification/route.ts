// app/api/auth/check-verification/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({
    where: { email },
    select: { emailVerified: true },
  });

  if (user) {
    return NextResponse.json({ verified: user.email });
  } else {
    return NextResponse.json({ verified: false }, { status: 404 });
  }
}
