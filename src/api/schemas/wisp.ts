import { z } from 'zod'

export const WispSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  category: z.string().optional(),
  created_at: z.string().optional(),
  from: z.string().optional(),
  rig: z.string().optional(),
})

export const WispListResponseSchema = z.object({
  wisps: z.array(WispSchema),
  count: z.number(),
})
