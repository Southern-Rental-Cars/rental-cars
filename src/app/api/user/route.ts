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
        license_number: true,
        license_city: true,
        license_country: true,
        license_expiration: true,
        license_state: true,
        license_front_img: true,
        license_back_img: true,
        billing_city: true,
        billing_zip_code: true,
        billing_state: true,
        billing_street_address: true,
        license_date_of_birth: true
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

export async function PUT(req: Request) {
  const user_id = req.headers.get('x-user-id');
  if (!user_id) {
    return NextResponse.json({ message: 'Unauthorized: Missing user information' }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Fetch the existing user data from the database
    const existingUser = await prisma.user.findUnique({ where: { id: user_id } });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Merge incoming data with existing user data
    const updatedUserData = { ...existingUser, ...data };

    // Check if all license-related fields are populated
    const isLicenseComplete =
      updatedUserData.license_number &&
      updatedUserData.license_date_of_birth &&
      updatedUserData.license_street_address &&
      updatedUserData.license_city &&
      updatedUserData.license_state &&
      updatedUserData.license_zip_code &&
      updatedUserData.license_country &&
      updatedUserData.license_expiration &&
      updatedUserData.license_front_img &&
      updatedUserData.license_back_img
        ? true
        : false;

    // Check if all billing-related fields are populated
    const isBillingComplete =
      updatedUserData.billing_street_address &&
      updatedUserData.billing_city &&
      updatedUserData.billing_state &&
      updatedUserData.billing_zip_code
        ? true
        : false;

    // Update user fields along with computed values
    await prisma.user.update({
      where: { id: user_id },
      data: {
        ...data,
        is_license_complete: isLicenseComplete,
        is_billing_complete: isBillingComplete,
      },
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
