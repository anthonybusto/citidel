import { useEffect, useRef, useCallback, useState } from 'react'

export type SSEStatus = 'connecting' | 'connected' | 'disconnected'

export function useSSE(
  url: string,
  onInvalidate: () => void,
): { status: SSEStatus } {
  const [status, setStatus] = useState<SSEStatus>('disconnected')
  const lastHashRef = useRef<string>('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryDelayRef = useRef(1000)
  const esRef = useRef<EventSource | null>(null)

  const stableInvalidate = useCallback(onInvalidate, [onInvalidate])

  useEffect(() => {
    if (!url) return

    let unmounted = false

    function connect() {
      if (unmounted) return
      setStatus('connecting')
      const es = new EventSource(url)
      esRef.current = es

      es.onopen = () => {
        if (!unmounted) {
          setStatus('connected')
          retryDelayRef.current = 1000
        }
      }

      es.addEventListener('dashboard-update', (event: MessageEvent) => {
        const hash = event.data
        if (hash === lastHashRef.current) return
        lastHashRef.current = hash

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          stableInvalidate()
        }, 200)
      })

      es.onerror = () => {
        es.close()
        if (!unmounted) {
          setStatus('disconnected')
          const delay = retryDelayRef.current
          retryDelayRef.current = Math.min(delay * 2, 30000)
          setTimeout(connect, delay)
        }
      }
    }

    connect()

    return () => {
      unmounted = true
      if (debounceRef.current) clearTimeout(debounceRef.current)
      esRef.current?.close()
      setStatus('disconnected')
    }
  }, [url, stableInvalidate])

  return { status }
}
