import { z } from 'zod'

export const IssueShowResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  owner: z.string().optional(),
  description: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  depends_on: z.array(z.string()).optional(),
  blocks: z.array(z.string()).optional(),
  raw_output: z.string(),
})

export const IssueCreateResponseSchema = z.object({
  success: z.boolean(),
  id: z.string().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})
