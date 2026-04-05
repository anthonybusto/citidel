import { z } from 'zod'

export const MergeRequestSchema = z.object({
  id: z.string(),
  branch: z.string(),
  worker: z.string().optional(),
  issue_id: z.string().optional(),
  target_branch: z.string().optional(),
  created_at: z.string().optional(),
  status: z.string(),
  close_reason: z.string().optional(),
  error: z.string().optional(),
})

export const QueueItemSchema = z.object({
  position: z.number(),
  mr: MergeRequestSchema,
  age: z.string().optional(),
})

export const RefineryStatusSchema = z.object({
  running: z.boolean(),
  rig_name: z.string(),
  session: z.string().optional(),
  queue_length: z.number(),
})

export const RefineryQueueResponseSchema = z.array(QueueItemSchema)
