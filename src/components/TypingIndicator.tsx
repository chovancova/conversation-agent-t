import { Robot } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'

export function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row">
      <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-accent text-accent-foreground">
        <Robot size={18} weight="bold" />
      </div>
      <Card className="px-4 py-3 bg-card border-border">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
        </div>
      </Card>
    </div>
  )
}
