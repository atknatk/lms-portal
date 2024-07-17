import ChatWindow from '@/components/perp/ChatWindow';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata: Metadata = {
  title: 'Chat - Perplexica',
  description: 'Chat with the internet, chat with Perplexica.',
};

const Home = () => {
  return (
    <div>
       <ScrollArea className="h-full">
      <Suspense>
        <ChatWindow />
      </Suspense>
      </ScrollArea>
    </div>
  );
};

export default Home;
