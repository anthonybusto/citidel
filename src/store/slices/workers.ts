import { create } from 'zustand'

export type Worker = {
  id: string        // "rig/name"
  name: string
  rig: string
  type: 'polecat' | 'crew'
  state: string
  hook?: string
  hookTitle?: string
  session: string
  lastActive: string
  sessionName?: string
}

type WorkersState = {
  workers: Map<string, Worker>
  setWorkers: (workers: Worker[]) => void
  clear: () => void
}

export const useWorkersStore = create<WorkersState>((set) => ({
  workers: new Map(),

  setWorkers: (workers) => {
    const map = new Map<string, Worker>()
    for (const w of workers) map.set(w.id, w)
    set({ workers: map })
  },

  clear: () => set({ workers: new Map() }),
}))
