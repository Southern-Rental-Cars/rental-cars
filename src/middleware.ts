import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const GENERATE_NEW_TOKEN = '/api/auth/regenerate_token';

// Define routes accessible to customers
const customerAllowedRoutes = [
  { method: 'POST', path: /^\/api\/booking/ },
  { method: 'GET', path: /^\/api\/booking(\/[^/]+)?\/?$/ },
  { method: 'POST', path: /^\/api\/orders/ },
  { method: 'GET', path: /^\/api\/vehicle/ },
  { method: 'GET', path: /^\/api\/vehicle_images/ },
  { method: 'POST', path: /^\/api\/extras\/availability/ },
  { method: 'GET', path: /^\/api\/extras/ },
  { method: 'PUT', path: /^\/api\/user/ },
  { method: 'GET', path: /^\/api\/user(\/[^/]+)?\/?$/ },
  { method: 'DELETE', path: /^\/api\/user/ },

];

// Define public routes (accessible without authentication)
const publicRoutes = [
  { method: 'GET', path: /^\/api\/vehicle/ },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Check if the route is publicly accessible without a token
  const isPublicRoute = publicRoutes.some((route) => route.method === method && route.path.test(pathname));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Exclude authentication and refresh routes from requiring verification
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  console.log("Path:", pathname);
  console.log("Method:", method);
  console.log("Is Public Route:", isPublicRoute);

  // Retrieve token from cookies
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    // Verify JWT token and extract payload
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)) as { payload: JwtPayload };
    const userRole = payload.role;
    const userId = payload.id;

    // Set user ID and role in the headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    response.headers.set('x-user-role', userRole);

    // If user is an admin, allow access to all routes
    if (userRole === 'admin') {
      return response;
    }
    
    // If the user is a customer and if the route is allowed for customers
    if (userRole === 'customer') {
      const isAllowed = customerAllowedRoutes.some(
        (route) => route.method === method && route.path.test(pathname)
      );
      if (isAllowed) {
        return response;
      } else {
        return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
      }
    }

    // If role is neither admin nor customer, deny access
    return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });

  } catch (error: any) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      const refreshResponse = await fetch(GENERATE_NEW_TOKEN, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshResponse.ok) {
        const { newToken } = await refreshResponse.json();
        const response = NextResponse.next();
        response.cookies.set('token', newToken, { httpOnly: true, sameSite: 'strict', path: '/' });
        return response;
      }

      return NextResponse.json({ message: 'Unauthorized: Token refresh failed' }, { status: 401 });
    }

    console.error('JWT verification failed:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }
}

// Apply middleware to all API routes
export const config = {
  matcher: ['/api/:path*']
};
