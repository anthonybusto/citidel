import { z } from 'zod'

export const CrewMemberSchema = z.object({
  name: z.string(),
  rig: z.string(),
  state: z.string(),
  hook: z.string().optional(),
  hook_title: z.string().optional(),
  session: z.string(),
  last_active: z.string(),
})

export const CrewResponseSchema = z.object({
  crew: z.array(CrewMemberSchema),
  by_rig: z.record(z.string(), z.array(CrewMemberSchema)),
  total: z.number(),
})
