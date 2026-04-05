import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { ConvoyListResponseSchema, ConvoyStatusSchema } from '@/api/schemas/convoy'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useConvoyList() {
  const client = useClient()
  return useQuery({
    queryKey: ['convoys'],
    queryFn: () => runCommand(client!, { command: 'convoy list --json' }, ConvoyListResponseSchema),
    enabled: !!client,
  })
}

export function useConvoyDetail(id: string | null) {
  const client = useClient()
  return useQuery({
    queryKey: ['convoys', id],
    queryFn: () => runCommand(client!, { command: `convoy status ${id} --json` }, ConvoyStatusSchema),
    enabled: !!client && !!id,
  })
}
