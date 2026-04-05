import { create } from 'zustand'

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

type ConnectionState = {
  baseUrl: string
  token: string
  status: ConnectionStatus
  error: string | null
  setConnection: (baseUrl: string, token: string) => void
  setStatus: (status: ConnectionStatus) => void
  setError: (error: string) => void
  hydrate: () => void
  autoConnect: () => Promise<void>
  reset: () => void
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* noop in test env */ }
}

function safeGetItem(key: string): string {
  try { return localStorage.getItem(key) ?? '' } catch { return '' }
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  baseUrl: '',
  token: '',
  status: 'disconnected',
  error: null,

  setConnection: (baseUrl, token) => {
    safeSetItem('citadel-base-url', baseUrl)
    safeSetItem('citadel-token', token)
    set({ baseUrl, token, status: 'disconnected', error: null })
  },

  setStatus: (status) => set({ status }),

  setError: (error) => set({ error, status: 'error' }),

  hydrate: () => {
    const baseUrl = safeGetItem('citadel-base-url')
    const token = safeGetItem('citadel-token')
    set({ baseUrl, token })
  },

  autoConnect: async () => {
    const state = get()
    // If already has a token (from previous session), try to reconnect
    const savedToken = state.token || safeGetItem('citadel-token')
    if (savedToken) {
      try {
        const res = await fetch(`${state.baseUrl}/api/commands`)
        if (res.ok) {
          set({ baseUrl: state.baseUrl, token: savedToken, status: 'connected' })
          return
        }
      } catch { /* fall through to auto-detect */ }
    }

    // Auto-detect: try proxied path (same origin, Vite proxy)
    set({ status: 'connecting' })
    try {
      const res = await fetch('/api/commands')
      if (!res.ok) {
        set({ status: 'error', error: 'Cannot reach Gas Town dashboard. Start it with: gt dashboard' })
        return
      }

      // Fetch the dashboard HTML to extract the CSRF token
      // Use /dashboard-html which proxies to the dashboard's root
      const htmlRes = await fetch('/dashboard-html')
      const html = await htmlRes.text()
      const tokenMatch = html.match(/dashboard-token.*?content="([^"]+)"/)

      // If we can't get token from HTML (proxied), try without token for GET requests
      // POST requests will need the token configured manually
      const token = tokenMatch?.[1] ?? safeGetItem('citadel-token')

      set({
        baseUrl: '', // empty = same origin (Vite proxy)
        token,
        status: 'connected',
        error: null,
      })
      if (token) {
        safeSetItem('citadel-base-url', '')
        safeSetItem('citadel-token', token)
      }
    } catch {
      set({
        status: 'error',
        error: 'Cannot reach Gas Town dashboard. Start it with: gt dashboard',
      })
    }
  },

  reset: () => {
    set({ baseUrl: '', token: '', status: 'disconnected', error: null })
  },
}))
