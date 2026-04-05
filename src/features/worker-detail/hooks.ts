import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { PolecatStatusSchema } from '@/api/schemas/polecat'
import { MoleculeStatusInfoSchema } from '@/api/schemas/hook'
import { CommandResponseSchema } from '@/api/schemas/run'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useWorkerStatus(workerId: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['worker', 'status', workerId],
    queryFn: () => runCommand(client!, { command: `polecat status ${workerId} --json` }, PolecatStatusSchema),
    enabled: !!client && !!workerId,
  })
}

export function useWorkerHook(workerId: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['worker', 'hook', workerId],
    queryFn: () => runCommand(client!, { command: 'hook status --json' }, MoleculeStatusInfoSchema),
    enabled: !!client && !!workerId,
  })
}

export function useNudge() {
  const client = useClient()
  return useMutation({
    mutationFn: async (body: { target: string; message: string }) => {
      const res = await client!.postRaw('/api/nudge', body)
      if (!res.ok) throw new Error(`Nudge failed: ${res.status}`)
      return res.json()
    },
  })
}

export function useSlingToWorker() {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ beadId, target }: { beadId: string; target: string }) =>
      runCommand(client!, { command: `sling ${beadId} ${target}`, confirmed: true }, CommandResponseSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['worker'] }),
  })
}
