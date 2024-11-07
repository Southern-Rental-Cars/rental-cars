// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the HTTP-only cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the "token" cookie by setting it with an expired maxAge or Expires
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: true, // Ensure this is true in production for HTTPS
      sameSite: 'strict',
      path: '/', // Apply to the entire site
      maxAge: 0, // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}
