import { useQuery } from '@tanstack/react-query'
import { ConvoyListResponseSchema, ConvoyStatusSchema } from '@/api/schemas/convoy'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


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
