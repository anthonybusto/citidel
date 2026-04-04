import type { z } from 'zod'
import type { CommandInfoSchema, CommandListResponseSchema } from './schemas/commands'
import type { CommandRequestSchema, CommandResponseSchema } from './schemas/run'

export type CommandInfo = z.infer<typeof CommandInfoSchema>
export type CommandListResponse = z.infer<typeof CommandListResponseSchema>
export type CommandRequest = z.infer<typeof CommandRequestSchema>
export type CommandResponse = z.infer<typeof CommandResponseSchema>
