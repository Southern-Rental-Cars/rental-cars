import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: string;
  admin: boolean;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret';
const GENERATE_NEW_TOKEN = process.env.NEXT_PUBLIC_API_BASE_URL+ '/api/auth/regenerate-token';

// Define routes accessible to customers
const customerAllowedRoutes = [
  { method: 'POST', path: /^\/api\/booking/ },
  { method: 'GET', path: /^\/api\/booking(\/[^/]+)?\/?$/ },
  { method: 'DELETE', path: /^\/api\/booking(\/[^/]+)?\/?$/ },
  { method: 'POST', path: /^\/api\/orders/ },
  { method: 'GET', path: /^\/api\/vehicle/ },
  { method: 'GET', path: /^\/api\/vehicle_images/ },
  { method: 'POST', path: /^\/api\/extras\/availability/ },
  { method: 'GET', path: /^\/api\/extras/ },
  { method: 'PUT', path: /^\/api\/user/ },
  { method: 'POST', path: /^\/api\/user\/license/ }, 
  { method: 'GET', path: /^\/api\/user(\/[^/]+)?\/?$/ },
  { method: 'DELETE', path: /^\/api\/user/ },

  { method: 'GET', path: /^\/dashboard\/?$/ },
];

// Define public routes (accessible without authentication)
const publicRoutes = [
  { method: 'GET', path: /^\/api\/vehicle/ },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  console.log('Middleware initiated for:', pathname, 'with method:', method);

  // Check if the route is publicly accessible without a token
  const isPublicRoute = publicRoutes.some((route) => route.method === method && route.path.test(pathname));
  if (isPublicRoute) {
    console.log('Public route accessed:', pathname);
    return NextResponse.next();
  }

  // Exclude authentication and refresh routes from requiring verification
  if (pathname.startsWith('/api/auth')) {
    console.log('Auth route accessed without verification:', pathname);
    return NextResponse.next();
  }

  // Retrieve token from cookies
  const token = request.cookies.get('token')?.value;
  if (!token) {
    console.log('Unauthorized: No token provided for', pathname);

    // Redirect unauthenticated requests to `/dashboard` to login page
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
  }

  try {
    // Verify JWT token and extract payload data
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)) as { payload: JwtPayload };
    const adminUser = payload.admin;
    const userId = payload.id;
    const userEmail = payload.email;
    
    console.log('Token verified. adminUser:', adminUser, ', userId:', userId, ', userEmail:', userEmail);

    // Set user ID, role, and email in the headers for API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', userId);
    response.headers.set('x-user-role', adminUser);
    response.headers.set('x-user-email', userEmail);

    // If user is an admin, allow access to all routes
    if (adminUser) {
      console.log('Admin access granted for', pathname);
      return response;
    } else {
      const isAllowed = customerAllowedRoutes.some(
        (route) => route.method === method && route.path.test(pathname)
      );

      if (isAllowed) {
        console.log('Customer access granted for', pathname);
        return response;
      } else {
        console.log('Customer access denied for', pathname);
        return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
      }
    }
  } catch (error: any) {

    if (error.code === 'ERR_JWT_EXPIRED') {
      console.log("Token is expired");

      const refreshResponse = await fetch(GENERATE_NEW_TOKEN, {
        method: 'POST',
        credentials: 'include',
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (refreshResponse.ok) {
        const newTokenCookie = refreshResponse.headers.get('set-cookie');

        if (newTokenCookie) {
          console.log("Token refreshed. Sending updated cookie to client.");

          // Create a new NextResponse to include the updated token cookie
          const response = NextResponse.next();

          // Set the new token in the response headers
          response.headers.set('Set-Cookie', newTokenCookie);

          return response;
      }

        console.log("Failed to extract new token from refresh response.");
      }

      console.log("Token refresh failed for", pathname);
      return NextResponse.json({ message: 'Unauthorized: Token refresh failed' }, { status: 401 });
    }

    console.error('JWT verification failed:', error);
    return NextResponse.json({ message: 'Unauthorized: Invalid or expired token' }, { status: 401 });
  }
}

// Apply middleware to all API routes and the `/dashboard` page
export const config = {
  matcher: ['/api/:path*', '/dashboard'],
};
