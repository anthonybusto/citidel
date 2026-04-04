import type { MailMessage } from '@/api/types'

type ThreadViewProps = {
  message: MailMessage | null
  isLoading: boolean
}

export function ThreadView({ message, isLoading }: ThreadViewProps) {
  if (isLoading) return <p className="p-4 text-sm text-muted-foreground">Loading...</p>
  if (!message) return <p className="p-4 text-sm text-muted-foreground">Select a message</p>

  return (
    <div className="space-y-4 p-4">
      <div>
        <h2 className="text-lg font-semibold">{message.subject}</h2>
        <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
          <span>From: {message.from}</span>
          <span>To: {message.to}</span>
          <span>{message.timestamp}</span>
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm">{message.body ?? '(no body)'}</div>
    </div>
  )
}
