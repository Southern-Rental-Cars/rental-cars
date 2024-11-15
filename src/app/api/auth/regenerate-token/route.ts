import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
const jwtExpiry = process.env.JWT_EXPIRY || '1d'; // Default to 1 day if not defined

export async function POST(req: Request) {
    console.log("Token Regeneration Request Received");

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { message: 'No token provided.' },
            { status: 401 }
        );
    }

    // Directly proceed to refresh the token
    return await handleTokenExpiration(token);
}

async function handleTokenExpiration(expiredToken: string) {
    const decoded = jwt.decode(expiredToken) as jwt.JwtPayload;

    if (!decoded || !decoded.id) {
        return NextResponse.json(
            { message: 'Invalid token payload.' },
            { status: 401 }
        );
    }

    // Validate user from decoded token
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
        return NextResponse.json(
            { message: 'User not found.' },
            { status: 401 }
        );
    }

    // Generate a new token for the user
    const newToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role_access },
        jwtSecret,
        {
            expiresIn: jwtExpiry,
            algorithm: 'HS256'
        }
    );

    // Set the new token in the cookies
    const response = NextResponse.json({
        message: 'Token refreshed successfully',
        user: {
            id: user.id,
            email: user.email,
            role: user.role_access
        }
    });

    response.cookies.set('token', newToken, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
    });

    return response;
}
