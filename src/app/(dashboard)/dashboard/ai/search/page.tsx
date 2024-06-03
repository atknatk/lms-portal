import { nanoid } from 'ai'
import { AI } from '@/app/actions'
import { redirect } from 'next/navigation'
import { Chat } from '@/components/ai/chat'

export const maxDuration = 60

export default function Page({
  searchParams
}: {
  searchParams: { q: string }
}) {
  if (!searchParams.q) {
    redirect('/dashboard/ai')
  }
  const id = nanoid()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} query={searchParams.q} />
    </AI>
  )
}
