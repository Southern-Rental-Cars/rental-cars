import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your prisma client

// Handler for POST request to create a new extra
export async function POST(req: Request) {
  try {
    const { name, description, total_quantity, price_type, price_amount } = await req.json();
    
    // Create a new extra without date requirements
    const newExtra = await prisma.extras.create({
      data: {
        name,
        description,
        total_quantity, // This represents overall available stock or can be used by default
        price_type,
        price_amount,
      },
    });

    return NextResponse.json(newExtra, { status: 201 });
  } catch (err) {
    console.error('Error creating extra:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handler for GET request to fetch all extras
export async function GET() {
  try {
    // Fetch all extras without date filtering
    const extras = await prisma.extras.findMany();
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
