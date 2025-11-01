import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Key, Warning, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AccessToken, TokenConfig } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@/lib/utils'

type TokenStatusProps = {
  onOpenTokenManager: () => void
  isExpanded: boolean
  onToggle: () => void
}

export function TokenStatus({ onOpenTokenManager, isExpanded, onToggle }: TokenStatusProps) {
  const [accessToken, setAccessToken] = useKV<AccessToken | null>('access-token', null)
  const [savedTokens] = useKV<TokenConfig[]>('saved-tokens', [])
  const [selectedTokenId] = useKV<string | null>('selected-token-id', null)
  const [isGenerating, setIsGenerating] = useState(false)

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()
  const { minutes, seconds } = useCountdown(accessToken?.expiresAt || null)
  const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)

  const handleGenerateToken = async () => {
    if (!selectedToken) {
      onOpenTokenManager()
      return
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
        expiresAt: Date.now() + (15 * 60 * 1000)
      }

      setAccessToken(newAccessToken)
    } catch (error) {
      console.error('Token generation error:', error)
      onOpenTokenManager()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
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
            <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
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
                onClick={selectedToken && !isTokenValid ? handleGenerateToken : onOpenTokenManager}
                disabled={isGenerating}
                size="sm"
                variant={isTokenValid ? "outline" : "default"}
                className="w-full h-8"
              >
                {isGenerating ? 'Generating...' : 
                 isTokenValid ? 'Refresh Token' : 
                 selectedToken ? 'Generate Token' : 'Configure Token'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
