import { describe, it, expect } from 'vitest'
import { createApiClient } from '@/api/client'

describe('createApiClient', () => {
  it('creates client with baseUrl', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    expect(client.baseUrl).toBe('http://localhost:8080')
  })

  it('strips trailing slash from baseUrl', () => {
    const client = createApiClient('http://localhost:8080/', 'test-token')
    expect(client.baseUrl).toBe('http://localhost:8080')
  })

  it('builds GET request without token header', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    const req = client.buildRequest('/api/commands', 'GET')
    expect(req.headers.get('X-Dashboard-Token')).toBeNull()
    expect(req.url).toBe('http://localhost:8080/api/commands')
  })

  it('builds POST request with token header', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    const req = client.buildRequest('/api/run', 'POST', { command: 'status --json' })
    expect(req.headers.get('X-Dashboard-Token')).toBe('test-token')
    expect(req.headers.get('Content-Type')).toBe('application/json')
  })

  it('maps 403 to token error', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    expect(client.mapError(403).message).toBe('Invalid or missing dashboard token')
  })

  it('maps 0 to unreachable error', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    expect(client.mapError(0).message).toContain('Cannot reach Gas Town')
  })

  it('returns SSE url', () => {
    const client = createApiClient('http://localhost:8080', 'test-token')
    expect(client.sseUrl()).toBe('http://localhost:8080/api/events')
  })
})
