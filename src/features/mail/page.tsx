import { useState } from 'react'
import { useInbox, useMailRead } from './hooks'
import { InboxList } from './components/inbox-list'
import { ThreadView } from './components/thread-view'
import { ComposeForm } from './components/compose-form'
import { ErrorBanner } from '@/components/error-banner'

export function MailPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const inbox = useInbox()
  const message = useMailRead(selectedId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mail</h1>
        {inbox.data && (
          <span className="text-sm text-muted-foreground">
            {inbox.data.unread_count} unread / {inbox.data.total} total
          </span>
        )}
      </div>
      {inbox.error && <ErrorBanner message={(inbox.error as { message: string }).message} />}
      <div className="grid grid-cols-3 gap-4" style={{ minHeight: '60vh' }}>
        <div className="col-span-1 overflow-auto rounded-md border border-border">
          <InboxList
            messages={inbox.data?.messages ?? []}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="col-span-2 overflow-auto rounded-md border border-border">
          <ThreadView message={message.data ?? null} isLoading={message.isLoading} />
          {selectedId && (
            <ComposeForm
              defaultTo={message.data?.from}
              replyTo={selectedId}
              defaultSubject={message.data ? `Re: ${message.data.subject}` : ''}
            />
          )}
          {!selectedId && <ComposeForm />}
        </div>
      </div>
    </div>
  )
}
