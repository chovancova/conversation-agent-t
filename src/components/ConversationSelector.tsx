import { Robot } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Conversation } from '@/lib/types'
import { getAgentName } from '@/lib/agents'

type ConversationSelectorProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  onSelect: (conversationId: string) => void
  currentConversationId: string | null
  agentNames: Record<string, string>
  title?: string
  description?: string
}

export function ConversationSelector({
  open,
  onOpenChange,
  conversations,
  onSelect,
  currentConversationId,
  agentNames,
  title = "Select Conversation",
  description = "Choose a conversation to display in this pane",
}: ConversationSelectorProps) {
  const handleSelect = (conversationId: string) => {
    onSelect(conversationId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Button
                key={conversation.id}
                variant={conversation.id === currentConversationId ? "secondary" : "outline"}
                className="w-full justify-start h-auto py-3 px-3"
                onClick={() => handleSelect(conversation.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
                    <Robot size={16} weight="duotone" className="text-accent" />
                  </div>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="font-medium text-sm text-left truncate w-full">
                      {conversation.title}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getAgentName(conversation.agentType, agentNames)}</span>
                      <span>•</span>
                      <span>{conversation.messages.length} messages</span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No conversations available
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
