import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { cn } from '@/lib/utils'

type DeaconData = {
  running: boolean
  paused?: boolean
  heartbeat?: { age_seconds: number; cycle: number; last_action: string; fresh: boolean; stale: boolean; very_stale: boolean }
}

export function DeaconCard({ data }: { data: DeaconData }) {
  const hb = data.heartbeat
  const freshness = hb?.very_stale ? 'red' : hb?.stale ? 'yellow' : 'green'

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Deacon</CardTitle>
          <StatusBadge state={data.paused ? 'paused' : data.running ? 'running' : 'stopped'} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        {hb && (
          <>
            <div className="flex items-center gap-2">
              <span>Heartbeat:</span>
              <span className={cn(
                'inline-block h-2 w-2 rounded-full',
                freshness === 'green' && 'bg-green-500',
                freshness === 'yellow' && 'bg-yellow-500',
                freshness === 'red' && 'bg-red-500',
              )} />
              <span>{hb.age_seconds}s ago</span>
            </div>
            <div>Cycle: {hb.cycle}</div>
            <div>Last action: {hb.last_action}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
