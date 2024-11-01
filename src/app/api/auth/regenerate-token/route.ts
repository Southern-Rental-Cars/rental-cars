import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
if (!JWT_EXPIRATION) {
  throw new Error("JWT_EXPIRATION is not defined in environment variables.");
}

export async function POST(req: Request) {
  console.log("REGENERATE TOKEN");
  try {
    // Try retrieving token from Authorization header
    const authHeader = req.headers.get('Authorization');
    let token = authHeader ? authHeader.split(' ')[1] : null;
    // If no token in header, attempt to retrieve from cookies
    if (!token) {
      const cookieStore = cookies();
      token = cookieStore.get('token')?.value ?? null;
    }
    console.log("TOKEN: " + token);

    if (!token) {
      return NextResponse.json({ message: 'No token provided.' }, { status: 401 });
    }

    try {
      // Verify JWT token (will throw if expired or invalid)
      jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ message: 'Token is still valid.' }, { status: 200 });
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        // Decode token payload for user details
        const decoded = jwt.decode(token) as jwt.JwtPayload;
        if (!decoded || !decoded.id) {
          return NextResponse.json({ message: 'Invalid token payload.' }, { status: 401 });
        }

        // Optional: Verify user exists in database
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user) {
          return NextResponse.json({ message: 'User not found.' }, { status: 401 });
        }

        // Generate a new token with the same payload
        const newToken = jwt.sign(
          { id: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRATION }
        );

        // Set new token in cookies
        const response = NextResponse.json({ message: 'Token refreshed successfully.' });
        response.cookies.set('token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60, //1 day
        });

        return response;
      }

      // Handle other JWT errors
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
export async function PATCH() {
  return GET();
}
export async function DELETE() {
  return GET();
}