import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const GENERATE_NEW_TOKEN = '/api/auth/regenerate_token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude authentication and refresh routes from requiring verification
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!protectedMethods.includes(request.method)) {
    return NextResponse.next();
  }

  // Retrieve token from cookies instead of headers
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }
  console.log("TOKEN IN MIDDLEWARE: " + token );
  try {
    // Verify JWT token
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return NextResponse.next(); // Token is valid
  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      // Expired token, request a new one
      const refreshResponse = await fetch(GENERATE_NEW_TOKEN, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const { newToken } = await refreshResponse.json();
        console.log("GENERATED NEW TOKEN: " + newToken);
        // Set the new token in cookies to be used in future requests
        const response = NextResponse.next();
        response.cookies.set('token', newToken, { httpOnly: true, sameSite: 'strict' });
        return response;
      }

      return NextResponse.json({ message: 'Unauthorized: Token refresh failed' }, { status: 401 });
    }

    console.error('JWT verification failed:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }
}

// Config to apply middleware to all API routes
export const config = {
  matcher: ['/api/:path*']
};