import { Conversation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getAgentConfig } from '@/lib/agents'

type ConversationListProps = {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function ConversationList({ conversations, activeId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No conversations yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conversation, index) => {
        const agent = getAgentConfig(conversation.agentType)
        return (
          <div key={conversation.id}>
            <button
              onClick={() => onSelect(conversation.id)}
              className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                activeId === conversation.id
                  ? 'bg-accent/20 border-l-2 border-accent'
                  : 'hover:bg-secondary/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-medium text-sm text-foreground truncate flex-1">
                  {conversation.title}
                </h3>
                <Badge variant="secondary" className="text-[11px] px-1.5 py-0">
                  {agent?.name.split(' ')[0] || conversation.agentType}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </button>
            {index < conversations.length - 1 && <Separator className="my-1" />}
          </div>
        )
      })}
    </div>
  )
}
