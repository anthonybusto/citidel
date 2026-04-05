import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RigListResponseSchema } from '@/api/schemas/rig'
import { CommandResponseSchema } from '@/api/schemas/run'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


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
