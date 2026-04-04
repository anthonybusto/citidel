import type { z } from 'zod'
import type { ApiClient, ApiError } from './client'
import { CommandResponseSchema } from './schemas/run'

type RunCommandOptions = {
  command: string
  confirmed?: boolean
  timeout?: number
}

type RunResult<T> = {
  data: T
  durationMs: number
  command: string
}

export async function runCommand<T>(
  client: ApiClient,
  options: RunCommandOptions,
  outputSchema: z.ZodType<T>,
): Promise<RunResult<T>> {
  const response = await client.post(
    '/api/run',
    {
      command: options.command,
      confirmed: options.confirmed,
      timeout: options.timeout,
    },
    CommandResponseSchema,
  )

  if (!response.success) {
    throw {
      message: response.error ?? `Command failed: ${options.command}`,
      status: 422,
      endpoint: '/api/run',
    } satisfies ApiError
  }

  const parsed = JSON.parse(response.output ?? '{}')
  try {
    const data = outputSchema.parse(parsed)
    return { data, durationMs: response.duration_ms, command: response.command }
  } catch {
    throw {
      message: `Unexpected response format from \`${options.command}\``,
      status: 200,
      endpoint: '/api/run',
    } satisfies ApiError
  }
}
