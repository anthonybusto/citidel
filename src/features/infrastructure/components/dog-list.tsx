import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'

type Dog = { name: string; state: string; work?: string; last_active?: string; worktrees?: number }

export function DogList({ dogs }: { dogs: Dog[] }) {
  if (dogs.length === 0) return <p className="text-sm text-muted-foreground">No dogs</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>State</TableHead>
          <TableHead>Work</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead>Worktrees</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dogs.map((d) => (
          <TableRow key={d.name}>
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell><StatusBadge state={d.state} /></TableCell>
            <TableCell>{d.work ?? '—'}</TableCell>
            <TableCell>{d.last_active ?? '—'}</TableCell>
            <TableCell>{d.worktrees ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
