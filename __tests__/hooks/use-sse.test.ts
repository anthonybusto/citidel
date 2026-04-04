import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

class MockEventSource {
  static instances: MockEventSource[] = []
  url: string
  listeners: Record<string, ((event: MessageEvent) => void)[]> = {}
  onopen: (() => void) | null = null
  onerror: (() => void) | null = null
  readyState = 0
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (!this.listeners[type]) this.listeners[type] = []
    this.listeners[type].push(listener)
  }

  simulateOpen() {
    this.readyState = 1
    this.onopen?.()
  }

  simulateMessage(data: string, event: string) {
    const msg = new MessageEvent(event, { data })
    this.listeners[event]?.forEach((fn) => fn(msg))
  }
}

vi.stubGlobal('EventSource', MockEventSource)

import { useSSE } from '@/hooks/use-sse'

describe('useSSE', () => {
  beforeEach(() => {
    MockEventSource.instances = []
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('connects to SSE endpoint', () => {
    const onInvalidate = vi.fn()
    renderHook(() => useSSE('http://localhost:8080/api/events', onInvalidate))
    expect(MockEventSource.instances).toHaveLength(1)
    expect(MockEventSource.instances[0].url).toBe('http://localhost:8080/api/events')
  })

  it('does not connect when url is empty', () => {
    const onInvalidate = vi.fn()
    renderHook(() => useSSE('', onInvalidate))
    expect(MockEventSource.instances).toHaveLength(0)
  })

  it('calls onInvalidate on new hash after debounce', () => {
    const onInvalidate = vi.fn()
    renderHook(() => useSSE('http://localhost:8080/api/events', onInvalidate))
    const es = MockEventSource.instances[0]
    es.simulateOpen()

    act(() => {
      es.simulateMessage('hash-abc', 'dashboard-update')
      vi.advanceTimersByTime(300)
    })
    expect(onInvalidate).toHaveBeenCalledTimes(1)
  })

  it('deduplicates identical hashes', () => {
    const onInvalidate = vi.fn()
    renderHook(() => useSSE('http://localhost:8080/api/events', onInvalidate))
    const es = MockEventSource.instances[0]
    es.simulateOpen()

    act(() => {
      es.simulateMessage('hash-abc', 'dashboard-update')
      vi.advanceTimersByTime(300)
    })
    expect(onInvalidate).toHaveBeenCalledTimes(1)

    act(() => {
      es.simulateMessage('hash-abc', 'dashboard-update')
      vi.advanceTimersByTime(300)
    })
    expect(onInvalidate).toHaveBeenCalledTimes(1) // same hash, no new call
  })

  it('closes on unmount', () => {
    const onInvalidate = vi.fn()
    const { unmount } = renderHook(() => useSSE('http://localhost:8080/api/events', onInvalidate))
    const es = MockEventSource.instances[0]
    unmount()
    expect(es.close).toHaveBeenCalled()
  })
})
