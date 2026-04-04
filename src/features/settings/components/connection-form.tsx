import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useConnectionStore } from '@/store/connection'

export function ConnectionForm() {
  const { baseUrl, token, status, error, setConnection } = useConnectionStore()
  const [url, setUrl] = useState(baseUrl)
  const [tok, setTok] = useState(token)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setConnection(url.trim(), tok.trim())
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Gas Town Connection</CardTitle>
        <CardDescription>
          Connect to your Gas Town dashboard. Copy the token from <code>gt dashboard</code> output.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              type="url"
              placeholder="http://localhost:8080"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Paste dashboard token"
              value={tok}
              onChange={(e) => setTok(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {status === 'connected' && (
            <p className="text-sm text-green-500">Connected</p>
          )}
          <Button type="submit" disabled={!url.trim() || !tok.trim()}>
            Connect
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
