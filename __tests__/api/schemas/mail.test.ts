import { describe, it, expect } from 'vitest'
import { MailMessageSchema, MailInboxResponseSchema, MailThreadsResponseSchema } from '@/api/schemas/mail'

describe('MailMessageSchema', () => {
  it('parses valid mail message', () => {
    const msg = {
      id: 'msg-001',
      from: 'mayor/',
      to: 'contractor/alpha-1',
      subject: 'Test',
      body: 'Hello',
      timestamp: '2026-04-04T00:00:00Z',
      read: false,
    }
    const result = MailMessageSchema.parse(msg)
    expect(result.id).toBe('msg-001')
  })

  it('parses message with optional fields', () => {
    const msg = {
      id: 'msg-002',
      from: 'contractor/witness',
      to: 'mayor/',
      subject: 'Alert',
      timestamp: '2026-04-04T00:00:00Z',
      read: true,
      priority: 'high',
      thread_id: 'thread-001',
      reply_to: 'msg-001',
    }
    const result = MailMessageSchema.parse(msg)
    expect(result.priority).toBe('high')
    expect(result.thread_id).toBe('thread-001')
  })

  it('rejects message missing required fields', () => {
    expect(() => MailMessageSchema.parse({ id: 'x' })).toThrow()
  })
})

describe('MailInboxResponseSchema', () => {
  it('parses valid inbox', () => {
    const inbox = {
      messages: [
        { id: 'msg-001', from: 'a/', to: 'b/', subject: 'Hi', timestamp: '2026-04-04T00:00:00Z', read: false },
      ],
      unread_count: 1,
      total: 1,
    }
    const result = MailInboxResponseSchema.parse(inbox)
    expect(result.messages).toHaveLength(1)
    expect(result.unread_count).toBe(1)
  })
})

describe('MailThreadsResponseSchema', () => {
  it('parses valid threads', () => {
    const threads = {
      threads: [
        {
          thread_id: 'thread-001',
          subject: 'Discussion',
          last_message: { id: 'msg-002', from: 'a/', to: 'b/', subject: 'Re: Discussion', timestamp: '2026-04-04T01:00:00Z', read: true },
          messages: [],
          count: 2,
          unread_count: 0,
        },
      ],
      unread_count: 0,
      total: 1,
    }
    const result = MailThreadsResponseSchema.parse(threads)
    expect(result.threads).toHaveLength(1)
  })
})
