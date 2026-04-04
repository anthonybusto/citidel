import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const stateColors: Record<string, string> = {
  spinning: 'bg-green-500/15 text-green-500 border-green-500/20',
  ready: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  finished: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  questions: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
  idle: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
  working: 'bg-green-500/15 text-green-500 border-green-500/20',
  blocked: 'bg-red-500/15 text-red-400 border-red-500/20',
  running: 'bg-green-500/15 text-green-500 border-green-500/20',
  stopped: 'bg-red-500/15 text-red-400 border-red-500/20',
  paused: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/20',
}

export function StatusBadge({ state }: { state: string }) {
  return (
    <Badge variant="outline" className={cn('text-xs', stateColors[state] ?? stateColors.idle)}>
      {state}
    </Badge>
  )
}
