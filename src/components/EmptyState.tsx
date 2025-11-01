import { Robot } from '@phosphor-icons/react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent mb-4">
        <Robot size={32} weight="bold" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">Start Testing Conversation Agents</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Begin a new conversation to test AI model responses, evaluate conversation flows, and analyze agent behavior.
      </p>
    </div>
  )
}
