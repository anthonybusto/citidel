import type { MailMessage } from '@/api/types'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

type ChatThreadProps = {
  messages: MailMessage[]
}

export function ChatThread({ messages }: ChatThreadProps) {
  if (messages.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No messages yet. Send a message to the Mayor below.</p>
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-3">
        {messages.map((msg) => {
          const isMayor = msg.from === 'mayor/'
          return (
            <div key={msg.id} className={cn('flex', isMayor ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                  isMayor ? 'bg-muted' : 'bg-primary text-primary-foreground',
                )}
              >
                <div className="mb-1 text-xs opacity-70">
                  {msg.from} &middot; {msg.timestamp}
                </div>
                {msg.subject && <div className="mb-1 font-medium">{msg.subject}</div>}
                <div className="whitespace-pre-wrap">{msg.body}</div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
