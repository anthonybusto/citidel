import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type RigFilterProps = {
  rigs: string[]
  value: string | null
  onChange: (rig: string | null) => void
}

export function RigFilter({ rigs, value, onChange }: RigFilterProps) {
  return (
    <Select value={value ?? 'all'} onValueChange={(v) => onChange(v === 'all' ? null : v)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="All rigs" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All rigs</SelectItem>
        {rigs.map((rig) => (
          <SelectItem key={rig} value={rig}>{rig}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
