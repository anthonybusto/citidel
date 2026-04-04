import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { MailInboxResponseSchema, MailThreadsResponseSchema, MailMessageSchema } from '@/api/schemas/mail'
import { useConnectionStore } from '@/store/connection'
import { useMailStore } from '@/store/slices/mail'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useInbox() {
  const client = useClient()
  const setMessages = useMailStore((s) => s.setMessages)
  const setUnreadCount = useMailStore((s) => s.setUnreadCount)

  return useQuery({
    queryKey: ['mail', 'inbox'],
    queryFn: async () => {
      const data = await client!.get('/api/mail/inbox', MailInboxResponseSchema)
      setMessages(data.messages)
      setUnreadCount(data.unread_count)
      return data
    },
    enabled: !!client,
  })
}

export function useThreads() {
  const client = useClient()
  const setThreads = useMailStore((s) => s.setThreads)

  return useQuery({
    queryKey: ['mail', 'threads'],
    queryFn: async () => {
      const data = await client!.get('/api/mail/threads', MailThreadsResponseSchema)
      setThreads(data.threads)
      return data
    },
    enabled: !!client,
  })
}

export function useMailRead(messageId: string | null) {
  const client = useClient()

  return useQuery({
    queryKey: ['mail', 'read', messageId],
    queryFn: async () => {
      return client!.get(`/api/mail/read?id=${messageId}`, MailMessageSchema)
    },
    enabled: !!client && !!messageId,
  })
}

export function useSendMail() {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: { to: string; subject: string; body: string; reply_to?: string }) => {
      const res = await client!.postRaw('/api/mail/send', body)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Send failed' }))
        throw new Error(err.error ?? `Send failed: ${res.status}`)
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mail'] })
    },
  })
}
