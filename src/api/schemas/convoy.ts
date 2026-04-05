import { z } from 'zod'

export const TrackedIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  issue_type: z.string().optional(),
  blocked: z.boolean().optional(),
  assignee: z.string().optional(),
  labels: z.string().optional(),
  worker: z.string().optional(),
  worker_age: z.string().optional(),
})

export const ConvoyStatusSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  work_status: z.string().optional(),
  completed: z.number().optional(),
  total: z.number().optional(),
  progress_pct: z.number().optional(),
  ready_beads: z.number().optional(),
  in_progress: z.number().optional(),
  assignees: z.array(z.string()).optional(),
  tracked_issues: z.array(TrackedIssueSchema).optional(),
})

export const ConvoyListResponseSchema = z.array(ConvoyStatusSchema)
