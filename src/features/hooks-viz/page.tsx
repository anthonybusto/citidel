import { useState, useMemo } from 'react'
import { useHooksList } from './hooks'
import { RigFilter } from '@/components/rig-filter'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Link } from 'react-router-dom'

export function HooksPage() {
  const [rigFilter, setRigFilter] = useState<string | null>(null)
  const hooks = useHooksList()

  const rigs = useMemo(() => {
    const set = new Set(hooks.data?.data.map((h) => h.agent.split('/')[0]) ?? [])
    return Array.from(set).sort()
  }, [hooks.data])

  const filtered = useMemo(() => {
    if (!rigFilter) return hooks.data?.data ?? []
    return (hooks.data?.data ?? []).filter((h) => h.agent.startsWith(rigFilter + '/'))
  }, [hooks.data, rigFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hooks</h1>
        <RigFilter rigs={rigs} value={rigFilter} onChange={setRigFilter} />
      </div>
      {hooks.error && <ErrorBanner message={(hooks.error as { message: string }).message} />}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hooks</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bead ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((h) => (
              <TableRow key={h.bead_id}>
                <TableCell className="font-mono text-xs">{h.bead_id}</TableCell>
                <TableCell>{h.title}</TableCell>
                <TableCell>
                  <Link to={`/workers/${encodeURIComponent(h.agent)}`} className="text-primary hover:underline">
                    {h.agent}
                  </Link>
                </TableCell>
                <TableCell>{h.age ?? '—'}</TableCell>
                <TableCell>
                  {h.is_stale && <Badge className="bg-red-500/15 text-red-400">stale</Badge>}
                  {h.status && <Badge variant="outline">{h.status}</Badge>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
