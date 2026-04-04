import { z } from 'zod'

export const SessionPreviewResponseSchema = z.object({
  session: z.string(),
  content: z.string(),
  timestamp: z.string(),
})
