// src/app/api/images/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, chat_history, chat_model_provider, chat_model } = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        chat_history,
        chat_model_provider,
        chat_model,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ message: 'Error generating image' }, { status: 500 });
  }
}