import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout'
import { useEffect } from 'react'
import { useConnectionStore } from '@/store/connection'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
})

function Placeholder({ name }: { name: string }) {
  return <div className="text-muted-foreground">Feature: {name} (coming soon)</div>
}

function AppInner() {
  const hydrate = useConnectionStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/mayor" replace />} />
        <Route path="/settings" element={<Placeholder name="Settings" />} />
        <Route path="/mayor" element={<Placeholder name="Mayor Chat" />} />
        <Route path="/workers" element={<Placeholder name="Workers" />} />
        <Route path="/workers/:id" element={<Placeholder name="Worker Detail" />} />
        <Route path="/infra" element={<Placeholder name="Infrastructure" />} />
        <Route path="/beads" element={<Placeholder name="Beads" />} />
        <Route path="/rigs" element={<Placeholder name="Rigs" />} />
        <Route path="/refinery" element={<Placeholder name="Refinery" />} />
        <Route path="/mail" element={<Placeholder name="Mail" />} />
        <Route path="/convoys" element={<Placeholder name="Convoys" />} />
        <Route path="/hooks" element={<Placeholder name="Hooks" />} />
        <Route path="/molecules" element={<Placeholder name="Molecules" />} />
        <Route path="/formulas" element={<Placeholder name="Formulas" />} />
        <Route path="/wisps" element={<Placeholder name="Wisps" />} />
      </Route>
    </Routes>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
