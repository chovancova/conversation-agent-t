import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, X, CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TokenConfig, AccessToken } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'

type TokenManagerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TokenManager({ open, onOpenChange }: TokenManagerProps) {
  const [tokenConfig, setTokenConfig] = useKV<TokenConfig>('token-config', {
    endpoint: '',
    clientId: '',
    username: '',
    password: ''
  })
  const [accessToken, setAccessToken] = useKV<AccessToken | null>('access-token', null)
  
  const [endpoint, setEndpoint] = useState('')
  const [clientId, setClientId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (tokenConfig) {
      setEndpoint(tokenConfig.endpoint || '')
      setClientId(tokenConfig.clientId || '')
      setUsername(tokenConfig.username || '')
      setPassword(tokenConfig.password || '')
    }
  }, [tokenConfig])

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()
  const { minutes: minutesRemaining, seconds: secondsRemaining } = useCountdown(accessToken?.expiresAt || null)

  const handleGenerateToken = async () => {
    if (!endpoint || !clientId || !username || !password) {
      toast.error('All fields are required')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          username,
          password
        })
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const token = data.access_token || data.token
      if (!token) {
        throw new Error('No access token in response')
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt: Date.now() + (15 * 60 * 1000)
      }

      setAccessToken(newAccessToken)
      setTokenConfig({
        endpoint,
        clientId,
        username,
        password
      })

      toast.success('Access token generated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate token')
      console.error('Token generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClearToken = () => {
    setAccessToken(null)
    toast.success('Token cleared')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key size={24} weight="duotone" />
            Token Manager
          </DialogTitle>
          <DialogDescription>
            Generate and manage Bearer authentication tokens for agent communication
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {accessToken && (
            <Card className={isTokenValid ? 'border-accent' : 'border-destructive'}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {isTokenValid ? (
                    <>
                      <CheckCircle size={20} weight="fill" className="text-accent" />
                      Active Token
                    </>
                  ) : (
                    <>
                      <XCircle size={20} weight="fill" className="text-destructive" />
                      Token Expired
                    </>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Clock size={16} />
                  {isTokenValid 
                    ? `Expires in ${minutesRemaining}m ${secondsRemaining}s`
                    : 'Generate a new token to continue'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono break-all">
                    {accessToken.token.substring(0, 50)}...
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearToken}
                  >
                    <X size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-endpoint">Token Endpoint URL</Label>
              <Input
                id="token-endpoint"
                type="url"
                placeholder="https://api.example.com/oauth/token"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-id">Client ID</Label>
              <Input
                id="client-id"
                type="text"
                placeholder="your-client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleGenerateToken}
              disabled={isGenerating || !endpoint || !clientId || !username || !password}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Token'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
