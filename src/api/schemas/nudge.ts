import { z } from 'zod'

export const NudgeRequestSchema = z.object({
  target: z.string(),
  message: z.string(),
  mode: z.enum(['wait-idle', 'immediate', 'queue']).optional(),
  priority: z.enum(['normal', 'urgent']).optional(),
})
