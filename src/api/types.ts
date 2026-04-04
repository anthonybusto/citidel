import type { z } from 'zod'
import type { CommandInfoSchema, CommandListResponseSchema } from './schemas/commands'
import type { CommandRequestSchema, CommandResponseSchema } from './schemas/run'
import type { MailMessageSchema, MailInboxResponseSchema, MailThreadSchema, MailThreadsResponseSchema } from './schemas/mail'

export type CommandInfo = z.infer<typeof CommandInfoSchema>
export type CommandListResponse = z.infer<typeof CommandListResponseSchema>
export type CommandRequest = z.infer<typeof CommandRequestSchema>
export type CommandResponse = z.infer<typeof CommandResponseSchema>
export type MailMessage = z.infer<typeof MailMessageSchema>
export type MailInboxResponse = z.infer<typeof MailInboxResponseSchema>
export type MailThread = z.infer<typeof MailThreadSchema>
export type MailThreadsResponse = z.infer<typeof MailThreadsResponseSchema>
