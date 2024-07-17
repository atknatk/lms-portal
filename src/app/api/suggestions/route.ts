// src/app/api/suggestions/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { chat_history, chat_model, chat_model_provider } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_history,
        chat_model,
        chat_model_provider,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return NextResponse.json({ message: 'Error fetching suggestions' }, { status: 500 });
  }
}