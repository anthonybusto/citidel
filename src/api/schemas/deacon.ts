import { z } from 'zod'

export const DeaconStatusSchema = z.object({
  running: z.boolean(),
  paused: z.boolean().optional(),
  session: z.string().optional(),
  heartbeat: z.object({
    timestamp: z.string(),
    age_seconds: z.number(),
    cycle: z.number(),
    last_action: z.string(),
    fresh: z.boolean(),
    stale: z.boolean(),
    very_stale: z.boolean(),
  }).optional(),
})
