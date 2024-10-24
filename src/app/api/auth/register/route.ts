import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma'; // Update the path for your Prisma client
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Define types for better clarity and maintainability
interface RegistrationData {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  role_access: string;
  phone: string;
  street_address: string;
  zip_code: string;
  country: string;
  license_number: string;
  license_state: string;
  license_front_img: string;
  license_back_img: string;
  license_expiration: string;
  billing_full_name: string;
  billing_street_address: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  tax_id: string;
  billing_email: string;
}

// Main POST handler function for registration
export async function POST(req: Request) {
  try {
    const {
      email, password, full_name, date_of_birth, role_access, phone, street_address, zip_code, country,
      license_number, license_state, license_front_img, license_back_img, license_expiration,
      billing_full_name, billing_street_address, billing_city, billing_state, billing_country, billing_postal_code, tax_id, billing_email
    }: RegistrationData = await req.json();

    // Validate required fields
    if (!email || !password || !license_number || !license_state || !license_expiration) {
      return NextResponse.json(
        { message: 'Email, password, license number, license state, and license expiration are required.' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        role_access: role_access || 'user',
        phone,
        street_address,
        zip_code,
        country,
        license_number,
        license_state,
        license_front_img: license_front_img || '',
        license_back_img: license_back_img || '',
        license_expiration: new Date(license_expiration),
        billing_full_name: billing_full_name || full_name,
        billing_street_address: billing_street_address || street_address,
        billing_city: billing_city || null,
        billing_state: billing_state || null,
        billing_country: billing_country || country,
        billing_postal_code: billing_postal_code || zip_code,
        tax_id: tax_id || null,
        billing_email: billing_email || email,
      },
    });

    // Generate a JWT token for the user (to be used for authentication)
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variable for secret
      { expiresIn: '7d' } // Token expiration time (7 days in this case)
    );

    // Return success response with the token
    return NextResponse.json(
      {
        message: 'User registered successfully!',
        user: {
          id: newUser.id,
          email: newUser.email,
          token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}

// This handles unsupported methods like GET, DELETE, etc.
export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
