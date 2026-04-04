import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'

type WitnessData = { running: boolean; rig_name: string; monitored_polecats?: string[] }

export function WitnessCard({ data }: { data: WitnessData }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Witness: {data.rig_name}</CardTitle>
          <StatusBadge state={data.running ? 'running' : 'stopped'} />
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {data.monitored_polecats && data.monitored_polecats.length > 0 ? (
          <div>Monitoring: {data.monitored_polecats.join(', ')}</div>
        ) : (
          <div>No monitored polecats</div>
        )}
      </CardContent>
    </Card>
  )
}
