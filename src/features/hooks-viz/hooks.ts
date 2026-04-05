import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { HooksListSchema } from '@/api/schemas/hook'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useHooksList() {
  const client = useClient()
  return useQuery({
    queryKey: ['hooks'],
    queryFn: () => runCommand(client!, { command: 'hooks list --json' }, HooksListSchema),
    enabled: !!client,
  })
}
