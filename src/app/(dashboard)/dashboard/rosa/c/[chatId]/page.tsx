import ChatWindow from '@/components/rosa/ChatWindow';

const Page = ({ params }: { params: { chatId: string } }) => {
  return <ChatWindow id={params.chatId} />;
};

export default Page;
