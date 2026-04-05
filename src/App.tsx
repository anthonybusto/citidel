import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { Layout } from '@/components/layout'
import { useEffect } from 'react'
import { useConnectionStore } from '@/store/connection'
import { SettingsPage } from '@/features/settings/page'
import { MailPage } from '@/features/mail/page'
import { MayorChatPage } from '@/features/mayor-chat/page'
import { WorkersPage } from '@/features/workers/page'
import { InfrastructurePage } from '@/features/infrastructure/page'
import { RigsPage } from '@/features/rigs/page'
import { BeadsPage } from '@/features/beads/page'
import { WorkerDetailPage } from '@/features/worker-detail/page'
import { ConvoysPage } from '@/features/convoys/page'
import { HooksPage } from '@/features/hooks-viz/page'
import { MoleculesPage } from '@/features/molecules/page'
import { RefineryPage } from '@/features/refinery/page'
import { WispsPage } from '@/features/wisps/page'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
})

function AppInner() {
  const hydrate = useConnectionStore((s) => s.hydrate)
  useEffect(() => { hydrate() }, [hydrate])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/mayor" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/mayor" element={<MayorChatPage />} />
        <Route path="/workers" element={<WorkersPage />} />
        <Route path="/workers/:id" element={<WorkerDetailPage />} />
        <Route path="/infra" element={<InfrastructurePage />} />
        <Route path="/beads" element={<BeadsPage />} />
        <Route path="/rigs" element={<RigsPage />} />
        <Route path="/refinery" element={<RefineryPage />} />
        <Route path="/mail" element={<MailPage />} />
        <Route path="/convoys" element={<ConvoysPage />} />
        <Route path="/hooks" element={<HooksPage />} />
        <Route path="/molecules" element={<MoleculesPage />} />
        <Route path="/wisps" element={<WispsPage />} />
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
