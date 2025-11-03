import { CheckCircle, XCircle, WarningCircle } from '@phosphor-icons/react'
import { ContrastResult } from '@/lib/contrast'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ContrastIndicatorProps {
  result: ContrastResult
  pairName: string
  showDetails?: boolean
}

export function ContrastIndicator({ result, pairName, showDetails = false }: ContrastIndicatorProps) {
  const getGradeColor = (grade: string) => {
    if (grade === 'AAA') return 'text-green-500'
    if (grade === 'AA') return 'text-blue-500'
    if (grade === 'AA Large') return 'text-yellow-500'
    return 'text-red-500'
  }

  const getGradeIcon = (grade: string) => {
    if (grade === 'AAA' || grade === 'AA') return CheckCircle
    if (grade === 'AA Large') return WarningCircle
    return XCircle
  }

  const Icon = getGradeIcon(result.grade)
  const colorClass = getGradeColor(result.grade)

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1">
              <Icon size={16} weight="fill" className={colorClass} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1 text-xs">
              <div className="font-semibold">{pairName}</div>
              <div>Contrast Ratio: <span className="font-mono">{result.ratio.toFixed(2)}:1</span></div>
              <div>WCAG Grade: <span className={`font-bold ${getGradeColor(result.grade)}`}>{result.grade}</span></div>
              {result.grade === 'Fail' && (
                <div className="text-destructive text-[10px] mt-1">
                  Minimum 4.5:1 required for normal text
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Icon size={18} weight="fill" className={colorClass} />
          <span className="text-sm font-semibold">{pairName}</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-0.5">
          <div>
            Contrast: <span className="font-mono font-medium text-foreground">{result.ratio.toFixed(2)}:1</span>
          </div>
          <div className="flex gap-3 mt-1">
            <span className={result.wcagAA ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              AA {result.wcagAA ? '✓' : '✗'}
            </span>
            <span className={result.wcagAAA ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              AAA {result.wcagAAA ? '✓' : '✗'}
            </span>
            <span className={result.wcagAALarge ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              Large {result.wcagAALarge ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded ${
        result.grade === 'AAA' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
        result.grade === 'AA' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
        result.grade === 'AA Large' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
        'bg-red-500/20 text-red-600 dark:text-red-400'
      }`}>
        {result.grade}
      </div>
    </div>
  )
}
