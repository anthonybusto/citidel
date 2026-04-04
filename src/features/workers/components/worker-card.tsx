import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import type { Worker } from '@/store/slices/workers'

export function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Link to={`/workers/${encodeURIComponent(worker.id)}`}>
      <Card className="transition-colors hover:bg-accent/30">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">{worker.name}</CardTitle>
            <StatusBadge state={worker.state} />
          </div>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{worker.rig}</span>
            <Badge variant="outline" className="text-xs">{worker.type}</Badge>
          </div>
          {worker.hook && <div>Hook: {worker.hook} {worker.hookTitle && `— ${worker.hookTitle}`}</div>}
          {worker.lastActive && <div>Active: {worker.lastActive}</div>}
        </CardContent>
      </Card>
    </Link>
  )
}
