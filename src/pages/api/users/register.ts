import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';

type Data = {
  message: string;
  user?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      const {
        email, password, full_name, date_of_birth, role_access, phone, street_address, zip_code, country,
        license_number, license_state, license_front_img, license_back_img, license_expiration,
        billing_full_name, billing_street_address, billing_city, billing_state, billing_country, billing_postal_code, tax_id, billing_email
      } = req.body;

      // Validate required fields
      // TODO: remove this, validation happens in client, not necessary here
      if (!email || !password || !license_number || !license_state || !license_expiration) {
        return res.status(400).json({
          message: 'Email, password, license number, license state, and license expiration are required.'
        });
      }

      // Check if the user already exists
      const existingUser = await prisma.users.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user in the database
      const newUser = await prisma.users.create({
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

      // Return success response
      return res.status(201).json({
        message: 'User registered successfully!',
        user: {
          user_id: newUser.id,
        },
      });
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Use type assertion to treat error as Error instance
      if (error instanceof Error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }

      return res.status(500).json({ message: 'Unknown error occurred' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
