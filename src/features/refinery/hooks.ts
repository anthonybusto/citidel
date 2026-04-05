import { useQuery } from '@tanstack/react-query'
import { RefineryStatusSchema, RefineryQueueResponseSchema } from '@/api/schemas/refinery'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


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
