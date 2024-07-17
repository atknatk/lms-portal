import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const config = req.body;

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
      res.status(200).json(data);
    } catch (error) {
      console.error('Error updating configuration:', error);
      res.status(500).json({ message: 'Error updating configuration' });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching chats' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
