// pages/api/videos.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { query, chat_history, chat_model_provider, chat_model } = req.body;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
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
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error generating video:', error);
      res.status(500).json({ message: 'Error generating video' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}