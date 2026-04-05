import { useQuery } from '@tanstack/react-query'
import { MailThreadsResponseSchema } from '@/api/schemas/mail'
import { useClient } from '@/hooks/use-client'


export function useMayorThreads() {
  const client = useClient()

  return useQuery({
    queryKey: ['mail', 'threads', 'mayor'],
    queryFn: async () => {
      const data = await client!.get('/api/mail/threads', MailThreadsResponseSchema)
      const mayorThreads = data.threads.filter((t) =>
        t.messages.some((m) => m.from === 'mayor/' || m.to === 'mayor/') ||
        t.last_message.from === 'mayor/' ||
        t.last_message.to === 'mayor/',
      )
      return { ...data, threads: mayorThreads }
    },
    enabled: !!client,
  })
}
