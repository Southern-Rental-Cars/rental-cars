import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma'; // Adjust the path to your prisma client

// Handler for POST request to create a new extra
export async function POST(req: Request) {
  try {
    const { name, description, total_quantity, price_type, price_amount } = await req.json();

    // Conditionally set total_quantity based on price_type
    const extraData: any = {
      name,
      description,
      price_type,
      price_amount,
    };

    // Only add total_quantity if price_type is not "TRIP"
    if (extraData.price_type != "TRIP") {
      extraData.total_quantity = total_quantity;
    }

    // Create a new extra without date requirements
    const extra = await prisma.extra.create({
      data: extraData,
    });

    return NextResponse.json(extra, { status: 201 });
  } catch (err) {
    console.error('Error creating extra:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handler for GET request to fetch all extras
export async function GET() {
  try {
    // Fetch all extras without date filtering
    const extras = await prisma.extra.findMany();
    return NextResponse.json(extras, { status: 200 });
  } catch (err) {
    console.error('Error fetching extras:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle unsupported HTTP methods
export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
