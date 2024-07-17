import { AI } from '@/app/actions'
import { Chat } from '@/components/ai/chat'
import { nanoid } from 'ai'
import { ScrollArea } from '@/components/ui/scroll-area';

export const maxDuration = 60

export default function Page() {
  const id = nanoid()
  return (
    <ScrollArea className="h-full">
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
    </ScrollArea>
  )
}
