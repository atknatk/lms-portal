import ChatWindow from '@/components/perp/ChatWindow';

const Page = ({ params }: { params: { chatId: string } }) => {
  return <ChatWindow id={params.chatId} />;
};

export default Page;
