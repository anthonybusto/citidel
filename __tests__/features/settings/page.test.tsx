import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SettingsPage } from '@/features/settings/page'
import { useConnectionStore } from '@/store/connection'

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>)
}

describe('SettingsPage', () => {
  beforeEach(() => {
    useConnectionStore.getState().reset()
  })

  it('renders connection form with base URL and token inputs', () => {
    renderWithProviders(<SettingsPage />)
    expect(screen.getByLabelText(/base url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/token/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /connect/i })).toBeInTheDocument()
  })

  it('saves connection config on submit', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SettingsPage />)

    await user.type(screen.getByLabelText(/base url/i), 'http://localhost:8080')
    await user.type(screen.getByLabelText(/token/i), 'my-secret-token')
    await user.click(screen.getByRole('button', { name: /connect/i }))

    const state = useConnectionStore.getState()
    expect(state.baseUrl).toBe('http://localhost:8080')
    expect(state.token).toBe('my-secret-token')
  })
})
