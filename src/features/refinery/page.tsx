import { useState } from 'react'
import { useRefineryStatus, useRefineryQueue } from './hooks'
import { useRigList } from '@/features/rigs/hooks'
import { StatusBadge } from '@/components/status-badge'
import { RigFilter } from '@/components/rig-filter'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function RefineryPage() {
  const rigs = useRigList()
  const rigNames = rigs.data?.data.map((r) => r.name) ?? []
  const [selectedRig, setSelectedRig] = useState<string | null>(rigNames[0] ?? null)

  const status = useRefineryStatus(selectedRig ?? '')
  const queue = useRefineryQueue(selectedRig ?? '')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Refinery</h1>
        <RigFilter rigs={rigNames} value={selectedRig} onChange={setSelectedRig} />
      </div>

      {!selectedRig && <p className="text-sm text-muted-foreground">Select a rig</p>}

      {selectedRig && status.data && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Refinery: {status.data.data.rig_name}</CardTitle>
              <StatusBadge state={status.data.data.running ? 'running' : 'stopped'} />
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Queue length: {status.data.data.queue_length}
          </CardContent>
        </Card>
      )}
      {status.error && <ErrorBanner message={(status.error as { message: string }).message} />}

      {selectedRig && queue.data && queue.data.data.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Merge Queue</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Age</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.data.data.map((item) => (
                <TableRow key={item.mr.id}>
                  <TableCell>{item.position}</TableCell>
                  <TableCell className="font-mono text-xs">{item.mr.branch}</TableCell>
                  <TableCell>{item.mr.worker ?? '—'}</TableCell>
                  <TableCell className="font-mono text-xs">{item.mr.issue_id ?? '—'}</TableCell>
                  <TableCell><Badge variant="outline">{item.mr.status}</Badge></TableCell>
                  <TableCell>{item.age ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
