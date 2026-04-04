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
  reset: () => void
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch { /* noop in test env */ }
}

function safeGetItem(key: string): string {
  try { return localStorage.getItem(key) ?? '' } catch { return '' }
}

export const useConnectionStore = create<ConnectionState>((set) => ({
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

  reset: () => {
    set({ baseUrl: '', token: '', status: 'disconnected', error: null })
  },
}))
