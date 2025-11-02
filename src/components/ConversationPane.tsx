import { useRef, useState } from 'react'
import { PaperPlaneRight, Export, Robot, Columns, X, TextT, FilePdf, Image, ClipboardText } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { ChatMessage } from '@/components/ChatMessage'
import { TypingIndicator } from '@/components/TypingIndicator'
import { Conversation, Message, AgentType, AccessToken } from '@/lib/types'
import { AGENTS, getAgentName } from '@/lib/agents'
import { exportAsText, exportAsMarkdown, exportAsPDF, exportAsPNG } from '@/lib/exportUtils'

type ConversationPaneProps = {
  conversation: Conversation
  isLoading: boolean
  onSendMessage: (conversationId: string, message: string) => Promise<void>
  onAgentChange: (conversationId: string, agentType: AgentType) => void
  agentNames: Record<string, string>
  onCloseSplit?: () => void
  showSplitButton?: boolean
  onOpenSplit?: () => void
  isPaneA?: boolean
}

export function ConversationPane({
  conversation,
  isLoading,
  onSendMessage,
  onAgentChange,
  agentNames,
  onCloseSplit,
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

  const handleExport = async (format: 'text' | 'markdown' | 'pdf' | 'png') => {
    if (conversation.messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    try {
      switch (format) {
        case 'text':
          exportAsText(conversation, agentNames)
          toast.success('Conversation copied to clipboard')
          break
        case 'markdown':
          exportAsMarkdown(conversation, agentNames)
          toast.success('Markdown file downloaded')
          break
        case 'pdf':
          await exportAsPDF(conversation, agentNames)
          toast.success('PDF file downloaded')
          break
        case 'png':
          await exportAsPNG(conversation, agentNames)
          toast.success('PNG image downloaded')
          break
      }
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`)
      console.error('Export error:', error)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <header className="h-14 border-b border-border px-4 flex items-center justify-between bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center flex-shrink-0 border border-accent/20">
            <Robot size={16} weight="duotone" className="text-accent" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="font-semibold text-sm text-foreground truncate">
              {conversation.title}
            </h2>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-muted-foreground truncate">
                {getAgentName(conversation.agentType, agentNames)}
              </p>
              {conversation.sessionId && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {conversation.sessionId.slice(0, 8)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Select value={conversation.agentType} onValueChange={(value) => onAgentChange(conversation.id, value as AgentType)}>
            <SelectTrigger className="w-[150px] h-8 rounded-lg text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGENTS.map(agent => (
                <SelectItem key={agent.type} value={agent.type}>
                  <div className="flex items-center gap-2">
                    <Robot size={14} />
                    <span className="text-sm">{getAgentName(agent.type, agentNames)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2.5 rounded-lg text-xs">
                <Export size={14} className="mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExport('text')}>
                <ClipboardText size={16} className="mr-2" />
                Copy as Text
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('markdown')}>
                <TextT size={16} className="mr-2" />
                Download Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('png')}>
                <Image size={16} className="mr-2" />
                Download PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <FilePdf size={16} className="mr-2" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {showSplitButton && onOpenSplit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenSplit} 
              className="h-8 px-2.5 rounded-lg text-xs"
              title="Open split view"
            >
              <Columns size={14} className="mr-1.5" />
              Split
            </Button>
          )}
          {onCloseSplit && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCloseSplit} 
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Close split view"
            >
              <X size={16} weight="bold" />
            </Button>
          )}
        </div>
      </header>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="py-6 px-6 flex flex-col gap-4 max-w-4xl mx-auto w-full">
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

      <div className="border-t border-border bg-card px-6 py-4 flex-shrink-0">
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
