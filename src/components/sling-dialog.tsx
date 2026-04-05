import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SlingDialogProps = {
  open: boolean
  beadId: string
  onSling: (target: string) => void
  onCancel: () => void
  loading?: boolean
}

export function SlingDialog({ open, beadId, onSling, onCancel, loading }: SlingDialogProps) {
  const [target, setTarget] = useState('')

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sling bead {beadId}</DialogTitle>
          <DialogDescription>Assign this bead to an agent or rig.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="sling-target">Target (rig/agent)</Label>
          <Input id="sling-target" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="contractor/alpha-1" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button onClick={() => onSling(target)} disabled={loading || !target.trim()}>
            {loading ? 'Slinging...' : 'Sling'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
