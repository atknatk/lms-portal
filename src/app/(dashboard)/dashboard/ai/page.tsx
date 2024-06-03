import { AI } from '@/app/actions'
import { Chat } from '@/components/ai/chat'
import { nanoid } from 'ai'


export const maxDuration = 60

export default function Page() {
  const id = nanoid()
  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  )
}
