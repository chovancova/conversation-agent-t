import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, X, CheckCircle, XCircle, Clock, FloppyDisk, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TokenConfig, AccessToken } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'

type TokenManagerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TokenManager({ open, onOpenChange }: TokenManagerProps) {
  const [savedTokens, setSavedTokens] = useKV<TokenConfig[]>('saved-tokens', [])
  const [selectedTokenId, setSelectedTokenId] = useKV<string | null>('selected-token-id', null)
  const [accessToken, setAccessToken] = useKV<AccessToken | null>('access-token', null)
  
  const [name, setName] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [clientId, setClientId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)

  useEffect(() => {
    if (selectedToken) {
      setName(selectedToken.name)
      setEndpoint(selectedToken.endpoint)
      setClientId(selectedToken.clientId)
      setUsername(selectedToken.username)
      setPassword(selectedToken.password)
    }
  }, [selectedToken])

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

      toast.success('Access token generated successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate token')
      console.error('Token generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToken = () => {
    if (!name || !endpoint || !clientId || !username || !password) {
      toast.error('All fields are required to save')
      return
    }

    const tokenId = selectedTokenId || Date.now().toString()
    const newToken: TokenConfig = {
      id: tokenId,
      name,
      endpoint,
      clientId,
      username,
      password
    }

    setSavedTokens((current = []) => {
      const existing = current.find(t => t.id === tokenId)
      if (existing) {
        return current.map(t => t.id === tokenId ? newToken : t)
      }
      return [...current, newToken]
    })

    setSelectedTokenId(tokenId)
    toast.success(selectedToken ? 'Token updated' : 'Token saved')
  }

  const handleDeleteToken = () => {
    if (!selectedTokenId) return

    setSavedTokens((current = []) => current.filter(t => t.id !== selectedTokenId))
    setSelectedTokenId(null)
    setName('')
    setEndpoint('')
    setClientId('')
    setUsername('')
    setPassword('')
    toast.success('Token configuration deleted')
  }

  const handleNewToken = () => {
    setSelectedTokenId(null)
    setName('')
    setEndpoint('')
    setClientId('')
    setUsername('')
    setPassword('')
  }

  const handleSelectToken = (tokenId: string) => {
    setSelectedTokenId(tokenId)
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

          <div className="flex items-center gap-2">
            <Select value={selectedTokenId || 'new'} onValueChange={(value) => value === 'new' ? handleNewToken() : handleSelectToken(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select saved token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ New Token Configuration</SelectItem>
                {savedTokens?.map(token => (
                  <SelectItem key={token.id} value={token.id}>
                    {token.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTokenId && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleDeleteToken}
                className="flex-shrink-0"
              >
                <Trash size={18} />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-name">Configuration Name</Label>
              <Input
                id="token-name"
                type="text"
                placeholder="Production, Staging, Development..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className="flex gap-2">
              <Button
                onClick={handleSaveToken}
                disabled={!name || !endpoint || !clientId || !username || !password}
                variant="outline"
                className="flex-1"
              >
                <FloppyDisk size={18} className="mr-2" />
                {selectedToken ? 'Update' : 'Save'} Configuration
              </Button>
              
              <Button
                onClick={handleGenerateToken}
                disabled={isGenerating || !endpoint || !clientId || !username || !password}
                className="flex-1"
              >
                {isGenerating ? 'Generating...' : 'Generate Token'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
