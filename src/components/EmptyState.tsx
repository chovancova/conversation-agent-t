import { Robot, Plus, Key } from '@phosphor-icons/react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 text-primary mb-6 shadow-sm">
        <Robot size={40} weight="duotone" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Welcome to Agent Tester</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
        Test AI agent responses with HTTP Bearer authentication. Create conversations, evaluate flows, and analyze agent behavior.
      </p>
      <div className="flex flex-col gap-3 text-left max-w-sm">
        <div className="flex items-start gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Plus size={16} weight="bold" className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground mb-0.5">Create a conversation</p>
            <p className="text-xs text-muted-foreground">Click "New Conversation" in the sidebar to begin</p>
          </div>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Key size={16} weight="bold" className="text-accent" />
          </div>
          <div>
            <p className="font-medium text-foreground mb-0.5">Set up authentication</p>
            <p className="text-xs text-muted-foreground">Configure your access token and agent endpoints</p>
          </div>
        </div>
      </div>
    </div>
  )
}
