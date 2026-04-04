import { useState, useMemo } from 'react'
import { useWorkers } from './hooks'
import { WorkerGrid } from './components/worker-grid'
import { RigFilter } from '@/components/rig-filter'
import { ErrorBanner } from '@/components/error-banner'

export function WorkersPage() {
  const [rigFilter, setRigFilter] = useState<string | null>(null)
  const workers = useWorkers()

  const rigs = useMemo(() => {
    const set = new Set(workers.data?.map((w) => w.rig) ?? [])
    return Array.from(set).sort()
  }, [workers.data])

  const filtered = useMemo(() => {
    if (!rigFilter) return workers.data ?? []
    return (workers.data ?? []).filter((w) => w.rig === rigFilter)
  }, [workers.data, rigFilter])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workers</h1>
        <RigFilter rigs={rigs} value={rigFilter} onChange={setRigFilter} />
      </div>
      {workers.error && <ErrorBanner message={(workers.error as { message: string }).message} />}
      <WorkerGrid workers={filtered} />
    </div>
  )
}
