import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

// Helper function to check extras availability
async function checkExtrasAvailability(
  res: NextApiResponse, // Pass res to send responses
  extras: { extra_id: number; quantity: number }[],
  start_date: string,
  end_date: string
): Promise<void> {
  const availabilityResults: { [key: number]: { available: boolean; available_quantity: number } } = {};

  for (const extra of extras) {
    const { extra_id, quantity } = extra;

    // Fetch the total available quantity of the extra
    const extraDetails = await prisma.extras.findUnique({
      where: { id: extra_id },
      select: { name: true, total_quantity: true },
    });

    // If extra not found, return a 404 error with JSON response
    if (!extraDetails) {
      return res.status(404).json({ error: `Extra with ID ${extra_id} not found.` });
    }

    let totalBookedQuantity = 0;
    let currentDate = new Date(start_date);
    const endDateObject = new Date(end_date);

    // Check availability for each day in the range
    while (currentDate <= endDateObject) {
      const bookedQuantityResult = await prisma.booking_extras.aggregate({
        _sum: { quantity: true },
        where: {
          extra_id,
          bookings: {
            OR: [
              { start_date: { lte: currentDate }, end_date: { gte: currentDate } },
            ],
          },
        },
      });

      const bookedQuantity = bookedQuantityResult._sum.quantity || 0;
      totalBookedQuantity = Math.max(totalBookedQuantity, bookedQuantity);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const availableQuantity = extraDetails.total_quantity - totalBookedQuantity;

    availabilityResults[extra_id] = {
      available: availableQuantity >= quantity,
      available_quantity: availableQuantity,
    };
  }

  // Return the availability result
  return res.status(200).json(availabilityResults);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { start_date, end_date, extras } = req.body;

    // Validate request body
    if (!start_date || !end_date || !extras) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    try {
      // Check the extras availability
      await checkExtrasAvailability(res, extras, start_date, end_date);
    } catch (error) {
      return res.status(500).json({ error: 'An error occurred while checking availability.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
