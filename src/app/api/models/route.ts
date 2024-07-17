// pages/api/models/index.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/models`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ message: 'Error fetching chats' });
    }
}