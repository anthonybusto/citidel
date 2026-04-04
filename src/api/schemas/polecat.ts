import { z } from 'zod'

export const PolecatListItemSchema = z.object({
  rig: z.string(),
  name: z.string(),
  state: z.string(),
  issue: z.string().optional(),
  session_running: z.boolean(),
  zombie: z.boolean().optional(),
  session_name: z.string().optional(),
})

export const PolecatListResponseSchema = z.array(PolecatListItemSchema)

export const PolecatStatusSchema = z.object({
  rig: z.string(),
  name: z.string(),
  state: z.string(),
  issue: z.string().optional(),
  clone_path: z.string().optional(),
  branch: z.string().optional(),
  session_running: z.boolean(),
  session_id: z.string().optional(),
  attached: z.boolean().optional(),
  windows: z.number().optional(),
  created_at: z.string().optional(),
  last_activity: z.string().optional(),
})
