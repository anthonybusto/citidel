import { ConnectionForm } from './components/connection-form'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <ConnectionForm />
    </div>
  )
}
