import { Conversation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { getAgentConfig } from '@/lib/agents'

type ConversationListProps = {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-center px-4">
        <p className="text-sm text-muted-foreground mb-1">No conversations yet</p>
        <p className="text-xs text-muted-foreground/70">Create one to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conversation) => {
        const agent = getAgentConfig(conversation.agentType)
        const isActive = activeId === conversation.id
        return (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-accent text-accent-foreground shadow-sm scale-[0.98]'
                : 'hover:bg-secondary/60 active:scale-[0.98]'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className={`font-medium text-sm truncate flex-1 ${isActive ? 'text-accent-foreground' : 'text-foreground'}`}>
                {conversation.title}
              </h3>
              <Badge 
                variant={isActive ? "default" : "secondary"} 
                className={`text-[10px] px-2 py-0.5 font-medium ${isActive ? 'bg-accent-foreground/10 text-accent-foreground border-accent-foreground/20' : ''}`}
              >
                {agent?.name.split(' ')[0] || conversation.agentType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-xs ${isActive ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                {new Date(conversation.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
              {conversation.messages.length > 0 && (
                <>
                  <span className={`text-xs ${isActive ? 'text-accent-foreground/50' : 'text-muted-foreground/50'}`}>•</span>
                  <p className={`text-xs ${isActive ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>
                    {conversation.messages.length} {conversation.messages.length === 1 ? 'message' : 'messages'}
                  </p>
                </>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
