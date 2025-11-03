import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Warning } from '@phosphor-icons/react'
import { ValidationResult } from '@/lib/validation'

type EndpointValidatorProps = {
  result: ValidationResult
  className?: string
}

export function EndpointValidator({ result, className = '' }: EndpointValidatorProps) {
  if (result.valid && result.warnings.length === 0) {
    return null
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

type ValidationBadgeProps = {
  result: ValidationResult
}

export function ValidationBadge({ result }: ValidationBadgeProps) {
  if (result.valid && result.warnings.length === 0) {
    return (
      <Badge variant="default" className="gap-1">
        <CheckCircle size={12} weight="fill" />
        Valid
      </Badge>
    )
  }

  if (!result.valid) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle size={12} weight="fill" />
        {result.errors.length} {result.errors.length === 1 ? 'Error' : 'Errors'}
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="gap-1 bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-500/50">
      <Warning size={12} weight="fill" />
      {result.warnings.length} {result.warnings.length === 1 ? 'Warning' : 'Warnings'}
    </Badge>
  )
}
