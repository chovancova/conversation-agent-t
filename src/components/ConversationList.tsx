import { Conversation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAgentConfig } from '@/lib/agents'
import { Chat, Robot, Trash, Columns } from '@phosphor-icons/react'

type ConversationListProps = {
  conversations: Conversation[]
  activeId: string | null
  splitId?: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onSelectForSplit?: (id: string) => void
  splitMode?: boolean
}

export function ConversationList({ conversations, activeId, splitId, onSelect, onDelete, onSelectForSplit, splitMode }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-4 py-8">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Chat size={24} className="text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No conversations yet</p>
        <p className="text-xs text-muted-foreground">Click "New Conversation" to get started</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      {conversations.map((conversation) => {
        const agent = getAgentConfig(conversation.agentType)
        const isActive = activeId === conversation.id
        const isInSplit = splitId === conversation.id
        const isHighlighted = isActive || isInSplit
        return (
          <div
            key={conversation.id}
            className={`relative rounded-lg transition-all duration-150 group ${
              isActive
                ? 'bg-accent text-accent-foreground shadow-sm'
                : isInSplit
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted/80'
            }`}
          >
            <button
              onClick={() => onSelect(conversation.id)}
              className="w-full text-left px-3 py-3"
            >
              <div className="flex items-start gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isActive 
                    ? 'bg-accent-foreground/10' 
                    : isInSplit 
                    ? 'bg-primary/20'
                    : 'bg-muted group-hover:bg-muted-foreground/10'
                }`}>
                  <Robot size={14} weight="duotone" className={
                    isActive 
                      ? 'text-accent-foreground' 
                      : isInSplit
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  } />
                </div>
                <div className="flex-1 min-w-0 pr-16">
                  <h3 className={`font-medium text-sm truncate mb-1 ${
                    isActive 
                      ? 'text-accent-foreground' 
                      : isInSplit
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}>
                    {conversation.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className={`text-[10px] px-1.5 py-0 font-medium h-5 ${
                        isActive 
                          ? 'bg-accent-foreground/15 text-accent-foreground border-0' 
                          : isInSplit
                          ? 'bg-primary/20 text-primary border-0'
                          : 'bg-muted'
                      }`}
                    >
                      {agent?.name || conversation.agentType}
                    </Badge>
                    {conversation.messages.length > 0 && (
                      <span className={`text-xs ${
                        isActive 
                          ? 'text-accent-foreground/60' 
                          : isInSplit
                          ? 'text-primary/70'
                          : 'text-muted-foreground'
                      }`}>
                        {conversation.messages.length} msgs
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className={`text-xs pl-9 ${
                isActive 
                  ? 'text-accent-foreground/60' 
                  : isInSplit
                  ? 'text-primary/60'
                  : 'text-muted-foreground/80'
              }`}>
                {new Date(conversation.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </button>
            <div className="absolute top-2 right-2 flex gap-1">
              {splitMode && onSelectForSplit && !isActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectForSplit(conversation.id)
                  }}
                  className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isInSplit
                      ? 'opacity-100 bg-primary/10 text-primary hover:bg-primary/20'
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
                  }`}
                  title="Open in split view"
                >
                  <Columns size={14} weight="bold" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conversation.id)
                }}
                className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isHighlighted 
                    ? isActive
                      ? 'hover:bg-accent-foreground/10 text-accent-foreground'
                      : 'hover:bg-primary/10 text-primary'
                    : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                }`}
              >
                <Trash size={14} weight="bold" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
