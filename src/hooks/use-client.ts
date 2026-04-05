import { useMemo } from 'react'
import { createApiClient } from '@/api/client'
import { useConnectionStore } from '@/store/connection'

export function useClient() {
  const { baseUrl, token, status } = useConnectionStore()
  return useMemo(() => {
    // Connected means we verified the dashboard is reachable
    if (status !== 'connected') return null
    return createApiClient(baseUrl, token)
  }, [baseUrl, token, status])
}
