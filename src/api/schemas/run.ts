import { z } from 'zod'

export const CommandRequestSchema = z.object({
  command: z.string(),
  timeout: z.number().optional(),
  confirmed: z.boolean().optional(),
})

export const CommandResponseSchema = z.object({
  success: z.boolean(),
  output: z.string().optional(),
  error: z.string().optional(),
  duration_ms: z.number(),
  command: z.string(),
})
