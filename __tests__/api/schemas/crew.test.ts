import { describe, it, expect } from 'vitest'
import { CrewResponseSchema } from '@/api/schemas/crew'

describe('CrewResponseSchema', () => {
  it('parses valid crew response', () => {
    const data = {
      crew: [
        { name: 'alpha-1', rig: 'contractor', state: 'spinning', hook: 'gt-abc12', hook_title: 'Fix bug', session: 'attached', last_active: '2m ago' },
      ],
      by_rig: { contractor: [{ name: 'alpha-1', rig: 'contractor', state: 'spinning', session: 'attached', last_active: '2m ago' }] },
      total: 1,
    }
    const result = CrewResponseSchema.parse(data)
    expect(result.crew).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  it('parses crew member without optional fields', () => {
    const data = {
      crew: [{ name: 'beta-2', rig: 'gastown', state: 'idle', session: 'detached', last_active: '5m ago' }],
      by_rig: {},
      total: 1,
    }
    const result = CrewResponseSchema.parse(data)
    expect(result.crew[0].hook).toBeUndefined()
    expect(result.crew[0].hook_title).toBeUndefined()
  })

  it('parses empty crew list', () => {
    const data = { crew: [], by_rig: {}, total: 0 }
    const result = CrewResponseSchema.parse(data)
    expect(result.total).toBe(0)
  })
})
