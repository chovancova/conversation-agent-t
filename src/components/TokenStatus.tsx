import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, Warning, CheckCircle, ArrowsClockwise } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { AccessToken, TokenConfig, AutoRefreshConfig } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type TokenStatusProps = {
  onOpenTokenManager: () => void
  isExpanded: boolean
  onToggle: () => void
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
  const [isGenerating, setIsGenerating] = useState(false)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()
  const { minutes, seconds } = useCountdown(accessToken?.expiresAt || null)
  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)

  const generateToken = async (isAutoRefresh = false) => {
    if (!selectedToken) {
      if (!isAutoRefresh) {
        onOpenTokenManager()
      }
      return false
    }

    setIsGenerating(true)

    try {
      const response = await fetch(selectedToken.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: selectedToken.clientId,
          client_secret: selectedToken.clientSecret,
          username: selectedToken.username,
          password: selectedToken.password
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
      }

      if (!isAutoRefresh) {
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

  const handleGenerateToken = () => generateToken(false)

  const handleToggleAutoRefresh = (enabled: boolean) => {
    if (enabled && !selectedToken) {
      toast.error('Please select a token configuration first')
      return
    }

    setAutoRefreshConfig((current = { enabled: false, maxRefreshes: 10, currentRefreshes: 0, startTime: null }) => ({
      ...current,
      enabled,
      currentRefreshes: 0,
      startTime: enabled ? Date.now() : null
    }))

    if (enabled && !isTokenValid) {
      generateToken(false)
    }
  }

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

      refreshIntervalRef.current = setInterval(() => {
        const timeUntilExpiry = (accessToken?.expiresAt || 0) - Date.now()
        
        if (timeUntilExpiry <= 60000 && timeUntilExpiry > 0) {
          if (autoRefreshConfig.currentRefreshes < autoRefreshConfig.maxRefreshes) {
            generateToken(true)
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
  }, [autoRefreshConfig?.enabled, autoRefreshConfig?.currentRefreshes, accessToken?.expiresAt, selectedToken])

  return (
    <div className="w-1/2">
      <Card 
        className={cn(
          "border cursor-pointer transition-all",
          isTokenValid ? "border-accent/30 bg-accent/5" : "border-destructive/30 bg-destructive/5"
        )}
        onClick={onToggle}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isTokenValid ? (
                  <CheckCircle size={16} weight="fill" className="text-accent flex-shrink-0" />
                ) : (
                  <Warning size={16} weight="fill" className="text-destructive flex-shrink-0" />
                )}
                <span className="text-sm font-medium">
                  {isTokenValid ? 'Token Active' : 'Token Expired'}
                </span>
              </div>
              <Key size={14} className="text-muted-foreground" />
            </div>

            {isExpanded && (
              <div className="space-y-3 pt-1" onClick={(e) => e.stopPropagation()}>
                {isTokenValid && (
                  <div className="text-xs text-muted-foreground">
                    Expires in {minutes}m {seconds}s
                  </div>
                )}
                
                {!isTokenValid && !selectedToken && (
                  <p className="text-xs text-muted-foreground">
                    No token configuration selected
                  </p>
                )}

                <Button
                  onClick={handleGenerateToken}
                  disabled={isGenerating || !selectedToken}
                  size="sm"
                  variant="default"
                  className="w-full h-8"
                >
                  {isGenerating ? (
                    'Generating...'
                  ) : (
                    <>
                      <ArrowsClockwise size={14} className="mr-1" />
                      Refresh Token
                    </>
                  )}
                </Button>

                {selectedToken && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Label htmlFor="auto-refresh" className="text-xs font-normal cursor-pointer">
                      Auto-refresh ({autoRefreshConfig?.currentRefreshes || 0}/{autoRefreshConfig?.maxRefreshes || 10})
                    </Label>
                    <Switch
                      id="auto-refresh"
                      checked={autoRefreshConfig?.enabled || false}
                      onCheckedChange={handleToggleAutoRefresh}
                      disabled={isGenerating}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
