import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRigAction } from '../hooks'

export function RigActions({ rigName }: { rigName: string }) {
  const [confirm, setConfirm] = useState<{ command: string; label: string } | null>(null)
  const rigAction = useRigAction()

  return (
    <>
      <div className="flex gap-1">
        <Button variant="outline" size="sm" onClick={() => setConfirm({ command: `rig boot ${rigName}`, label: 'Boot' })}>Boot</Button>
        <Button variant="outline" size="sm" onClick={() => setConfirm({ command: `rig start ${rigName}`, label: 'Start' })}>Start</Button>
        <Button variant="outline" size="sm" onClick={() => setConfirm({ command: `rig stop ${rigName}`, label: 'Stop' })}>Stop</Button>
      </div>
      {confirm && (
        <ConfirmDialog
          open
          title={`${confirm.label} rig "${rigName}"?`}
          description={`This will execute: gt ${confirm.command}`}
          loading={rigAction.isPending}
          onConfirm={() => {
            rigAction.mutate({ command: confirm.command, confirmed: true }, { onSettled: () => setConfirm(null) })
          }}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  )
}
