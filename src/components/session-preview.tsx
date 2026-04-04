import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { SessionPreviewResponseSchema } from '@/api/schemas/session'
import { useConnectionStore } from '@/store/connection'
import { ScrollArea } from '@/components/ui/scroll-area'

type SessionPreviewProps = {
  sessionName: string | undefined
}

export function SessionPreview({ sessionName }: SessionPreviewProps) {
  const { baseUrl, token } = useConnectionStore()
  const client = baseUrl && token ? createApiClient(baseUrl, token) : null

  const preview = useQuery({
    queryKey: ['session', 'preview', sessionName],
    queryFn: async () => {
      return client!.get(`/api/session/preview?session=${sessionName}`, SessionPreviewResponseSchema)
    },
    enabled: !!client && !!sessionName,
    refetchInterval: 5000,
  })

  if (!sessionName) return <p className="text-sm text-muted-foreground">No session</p>
  if (preview.isLoading) return <p className="text-sm text-muted-foreground">Loading preview...</p>
  if (preview.error) return <p className="text-sm text-destructive">Preview unavailable</p>

  return (
    <ScrollArea className="h-64 rounded-md border border-border bg-black p-3">
      <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
        {preview.data?.content}
      </pre>
    </ScrollArea>
  )
}
