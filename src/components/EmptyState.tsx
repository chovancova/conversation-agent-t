import { Robot, Plus, Key, CaretRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateConversation?: () => void
  onSetupAuth?: () => void
}

export function EmptyState({ onCreateConversation, onSetupAuth }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 text-primary mb-6 shadow-sm">
        <Robot size={40} weight="duotone" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Welcome to Agent Tester</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        Test AI agent responses with HTTP Bearer authentication. Create conversations, evaluate flows, and analyze agent behavior.
      </p>
      <div className="flex flex-col gap-3 text-left max-w-sm w-full">
        <button
          onClick={onCreateConversation}
          className="flex items-start gap-3 text-sm p-4 rounded-xl border border-border bg-card hover:bg-accent/5 hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <Plus size={16} weight="bold" className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground mb-0.5 group-hover:text-primary transition-colors">Create a conversation</p>
            <p className="text-xs text-muted-foreground">Start testing your AI agents with a new conversation</p>
          </div>
          <CaretRight size={16} weight="bold" className="text-muted-foreground group-hover:text-primary transition-colors mt-1 flex-shrink-0" />
        </button>
        <button
          onClick={onSetupAuth}
          className="flex items-start gap-3 text-sm p-4 rounded-xl border border-border bg-card hover:bg-accent/5 hover:border-accent/30 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center flex-shrink-0 transition-colors">
            <Key size={16} weight="bold" className="text-accent" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground mb-0.5 group-hover:text-accent transition-colors">Set up authentication</p>
            <p className="text-xs text-muted-foreground">Configure your access token and agent endpoints</p>
          </div>
          <CaretRight size={16} weight="bold" className="text-muted-foreground group-hover:text-accent transition-colors mt-1 flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}
