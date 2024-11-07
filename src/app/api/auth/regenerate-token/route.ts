import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRY;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables.");
if (!JWT_EXPIRATION) throw new Error("JWT_EXPIRATION is not defined in environment variables.");

export async function POST(req: Request) {
  console.log("Token Regeneration Request Received");

  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No token provided.' }, { status: 401 });
  }

  try {
    // Verify current token; if still valid, return confirmation
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ message: 'Token is still valid.' }, { status: 200 });
  } catch (error : any) {
    if (error.name === 'TokenExpiredError') {
      return handleTokenExpiration(token);
    }
    console.error('JWT verification failed:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid token.' }, { status: 401 });
  }
}

async function handleTokenExpiration(expiredToken: string) {
  const decoded = jwt.decode(expiredToken) as jwt.JwtPayload;

  if (!decoded || !decoded.id) {
    return NextResponse.json({ message: 'Invalid token payload.' }, { status: 401 });
  }

  // Validate user from decoded token
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    return NextResponse.json({ message: 'User not found.' }, { status: 401 });
  }

  // Generate a new token for the user
  const newToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  // Set the new token in the cookies
  const response = NextResponse.json({ message: 'Token refreshed successfully.' });
  response.cookies.set('token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 1 day
  });

  return response;
}

// Handle unsupported HTTP methods with a generic 405 response
export async function GET() {
  return methodNotAllowedResponse();
}
export async function PATCH() {
  return methodNotAllowedResponse();
}
export async function DELETE() {
  return methodNotAllowedResponse();
}

function methodNotAllowedResponse() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}