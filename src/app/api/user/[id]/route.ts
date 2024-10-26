import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client

// GET /api/user/:id - Returns the user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        full_name: true,
        date_of_birth: true,
        role_access: true,
        phone: true,
        street_address: true,
        zip_code: true,
        country: true,
        license_number: true,
        license_state: true,
        license_expiration: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/user/:id - Updates a user's fields
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const data = await req.json();

    // Update user fields based on the provided data
    await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data,
    });

    return NextResponse.json({}, { status: 204 }); // No content response
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/user/:id - Deletes a user and returns the deleted userId
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ userId: deletedUser.id });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
