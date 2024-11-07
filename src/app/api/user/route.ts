import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { Role } from '@prisma/client';

// GET /api/user - Returns the user based on the user_id in the headers
export async function GET(request: Request) {
  const user_id = request.headers.get('x-user-id');
  console.log("user: "+ user_id);
  if (!user_id) {
    return NextResponse.json({ error: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        email: true,
        full_name: true,
        date_of_birth: true,
        role_access: true,
        phone: true,
        street_address: true,
        zip_code: true,
        license_city: true,
        license_state: true,
        license_country: true,
        license_number: true,
        license_expiration: true,
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

// PUT /api/user - Updates a user's fields based on the user_id in the headers
export async function PUT(req: Request) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const data = await req.json();
    // Ensure role_access is in the correct format
    if (data.role_access) {
      data.role_access = data.role_access === 'admin' ? Role.admin : Role.customer;
    }

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

// DELETE /api/user - Deletes a user based on the user_id in the headers
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
