import { useQuery } from '@tanstack/react-query'
import { MoleculeProgressInfoSchema, DAGInfoSchema } from '@/api/schemas/molecule'
import { FormulaListResponseSchema, FormulaSchema } from '@/api/schemas/formula'
import { MoleculeStatusInfoSchema } from '@/api/schemas/hook'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


export function useMolStatus(target?: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['molecules', 'status', target],
    queryFn: () => runCommand(client!, { command: `mol status ${target ?? ''} --json` }, MoleculeStatusInfoSchema),
    enabled: !!client,
  })
}

export function useMolProgress(rootId: string | null) {
  const client = useClient()
  return useQuery({
    queryKey: ['molecules', 'progress', rootId],
    queryFn: () => runCommand(client!, { command: `mol progress ${rootId} --json` }, MoleculeProgressInfoSchema),
    enabled: !!client && !!rootId,
  })
}

export function useMolDAG(moleculeId: string | null) {
  const client = useClient()
  return useQuery({
    queryKey: ['molecules', 'dag', moleculeId],
    queryFn: () => runCommand(client!, { command: `mol dag ${moleculeId} --json` }, DAGInfoSchema),
    enabled: !!client && !!moleculeId,
  })
}

export function useFormulaList() {
  const client = useClient()
  return useQuery({
    queryKey: ['formulas'],
    queryFn: () => runCommand(client!, { command: 'formula list --json' }, FormulaListResponseSchema),
    enabled: !!client,
  })
}

export function useFormulaShow(name: string | null) {
  const client = useClient()
  return useQuery({
    queryKey: ['formulas', name],
    queryFn: () => runCommand(client!, { command: `formula show ${name} --json` }, FormulaSchema),
    enabled: !!client && !!name,
  })
}
