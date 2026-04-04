import type { MailMessage } from '@/api/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type InboxListProps = {
  messages: MailMessage[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function InboxList({ messages, selectedId, onSelect }: InboxListProps) {
  if (messages.length === 0) {
    return <p className="p-4 text-sm text-muted-foreground">No messages</p>
  }

  return (
    <div className="space-y-1">
      {messages.map((msg) => (
        <button
          key={msg.id}
          onClick={() => onSelect(msg.id)}
          className={cn(
            'flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left text-sm transition-colors',
            selectedId === msg.id ? 'bg-accent' : 'hover:bg-accent/50',
            !msg.read && 'font-medium',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="truncate">{msg.from}</span>
            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="truncate">{msg.subject}</span>
            {msg.priority && msg.priority !== 'normal' && (
              <Badge variant="outline" className="text-xs">{msg.priority}</Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
