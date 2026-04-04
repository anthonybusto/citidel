import { cn } from '@/lib/utils'

type HealthBarProps = { healthy: number; unhealthy: number }

export function HealthBar({ healthy, unhealthy }: HealthBarProps) {
  const total = healthy + unhealthy
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={cn('font-medium', unhealthy === 0 ? 'text-green-500' : 'text-yellow-500')}>
        {healthy}/{total} healthy
      </span>
      {unhealthy > 0 && <span className="text-red-400">{unhealthy} unhealthy</span>}
    </div>
  )
}
