import { useState } from 'react'
import { useConvoyList, useConvoyDetail } from './hooks'
import { ProgressBar } from '@/components/progress-bar'
import { StatusBadge } from '@/components/status-badge'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ConvoysPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const convoys = useConvoyList()
  const detail = useConvoyDetail(selectedId)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Convoys</h1>
      {convoys.error && <ErrorBanner message={(convoys.error as { message: string }).message} />}
      {convoys.data?.data.length === 0 && <p className="text-sm text-muted-foreground">No convoys</p>}
      {convoys.data && convoys.data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Assignees</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {convoys.data.data.map((c) => (
              <TableRow key={c.id} className="cursor-pointer" onClick={() => setSelectedId(c.id)}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell><StatusBadge state={c.work_status ?? c.status} /></TableCell>
                <TableCell className="w-40">
                  {c.total != null && c.completed != null && (
                    <ProgressBar value={c.completed} max={c.total} label={`${c.completed}/${c.total}`} />
                  )}
                </TableCell>
                <TableCell>{c.assignees?.join(', ') ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedId && detail.data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{detail.data.data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {detail.data.data.tracked_issues && detail.data.data.tracked_issues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Blocked</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.data.data.tracked_issues.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono text-xs">{i.id}</TableCell>
                      <TableCell>{i.title}</TableCell>
                      <TableCell><Badge variant="outline">{i.status}</Badge></TableCell>
                      <TableCell>{i.assignee ?? '—'}</TableCell>
                      <TableCell>{i.blocked ? <Badge className="bg-red-500/15 text-red-400">blocked</Badge> : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No tracked issues</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
