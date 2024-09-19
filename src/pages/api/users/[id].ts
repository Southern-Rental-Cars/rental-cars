import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

type Data = {
  message: string;
  user?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      return getUser(req, res, id as string);
    case 'PUT':
      return updateUser(req, res, id as string);
    case 'DELETE':
      return deleteUser(req, res, id as string);
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// GET /api/users/:id - Returns the currently logged-in user
async function getUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const user = await prisma.users.findUnique({
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
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// PUT /api/users/:id - Updates a user's fields
async function updateUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const data = req.body;

    // Update user fields based on the provided data
    await prisma.users.update({
      where: { id: parseInt(id) },
      data,
    });

    return res.status(204).end(); // No content response
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// DELETE /api/users/:id - Deletes a user and returns the deleted userId
async function deleteUser(req: NextApiRequest, res: NextApiResponse, id: string) {
  try {
    const deletedUser = await prisma.users.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ userId: deletedUser.id });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
