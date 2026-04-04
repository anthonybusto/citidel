export type ApiError = {
  message: string
  status: number
  endpoint: string
}

export type ApiClient = {
  baseUrl: string
  get: <T>(path: string, schema: { parse: (data: unknown) => T }) => Promise<T>
  post: <T>(path: string, body: unknown, schema: { parse: (data: unknown) => T }) => Promise<T>
  postRaw: (path: string, body: unknown) => Promise<Response>
  buildRequest: (path: string, method: string, body?: unknown) => Request
  mapError: (status: number) => ApiError
  sseUrl: () => string
}

export function createApiClient(baseUrl: string, token: string): ApiClient {
  const trimmedBase = baseUrl.replace(/\/+$/, '')

  function buildRequest(path: string, method: string, body?: unknown): Request {
    const headers: Record<string, string> = {}
    if (method === 'POST') {
      headers['X-Dashboard-Token'] = token
      headers['Content-Type'] = 'application/json'
    }
    return new Request(`${trimmedBase}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  function mapError(status: number, endpoint = ''): ApiError {
    if (status === 0)
      return { message: `Cannot reach Gas Town at ${trimmedBase}`, status, endpoint }
    if (status === 403)
      return { message: 'Invalid or missing dashboard token', status, endpoint }
    if (status === 404)
      return { message: `Endpoint not found: ${endpoint}`, status, endpoint }
    return { message: `Request failed with status ${status}`, status, endpoint }
  }

  async function request<T>(
    path: string,
    method: string,
    body: unknown | undefined,
    schema: { parse: (data: unknown) => T },
  ): Promise<T> {
    let res: Response
    try {
      res = await fetch(buildRequest(path, method, body))
    } catch {
      throw mapError(0, path)
    }
    if (!res.ok) throw mapError(res.status, path)
    const json = await res.json()
    try {
      return schema.parse(json)
    } catch {
      throw {
        message: `Unexpected response format from ${path}`,
        status: res.status,
        endpoint: path,
      } satisfies ApiError
    }
  }

  return {
    baseUrl: trimmedBase,
    get: <T>(path: string, schema: { parse: (data: unknown) => T }) =>
      request(path, 'GET', undefined, schema),
    post: <T>(path: string, body: unknown, schema: { parse: (data: unknown) => T }) =>
      request(path, 'POST', body, schema),
    postRaw: (path: string, body: unknown) =>
      fetch(buildRequest(path, 'POST', body)),
    buildRequest,
    mapError: (status: number) => mapError(status),
    sseUrl: () => `${trimmedBase}/api/events`,
  }
}
