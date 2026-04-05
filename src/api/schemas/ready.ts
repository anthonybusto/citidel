import { z } from 'zod'

export const ReadyItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  priority: z.number(),
  source: z.string(),
  type: z.string(),
})

export const ReadyResponseSchema = z.object({
  items: z.array(ReadyItemSchema),
  by_source: z.record(z.string(), z.array(ReadyItemSchema)),
  summary: z.object({
    total: z.number(),
    p1_count: z.number(),
    p2_count: z.number(),
    p3_count: z.number(),
  }),
})
