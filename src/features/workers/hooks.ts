import { useQuery } from '@tanstack/react-query'
import { CrewResponseSchema } from '@/api/schemas/crew'
import { PolecatListResponseSchema } from '@/api/schemas/polecat'
import { useWorkersStore, type Worker } from '@/store/slices/workers'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


export function useWorkers() {
  const client = useClient()
  const setWorkers = useWorkersStore((s) => s.setWorkers)

  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => {
      const [crewData, polecatResult] = await Promise.all([
        client!.get('/api/crew', CrewResponseSchema),
        runCommand(client!, { command: 'polecat list --all --json' }, PolecatListResponseSchema),
      ])

      const workers: Worker[] = [
        ...crewData.crew.map((c) => ({
          id: `${c.rig}/${c.name}`,
          name: c.name,
          rig: c.rig,
          type: 'crew' as const,
          state: c.state,
          hook: c.hook,
          hookTitle: c.hook_title,
          session: c.session,
          lastActive: c.last_active,
        })),
        ...polecatResult.data
          .filter((p) => !crewData.crew.some((c) => c.name === p.name && c.rig === p.rig))
          .map((p) => ({
            id: `${p.rig}/${p.name}`,
            name: p.name,
            rig: p.rig,
            type: 'polecat' as const,
            state: p.state,
            hook: p.issue,
            session: p.session_running ? 'running' : 'none',
            lastActive: '',
            sessionName: p.session_name,
          })),
      ]
      setWorkers(workers)
      return workers
    },
    enabled: !!client,
  })
}
