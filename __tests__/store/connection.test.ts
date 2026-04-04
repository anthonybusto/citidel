import { describe, it, expect, beforeEach } from 'vitest'
import { useConnectionStore } from '@/store/connection'

describe('connectionStore', () => {
  beforeEach(() => {
    useConnectionStore.getState().reset()
  })

  it('starts disconnected with no config', () => {
    const state = useConnectionStore.getState()
    expect(state.baseUrl).toBe('')
    expect(state.token).toBe('')
    expect(state.status).toBe('disconnected')
  })

  it('saves connection config', () => {
    useConnectionStore.getState().setConnection('http://localhost:8080', 'abc123')
    const state = useConnectionStore.getState()
    expect(state.baseUrl).toBe('http://localhost:8080')
    expect(state.token).toBe('abc123')
    expect(state.status).toBe('disconnected')
    expect(state.error).toBeNull()
  })

  it('sets status', () => {
    useConnectionStore.getState().setStatus('connected')
    expect(useConnectionStore.getState().status).toBe('connected')
  })

  it('sets error with error status', () => {
    useConnectionStore.getState().setError('Bad token')
    const state = useConnectionStore.getState()
    expect(state.error).toBe('Bad token')
    expect(state.status).toBe('error')
  })

  it('resets to initial state', () => {
    useConnectionStore.getState().setConnection('http://test', 'tok')
    useConnectionStore.getState().setStatus('connected')
    useConnectionStore.getState().reset()
    const state = useConnectionStore.getState()
    expect(state.baseUrl).toBe('')
    expect(state.token).toBe('')
    expect(state.status).toBe('disconnected')
  })
})
