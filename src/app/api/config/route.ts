// src/app/api/config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return NextResponse.json({ message: 'Error fetching configuration' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (!response.ok) {
      throw new Error('Failed to update configuration');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating configuration:', error);
    return NextResponse.json({ message: 'Error updating configuration' }, { status: 500 });
  }
}