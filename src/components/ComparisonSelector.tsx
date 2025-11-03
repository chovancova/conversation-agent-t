import { useState } from 'react'
import { Conversation } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Check, ChatsCircle } from '@phosphor-icons/react'
import { getAgentName } from '@/lib/agents'
import { cn } from '@/lib/utils'

type ComparisonSelectorProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  onCompare: (conversationA: Conversation, conversationB: Conversation) => void
  agentNames?: Record<string, string>
}

export function ComparisonSelector({
  open,
  onOpenChange,
  conversations,
  onCompare,
  agentNames = {}
}: ComparisonSelectorProps) {
  const [selectedA, setSelectedA] = useState<string | null>(null)
  const [selectedB, setSelectedB] = useState<string | null>(null)

  const handleCompare = () => {
    const convA = conversations.find(c => c.id === selectedA)
    const convB = conversations.find(c => c.id === selectedB)
    
    if (convA && convB) {
      onCompare(convA, convB)
      onOpenChange(false)
      setSelectedA(null)
      setSelectedB(null)
    }
  }

  const handleSelectConversation = (id: string) => {
    if (!selectedA) {
      setSelectedA(id)
    } else if (selectedA === id) {
      setSelectedA(null)
    } else if (!selectedB) {
      setSelectedB(id)
    } else if (selectedB === id) {
      setSelectedB(null)
    } else {
      setSelectedA(id)
      setSelectedB(null)
    }
  }

  const canCompare = selectedA && selectedB && selectedA !== selectedB

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) {
        setSelectedA(null)
        setSelectedB(null)
      }
    }}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <DialogTitle className="text-xl font-bold">Compare Conversations</DialogTitle>
          <DialogDescription className="text-sm mt-2">
            Select two conversations to compare their agent responses side-by-side
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-3 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <Card className={cn(
              "p-3 transition-all",
              selectedA ? "bg-primary/10 border-primary/30" : "bg-card"
            )}>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Conversation A</p>
              {selectedA ? (
                <p className="text-sm font-bold text-foreground">
                  {conversations.find(c => c.id === selectedA)?.title}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Not selected</p>
              )}
            </Card>
            <Card className={cn(
              "p-3 transition-all",
              selectedB ? "bg-accent/10 border-accent/30" : "bg-card"
            )}>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Conversation B</p>
              {selectedB ? (
                <p className="text-sm font-bold text-foreground">
                  {conversations.find(c => c.id === selectedB)?.title}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Not selected</p>
              )}
            </Card>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <ChatsCircle size={48} className="mx-auto text-muted-foreground mb-3" weight="duotone" />
                <p className="text-sm text-muted-foreground">No conversations available</p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const agentName = agentNames[conversation.agentType] || getAgentName(conversation.agentType)
                const isSelectedA = selectedA === conversation.id
                const isSelectedB = selectedB === conversation.id
                const isSelected = isSelectedA || isSelectedB
                const messageCount = conversation.messages.filter(m => m.role === 'assistant').length

                return (
                  <Card
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:shadow-md",
                      isSelectedA && "bg-primary/10 border-primary/40 ring-2 ring-primary/20",
                      isSelectedB && "bg-accent/10 border-accent/40 ring-2 ring-accent/20",
                      !isSelected && "hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-foreground truncate">
                            {conversation.title}
                          </h3>
                          {isSelected && (
                            <Check size={16} weight="bold" className={cn(
                              isSelectedA && "text-primary",
                              isSelectedB && "text-accent"
                            )} />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {agentName}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {messageCount} response{messageCount !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(conversation.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge className={cn(
                          "text-xs font-bold",
                          isSelectedA && "bg-primary/20 text-primary border-primary/30",
                          isSelectedB && "bg-accent/20 text-accent border-accent/30"
                        )}>
                          {isSelectedA ? 'A' : 'B'}
                        </Badge>
                      )}
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t border-border flex-shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedA(null)
              setSelectedB(null)
            }}
            disabled={!selectedA && !selectedB}
          >
            Clear Selection
          </Button>
          <Button
            onClick={handleCompare}
            disabled={!canCompare}
            className="min-w-32"
          >
            Compare
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
