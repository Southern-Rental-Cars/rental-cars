import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Extract the 'id' and 'car_id' from the query parameters
    const { id, car_id } = req.query;

    // Validate that 'id' and 'car_id' are strings if they exist
    if ((id && typeof id !== 'string') || (car_id && typeof car_id !== 'string')) {
        return res.status(400).json({ error: 'Invalid ID or car_id' });
    }

    switch (req.method) {
        case 'GET':
            await handleGet(req, res, id as string | undefined, car_id as string | undefined);
            break;
        case 'PUT':
            await handleUpdate(req, res, id as string);
            break;
        case 'DELETE':
            await handleCancel(req, res, id as string);
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, id?: string, car_id?: string) {
    try {
        // Case: Fetch booking by booking ID
        if (id) {
            const booking = await prisma.bookings.findUnique({
                where: {
                    id: parseInt(id),
                },
                select: {
                    id: true,
                    car_id: true,
                    start_date: true,
                    end_date: true,
                    status: true,
                    booking_extras: {
                        select: {
                            extra_id: true,
                            quantity: true,
                        },
                    },
                },
            });

            if (booking) {
                return res.status(200).json(booking);
            } else {
                return res.status(404).json({ error: 'Booking not found' });
            }
        }

        // Case: Fetch bookings by car ID
        //TODO: Implement this case
        /*if (car_id) {
            const bookings = await prisma.bookings.findMany({
                where: {
                    car_id: parseInt(car_id),
                },
                select: {
                    id: true,
                    car_id: true,
                    start_date: true,
                    end_date: true,
                    status: true,
                },
            });

            return res.status(200).json(bookings);
        }*/

        // Case: Fetch all bookings if no ID or car_id is provided
        const bookings = await prisma.bookings.findMany({
            select: {
                id: true,
                car_id: true,
                start_date: true,
                end_date: true,
                status: true,
            },
        });

        return res.status(200).json(bookings);

    } catch (err) {
        console.error('Error fetching booking:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse, id: string) {
    const { start_date, end_date, status } = req.body;

    if (!start_date && !end_date && !status) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    try {
        // Start a transaction
        await prisma.$transaction(async (prisma) => {
            // Fetch the existing booking and its extras
            const booking = await prisma.bookings.findUnique({
                where: { id: parseInt(id) },
                include: { booking_extras: true },
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            // If status is being updated to 'completed', increment available_quantity
            if (status && status === 'completed' && booking.status !== 'completed') {
                for (const bookingExtra of booking.booking_extras) {
                    if (bookingExtra.extra_id !== null && bookingExtra.quantity !== null) {
                        await prisma.extras.update({
                            where: { id: bookingExtra.extra_id },
                            data: {
                                available_quantity: { increment: bookingExtra.quantity },
                            },
                        });
                    }
                }
            }

            // Update the booking
            await prisma.bookings.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    ...(start_date && { start_date: new Date(start_date) }),
                    ...(end_date && { end_date: new Date(end_date) }),
                    ...(status && { status }),
                },
            });
        });

        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error: unknown) {
        console.error('Error updating booking:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Booking not found' });
            } else {
                res.status(500).json({ error: 'Database error' });
            }
        } else {
            const message = error instanceof Error ? error.message : 'Internal Server Error';
            res.status(400).json({ error: message });
        }
    } finally {
        await prisma.$disconnect();
    }
}

async function handleCancel(req: NextApiRequest, res: NextApiResponse, id: string) {
    try {
        // Fetch the booking and its related booking_extras
        const booking = await prisma.bookings.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                booking_extras: true, // Include the booking_extras in the query
            },
        });

        // If booking not found, return 404
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if the booking is already canceled to prevent double-cancellation
        if (booking.status === 'CANCEL') {
            return res.status(400).json({ error: 'Booking is already canceled' });
        }

        // Increment the available_quantity for each extra in booking_extras
        for (const bookingExtra of booking.booking_extras) {
            if (bookingExtra.extra_id && bookingExtra.quantity) {
                await prisma.extras.update({
                    where: { id: bookingExtra.extra_id },
                    data: {
                        available_quantity: {
                            increment: bookingExtra.quantity, // Increment by the quantity in booking_extras
                        },
                    },
                });
            }
        }

        // Update the booking status to "CANCEL"
        const updatedBooking = await prisma.bookings.update({
            where: {
                id: parseInt(id),
            },
            data: {
                status: 'CANCEL',  // Update the status field to "CANCEL"
            },
        });

        res.status(200).json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error cancelling booking:', error);

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: 'Booking not found' });
            } else {
                res.status(500).json({ error: 'Database error' });
            }
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } finally {
        await prisma.$disconnect();
    }
}


