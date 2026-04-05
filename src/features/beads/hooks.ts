import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createApiClient } from '@/api/client'
import { ReadyResponseSchema } from '@/api/schemas/ready'
import { IssueShowResponseSchema, IssueCreateResponseSchema } from '@/api/schemas/issues'
import { CommandResponseSchema } from '@/api/schemas/run'
import { useConnectionStore } from '@/store/connection'
import { runCommand } from '@/api/run'

function useClient() {
  const { baseUrl, token } = useConnectionStore()
  return baseUrl && token ? createApiClient(baseUrl, token) : null
}

export function useReadyBeads() {
  const client = useClient()
  return useQuery({
    queryKey: ['beads', 'ready'],
    queryFn: () => client!.get('/api/ready', ReadyResponseSchema),
    enabled: !!client,
  })
}

export function useIssueShow(id: string | null) {
  const client = useClient()
  return useQuery({
    queryKey: ['beads', 'show', id],
    queryFn: () => client!.get(`/api/issues/show?id=${id}`, IssueShowResponseSchema),
    enabled: !!client && !!id,
  })
}

export function useSlingBead() {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ beadId, target }: { beadId: string; target: string }) =>
      runCommand(client!, { command: `sling ${beadId} ${target}`, confirmed: true }, CommandResponseSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beads'] }),
  })
}

export function useCreateIssue() {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: { title: string; description?: string; priority?: number }) =>
      client!.post('/api/issues/create', body, IssueCreateResponseSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beads'] }),
  })
}

export function useCloseIssue() {
  const client = useClient()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => client!.post('/api/issues/close', { id }, IssueCreateResponseSchema),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['beads'] }),
  })
}
