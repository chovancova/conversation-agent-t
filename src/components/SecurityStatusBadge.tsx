import { ShieldCheck, ShieldWarning, Lock } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { isSecureContext } from '@/lib/security'

type SecurityStatusBadgeProps = {
  hasEncryptedTokens?: boolean
  className?: string
}

export function SecurityStatusBadge({ hasEncryptedTokens = false, className = '' }: SecurityStatusBadgeProps) {
  const secure = isSecureContext()
  
  if (!secure) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="destructive" className={`gap-1.5 ${className}`}>
              <ShieldWarning size={12} weight="fill" />
              Insecure Context
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              Not running in a secure context (HTTPS). Cryptographic features may be limited.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`gap-1.5 border-accent/50 text-accent ${className}`}>
            {hasEncryptedTokens ? (
              <>
                <Lock size={12} weight="fill" />
                Encrypted
              </>
            ) : (
              <>
                <ShieldCheck size={12} weight="fill" />
                Secure Context
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">
            {hasEncryptedTokens 
              ? 'Using AES-256-GCM encryption for stored credentials'
              : 'Running in secure context (HTTPS) - all data stays in your browser'
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
