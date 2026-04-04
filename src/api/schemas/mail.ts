import { z } from 'zod'

export const MailMessageSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string().optional(),
  timestamp: z.string(),
  read: z.boolean(),
  priority: z.string().optional(),
  thread_id: z.string().optional(),
  reply_to: z.string().optional(),
})

export const MailInboxResponseSchema = z.object({
  messages: z.array(MailMessageSchema),
  unread_count: z.number(),
  total: z.number(),
})

export const MailThreadSchema = z.object({
  thread_id: z.string(),
  subject: z.string(),
  last_message: MailMessageSchema,
  messages: z.array(MailMessageSchema),
  count: z.number(),
  unread_count: z.number(),
})

export const MailThreadsResponseSchema = z.object({
  threads: z.array(MailThreadSchema),
  unread_count: z.number(),
  total: z.number(),
})

export const MailSendRequestSchema = z.object({
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  reply_to: z.string().optional(),
})
