import { z } from 'zod'

export const WitnessStatusSchema = z.object({
  running: z.boolean(),
  rig_name: z.string(),
  session: z.string().optional(),
  monitored_polecats: z.array(z.string()).optional(),
})
