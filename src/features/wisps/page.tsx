import { useState, useMemo } from 'react'
import { useWispList } from './hooks'
import { RigFilter } from '@/components/rig-filter'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WispsPage() {
  const [rigFilter, setRigFilter] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const wisps = useWispList()

  const rigs = useMemo(() => {
    const set = new Set(wisps.data?.data.wisps.map((w) => w.rig).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [wisps.data])

  const categories = useMemo(() => {
    const set = new Set(wisps.data?.data.wisps.map((w) => w.category).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [wisps.data])

  const filtered = useMemo(() => {
    let items = wisps.data?.data.wisps ?? []
    if (rigFilter) items = items.filter((w) => w.rig === rigFilter)
    if (categoryFilter) items = items.filter((w) => w.category === categoryFilter)
    return items
  }, [wisps.data, rigFilter, categoryFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Wisps</h1>
        <div className="flex gap-2">
          <Select value={categoryFilter ?? 'all'} onValueChange={(v) => setCategoryFilter(v === 'all' ? null : v)}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <RigFilter rigs={rigs} value={rigFilter} onChange={setRigFilter} />
        </div>
      </div>
      {wisps.data && (
        <span className="text-sm text-muted-foreground">{wisps.data.data.count} total wisps</span>
      )}
      {wisps.error && <ErrorBanner message={(wisps.error as { message: string }).message} />}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No wisps</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Rig</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-mono text-xs">{w.id}</TableCell>
                <TableCell>{w.title ?? '—'}</TableCell>
                <TableCell>{w.category ? <Badge variant="outline">{w.category}</Badge> : '—'}</TableCell>
                <TableCell>{w.from ?? '—'}</TableCell>
                <TableCell>{w.rig ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">{w.created_at ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
