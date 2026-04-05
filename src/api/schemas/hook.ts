import { z } from 'zod'

export const HookShowSchema = z.object({
  agent: z.string().optional(),
  bead_id: z.string().optional(),
  title: z.string().optional(),
  status: z.string().optional(),
})

export const MoleculeStatusInfoSchema = z.object({
  target: z.string().optional(),
  role: z.string().optional(),
  agent_bead_id: z.string().optional(),
  has_work: z.boolean(),
  pinned_bead: z.any().optional(),
  attached_molecule: z.string().optional(),
  attached_formula: z.string().optional(),
  attached_at: z.string().optional(),
  is_wisp: z.boolean().optional(),
  progress: z.object({
    root_id: z.string().optional(),
    root_title: z.string().optional(),
    molecule_id: z.string().optional(),
    total_steps: z.number(),
    done_steps: z.number(),
    in_progress_steps: z.number(),
    ready_steps: z.array(z.string()).optional(),
    blocked_steps: z.array(z.string()).optional(),
    percent_complete: z.number(),
    complete: z.boolean(),
  }).optional(),
  next_action: z.string().optional(),
})

export const HooksListItemSchema = z.object({
  agent: z.string(),
  bead_id: z.string(),
  title: z.string(),
  status: z.string().optional(),
  age: z.string().optional(),
  is_stale: z.boolean().optional(),
})

export const HooksListSchema = z.array(HooksListItemSchema)
