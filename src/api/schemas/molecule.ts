import { z } from 'zod'

export const DAGNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  parallel: z.boolean().optional(),
  dependencies: z.array(z.string()),
  dependents: z.array(z.string()),
  tier: z.number(),
  children: z.array(z.string()).optional(),
})

export const DAGInfoSchema = z.object({
  root_id: z.string(),
  root_title: z.string(),
  total_nodes: z.number(),
  tiers: z.number(),
  critical_path: z.array(z.string()).optional(),
  nodes: z.array(DAGNodeSchema),
  tier_groups: z.record(z.string(), z.array(z.string())).optional(),
})

export const MoleculeProgressInfoSchema = z.object({
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
})

export const MoleculeCurrentInfoSchema = z.object({
  identity: z.string().optional(),
  handoff_id: z.string().optional(),
  handoff_title: z.string().optional(),
  molecule_id: z.string().optional(),
  molecule_title: z.string().optional(),
  steps_complete: z.number().optional(),
  steps_total: z.number().optional(),
  current_step_id: z.string().optional(),
  current_step: z.string().optional(),
  status: z.string().optional(),
})
