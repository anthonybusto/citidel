import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSendMail } from '../hooks'

type ComposeFormProps = {
  defaultTo?: string
  replyTo?: string
  defaultSubject?: string
  onSent?: () => void
}

export function ComposeForm({ defaultTo = '', replyTo, defaultSubject = '', onSent }: ComposeFormProps) {
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState('')
  const sendMail = useSendMail()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMail.mutate(
      { to: to.trim(), subject: subject.trim(), body: body.trim(), reply_to: replyTo },
      {
        onSuccess: () => {
          setBody('')
          if (!replyTo) { setTo(''); setSubject('') }
          onSent?.()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-border p-4">
      {!replyTo && (
        <>
          <div className="space-y-1">
            <Label htmlFor="mail-to">To</Label>
            <Input id="mail-to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="mayor/" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="mail-subject">Subject</Label>
            <Input id="mail-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
        </>
      )}
      <div className="space-y-1">
        <Label htmlFor="mail-body">Message</Label>
        <textarea
          id="mail-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Message body..."
        />
      </div>
      {sendMail.error && (
        <p className="text-sm text-destructive">{(sendMail.error as Error).message}</p>
      )}
      <Button type="submit" disabled={sendMail.isPending || !body.trim()}>
        {sendMail.isPending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  )
}
