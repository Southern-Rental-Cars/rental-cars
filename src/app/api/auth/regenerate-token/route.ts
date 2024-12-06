import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/utils/prisma';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error("JWT_SECRET not defined in .env.");
}
const jwtExpiry = process.env.JWT_EXPIRY || '1d'; // Default to 1 day if not defined

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { message: 'No token provided' },
            { status: 401 }
        );
    }

    return await refreshToken(token);
}

async function refreshToken(expiredToken: string) {
    const decodedToken = jwt.decode(expiredToken) as jwt.JwtPayload;

    if (!decodedToken || !decodedToken.id) {
        return NextResponse.json(
            { message: 'Invalid token payload' },
            { status: 401 }
        );
    }

    // Validate user from decoded token
    const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
    if (!user) {
        return NextResponse.json(
            { message: 'User not found' },
            { status: 401 }
        );
    }

    // Generate a new token for the user
    const token = jwt.sign(
        { id: user.id, email: user.email, admin: user.admin }, 
        jwtSecret as string,
        { expiresIn: jwtExpiry, algorithm: 'HS256' }
    );
    
    // Set the new token in the cookies
    const response = NextResponse.json({
        message: 'Token successfully refreshed',
        user: {
            id: user.id,
            email: user.email,
            admin: user.admin
        }
    });

    response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
    });

    return response;
}
