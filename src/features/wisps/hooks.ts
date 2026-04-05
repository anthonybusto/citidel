import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { WispListResponseSchema } from '@/api/schemas/wisp'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useWispList() {
  const client = useClient()
  return useQuery({
    queryKey: ['wisps'],
    queryFn: () => runCommand(client!, { command: 'wisp list --json' }, WispListResponseSchema),
    enabled: !!client,
  })
}
