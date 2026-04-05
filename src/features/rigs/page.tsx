import { useRigList } from './hooks'
import { RigActions } from './components/rig-actions'
import { StatusBadge } from '@/components/status-badge'
import { ErrorBanner } from '@/components/error-banner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function RigsPage() {
  const rigs = useRigList()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Rigs</h1>
      {rigs.error && <ErrorBanner message={(rigs.error as { message: string }).message} />}
      {rigs.data?.data.length === 0 && <p className="text-sm text-muted-foreground">No rigs</p>}
      {rigs.data && rigs.data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Polecats</TableHead>
              <TableHead>Crew</TableHead>
              <TableHead>Witness</TableHead>
              <TableHead>Refinery</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rigs.data.data.map((r) => (
              <TableRow key={r.name}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.status ? <StatusBadge state={r.status} /> : '—'}</TableCell>
                <TableCell>{r.polecats ?? 0}</TableCell>
                <TableCell>{r.crew ?? 0}</TableCell>
                <TableCell>{r.witness ?? '—'}</TableCell>
                <TableCell>{r.refinery ?? '—'}</TableCell>
                <TableCell><RigActions rigName={r.name} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
