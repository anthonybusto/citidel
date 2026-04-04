import { useState } from 'react'
import { useMayorThreads } from './hooks'
import { ChatThread } from './components/chat-thread'
import { ComposeBox } from './components/compose-box'
import { ErrorBanner } from '@/components/error-banner'

export function MayorChatPage() {
  const threads = useMayorThreads()
  const [selectedThread, setSelectedThread] = useState<string | null>(null)

  const allMessages = threads.data?.threads
    .flatMap((t) => t.messages)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) ?? []

  const selectedMessages = selectedThread
    ? threads.data?.threads.find((t) => t.thread_id === selectedThread)?.messages ?? []
    : allMessages

  const lastMessageId = selectedMessages[selectedMessages.length - 1]?.id

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 pb-4">
        <h1 className="text-2xl font-bold">Mayor Chat</h1>
        {threads.data && threads.data.threads.length > 0 && (
          <select
            className="rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={selectedThread ?? ''}
            onChange={(e) => setSelectedThread(e.target.value || null)}
          >
            <option value="">All threads</option>
            {threads.data.threads.map((t) => (
              <option key={t.thread_id} value={t.thread_id}>
                {t.subject} ({t.count})
              </option>
            ))}
          </select>
        )}
      </div>
      {threads.error && <ErrorBanner message={(threads.error as { message: string }).message} />}
      <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-border">
        <ChatThread messages={selectedMessages} />
        <ComposeBox replyTo={lastMessageId} />
      </div>
    </div>
  )
}
