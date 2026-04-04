import type { Worker } from '@/store/slices/workers'
import { WorkerCard } from './worker-card'

export function WorkerGrid({ workers }: { workers: Worker[] }) {
  if (workers.length === 0) {
    return <p className="text-sm text-muted-foreground">No workers found</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {workers.map((w) => (
        <WorkerCard key={w.id} worker={w} />
      ))}
    </div>
  )
}
