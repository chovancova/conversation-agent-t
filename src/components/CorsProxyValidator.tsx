import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Warning, Info, ShieldCheck, ShieldWarning, CloudSlash } from '@phosphor-icons/react'
import { validateCorsProxyUrl, validateProxyConfiguration } from '@/lib/validation'

type CorsProxyValidatorProps = {
  proxyUrl: string
  requiresAuth: boolean
  username?: string
  password?: string
  className?: string
}

export function CorsProxyValidator({ proxyUrl, requiresAuth, username, password, className = '' }: CorsProxyValidatorProps) {
  if (!proxyUrl || proxyUrl.trim() === '') {
    return null
  }

  const result = validateProxyConfiguration(proxyUrl, requiresAuth, username, password)

  if (result.valid && result.warnings.length === 0) {
    return (
      <div className={className}>
        <Alert className="py-2 border-accent/50 bg-accent/5">
          <CheckCircle size={16} className="mt-0.5 text-accent" weight="fill" />
          <AlertDescription className="text-xs ml-2 text-accent-foreground">
            Proxy configuration is valid
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {result.errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive" className="py-2">
          <XCircle size={16} className="mt-0.5" weight="fill" />
          <AlertDescription className="text-xs ml-2">
            {error}
          </AlertDescription>
        </Alert>
      ))}
      
      {result.warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} className="py-2 border-yellow-500/50 bg-yellow-500/5">
          <Warning size={16} className="mt-0.5 text-yellow-600 dark:text-yellow-500" weight="fill" />
          <AlertDescription className="text-xs ml-2 text-yellow-800 dark:text-yellow-300">
            {warning}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

type ProxyProviderBadgeProps = {
  requiresAuth: boolean
  isLocal?: boolean
  isPremium?: boolean
  className?: string
}

export function ProxyProviderBadge({ requiresAuth, isLocal, isPremium, className = '' }: ProxyProviderBadgeProps) {
  if (isPremium) {
    return (
      <Badge variant="secondary" className={`gap-1 bg-purple-500/15 text-purple-800 dark:text-purple-300 border-purple-500/50 ${className}`}>
        <ShieldCheck size={12} weight="fill" />
        Premium
      </Badge>
    )
  }

  if (isLocal) {
    return (
      <Badge variant="secondary" className={`gap-1 bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/50 ${className}`}>
        <CloudSlash size={12} weight="fill" />
        Local
      </Badge>
    )
  }

  if (requiresAuth) {
    return (
      <Badge variant="secondary" className={`gap-1 bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/50 ${className}`}>
        <ShieldWarning size={12} weight="fill" />
        Auth Required
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className={`gap-1 ${className}`}>
      <Info size={12} weight="fill" />
      Free
    </Badge>
  )
}

type ProxyRecommendationProps = {
  endpoint: string
  className?: string
}

export function ProxyRecommendation({ endpoint, className = '' }: ProxyRecommendationProps) {
  let recommendation = ''
  let isLocal = false
  let needsAuth = false

  try {
    const url = new URL(endpoint)
    isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname)
    needsAuth = url.protocol === 'https:' && !isLocal

    if (isLocal) {
      recommendation = 'Local endpoints typically do not require CORS proxy'
    } else if (needsAuth) {
      recommendation = 'HTTPS endpoints may require CORS proxy for browser requests'
    } else {
      recommendation = 'HTTP endpoints may work without proxy, but CORS proxy is recommended'
    }
  } catch (error) {
    return null
  }

  if (!recommendation) {
    return null
  }

  return (
    <div className={className}>
      <Alert className="py-2 border-blue-500/50 bg-blue-500/5">
        <Info size={16} className="mt-0.5 text-blue-600 dark:text-blue-400" weight="fill" />
        <AlertDescription className="text-xs ml-2 text-blue-800 dark:text-blue-300">
          <strong>Recommendation:</strong> {recommendation}
        </AlertDescription>
      </Alert>
    </div>
  )
}
