import { useKV } from '@github/spark/hooks'
import { Key } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { AccessToken } from '@/lib/types'
import { useCountdown } from '@/hooks/use-countdown'
import { cn } from '@/lib/utils'

type TokenStatusIconProps = {
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function TokenStatusIcon({ onClick, disabled, className }: TokenStatusIconProps) {
  const [accessToken] = useKV<AccessToken | null>('access-token', null)
  const { minutes, seconds } = useCountdown(accessToken?.expiresAt || null)
  const totalSecondsRemaining = (accessToken?.expiresAt || 0) - Date.now()
  const hasTimeRemaining = totalSecondsRemaining > 0

  const totalDurationMs = accessToken?.expiresAt && accessToken?.generatedAt 
    ? accessToken.expiresAt - accessToken.generatedAt 
    : 15 * 60 * 1000
  
  const elapsedMs = accessToken?.generatedAt 
    ? Date.now() - accessToken.generatedAt 
    : 0
  
  const progress = totalDurationMs > 0 ? Math.max(0, Math.min(100, (elapsedMs / totalDurationMs) * 100)) : 0
  const remainingProgress = 100 - progress

  const circumference = 2 * Math.PI * 10
  const strokeDashoffset = circumference - (remainingProgress / 100) * circumference

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 rounded-lg relative",
              hasTimeRemaining 
                ? 'border-accent/50 text-accent hover:bg-accent/10' 
                : 'border-destructive/50 text-destructive hover:bg-destructive/10',
              className
            )}
          >
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn(
                  "opacity-20",
                  hasTimeRemaining ? "text-accent" : "text-destructive"
                )}
              />
              {hasTimeRemaining && (
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={cn(
                    "transition-all duration-1000",
                    minutes < 2 ? "text-destructive" : "text-accent"
                  )}
                />
              )}
            </svg>
            <Key size={16} weight="bold" className="relative z-10" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {hasTimeRemaining ? (
            <div className="text-xs">
              <p className="font-medium">Token Active</p>
              <p className="text-muted-foreground">Expires in {minutes}m {seconds}s</p>
            </div>
          ) : (
            <div className="text-xs">
              <p className="font-medium text-destructive">Token Expired</p>
              <p className="text-muted-foreground">Click to generate new token</p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
