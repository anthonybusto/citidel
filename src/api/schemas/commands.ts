import { z } from 'zod'

export const CommandInfoSchema = z.object({
  name: z.string(),
  desc: z.string(),
  category: z.string(),
  safe: z.boolean(),
  confirm: z.boolean(),
  args: z.string().optional(),
  argType: z.string().optional(),
})

export const CommandListResponseSchema = z.object({
  commands: z.array(CommandInfoSchema),
})
