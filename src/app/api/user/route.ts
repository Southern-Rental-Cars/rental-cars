import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import crypto from 'crypto';

const encryptionKey = process.env.ENCRYPTION_KEY!; // Must be 32 bytes for AES-256
const ivLength = 16; // For AES, this is always 16 bytes

function encrypt(text: string): string {
  // initalize cipher
  const initVector = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), initVector);
  // encrypting
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${initVector.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(text: string): string {
  const [ivHex, encryptedText] = text.split(':');
  const initVector = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), initVector);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

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
        license_street_address: true,
        license_city: true,
        license_state: true,
        license_country: true,
        license_zip_code: true,
        license_date_of_birth: true,
        license_expiration: true,
        license_front_img: true,
        license_back_img: true,
        billing_city: true,
        billing_zip_code: true,
        billing_state: true,
        billing_street_address: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Decrypt sensitive fields
    const decryptedUser = {
        ...user,
        phone: user.phone ? decrypt(user.phone) : null,
        license_number: user.license_number ? decrypt(user.license_number) : null,
        license_street_address: user.license_street_address ? decrypt(user.license_street_address) : null,
        license_city: user.license_city ? decrypt(user.license_city) : null,
        license_state: user.license_state ? decrypt(user.license_state) : null,
        license_country: user.license_country ? decrypt(user.license_country) : null,
        license_zip_code: user.license_zip_code ? decrypt(user.license_zip_code) : null,
        license_date_of_birth: user.license_date_of_birth ? decrypt(user.license_date_of_birth) : null,
        license_expiration: user.license_expiration ? decrypt(user.license_expiration) : null,
        billing_city: user.billing_city ? decrypt(user.billing_city) : null,
        billing_zip_code: user.billing_zip_code ? decrypt(user.billing_zip_code) : null,
        billing_state: user.billing_state ? decrypt(user.billing_state) : null,
        billing_street_address: user.billing_street_address ? decrypt(user.billing_street_address) : null,
      };

    return NextResponse.json(decryptedUser);
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

    // Fetch existing user data from the database
    const existingUser = await prisma.user.findUnique({ where: { id: user_id } });
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Encrypt sensitive fields before saving to the database
    const encryptedData = {
      ...data,
      phone: data.phone ? encrypt(data.phone) : undefined,
      license_number: data.license_number ? encrypt(data.license_number) : undefined,
      license_city: data.license_city ? encrypt(data.license_city) : undefined,
      license_state: data.license_state ? encrypt(data.license_state) : undefined,
      license_street_address: data.license_street_address ? encrypt(data.license_street_address) : undefined,
      license_country: data.license_country ? encrypt(data.license_country) : undefined,
      license_date_of_birth: data.license_date_of_birth ? encrypt(data.license_date_of_birth) : undefined,
      license_zip_code: data.license_zip_code ? encrypt(data.license_zip_code) : undefined,
      license_expiration: data.license_expiration ? encrypt(data.license_expiration) : undefined,
      billing_city: data.billing_city ? encrypt(data.billing_city) : undefined,
      billing_zip_code: data.billing_zip_code ? encrypt(data.billing_zip_code) : undefined,
      billing_state: data.billing_state ? encrypt(data.billing_state) : undefined,
      billing_street_address: data.billing_street_address ? encrypt(data.billing_street_address) : undefined,
    };

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
        ...encryptedData,
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

// Delete user
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
