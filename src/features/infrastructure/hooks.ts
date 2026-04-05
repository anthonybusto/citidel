import { useQuery } from '@tanstack/react-query'
import { DeaconStatusSchema } from '@/api/schemas/deacon'
import { WitnessStatusSchema } from '@/api/schemas/witness'
import { DogListResponseSchema } from '@/api/schemas/dog'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


export function useDeacon() {
  const client = useClient()
  return useQuery({
    queryKey: ['infra', 'deacon'],
    queryFn: () => runCommand(client!, { command: 'deacon status --json' }, DeaconStatusSchema),
    enabled: !!client,
  })
}

export function useWitness(rig: string) {
  const client = useClient()
  return useQuery({
    queryKey: ['infra', 'witness', rig],
    queryFn: () => runCommand(client!, { command: `witness status ${rig} --json` }, WitnessStatusSchema),
    enabled: !!client && !!rig,
  })
}

export function useDogs() {
  const client = useClient()
  return useQuery({
    queryKey: ['infra', 'dogs'],
    queryFn: () => runCommand(client!, { command: 'dog list --json' }, DogListResponseSchema),
    enabled: !!client,
  })
}
