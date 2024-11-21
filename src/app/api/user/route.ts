import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// Get logged in user
export async function GET(request: Request) {
  const user_id = request.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        email: true,
        phone: true,
        license_front_img: true,
        license_back_img: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Updates logged in user profile data
export async function PUT(req: Request) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Update user fields based on the provided data
    await prisma.user.update({
      where: { id: user_id },
      data,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Deletes logged in user
export async function DELETE(req: Request) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const user = await prisma.user.delete({
      where: { id: user_id },
    });

    return NextResponse.json({ userId: user.id });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
