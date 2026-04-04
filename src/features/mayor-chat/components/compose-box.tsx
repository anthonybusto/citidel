import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSendMail } from '@/features/mail/hooks'

type ComposeBoxProps = {
  replyTo?: string
}

export function ComposeBox({ replyTo }: ComposeBoxProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const sendMail = useSendMail()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    sendMail.mutate(
      { to: 'mayor/', subject: subject.trim() || '(no subject)', body: body.trim(), reply_to: replyTo },
      { onSuccess: () => { setBody(''); setSubject('') } },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-4">
      <Input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        className="w-40"
      />
      <Input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Message to Mayor..."
        className="flex-1"
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e) }}
      />
      <Button type="submit" disabled={sendMail.isPending || !body.trim()}>
        Send
      </Button>
    </form>
  )
}
