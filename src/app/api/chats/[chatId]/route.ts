// src/app/api/chats/[chatId]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chat');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ message: 'Error fetching chat' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  const { chatId } = params;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting chat:', error);
    return NextResponse.json({ message: 'Error deleting chat' }, { status: 500 });
  }
}