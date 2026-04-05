import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { RigListResponseSchema } from '@/api/schemas/rig'
import { CommandResponseSchema } from '@/api/schemas/run'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useRigList() {
  const client = useClient()
  return useQuery({
    queryKey: ['rigs'],
    queryFn: () => runCommand(client!, { command: 'rig list --json' }, RigListResponseSchema),
    enabled: !!client,
  })
}

export function useRigAction() {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ command, confirmed }: { command: string; confirmed: boolean }) => {
      return runCommand(client!, { command, confirmed }, CommandResponseSchema)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rigs'] })
    },
  })
}
