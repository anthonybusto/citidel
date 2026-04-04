import { z } from 'zod'

export const DogListItemSchema = z.object({
  name: z.string(),
  state: z.string(),
  work: z.string().optional(),
  work_started_at: z.string().optional(),
  last_active: z.string().optional(),
  worktrees: z.number().optional(),
})

export const DogListResponseSchema = z.array(DogListItemSchema)
