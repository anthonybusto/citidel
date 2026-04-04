import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { MailThreadsResponseSchema } from '@/api/schemas/mail'
import { useConnectionStore } from '@/store/connection'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

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
