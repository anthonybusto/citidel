import { describe, it, expect } from 'vitest'
import { CommandListResponseSchema } from '@/api/schemas/commands'

describe('CommandListResponseSchema', () => {
  it('parses valid command list response', () => {
    const data = {
      commands: [
        { name: 'status', desc: 'Show status', category: 'Status', safe: true, confirm: false },
        { name: 'rig boot', desc: 'Boot rig', category: 'Rigs', safe: false, confirm: true, args: '<name>', argType: 'rig' },
      ],
    }
    const result = CommandListResponseSchema.parse(data)
    expect(result.commands).toHaveLength(2)
    expect(result.commands[0].name).toBe('status')
    expect(result.commands[1].confirm).toBe(true)
  })

  it('rejects response missing commands array', () => {
    expect(() => CommandListResponseSchema.parse({})).toThrow()
  })

  it('rejects command missing required fields', () => {
    const data = { commands: [{ name: 'test' }] }
    expect(() => CommandListResponseSchema.parse(data)).toThrow()
  })
})
