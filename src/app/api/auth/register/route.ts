import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import validator from 'validator';

// Define allowed roles based on the enum in your Prisma schema
type Role = 'customer' | 'admin';

interface RegistrationData {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  role_access?: Role; // Updated to optional Role type
  phone: string;
  street_address: string;
  zip_code: string;
  country: string;
  license_number: string;
  license_state: string;
  license_city: string;
  license_expiration: string;
  license_country: string;
  license_front_img: string;
  license_back_img: string;
  billing_street_address: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  tax_id: string;
}

export async function POST(req: Request) {
  try {
    const data: RegistrationData = await req.json();
    const {
      email, password, full_name, date_of_birth, role_access, phone, street_address, zip_code, country,
      license_number, license_state, license_city, license_country, license_front_img, license_back_img, license_expiration,
      billing_street_address, billing_city, billing_state, billing_country, billing_postal_code, tax_id
    } = data;

    // Check required fields and validate email format
    if (!email || !password || !license_number || !license_state || !license_expiration || !validator.isEmail(email)) {
      return NextResponse.json({ message: 'Missing required input fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate or set default for role_access
    const userRole: Role = role_access === 'admin' ? 'admin' : 'customer';

    // Set default values for billing if not provided
    const billingInfo = {
      billing_street_address: billing_street_address || street_address,
      billing_city: billing_city || null,
      billing_state: billing_state || null,
      billing_country: billing_country || country,
      billing_postal_code: billing_postal_code || zip_code,
    };

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name,
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        role_access: userRole, // Assign role using validated userRole variable
        phone,
        street_address,
        zip_code,
        country,
        license_number,
        license_state,
        license_city,
        license_country,
        license_front_img: license_front_img || '',
        license_back_img: license_back_img || '',
        license_expiration: new Date(license_expiration),
        ...billingInfo,
        tax_id: tax_id || null,
      },
    });

    return NextResponse.json(
      { message: 'Registered successfully', user: { id: user.id, email: user.email, full_name: user.full_name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function PATCH() {
  return GET();
}

export async function DELETE() {
  return GET();
}