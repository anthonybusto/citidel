import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useWorkerStatus, useWorkerHook, useNudge } from './hooks'
import { SessionPreview } from '@/components/session-preview'
import { StatusBadge } from '@/components/status-badge'
import { ProgressBar } from '@/components/progress-bar'
import { ErrorBanner } from '@/components/error-banner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const workerId = decodeURIComponent(id ?? '')
  const status = useWorkerStatus(workerId)
  const hook = useWorkerHook(workerId)
  const nudge = useNudge()
  const [nudgeMsg, setNudgeMsg] = useState('')

  if (!workerId) return <p>No worker ID</p>
  const s = status.data?.data
  const h = hook.data?.data

  return (
    <div className="space-y-6">
      {status.error && <ErrorBanner message={(status.error as { message: string }).message} />}
      {s && (
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{s.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <span>{s.rig}</span>
              <Badge variant="outline">polecat</Badge>
              <StatusBadge state={s.state} />
              {s.session_running && <Badge variant="outline" className="bg-green-500/10 text-green-500">session active</Badge>}
            </div>
          </div>
          <div className="ml-auto text-right text-xs text-muted-foreground">
            {s.branch && <div>Branch: {s.branch}</div>}
            {s.last_activity && <div>Active: {s.last_activity}</div>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Current Work</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {h && h.has_work ? (
                <>
                  {h.attached_formula && <div>Formula: {h.attached_formula}</div>}
                  {h.attached_molecule && <div>Molecule: {h.attached_molecule}</div>}
                  {h.is_wisp && <span className="text-xs text-yellow-500">(wisp)</span>}
                  {h.progress && (
                    <ProgressBar value={h.progress.done_steps} max={h.progress.total_steps}
                      label={`${h.progress.done_steps}/${h.progress.total_steps} steps (${h.progress.percent_complete}%)`} />
                  )}
                  {h.next_action && <div className="text-muted-foreground">Next: {h.next_action}</div>}
                </>
              ) : (
                <p className="text-muted-foreground">No hooked work</p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Nudge</h2>
            <div className="flex gap-2">
              <Input value={nudgeMsg} onChange={(e) => setNudgeMsg(e.target.value)} placeholder="Nudge message..."
                onKeyDown={(e) => { if (e.key === 'Enter' && nudgeMsg.trim()) { nudge.mutate({ target: workerId, message: nudgeMsg.trim() }); setNudgeMsg('') } }} />
              <Button size="sm" disabled={nudge.isPending || !nudgeMsg.trim()}
                onClick={() => { nudge.mutate({ target: workerId, message: nudgeMsg.trim() }); setNudgeMsg('') }}>
                {nudge.isPending ? 'Sending...' : 'Nudge'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Session Preview</h2>
          <SessionPreview sessionName={s?.session_id} />
        </div>
      </div>
    </div>
  )
}
