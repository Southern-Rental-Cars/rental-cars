import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Use jose for JWT verification (Edge-compatible)

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret'; // Store secret in environment variables

// Middleware function to verify JWT token
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude the /auth routes from requiring authentication
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check the HTTP method; only protect mutating methods (POST, PUT, PATCH, DELETE)
  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  // If the request method is GET or other non-mutating methods, allow it to pass through
  if (!protectedMethods.includes(request.method)) {
    return NextResponse.next();
  }

  // Attempt to retrieve the token from Authorization header
  const authHeader = request.headers.get('Authorization');
  let token = authHeader ? authHeader.split(' ')[1] : null;

  // If no token is found, return an unauthorized response
  if (!token || token === 'undefined') {
    return new NextResponse('Unauthorized: No token provided', { status: 401 });
  }

  try {
    // Verify the JWT token using jose (for Edge runtime compatibility)
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    console.log('Token verification successful:', payload);

    // Proceed with the request if token verification succeeds
    return NextResponse.next();
  } catch (error) {
    // Log the error for debugging purposes and return a 401 Unauthorized response
    console.error('JWT verification failed:', error);
    return new NextResponse('Unauthorized: Invalid or expired token', { status: 401 });
  }
}

// Config to apply middleware to all API routes
export const config = {
  matcher: ['/api/:path*'],
};
