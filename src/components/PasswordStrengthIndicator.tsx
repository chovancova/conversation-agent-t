import { ShieldCheck, ShieldWarning, ShieldSlash } from '@phosphor-icons/react'
import { checkPasswordStrength } from '@/lib/security'
import { Progress } from '@/components/ui/progress'

type PasswordStrengthIndicatorProps = {
  password: string
  className?: string
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const { strength, score, feedback } = checkPasswordStrength(password)

  const getColor = () => {
    switch (strength) {
      case 'weak':
        return 'text-destructive'
      case 'medium':
        return 'text-amber-500'
      case 'strong':
        return 'text-accent'
    }
  }

  const getProgressColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-destructive'
      case 'medium':
        return 'bg-amber-500'
      case 'strong':
        return 'bg-accent'
    }
  }

  const getIcon = () => {
    switch (strength) {
      case 'weak':
        return <ShieldSlash size={14} weight="fill" />
      case 'medium':
        return <ShieldWarning size={14} weight="fill" />
      case 'strong':
        return <ShieldCheck size={14} weight="fill" />
    }
  }

  const progressValue = (score / 6) * 100

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <div className={getColor()}>
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="relative h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        </div>
        <span className={`text-xs font-semibold ${getColor()} capitalize`}>
          {strength}
        </span>
      </div>
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-0.5">
          {feedback.map((item, i) => (
            <div key={i}>• {item}</div>
          ))}
        </div>
      )}
    </div>
  )
}
