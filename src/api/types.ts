import type { z } from 'zod'
import type { CommandInfoSchema, CommandListResponseSchema } from './schemas/commands'
import type { CommandRequestSchema, CommandResponseSchema } from './schemas/run'
import type { MailMessageSchema, MailInboxResponseSchema, MailThreadSchema, MailThreadsResponseSchema } from './schemas/mail'
import type { CrewMemberSchema, CrewResponseSchema } from './schemas/crew'
import type { PolecatListItemSchema, PolecatStatusSchema } from './schemas/polecat'
import type { SessionPreviewResponseSchema } from './schemas/session'
import type { DeaconStatusSchema } from './schemas/deacon'
import type { WitnessStatusSchema } from './schemas/witness'
import type { DogListItemSchema, DogListResponseSchema } from './schemas/dog'

export type CommandInfo = z.infer<typeof CommandInfoSchema>
export type CommandListResponse = z.infer<typeof CommandListResponseSchema>
export type CommandRequest = z.infer<typeof CommandRequestSchema>
export type CommandResponse = z.infer<typeof CommandResponseSchema>
export type MailMessage = z.infer<typeof MailMessageSchema>
export type MailInboxResponse = z.infer<typeof MailInboxResponseSchema>
export type MailThread = z.infer<typeof MailThreadSchema>
export type MailThreadsResponse = z.infer<typeof MailThreadsResponseSchema>
export type CrewMember = z.infer<typeof CrewMemberSchema>
export type CrewResponse = z.infer<typeof CrewResponseSchema>
export type PolecatListItem = z.infer<typeof PolecatListItemSchema>
export type PolecatStatus = z.infer<typeof PolecatStatusSchema>
export type SessionPreviewResponse = z.infer<typeof SessionPreviewResponseSchema>
export type DeaconStatus = z.infer<typeof DeaconStatusSchema>
export type WitnessStatus = z.infer<typeof WitnessStatusSchema>
export type DogListItem = z.infer<typeof DogListItemSchema>
export type DogListResponse = z.infer<typeof DogListResponseSchema>
