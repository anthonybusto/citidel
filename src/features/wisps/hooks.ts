import { useQuery } from '@tanstack/react-query'
import { WispListResponseSchema } from '@/api/schemas/wisp'
import { runCommand } from '@/api/run'
import { useClient } from '@/hooks/use-client'


export function useWispList() {
  const client = useClient()
  return useQuery({
    queryKey: ['wisps'],
    queryFn: () => runCommand(client!, { command: 'wisp list --json' }, WispListResponseSchema),
    enabled: !!client,
  })
}
