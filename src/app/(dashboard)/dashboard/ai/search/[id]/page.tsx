import { notFound, redirect } from 'next/navigation'
import { getChat } from '@/lib/actions/chat'
import { AI } from '@/app/actions'
import { Chat } from '@/components/ai/chat'
import { ScrollArea } from "@/components/ui/scroll-area"

export const maxDuration = 60

export interface SearchPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: SearchPageProps) {
  const chat = await getChat(params.id, 'anonymous')
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage({ params }: SearchPageProps) {
  const userId = 'anonymous'
  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }
//h-[calc(100vh+rem)]
  return (
    <ScrollArea className="h-[100vh]  rounded-md border p-4">
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages
      }}
    >
      <Chat id={params.id} />
    </AI>
    </ScrollArea>

  )
}
