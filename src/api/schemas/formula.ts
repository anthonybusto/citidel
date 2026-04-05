import { z } from 'zod'

export const FormulaStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  needs: z.array(z.string()).optional(),
  description: z.string().optional(),
})

export const FormulaSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  version: z.string().optional(),
  steps: z.array(FormulaStepSchema).optional(),
  vars: z.record(z.string(), z.any()).optional(),
})

export const FormulaListResponseSchema = z.array(FormulaSchema)
