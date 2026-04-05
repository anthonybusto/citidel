import { useQuery } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { RefineryStatusSchema, RefineryQueueResponseSchema } from '@/api/schemas/refinery'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useRefineryStatus(rig: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['refinery', 'status', rig],
    queryFn: () => runCommand(client!, { command: `refinery status ${rig} --json` }, RefineryStatusSchema),
    enabled: !!client && !!rig,
  })
}

export function useRefineryQueue(rig: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['refinery', 'queue', rig],
    queryFn: () => runCommand(client!, { command: `refinery queue ${rig} --json` }, RefineryQueueResponseSchema),
    enabled: !!client && !!rig,
  })
}
