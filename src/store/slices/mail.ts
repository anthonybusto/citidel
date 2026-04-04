import { create } from 'zustand'
import type { MailMessage, MailThread } from '@/api/types'

type MailState = {
  messages: Map<string, MailMessage>
  threads: Map<string, MailThread>
  unreadCount: number
  setMessages: (messages: MailMessage[]) => void
  setThreads: (threads: MailThread[]) => void
  setUnreadCount: (count: number) => void
  clear: () => void
}

export const useMailStore = create<MailState>((set) => ({
  messages: new Map(),
  threads: new Map(),
  unreadCount: 0,

  setMessages: (messages) => {
    const map = new Map<string, MailMessage>()
    for (const msg of messages) map.set(msg.id, msg)
    set({ messages: map })
  },

  setThreads: (threads) => {
    const map = new Map<string, MailThread>()
    for (const t of threads) map.set(t.thread_id, t)
    set({ threads: map })
  },

  setUnreadCount: (count) => set({ unreadCount: count }),

  clear: () => set({ messages: new Map(), threads: new Map(), unreadCount: 0 }),
}))
