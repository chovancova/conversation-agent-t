import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, Warning, CheckCircle, ArrowsClockwise, Lock, Gear } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AccessToken, TokenConfig, AutoRefreshConfig } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { EncryptionPasswordDialog } from '@/components/EncryptionPasswordDialog'
import { decryptData } from '@/lib/encryption'
import { SoundPreferences, DEFAULT_SOUND_PREFERENCES, playNotificationSound } from '@/lib/sound'

type TokenStatusProps = {
  onOpenTokenManager: () => void
  isExpanded: boolean
  onToggle: () => void
}

type DecryptedCredentials = {
  clientId: string
  clientSecret: string
  username: string
  password: string
}

export function TokenStatus({ onOpenTokenManager, isExpanded, onToggle }: TokenStatusProps) {
  const [accessToken, setAccessToken] = useKV<AccessToken | null>('access-token', null)
  const [savedTokens] = useKV<TokenConfig[]>('saved-tokens', [])
  const [selectedTokenId] = useKV<string | null>('selected-token-id', null)
  const [autoRefreshConfig, setAutoRefreshConfig] = useKV<AutoRefreshConfig>('auto-refresh-config', {
    enabled: false,
    maxRefreshes: 10,
    currentRefreshes: 0,
    startTime: null
  })
  const [soundPreferences] = useKV<SoundPreferences>('sound-preferences', DEFAULT_SOUND_PREFERENCES)
  const [decryptedCredentials, setDecryptedCredentials] = useKV<DecryptedCredentials | null>('decrypted-credentials-cache', null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDecryptDialog, setShowDecryptDialog] = useState(false)
  const [pendingAction, setPendingAction] = useState<'generate' | 'auto-refresh-enable' | null>(null)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const soundPlayedRef = useRef<{
    fiveMinutes: boolean
    twoMinutes: boolean
    oneMinute: boolean
    thirtySeconds: boolean
  }>({
    fiveMinutes: false,
    twoMinutes: false,
    oneMinute: false,
    thirtySeconds: false
  })

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()
  const { minutes, seconds } = useCountdown(accessToken?.expiresAt || null)
  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)

  const generateToken = async (credentials: DecryptedCredentials, endpoint: string, isAutoRefresh = false) => {
    setIsGenerating(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: credentials.clientId,
          client_secret: credentials.clientSecret,
          username: credentials.username,
          password: credentials.password
        })
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status}`)
      }

      const data = await response.json()
      const token = data.access_token || data.token
      
      if (!token) {
        throw new Error('No access token in response')
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt: Date.now() + (15 * 60 * 1000),
        refreshCount: (accessToken?.refreshCount || 0) + (isAutoRefresh ? 1 : 0),
        generatedAt: Date.now()
      }

      setAccessToken(newAccessToken)
      
      if (isAutoRefresh) {
        setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
          ...current,
          currentRefreshes: current.currentRefreshes + 1
        }))
        toast.success(`Token auto-refreshed (${(autoRefreshConfig?.currentRefreshes || 0) + 1}/${autoRefreshConfig?.maxRefreshes || 10})`, { duration: 2000 })
      } else {
        toast.success('Token generated successfully')
      }
      
      return true
    } catch (error) {
      console.error('Token generation error:', error)
      if (!isAutoRefresh) {
        toast.error('Failed to generate token')
        onOpenTokenManager()
      } else {
        setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
          ...current,
          enabled: false
        }))
        toast.error('Auto-refresh failed. Please generate token manually.')
      }
      return false
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDecryptAndGenerate = async (password: string) => {
    if (!selectedToken) return

    try {
      const encryptedData = {
        encrypted: selectedToken.clientId,
        iv: selectedToken.clientSecret,
        salt: selectedToken.username
      }

      const decrypted = await decryptData(encryptedData, password)
      const credentials: DecryptedCredentials = JSON.parse(decrypted)

      setDecryptedCredentials(credentials)

      if (pendingAction === 'generate') {
        await generateToken(credentials, selectedToken.endpoint, false)
      } else if (pendingAction === 'auto-refresh-enable') {
        setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
          ...current,
          enabled: true,
          currentRefreshes: 0,
          startTime: Date.now()
        }))
        
        if (!isTokenValid) {
          await generateToken(credentials, selectedToken.endpoint, false)
        }
      }

      toast.success('Credentials decrypted and cached for auto-refresh')
    } catch (error) {
      toast.error('Failed to decrypt credentials. Check your password.')
      console.error('Decryption error:', error)
    } finally {
      setShowDecryptDialog(false)
      setPendingAction(null)
    }
  }

  const handleGenerateToken = () => {
    if (!selectedToken) {
      onOpenTokenManager()
      return
    }

    if (selectedToken.isEncrypted) {
      if (decryptedCredentials) {
        generateToken(decryptedCredentials, selectedToken.endpoint, false)
      } else {
        setPendingAction('generate')
        setShowDecryptDialog(true)
      }
    } else {
      const credentials: DecryptedCredentials = {
        clientId: selectedToken.clientId,
        clientSecret: selectedToken.clientSecret,
        username: selectedToken.username,
        password: selectedToken.password
      }
      generateToken(credentials, selectedToken.endpoint, false)
    }
  }

  const handleToggleAutoRefresh = (enabled: boolean) => {
    if (enabled && !selectedToken) {
      toast.error('Please select a token configuration first')
      return
    }

    if (!enabled) {
      setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
        ...current,
        enabled: false
      }))
      return
    }

    if (selectedToken?.isEncrypted && !decryptedCredentials) {
      setPendingAction('auto-refresh-enable')
      setShowDecryptDialog(true)
      return
    }

    setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
      ...current,
      enabled: true,
      currentRefreshes: 0,
      startTime: Date.now()
    }))

    if (!isTokenValid) {
      const credentials = selectedToken?.isEncrypted 
        ? decryptedCredentials! 
        : {
            clientId: selectedToken!.clientId,
            clientSecret: selectedToken!.clientSecret,
            username: selectedToken!.username,
            password: selectedToken!.password
          }
      generateToken(credentials, selectedToken!.endpoint, false)
    }
  }

  useEffect(() => {
    if (selectedToken?.id !== selectedTokenId && decryptedCredentials) {
      setDecryptedCredentials(null)
    }
  }, [selectedTokenId])

  useEffect(() => {
    if (!accessToken || !accessToken.expiresAt || !isTokenValid) {
      soundPlayedRef.current = {
        fiveMinutes: false,
        twoMinutes: false,
        oneMinute: false,
        thirtySeconds: false
      }
      return
    }

    const prefs = soundPreferences || DEFAULT_SOUND_PREFERENCES
    if (!prefs.enabled || prefs.sound === 'none') return

    const checkInterval = setInterval(() => {
      const timeRemaining = accessToken.expiresAt - Date.now()
      
      if (timeRemaining <= 300000 && timeRemaining > 299000 && 
          prefs.warningIntervals.fiveMinutes && !soundPlayedRef.current.fiveMinutes) {
        playNotificationSound(prefs.sound, prefs.volume)
        soundPlayedRef.current.fiveMinutes = true
        toast.warning('Token expires in 5 minutes', { duration: 3000 })
      }
      
      if (timeRemaining <= 120000 && timeRemaining > 119000 && 
          prefs.warningIntervals.twoMinutes && !soundPlayedRef.current.twoMinutes) {
        playNotificationSound(prefs.sound, prefs.volume)
        soundPlayedRef.current.twoMinutes = true
        toast.warning('Token expires in 2 minutes', { duration: 3000 })
      }
      
      if (timeRemaining <= 60000 && timeRemaining > 59000 && 
          prefs.warningIntervals.oneMinute && !soundPlayedRef.current.oneMinute) {
        playNotificationSound(prefs.sound, prefs.volume)
        soundPlayedRef.current.oneMinute = true
        toast.warning('Token expires in 1 minute!', { duration: 4000 })
      }
      
      if (timeRemaining <= 30000 && timeRemaining > 29000 && 
          prefs.warningIntervals.thirtySeconds && !soundPlayedRef.current.thirtySeconds) {
        playNotificationSound(prefs.sound, prefs.volume)
        soundPlayedRef.current.thirtySeconds = true
        toast.error('Token expires in 30 seconds!', { duration: 5000 })
      }
    }, 1000)

    return () => clearInterval(checkInterval)
  }, [accessToken, soundPreferences, isTokenValid])

  useEffect(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }

    if (autoRefreshConfig?.enabled && selectedToken) {
      if (autoRefreshConfig.currentRefreshes >= autoRefreshConfig.maxRefreshes) {
        setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
          ...current,
          enabled: false
        }))
        toast.warning(`Auto-refresh stopped after ${autoRefreshConfig.maxRefreshes} refreshes`)
        return
      }

      if (selectedToken.isEncrypted && !decryptedCredentials) {
        setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
          ...current,
          enabled: false
        }))
        toast.error('Auto-refresh disabled: encrypted credentials not available')
        return
      }

      refreshIntervalRef.current = setInterval(() => {
        const timeUntilExpiry = (accessToken?.expiresAt || 0) - Date.now()
        
        if (timeUntilExpiry <= 60000 && timeUntilExpiry > 0) {
          if (autoRefreshConfig.currentRefreshes < autoRefreshConfig.maxRefreshes) {
            const credentials = selectedToken.isEncrypted 
              ? decryptedCredentials! 
              : {
                  clientId: selectedToken.clientId,
                  clientSecret: selectedToken.clientSecret,
                  username: selectedToken.username,
                  password: selectedToken.password
                }
            generateToken(credentials, selectedToken.endpoint, true)
          } else {
            setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
              ...current,
              enabled: false
            }))
            toast.warning(`Auto-refresh stopped after ${autoRefreshConfig.maxRefreshes} refreshes`)
          }
        }
      }, 10000)
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefreshConfig?.enabled, autoRefreshConfig?.currentRefreshes, accessToken?.expiresAt, selectedToken, decryptedCredentials])

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <Card 
          className={cn(
            "border cursor-pointer transition-all",
            isTokenValid ? "border-accent/30 bg-accent/5" : "border-destructive/40 bg-destructive/10"
          )}
          onClick={onToggle}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-between h-5">
                    <div className="flex items-center gap-2.5">
                      {isTokenValid ? (
                        <CheckCircle size={18} weight="fill" className="text-accent flex-shrink-0" />
                      ) : (
                        <Warning size={18} weight="fill" className="text-destructive flex-shrink-0" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        isTokenValid ? "text-foreground" : "text-destructive"
                      )}>
                        {isTokenValid ? 'Token Active' : 'Token Expired'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {selectedToken?.isEncrypted && decryptedCredentials && (
                        <Lock size={14} className="text-accent" weight="fill" />
                      )}
                      <Key size={16} className={cn(
                        "transition-colors",
                        isTokenValid ? "text-muted-foreground" : "text-destructive/60"
                      )} />
                    </div>
                  </div>
                </TooltipTrigger>
                {!isTokenValid && !selectedToken && (
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-xs">No token configuration selected. Please set up a token in settings.</p>
                  </TooltipContent>
                )}
              </Tooltip>

              {isExpanded && (
              <div className="space-y-3 pt-0.5" onClick={(e) => e.stopPropagation()}>
                {isTokenValid && (
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-muted-foreground">Time remaining</span>
                    <span className={cn(
                      "text-xs font-medium tabular-nums",
                      minutes < 2 ? "text-destructive" : "text-accent"
                    )}>
                      {minutes}m {seconds}s
                    </span>
                  </div>
                )}
                
                {!isTokenValid && !selectedToken && (
                  <div className="px-2 py-2 bg-destructive/5 border border-destructive/20 rounded-md">
                    <p className="text-xs text-destructive/90 leading-relaxed">
                      No token configuration selected. Please set up a token in settings.
                    </p>
                  </div>
                )}

                {!isTokenValid && selectedToken && (
                  <div className="px-2 py-2 bg-destructive/5 border border-destructive/20 rounded-md">
                    <p className="text-xs text-destructive/90 leading-relaxed">
                      Your token has expired. Click below to generate a new one.
                    </p>
                  </div>
                )}

                {selectedToken?.isEncrypted && decryptedCredentials && (
                  <div className="px-2 py-1.5 bg-accent/10 border border-accent/30 rounded-md flex items-center gap-2">
                    <Lock size={14} className="text-accent flex-shrink-0" weight="fill" />
                    <p className="text-xs text-accent font-medium">
                      Credentials cached for auto-refresh
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleGenerateToken}
                  disabled={isGenerating || !selectedToken}
                  size="sm"
                  variant={isTokenValid ? "outline" : "default"}
                  className={cn(
                    "w-full h-9 text-sm",
                    !isTokenValid && "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isGenerating ? (
                    'Generating...'
                  ) : (
                    <>
                      <ArrowsClockwise size={16} className="mr-1.5" />
                      {isTokenValid ? 'Refresh Token' : 'Generate New Token'}
                    </>
                  )}
                </Button>

                {selectedToken && (
                  <>
                    <div className="flex items-center justify-between gap-2 px-1">
                      <Label htmlFor="auto-refresh" className="text-xs font-normal cursor-pointer text-muted-foreground">
                        Auto-refresh ({autoRefreshConfig?.currentRefreshes || 0}/{autoRefreshConfig?.maxRefreshes || 10})
                      </Label>
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              title="Configure max refreshes"
                            >
                              <Gear size={14} className="text-muted-foreground" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72" align="end">
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <Label htmlFor="max-refreshes" className="text-sm font-medium">
                                  Max Auto-Refreshes
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Maximum number of times to automatically refresh the token before stopping
                                </p>
                              </div>
                              <Input
                                id="max-refreshes"
                                type="number"
                                min={1}
                                max={999}
                                value={autoRefreshConfig?.maxRefreshes || 10}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value)
                                  if (value > 0 && value <= 999) {
                                    setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
                                      ...current,
                                      maxRefreshes: value
                                    }))
                                  }
                                }}
                                className="h-9"
                              />
                              <div className="pt-1">
                                <p className="text-xs text-muted-foreground">
                                  Token refreshes automatically when less than 1 minute remains
                                </p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Switch
                          id="auto-refresh"
                          checked={autoRefreshConfig?.enabled || false}
                          onCheckedChange={handleToggleAutoRefresh}
                          disabled={isGenerating}
                          className="scale-90"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      <EncryptionPasswordDialog
        open={showDecryptDialog}
        onOpenChange={setShowDecryptDialog}
        onConfirm={handleDecryptAndGenerate}
        mode="decrypt"
        title="Decrypt Credentials"
        description="Enter your encryption password to unlock credentials for token generation and auto-refresh."
      />
    </>
  )
}
