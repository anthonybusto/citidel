import { z } from 'zod'

export const RigInfoSchema = z.object({
  name: z.string(),
  beads_prefix: z.string().optional(),
  status: z.string().optional(),
  witness: z.string().optional(),
  refinery: z.string().optional(),
  polecats: z.number().optional(),
  crew: z.number().optional(),
})

export const RigListResponseSchema = z.array(RigInfoSchema)
