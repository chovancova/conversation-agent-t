import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, X, CheckCircle, XCircle, Clock, FloppyDisk, Trash, Export, Download, Warning, ShieldCheck, Plus, PencilSimple, Lock, LockOpen } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { TokenConfig, AccessToken } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { EncryptionPasswordDialog } from '@/components/EncryptionPasswordDialog'
import { encryptData, decryptData } from '@/lib/encryption'
import { getJWTExpiration } from '@/lib/jwt'

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
  const [clientSecret, setClientSecret] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [useFormEncoded, setUseFormEncoded] = useState(false)
  const [useJWTExpiration, setUseJWTExpiration] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [encryptOnSave, setEncryptOnSave] = useState(true)
  const [encryptOnExport, setEncryptOnExport] = useState(true)
  const [showEncryptDialog, setShowEncryptDialog] = useState(false)
  const [showDecryptDialog, setShowDecryptDialog] = useState(false)
  const [showDecryptImportDialog, setShowDecryptImportDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'save' | 'export' | 'load' | 'import' | null>(null)
  const [tokenToDecrypt, setTokenToDecrypt] = useState<TokenConfig | null>(null)
  const [importedEncryptedData, setImportedEncryptedData] = useState<any>(null)

  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)

  useEffect(() => {
    if (selectedToken) {
      setName(selectedToken.name)
      setEndpoint(selectedToken.endpoint)
      setUseFormEncoded(selectedToken.useFormEncoded || false)
      setUseJWTExpiration(selectedToken.useJWTExpiration || false)
      if (selectedToken.isEncrypted) {
        setClientId('••••••••')
        setClientSecret('••••••••')
        setUsername('••••••••')
        setPassword('••••••••')
      } else {
        setClientId(selectedToken.clientId)
        setClientSecret(selectedToken.clientSecret)
        setUsername(selectedToken.username)
        setPassword(selectedToken.password)
      }
    }
  }, [selectedToken])

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()
  const { minutes: minutesRemaining, seconds: secondsRemaining } = useCountdown(accessToken?.expiresAt || null)

  const handleEncryptionPassword = async (encryptionPassword: string) => {
    if (pendingAction === 'save') {
      await handleSaveTokenWithEncryption(encryptionPassword)
    } else if (pendingAction === 'export') {
      await handleExportWithEncryption(encryptionPassword)
    } else if (pendingAction === 'load' && tokenToDecrypt) {
      await handleDecryptToken(tokenToDecrypt, encryptionPassword)
    } else if (pendingAction === 'import' && importedEncryptedData) {
      await handleDecryptImport(encryptionPassword)
    }
    setPendingAction(null)
    setTokenToDecrypt(null)
    setImportedEncryptedData(null)
    setShowEncryptDialog(false)
    setShowDecryptDialog(false)
    setShowDecryptImportDialog(false)
  }

  const handleSaveTokenWithEncryption = async (encryptionPassword: string) => {
    if (!name || !endpoint || !clientId || !clientSecret || !username || !password) {
      toast.error('All fields are required to save')
      return
    }

    const tokenId = selectedTokenId || Date.now().toString()

    try {
      const credentialsData = JSON.stringify({
        clientId,
        clientSecret,
        username,
        password
      })

      const encrypted = await encryptData(credentialsData, encryptionPassword)

      const newToken: TokenConfig = {
        id: tokenId,
        name,
        endpoint,
        clientId: encrypted.encrypted,
        clientSecret: encrypted.iv,
        username: encrypted.salt,
        password: '',
        isEncrypted: true,
        useFormEncoded,
        useJWTExpiration
      }

      setSavedTokens((current = []) => {
        const existing = current.find(t => t.id === tokenId)
        if (existing) {
          return current.map(t => t.id === tokenId ? newToken : t)
        }
        return [...current, newToken]
      })

      setSelectedTokenId(tokenId)
      toast.success(selectedToken ? 'Token updated (encrypted)' : 'Token saved (encrypted)')
      setShowForm(false)
    } catch (error) {
      toast.error('Failed to encrypt credentials')
      console.error('Encryption error:', error)
    }
  }

  const handleDecryptToken = async (token: TokenConfig, encryptionPassword: string) => {
    if (!token.isEncrypted) {
      toast.error('Token is not encrypted')
      return
    }

    try {
      const encryptedData = {
        encrypted: token.clientId,
        iv: token.clientSecret,
        salt: token.username
      }

      const decrypted = await decryptData(encryptedData, encryptionPassword)
      const credentials = JSON.parse(decrypted)

      setClientId(credentials.clientId)
      setClientSecret(credentials.clientSecret)
      setUsername(credentials.username)
      setPassword(credentials.password)
      setShowForm(true)

      toast.success('Credentials decrypted successfully')
    } catch (error) {
      toast.error('Failed to decrypt credentials. Check your password.')
      console.error('Decryption error:', error)
    }
  }

  const handleDecryptImport = async (encryptionPassword: string) => {
    if (!importedEncryptedData) {
      toast.error('No encrypted import data found')
      return
    }

    try {
      const decrypted = await decryptData(importedEncryptedData, encryptionPassword)
      const data = JSON.parse(decrypted)
      
      if (!data.tokens || !Array.isArray(data.tokens)) {
        throw new Error('Invalid token configuration file')
      }

      setSavedTokens((current = []) => {
        const existingIds = new Set(current.map(t => t.id))
        const newTokens = data.tokens.filter((t: TokenConfig) => !existingIds.has(t.id))
        return [...current, ...newTokens]
      })

      toast.success(`Imported ${data.tokens.length} token configuration(s)`)
    } catch (error) {
      toast.error('Failed to decrypt import. Check your password.')
      console.error('Decryption error:', error)
    }
  }

  const handleLoadForGenerate = async (token: TokenConfig) => {
    if (token.isEncrypted) {
      setTokenToDecrypt(token)
      setPendingAction('load')
      setShowDecryptDialog(true)
    } else {
      setClientId(token.clientId)
      setClientSecret(token.clientSecret)
      setUsername(token.username)
      setPassword(token.password)
      await handleGenerateTokenDirect(
        token.endpoint, 
        token.clientId, 
        token.clientSecret, 
        token.username, 
        token.password,
        token.useFormEncoded || false,
        token.useJWTExpiration || false
      )
    }
  }

  const handleGenerateTokenDirect = async (ep: string, cid: string, csecret: string, uname: string, pwd: string, formEncoded = false, jwtExp = false) => {
    setIsGenerating(true)

    try {
      let headers: Record<string, string> = {}
      let body: string

      if (formEncoded) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        const params = new URLSearchParams()
        params.append('grant_type', 'password')
        params.append('client_id', cid)
        params.append('client_secret', csecret)
        params.append('username', uname)
        params.append('password', pwd)
        body = params.toString()
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({
          client_id: cid,
          client_secret: csecret,
          username: uname,
          password: pwd
        })
      }

      const response = await fetch(ep, {
        method: 'POST',
        headers,
        body
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const token = data.access_token || data.token
      if (!token) {
        throw new Error('No access token in response')
      }

      let expiresAt = Date.now() + (15 * 60 * 1000)
      
      if (jwtExp) {
        const jwtExpTime = getJWTExpiration(token)
        if (jwtExpTime) {
          expiresAt = jwtExpTime
        }
      } else if (data.expires_in) {
        expiresAt = Date.now() + (data.expires_in * 1000)
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt
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

  const handleGenerateToken = async () => {
    if (!endpoint || !clientId || !clientSecret || !username || !password) {
      toast.error('All fields are required')
      return
    }

    setIsGenerating(true)

    try {
      let headers: Record<string, string> = {}
      let body: string

      if (useFormEncoded) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded'
        const params = new URLSearchParams()
        params.append('grant_type', 'password')
        params.append('client_id', clientId)
        params.append('client_secret', clientSecret)
        params.append('username', username)
        params.append('password', password)
        body = params.toString()
      } else {
        headers['Content-Type'] = 'application/json'
        body = JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          username,
          password
        })
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const token = data.access_token || data.token
      if (!token) {
        throw new Error('No access token in response')
      }

      let expiresAt = Date.now() + (15 * 60 * 1000)
      
      if (useJWTExpiration) {
        const jwtExp = getJWTExpiration(token)
        if (jwtExp) {
          expiresAt = jwtExp
        }
      } else if (data.expires_in) {
        expiresAt = Date.now() + (data.expires_in * 1000)
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt
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
    if (!name || !endpoint || !clientId || !clientSecret || !username || !password) {
      toast.error('All fields are required to save')
      return
    }

    if (encryptOnSave) {
      setPendingAction('save')
      setShowEncryptDialog(true)
    } else {
      const tokenId = selectedTokenId || Date.now().toString()
      const newToken: TokenConfig = {
        id: tokenId,
        name,
        endpoint,
        clientId,
        clientSecret,
        username,
        password,
        isEncrypted: false,
        useFormEncoded,
        useJWTExpiration
      }

      setSavedTokens((current = []) => {
        const existing = current.find(t => t.id === tokenId)
        if (existing) {
          return current.map(t => t.id === tokenId ? newToken : t)
        }
        return [...current, newToken]
      })

      setSelectedTokenId(tokenId)
      toast.success(selectedToken ? 'Token updated (unencrypted)' : 'Token saved (unencrypted)', {
        description: 'Warning: Credentials stored in plaintext'
      })
      setShowForm(false)
    }
  }

  const handleDeleteToken = () => {
    if (!selectedTokenId) return

    setSavedTokens((current = []) => current.filter(t => t.id !== selectedTokenId))
    setSelectedTokenId(null)
    setName('')
    setEndpoint('')
    setClientId('')
    setClientSecret('')
    setUsername('')
    setPassword('')
    toast.success('Token configuration deleted')
  }

  const handleNewToken = () => {
    setSelectedTokenId(null)
    setName('')
    setEndpoint('')
    setClientId('')
    setClientSecret('')
    setUsername('')
    setPassword('')
    setUseFormEncoded(false)
    setUseJWTExpiration(false)
    setShowForm(true)
  }

  const handleSelectToken = (tokenId: string) => {
    setSelectedTokenId(tokenId)
    setShowForm(false)
  }

  const handleUpdateConfiguration = () => {
    if (selectedToken?.isEncrypted) {
      setTokenToDecrypt(selectedToken)
      setPendingAction('load')
      setShowDecryptDialog(true)
    } else {
      setShowForm(true)
    }
  }

  const handleClearToken = () => {
    setAccessToken(null)
    toast.success('Token cleared')
  }

  const handleExportWithEncryption = async (encryptionPassword: string) => {
    if (!savedTokens || savedTokens.length === 0) {
      toast.error('No saved tokens to export')
      return
    }

    try {
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        encrypted: true,
        tokens: savedTokens
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const encrypted = await encryptData(dataStr, encryptionPassword)

      const encryptedExport = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        encrypted: true,
        data: encrypted
      }

      const dataBlob = new Blob([JSON.stringify(encryptedExport, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      const filename = `token-configs-encrypted-${Date.now()}.json`
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Encrypted export downloaded!', {
        description: `${filename} - Requires password to decrypt`,
        duration: 5000
      })
    } catch (error) {
      toast.error('Failed to encrypt export')
      console.error('Encryption error:', error)
    }
  }

  const handleExportTokens = () => {
    if (!savedTokens || savedTokens.length === 0) {
      toast.error('No saved tokens to export')
      return
    }

    if (encryptOnExport) {
      setPendingAction('export')
      setShowEncryptDialog(true)
      return
    }
    if (!savedTokens || savedTokens.length === 0) {
      toast.error('No saved tokens to export')
      return
    }

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tokens: savedTokens
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    const filename = `token-configs-${Date.now()}.json`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Download started!', {
      description: `${filename} - Check your Downloads folder. Contains plaintext credentials!`,
      duration: 5000
    })
  }

  const handleImportTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (data.encrypted === true && data.data) {
          setImportedEncryptedData(data.data)
          setPendingAction('import')
          setShowDecryptImportDialog(true)
          return
        }
        
        if (!data.tokens || !Array.isArray(data.tokens)) {
          throw new Error('Invalid token configuration file')
        }

        setSavedTokens((current = []) => {
          const existingIds = new Set(current.map(t => t.id))
          const newTokens = data.tokens.filter((t: TokenConfig) => !existingIds.has(t.id))
          return [...current, ...newTokens]
        })

        toast.success(`Imported ${data.tokens.length} token configuration(s)`)
      } catch (error) {
        toast.error('Failed to import token configurations')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    event.target.value = ''
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
                    <span className="flex items-center gap-2">
                      {token.name}
                      {token.isEncrypted && (
                        <Lock size={12} className="text-accent" weight="fill" />
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTokenId && !showForm && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleUpdateConfiguration}
                  className="flex-shrink-0"
                  title="Update Configuration"
                >
                  <PencilSimple size={18} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDeleteToken}
                  className="flex-shrink-0"
                  title="Delete Configuration"
                >
                  <Trash size={18} />
                </Button>
              </>
            )}
            {!selectedTokenId && !showForm && (
              <Button
                variant="default"
                onClick={handleNewToken}
                className="flex-shrink-0"
              >
                <Plus size={18} className="mr-2" />
                Add New Configuration
              </Button>
            )}
          </div>

          {showForm && (
            <div className="space-y-4 border border-border rounded-lg p-4 bg-card">
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

              <div className="space-y-2">
                <Label htmlFor="client-secret">Client Secret</Label>
                <Input
                  id="client-secret"
                  type="password"
                  placeholder="your-client-secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
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

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="use-form-encoded" className="text-sm font-semibold cursor-pointer">
                      Use Form-Encoded Request
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Send as application/x-www-form-urlencoded instead of JSON
                    </p>
                  </div>
                  <Switch
                    id="use-form-encoded"
                    checked={useFormEncoded}
                    onCheckedChange={setUseFormEncoded}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="use-jwt-expiration" className="text-sm font-semibold cursor-pointer">
                      Use JWT Expiration
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Parse token 'exp' claim instead of using expires_in (15 min default)
                    </p>
                  </div>
                  <Switch
                    id="use-jwt-expiration"
                    checked={useJWTExpiration}
                    onCheckedChange={setUseJWTExpiration}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className={encryptOnSave ? 'text-accent' : 'text-muted-foreground'} />
                  <div className="flex flex-col">
                    <Label htmlFor="encrypt-on-save" className="text-sm font-semibold cursor-pointer">
                      Encrypt Before Saving
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Encrypt credentials with a password
                    </p>
                  </div>
                </div>
                <Switch
                  id="encrypt-on-save"
                  checked={encryptOnSave}
                  onCheckedChange={setEncryptOnSave}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveToken}
                  disabled={!name || !endpoint || !clientId || !clientSecret || !username || !password}
                  variant="outline"
                  className="flex-1"
                >
                  <FloppyDisk size={18} className="mr-2" />
                  {selectedToken ? 'Update' : 'Save'} Configuration
                </Button>
                
                <Button
                  onClick={handleGenerateToken}
                  disabled={isGenerating || !endpoint || !clientId || !clientSecret || !username || !password}
                  className="flex-1"
                >
                  {isGenerating ? 'Generating...' : 'Generate Token'}
                </Button>
              </div>

              {selectedToken && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              )}
            </div>
          )}

          {selectedToken && !showForm && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {selectedToken.name}
                  {selectedToken.isEncrypted && (
                    <Lock size={14} className="text-accent" weight="fill" />
                  )}
                </CardTitle>
                <CardDescription className="text-xs break-all">
                  {selectedToken.endpoint}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedToken.isEncrypted ? (
                  <Alert className="mb-3 border-accent/50 bg-accent/10">
                    <Lock size={16} className="text-accent" />
                    <AlertDescription className="text-xs ml-2">
                      Encrypted credentials - password required to generate token
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive" className="mb-3">
                    <LockOpen size={16} />
                    <AlertDescription className="text-xs ml-2">
                      Unencrypted credentials - stored in plaintext
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={() => selectedToken.isEncrypted ? handleLoadForGenerate(selectedToken) : handleGenerateToken()}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Token'}
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2">
                <Lock size={18} className={encryptOnExport ? 'text-accent' : 'text-muted-foreground'} />
                <div className="flex flex-col">
                  <Label htmlFor="encrypt-on-export" className="text-sm font-semibold cursor-pointer">
                    Encrypt Exports
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Password-protect exported JSON files
                  </p>
                </div>
              </div>
              <Switch
                id="encrypt-on-export"
                checked={encryptOnExport}
                onCheckedChange={setEncryptOnExport}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleExportTokens}
                disabled={!savedTokens || savedTokens.length === 0}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Export size={16} className="mr-2" />
                Export All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => document.getElementById('import-tokens')?.click()}
              >
                <Download size={16} className="mr-2" />
                Import
              </Button>
              <input
                id="import-tokens"
                type="file"
                accept=".json"
                onChange={handleImportTokens}
                className="hidden"
              />
            </div>
            {!encryptOnExport && (
              <Alert variant="destructive">
                <Warning size={16} />
                <AlertDescription className="text-xs ml-2">
                  Warning: Exports will contain plaintext credentials. Enable encryption for security.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Alert className="border-accent/50 bg-accent/5">
            <ShieldCheck size={18} className="text-accent" />
            <AlertTitle className="text-sm font-semibold">Client-Side Encryption</AlertTitle>
            <AlertDescription className="text-xs">
              Credentials are encrypted using AES-256-GCM with PBKDF2 key derivation (100,000 iterations). Encryption happens entirely in your browser - passwords never leave your device.
            </AlertDescription>
          </Alert>
        </div>

        <EncryptionPasswordDialog
          open={showEncryptDialog}
          onOpenChange={setShowEncryptDialog}
          onConfirm={handleEncryptionPassword}
          mode="encrypt"
        />

        <EncryptionPasswordDialog
          open={showDecryptDialog}
          onOpenChange={setShowDecryptDialog}
          onConfirm={handleEncryptionPassword}
          mode="decrypt"
        />

        <EncryptionPasswordDialog
          open={showDecryptImportDialog}
          onOpenChange={setShowDecryptImportDialog}
          onConfirm={handleEncryptionPassword}
          mode="decrypt"
          title="Decrypt Import"
          description="Enter the password used to encrypt this export file"
        />
      </DialogContent>
    </Dialog>
  )
}
