import { describe, it, expect, beforeEach } from 'vitest'
import { useMailStore } from '@/store/slices/mail'

describe('mailStore', () => {
  beforeEach(() => {
    useMailStore.getState().clear()
  })

  it('sets messages by ID', () => {
    useMailStore.getState().setMessages([
      { id: 'msg-1', from: 'a/', to: 'b/', subject: 'Hi', timestamp: '2026-04-04T00:00:00Z', read: false },
      { id: 'msg-2', from: 'b/', to: 'a/', subject: 'Re', timestamp: '2026-04-04T01:00:00Z', read: true },
    ])
    const state = useMailStore.getState()
    expect(state.messages.size).toBe(2)
    expect(state.messages.get('msg-1')?.subject).toBe('Hi')
  })

  it('replaces all messages on set (full replace)', () => {
    useMailStore.getState().setMessages([
      { id: 'msg-1', from: 'a/', to: 'b/', subject: 'Hi', timestamp: '2026-04-04T00:00:00Z', read: false },
    ])
    useMailStore.getState().setMessages([
      { id: 'msg-2', from: 'b/', to: 'a/', subject: 'New', timestamp: '2026-04-04T01:00:00Z', read: true },
    ])
    const state = useMailStore.getState()
    expect(state.messages.size).toBe(1)
    expect(state.messages.has('msg-1')).toBe(false)
    expect(state.messages.get('msg-2')?.subject).toBe('New')
  })

  it('stores threads by thread_id', () => {
    useMailStore.getState().setThreads([
      {
        thread_id: 't-1',
        subject: 'Thread',
        last_message: { id: 'msg-1', from: 'a/', to: 'b/', subject: 'Re', timestamp: '2026-04-04T00:00:00Z', read: true },
        messages: [],
        count: 1,
        unread_count: 0,
      },
    ])
    expect(useMailStore.getState().threads.size).toBe(1)
    expect(useMailStore.getState().threads.get('t-1')?.subject).toBe('Thread')
  })

  it('stores unread count', () => {
    useMailStore.getState().setUnreadCount(5)
    expect(useMailStore.getState().unreadCount).toBe(5)
  })

  it('clears all state', () => {
    useMailStore.getState().setUnreadCount(3)
    useMailStore.getState().setMessages([
      { id: 'msg-1', from: 'a/', to: 'b/', subject: 'Hi', timestamp: '2026-04-04T00:00:00Z', read: false },
    ])
    useMailStore.getState().clear()
    const state = useMailStore.getState()
    expect(state.messages.size).toBe(0)
    expect(state.threads.size).toBe(0)
    expect(state.unreadCount).toBe(0)
  })
})
