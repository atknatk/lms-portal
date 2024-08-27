import ChatWindow from '@/components/rosa/ChatWindow';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const metadata: Metadata = {
  title: 'Chat - Rosa AI',
  description: 'Chat with the internet, chat with Rosa AI.',
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
