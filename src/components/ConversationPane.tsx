import { useRef, useState } from 'react'
import { PaperPlaneRight, Export, Robot, Columns, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChatMessage } from '@/components/ChatMessage'
import { TypingIndicator } from '@/components/TypingIndicator'
import { Conversation, Message, AgentType, AccessToken } from '@/lib/types'
import { AGENTS, getAgentName } from '@/lib/agents'

type ConversationPaneProps = {
  conversation: Conversation
  isLoading: boolean
  onSendMessage: (conversationId: string, message: string) => Promise<void>
  onAgentChange: (conversationId: string, agentType: AgentType) => void
  onExport: (conversation: Conversation) => void
  onCloseSplit?: () => void
  agentNames: Record<string, string>
  showSplitButton?: boolean
  onOpenSplit?: () => void
  isPaneA?: boolean
}

export function ConversationPane({
  conversation,
  isLoading,
  onSendMessage,
  onAgentChange,
  onExport,
  onCloseSplit,
  agentNames,
  showSplitButton = false,
  onOpenSplit,
  isPaneA = false,
}: ConversationPaneProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput('')
    
    await onSendMessage(conversation.id, message)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Robot size={16} weight="duotone" className="text-accent" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-medium text-foreground truncate">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {getAgentName(conversation.agentType, agentNames)}
              </p>
              {conversation.sessionId && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground font-mono">
                    Session: {conversation.sessionId.slice(0, 8)}...
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={conversation.agentType} onValueChange={(value) => onAgentChange(conversation.id, value as AgentType)}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map(agent => (
                <SelectItem key={agent.type} value={agent.type}>
                  <div className="flex items-center gap-2">
                    <Robot size={16} />
                    {getAgentName(agent.type, agentNames)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => onExport(conversation)} className="h-9">
            <Export size={16} className="mr-2" />
            Export
          </Button>
          {showSplitButton && onOpenSplit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenSplit} 
              className="h-9"
              title="Open split view"
            >
              <Columns size={16} className="mr-2" />
              Split
            </Button>
          )}
          {onCloseSplit && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCloseSplit} 
              className="h-9 w-9"
              title="Close split view"
            >
              <X size={16} weight="bold" />
            </Button>
          )}
        </div>
      </header>

      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="py-6 flex flex-col gap-4 max-w-4xl mx-auto w-full">
          {conversation.messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground text-sm py-12">
              Send a message to start the conversation
            </div>
          ) : (
            conversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="resize-none min-h-[52px] max-h-[200px]"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[52px] w-[52px] flex-shrink-0"
            >
              <PaperPlaneRight size={20} weight="bold" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
