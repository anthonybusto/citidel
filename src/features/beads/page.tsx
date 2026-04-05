import { useState, useMemo } from 'react'
import { useReadyBeads, useIssueShow, useSlingBead } from './hooks'
import { SlingDialog } from '@/components/sling-dialog'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const priorityColors: Record<number, string> = {
  1: 'bg-red-500/15 text-red-400',
  2: 'bg-yellow-500/15 text-yellow-500',
  3: 'bg-blue-500/15 text-blue-400',
}

export function BeadsPage() {
  const [sourceFilter, setSourceFilter] = useState<string | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [slingId, setSlingId] = useState<string | null>(null)
  const ready = useReadyBeads()
  const detail = useIssueShow(selectedId)
  const sling = useSlingBead()

  const sources = useMemo(() => Object.keys(ready.data?.by_source ?? {}), [ready.data])
  const filtered = useMemo(() => {
    let items = ready.data?.items ?? []
    if (sourceFilter) items = items.filter((i) => i.source === sourceFilter)
    if (priorityFilter) items = items.filter((i) => i.priority === priorityFilter)
    return items
  }, [ready.data, sourceFilter, priorityFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Beads</h1>
        {ready.data && (
          <span className="text-sm text-muted-foreground">
            {ready.data.summary.total} total — P1:{ready.data.summary.p1_count} P2:{ready.data.summary.p2_count} P3:{ready.data.summary.p3_count}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <Select value={sourceFilter ?? 'all'} onValueChange={(v) => setSourceFilter(v === 'all' ? null : v)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All sources" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {sources.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter?.toString() ?? 'all'} onValueChange={(v) => setPriorityFilter(v === 'all' ? null : Number(v))}>
          <SelectTrigger className="w-28"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1">P1</SelectItem>
            <SelectItem value="2">P2</SelectItem>
            <SelectItem value="3">P3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {ready.error && <ErrorBanner message={(ready.error as { message: string }).message} />}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No beads</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedId(item.id)}>
                <TableCell className="font-mono text-xs">{item.id}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                <TableCell><Badge className={priorityColors[item.priority] ?? ''}> P{item.priority}</Badge></TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSlingId(item.id) }}>Sling</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedId && detail.data && (
        <div className="rounded-md border border-border p-4">
          <h3 className="font-semibold">{detail.data.title}</h3>
          <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{detail.data.description ?? detail.data.raw_output}</pre>
        </div>
      )}
      {slingId && (
        <SlingDialog open beadId={slingId} loading={sling.isPending}
          onSling={(target) => sling.mutate({ beadId: slingId, target }, { onSuccess: () => setSlingId(null) })}
          onCancel={() => setSlingId(null)}
        />
      )}
    </div>
  )
}
