import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, X as XIcon, CheckCircle, XCircle, Clock, FloppyDisk, Trash, Export, Download, Warning, ShieldCheck, Plus, PencilSimple, Lock, LockOpen, ShieldWarning, CloudSlash, Certificate, Info, Keyboard } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { TokenConfig, AccessToken, ClientCertificateConfig } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { EncryptionPasswordDialog } from '@/components/EncryptionPasswordDialog'
import { encryptData, decryptData } from '@/lib/encryption'
import { getJWTExpiration } from '@/lib/jwt'
import { validateEndpointSecurity } from '@/lib/security'
import { ClientCertificateSetup } from '@/components/ClientCertificateSetup'
import { buildProxiedUrl, COMMON_CORS_PROXIES } from '@/lib/corsProxy'
import { CorsProxyValidator, ProxyProviderBadge } from '@/components/CorsProxyValidator'
import { ValidationRulesGuide } from '@/components/ValidationRulesGuide'
import { EndpointValidator } from '@/components/EndpointValidator'
import { validateEndpointComprehensive } from '@/lib/validation'

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
  const [ignoreCertErrors, setIgnoreCertErrors] = useState(false)
  const [proxyUrl, setProxyUrl] = useState('')
  const [corsProxy, setCorsProxy] = useState('')
  const [useCorsProxy, setUseCorsProxy] = useState(false)
  const [clientCertificate, setClientCertificate] = useState<ClientCertificateConfig>({
    enabled: false
  })
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
  const [showManualToken, setShowManualToken] = useState(false)
  const [manualToken, setManualToken] = useState('')
  const [manualTokenExpiration, setManualTokenExpiration] = useState('15')
  const [manualUseJWT, setManualUseJWT] = useState(true)

  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)
  const endpointValidation = endpoint ? validateEndpointComprehensive(endpoint) : null
  const corsProxyValidation = useCorsProxy && corsProxy

  useEffect(() => {
    if (selectedToken) {
      setName(selectedToken.name)
      setEndpoint(selectedToken.endpoint)
      setUseFormEncoded(selectedToken.useFormEncoded || false)
      setUseJWTExpiration(selectedToken.useJWTExpiration || false)
      setIgnoreCertErrors(selectedToken.ignoreCertErrors || false)
      setProxyUrl(selectedToken.proxyUrl || '')
      setCorsProxy(selectedToken.corsProxy || '')
      setUseCorsProxy(selectedToken.useCorsProxy || false)
      setClientCertificate(selectedToken.clientCertificate || { enabled: false })
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
        password,
        proxyUrl,
        corsProxy
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
        useJWTExpiration,
        ignoreCertErrors,
        proxyUrl: proxyUrl ? '••••••••' : '',
        corsProxy: corsProxy ? '••••••••' : '',
        useCorsProxy,
        clientCertificate: clientCertificate.enabled ? clientCertificate : undefined
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
      setProxyUrl(credentials.proxyUrl || '')
      setCorsProxy(credentials.corsProxy || '')
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
        token.useJWTExpiration || false,
        token.useCorsProxy || false,
        token.corsProxy || ''
      )
    }
  }

  const handleGenerateTokenDirect = async (ep: string, cid: string, csecret: string, uname: string, pwd: string, formEncoded = false, jwtExp = false, useCorsProxyFlag = false, corsProxyUrl = '') => {
    setIsGenerating(true)

    try {
      const finalEndpoint = useCorsProxyFlag && corsProxyUrl 
        ? buildProxiedUrl(ep, corsProxyUrl)
        : ep

      const headers: Record<string, string> = {}
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

      const response = await fetch(finalEndpoint, {
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
      let errorMessage = error instanceof Error ? error.message : 'Failed to generate token'
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
        errorMessage = 'CORS error: Enable "Use CORS Proxy" to bypass browser restrictions'
      }
      
      toast.error(errorMessage)
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
      const finalEndpoint = useCorsProxy && corsProxy 
        ? buildProxiedUrl(endpoint, corsProxy)
        : endpoint
      const headers: Record<string, string> = {}
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

      const response = await fetch(finalEndpoint, {
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate token'
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS')) {
        toast.error('CORS error: Enable "Use CORS Proxy" to bypass browser restrictions')
      } else {
        toast.error(errorMessage)
      }
      
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
        useJWTExpiration,
        ignoreCertErrors,
        proxyUrl,
        corsProxy,
        useCorsProxy,
        clientCertificate: clientCertificate.enabled ? clientCertificate : undefined
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
    setIgnoreCertErrors(false)
    setProxyUrl('')
    setCorsProxy('')
    setUseCorsProxy(false)
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

  const handleSetManualToken = () => {
    if (!manualToken || manualToken.trim().length === 0) {
      toast.error('Please enter a valid token')
      return
    }

    let expiresAt = Date.now() + (15 * 60 * 1000)

    if (manualUseJWT) {
      const jwtExp = getJWTExpiration(manualToken)
      if (jwtExp) {
        expiresAt = jwtExp
      } else {
        toast.warning('Could not parse JWT expiration, using custom duration')
        const minutes = parseInt(manualTokenExpiration) || 15
        expiresAt = Date.now() + (minutes * 60 * 1000)
      }
    } else {
      const minutes = parseInt(manualTokenExpiration) || 15
      expiresAt = Date.now() + (minutes * 60 * 1000)
    }

    const newAccessToken: AccessToken = {
      token: manualToken,
      expiresAt,
      generatedAt: Date.now()
    }

    setAccessToken(newAccessToken)
    setManualToken('')
    setShowManualToken(false)
    toast.success('Manual token set successfully', {
      description: `Expires in ${Math.round((expiresAt - Date.now()) / 60000)} minutes`
    })
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
            Generate and manage Bearer authentication tokens. Configure certificate validation and proxy settings for your network environment.
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
                    <XIcon size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/30 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Keyboard size={20} weight="duotone" className="text-primary" />
                Manual Token Entry
              </CardTitle>
              <CardDescription>
                Paste an existing Bearer token (OAuth2 JWT) directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showManualToken ? (
                <Button
                  onClick={() => setShowManualToken(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Manual Token
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="manual-token">Access Token (Bearer JWT)</Label>
                    <textarea
                      id="manual-token"
                      className="w-full min-h-[100px] p-3 text-xs font-mono bg-background border border-input rounded-md resize-y"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={manualToken}
                      onChange={(e) => setManualToken(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste your Bearer token (JWT format) here
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                    <div className="flex flex-col flex-1">
                      <Label htmlFor="manual-use-jwt" className="text-sm font-semibold cursor-pointer">
                        Auto-detect JWT Expiration
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Parse token 'exp' claim for expiration time
                      </p>
                    </div>
                    <Switch
                      id="manual-use-jwt"
                      checked={manualUseJWT}
                      onCheckedChange={setManualUseJWT}
                    />
                  </div>

                  {!manualUseJWT && (
                    <div className="space-y-2">
                      <Label htmlFor="manual-expiration">Token Expiration (minutes)</Label>
                      <Input
                        id="manual-expiration"
                        type="number"
                        min="1"
                        max="1440"
                        placeholder="15"
                        value={manualTokenExpiration}
                        onChange={(e) => setManualTokenExpiration(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Set how long until the token expires (default: 15 minutes)
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSetManualToken}
                      disabled={!manualToken || manualToken.trim().length === 0}
                      className="flex-1"
                    >
                      <Key size={16} className="mr-2" />
                      Set Token
                    </Button>
                    <Button
                      onClick={() => {
                        setShowManualToken(false)
                        setManualToken('')
                      }}
                      variant="ghost"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>

                  <Alert className="border-blue-500/50 bg-blue-500/5">
                    <Info size={16} className="text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>Manual Token Entry:</strong> Use this when you already have a Bearer token from another source. 
                      If the token is a JWT, we can auto-detect its expiration. Otherwise, set a custom expiration time.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="relative">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Or Generate Token
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedTokenId || 'new'} onValueChange={(value) => value === 'new' ? handleNewToken() : handleSelectToken(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select saved token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ New Token Configuration</SelectItem>
                {savedTokens?.filter(t => t && t.id).map(token => (
                  <SelectItem key={token.id} value={token.id}>
                    <span className="flex items-center gap-2">
                      {token?.name || 'Unnamed Token'}
                      {token?.isEncrypted && (
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
                {endpointValidation && (
                  <EndpointValidator result={endpointValidation} className="mt-2" />
                )}
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

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="ignore-cert-errors" className="text-sm font-semibold cursor-pointer">
                      Ignore Certificate Errors
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      For self-signed certificates or ERR_CERT_AUTHORITY_INVALID errors (dev only)
                    </p>
                  </div>
                  <Switch
                    id="ignore-cert-errors"
                    checked={ignoreCertErrors}
                    onCheckedChange={setIgnoreCertErrors}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proxy-url" className="text-sm font-semibold">
                    Proxy URL (Optional)
                  </Label>
                  <Input
                    id="proxy-url"
                    type="url"
                    placeholder="https://username:password@proxy.example.com:8080 or https://proxy.example.com:8080"
                    value={proxyUrl}
                    onChange={(e) => setProxyUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Configure a proxy server with optional embedded credentials (username:password@host)
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="use-cors-proxy" className="text-sm font-semibold cursor-pointer">
                      Use CORS Proxy
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Route requests through a CORS proxy to bypass browser CORS restrictions
                    </p>
                  </div>
                  <Switch
                    id="use-cors-proxy"
                    checked={useCorsProxy}
                    onCheckedChange={setUseCorsProxy}
                  />
                </div>

                {useCorsProxy && (
                  <div className="space-y-2">
                    <Label htmlFor="cors-proxy-select" className="text-sm font-semibold">
                      Select CORS Proxy
                    </Label>
                    <Select
                      value={corsProxy || 'custom'}
                      onValueChange={(value) => {
                        if (value !== 'custom') {
                          setCorsProxy(value)
                        }
                      }}
                    >
                      <SelectTrigger id="cors-proxy-select">
                        <SelectValue placeholder="Select a CORS proxy..." />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_CORS_PROXIES.map((proxy) => (
                          <SelectItem key={proxy.name} value={proxy.url || 'custom'}>
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium">{proxy.name}</span>
                                  <ProxyProviderBadge 
                                    requiresAuth={proxy.requiresAuth}
                                    isLocal={proxy.url.includes('localhost')}
                                    isPremium={proxy.requiresAuth && !proxy.url.includes('localhost')}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">{proxy.description}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cors-proxy" className="text-sm font-semibold">
                        CORS Proxy URL
                      </Label>
                      <Input
                        id="cors-proxy"
                        type="url"
                        placeholder="https://cors-anywhere.herokuapp.com/ or custom URL"
                        value={corsProxy}
                        onChange={(e) => setCorsProxy(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Target URL will be appended to this proxy URL. Can include credentials (username:password@host)
                      </p>
                      
                      {corsProxy && (
                        <CorsProxyValidator 
                          proxyUrl={corsProxy}
                          requiresAuth={false}
                          className="mt-2"
                        />
                      )}
                    </div>
                    
                    <Alert className="border-blue-500/50 bg-blue-500/5">
                      <Info size={16} className="text-blue-600" />
                      <AlertDescription className="text-xs text-blue-800 dark:text-blue-300">
                        <div className="font-semibold mb-2">Available CORS Proxy Providers:</div>
                        <div className="space-y-1">
                          {COMMON_CORS_PROXIES.filter(p => p.url).slice(0, 7).map((proxy, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <ProxyProviderBadge 
                                requiresAuth={proxy.requiresAuth}
                                isLocal={proxy.url.includes('localhost')}
                                isPremium={proxy.requiresAuth && !proxy.url.includes('localhost')}
                              />
                              <span className="flex-1">{proxy.name}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-blue-500/20">
                          <div className="font-semibold mb-1">With Credentials:</div>
                          <code className="text-[10px]">https://user:pass@proxy.example.com/</code>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </div>

              {(ignoreCertErrors || proxyUrl || useCorsProxy) && (
                <Alert className="border-amber-500/50 bg-amber-500/10">
                  <Warning size={16} className="text-amber-500" />
                  <AlertTitle className="text-sm font-semibold text-amber-900 dark:text-amber-200">Browser & Network Notes</AlertTitle>
                  <AlertDescription className="text-xs text-amber-900 dark:text-amber-200">
                    {ignoreCertErrors && <div>• Certificate validation is controlled by the browser. Self-signed certificates may still be blocked.</div>}
                    {proxyUrl && <div>• Proxy settings are informational only. Browser fetch API uses system proxy settings automatically.</div>}
                    {useCorsProxy && <div>• CORS Proxy routes your requests through a third-party server to bypass browser CORS restrictions.</div>}
                    <div className="mt-1 font-semibold">💡 This is a client-side app - all requests come from your browser, not a server.</div>
                  </AlertDescription>
                </Alert>
              )}

              <Accordion type="single" collapsible className="border rounded-lg">
                <AccordionItem value="certificate" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Certificate size={16} className="text-muted-foreground" />
                      <span className="text-sm font-semibold">Client Certificate (mTLS)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ClientCertificateSetup
                      value={clientCertificate}
                      onChange={setClientCertificate}
                    />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="validation-rules" className="border-none border-t">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-muted-foreground" />
                      <span className="text-sm font-semibold">Validation Rules & Guidelines</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ValidationRulesGuide />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

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
            <AlertTitle className="text-sm font-semibold">100% Client-Side Application</AlertTitle>
            <AlertDescription className="text-xs space-y-1">
              <p>
                <strong>All data stays in your browser.</strong> Credentials are encrypted using AES-256-GCM with PBKDF2 
                key derivation (100,000 iterations). Encryption happens entirely in your browser - passwords never leave your device.
              </p>
              <p className="text-muted-foreground pt-1">
                ⚠️ Certificate validation and proxy settings are controlled by your browser's security policies. 
                See the "Client-Side Only" info panel for details on handling certificate errors.
              </p>
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
