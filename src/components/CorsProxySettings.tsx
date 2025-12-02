import { useState, useEffect } from 'react'
import { CloudSlash, CheckCircle, Warning, Info, ShieldWarning, TestTube, Copy, Eye, EyeSlash, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { COMMON_CORS_PROXIES, buildProxiedUrl, sanitizeProxyUrlForDisplay, buildProxyUrlWithCredentials, extractCredentialsFromProxyUrl } from '@/lib/corsProxy'
import { CorsProxyValidator, ProxyProviderBadge } from '@/components/CorsProxyValidator'
import { validateProxyConfiguration, validateUrl } from '@/lib/validation'
import { CorsProxyQuickGuide } from '@/components/CorsProxyQuickGuide'

type CorsProxySettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentProxyUrl: string
  onSave: (config: {
    useCorsProxy: boolean
    corsProxy: string
    proxyUsername?: string
    proxyPassword?: string
  }) => void
  testEndpoint?: string
}

export function CorsProxySettings({ 
  open, 
  onOpenChange, 
  currentProxyUrl,
  onSave,
  testEndpoint 
}: CorsProxySettingsProps) {
  const [useCorsProxy, setUseCorsProxy] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>('custom')
  const [customProxyUrl, setCustomProxyUrl] = useState('')
  const [proxyUsername, setProxyUsername] = useState('')
  const [proxyPassword, setProxyPassword] = useState('')
  const [showProxyPassword, setShowProxyPassword] = useState(false)
  const [requiresAuth, setRequiresAuth] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    if (open && currentProxyUrl) {
      setUseCorsProxy(true)
      
      const existingProvider = COMMON_CORS_PROXIES.find(p => 
        p.url && currentProxyUrl.includes(p.url)
      )
      
      if (existingProvider) {
        setSelectedProvider(existingProvider.name)
        setRequiresAuth(existingProvider.requiresAuth)
      } else {
        setSelectedProvider('custom')
        
        const { cleanUrl, credentials } = extractCredentialsFromProxyUrl(currentProxyUrl)
        setCustomProxyUrl(cleanUrl)
        
        if (credentials) {
          setProxyUsername(credentials.username)
          setProxyPassword(credentials.password)
          setRequiresAuth(true)
        }
      }
    }
  }, [open, currentProxyUrl])

  const handleProviderChange = (providerName: string) => {
    setSelectedProvider(providerName)
    setTestResult(null)
    
    const provider = COMMON_CORS_PROXIES.find(p => p.name === providerName)
    if (provider) {
      setRequiresAuth(provider.requiresAuth)
      if (!provider.requiresAuth) {
        setProxyUsername('')
        setProxyPassword('')
      }
      if (provider.url) {
        setCustomProxyUrl(provider.url)
      }
    }
  }

  const getEffectiveProxyUrl = () => {
    const provider = COMMON_CORS_PROXIES.find(p => p.name === selectedProvider)
    const baseUrl = provider?.url || customProxyUrl
    
    if (requiresAuth && proxyUsername && proxyPassword) {
      return buildProxyUrlWithCredentials(baseUrl, proxyUsername, proxyPassword)
    }
    
    return baseUrl
  }

  const handleTestProxy = async () => {
    const proxyUrl = getEffectiveProxyUrl()
    
    if (!proxyUrl) {
      toast.error('Please configure a proxy URL first')
      return
    }

    const validation = validateProxyConfiguration(proxyUrl, requiresAuth, proxyUsername, proxyPassword)
    if (!validation.valid) {
      toast.error('Invalid proxy configuration', {
        description: validation.errors[0]
      })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const targetUrl = testEndpoint || 'https://httpbin.org/get'
      const proxiedUrl = buildProxiedUrl(targetUrl, proxyUrl)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(proxiedUrl, {
        method: 'GET',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setTestResult({
          success: true,
          message: `Proxy is working! Response status: ${response.status}`
        })
        toast.success('Proxy test successful', {
          description: 'The CORS proxy is working correctly'
        })
      } else {
        setTestResult({
          success: false,
          message: `Proxy returned error: ${response.status} ${response.statusText}`
        })
        toast.warning('Proxy test returned error', {
          description: `Status: ${response.status}`
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setTestResult({
        success: false,
        message: `Proxy test failed: ${errorMessage}`
      })
      toast.error('Proxy test failed', {
        description: errorMessage
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSave = () => {
    if (useCorsProxy) {
      const proxyUrl = getEffectiveProxyUrl()
      
      if (!proxyUrl) {
        toast.error('Please select or enter a proxy URL')
        return
      }

      const validation = validateProxyConfiguration(proxyUrl, requiresAuth, proxyUsername, proxyPassword)
      if (!validation.valid) {
        toast.error('Invalid proxy configuration', {
          description: validation.errors[0]
        })
        return
      }
    }

    onSave({
      useCorsProxy,
      corsProxy: useCorsProxy ? getEffectiveProxyUrl() : '',
      proxyUsername: requiresAuth ? proxyUsername : undefined,
      proxyPassword: requiresAuth ? proxyPassword : undefined
    })

    toast.success('CORS proxy settings saved')
    onOpenChange(false)
  }

  const handleCopyUrl = () => {
    const url = getEffectiveProxyUrl()
    navigator.clipboard.writeText(url)
    toast.success('Proxy URL copied to clipboard')
  }

  const selectedProviderData = COMMON_CORS_PROXIES.find(p => p.name === selectedProvider)
  const effectiveProxyUrl = getEffectiveProxyUrl()
  const isCustom = selectedProvider === 'Custom Proxy'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudSlash size={24} weight="duotone" className="text-primary" />
            CORS Proxy Configuration
          </DialogTitle>
          <DialogDescription>
            Configure cross-origin request proxy to bypass CORS restrictions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable CORS Proxy</Label>
                    <p className="text-sm text-muted-foreground">
                      Route requests through a proxy to bypass CORS restrictions
                    </p>
                  </div>
                  <Switch
                    checked={useCorsProxy}
                    onCheckedChange={setUseCorsProxy}
                  />
                </div>

                {useCorsProxy && (
                  <>
                    <Separator />

                    <div className="space-y-2">
                      <Label>Proxy Provider</Label>
                      <Select value={selectedProvider} onValueChange={handleProviderChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_CORS_PROXIES.map((provider) => (
                            <SelectItem key={provider.name} value={provider.name}>
                              <div className="flex items-center gap-2">
                                <span>{provider.name}</span>
                                {provider.requiresAuth && (
                                  <Badge variant="secondary" className="text-xs">Auth</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedProviderData && (
                        <p className="text-xs text-muted-foreground">
                          {selectedProviderData.description}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proxy-url">Proxy URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="proxy-url"
                          value={customProxyUrl}
                          onChange={(e) => setCustomProxyUrl(e.target.value)}
                          placeholder="https://cors-proxy.example.com/"
                          disabled={!isCustom && selectedProviderData?.url !== ''}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyUrl}
                          disabled={!effectiveProxyUrl}
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                      {effectiveProxyUrl && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Display: {sanitizeProxyUrlForDisplay(effectiveProxyUrl)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">Proxy Requires Authentication</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable if your proxy requires username/password
                        </p>
                      </div>
                      <Switch
                        checked={requiresAuth}
                        onCheckedChange={setRequiresAuth}
                      />
                    </div>

                    {requiresAuth && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="proxy-username">Proxy Username</Label>
                          <Input
                            id="proxy-username"
                            value={proxyUsername}
                            onChange={(e) => setProxyUsername(e.target.value)}
                            placeholder="proxy_username"
                            autoComplete="off"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="proxy-password">Proxy Password</Label>
                          <div className="flex gap-2">
                            <Input
                              id="proxy-password"
                              type={showProxyPassword ? 'text' : 'password'}
                              value={proxyPassword}
                              onChange={(e) => setProxyPassword(e.target.value)}
                              placeholder="••••••••"
                              autoComplete="off"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setShowProxyPassword(!showProxyPassword)}
                            >
                              {showProxyPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                            </Button>
                          </div>
                        </div>

                        <Alert className="border-yellow-500/50 bg-yellow-500/5">
                          <ShieldWarning size={16} className="text-yellow-600 dark:text-yellow-500" weight="fill" />
                          <AlertTitle className="text-sm text-yellow-800 dark:text-yellow-300">
                            Security Notice
                          </AlertTitle>
                          <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-300">
                            Proxy credentials will be embedded in the URL. Ensure you trust the proxy provider and use HTTPS.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}

                    {effectiveProxyUrl && (
                      <CorsProxyValidator
                        proxyUrl={effectiveProxyUrl}
                        requiresAuth={requiresAuth}
                        username={proxyUsername}
                        password={proxyPassword}
                      />
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Label>Test Proxy</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={handleTestProxy}
                          disabled={isTesting || !effectiveProxyUrl}
                          className="flex-1"
                        >
                          <TestTube size={16} className="mr-2" weight="duotone" />
                          {isTesting ? 'Testing...' : 'Test Proxy'}
                        </Button>
                      </div>
                      {testResult && (
                        <Alert className={testResult.success ? 'border-accent/50 bg-accent/5' : 'border-destructive/50 bg-destructive/5'}>
                          {testResult.success ? (
                            <CheckCircle size={16} className="text-accent" weight="fill" />
                          ) : (
                            <Warning size={16} className="text-destructive" weight="fill" />
                          )}
                          <AlertDescription className="text-xs ml-2">
                            {testResult.message}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {COMMON_CORS_PROXIES.filter(p => p.name !== 'Custom Proxy').map((provider) => (
                  <Card 
                    key={provider.name} 
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedProvider === provider.name ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleProviderChange(provider.name)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{provider.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {provider.description}
                          </CardDescription>
                        </div>
                        <ProxyProviderBadge
                          requiresAuth={provider.requiresAuth}
                          isLocal={provider.url.includes('localhost')}
                          isPremium={provider.requiresAuth && !provider.url.includes('localhost')}
                        />
                      </div>
                    </CardHeader>
                    {provider.url && (
                      <CardContent className="pt-0">
                        <p className="text-xs font-mono text-muted-foreground break-all">
                          {provider.url}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <CorsProxyQuickGuide />
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
