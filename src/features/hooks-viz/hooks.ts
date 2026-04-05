import { useQuery } from '@tanstack/react-query'
import { HooksListSchema } from '@/api/schemas/hook'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


export function useHooksList() {
  const client = useClient()
  return useQuery({
    queryKey: ['hooks'],
    queryFn: () => runCommand(client!, { command: 'hooks list --json' }, HooksListSchema),
    enabled: !!client,
  })
}
