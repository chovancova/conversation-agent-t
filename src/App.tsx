import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PaperPlaneRight, Export, Key, Gear, Robot } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/ChatMessage'
import { TypingIndicator } from '@/components/TypingIndicator'
import { ConversationList } from '@/components/ConversationList'
import { EmptyState } from '@/components/EmptyState'
import { TokenManager } from '@/components/TokenManager'
import { AgentSettings } from '@/components/AgentSettings'
import { Conversation, Message, AgentType, AccessToken } from '@/lib/types'
import { AGENTS, getAgentConfig } from '@/lib/agents'

function App() {
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [activeConversationId, setActiveConversationId] = useKV<string | null>('activeConversationId', null)
  const [accessToken] = useKV<AccessToken | null>('access-token', null)
  const [agentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokenManagerOpen, setTokenManagerOpen] = useState(false)
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = (conversations || []).find((c) => c.id === activeConversationId)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeConversation?.messages, isLoading])

  const isTokenValid = accessToken && accessToken.expiresAt > Date.now()

  const createNewConversation = (agentType: AgentType = 'account-opening') => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      agentType,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    setConversations((current = []) => [newConversation, ...current])
    setActiveConversationId(newConversation.id)
  }

  const updateConversation = (id: string, updates: Partial<Conversation>) => {
    setConversations((current = []) =>
      current.map((conv) =>
        conv.id === id
          ? { ...conv, ...updates, updatedAt: Date.now() }
          : conv
      )
    )
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    if (!activeConversation) {
      createNewConversation()
      return
    }

    if (!isTokenValid) {
      toast.error('Access token expired. Please generate a new token.')
      setTokenManagerOpen(true)
      return
    }

    const endpoint = agentEndpoints?.[activeConversation.agentType]
    if (!endpoint) {
      toast.error('Agent endpoint not configured. Please set it in Agent Settings.')
      setAgentSettingsOpen(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    const updatedMessages = [...activeConversation.messages, userMessage]
    
    updateConversation(activeConversation.id, {
      messages: updatedMessages,
      title: activeConversation.messages.length === 0 
        ? input.trim().slice(0, 50) + (input.trim().length > 50 ? '...' : '')
        : activeConversation.title,
    })

    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken!.token}`
        },
        body: JSON.stringify({
          message: input.trim()
        })
      })

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const responseContent = data.response || data.message || data.content || JSON.stringify(data)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      }

      updateConversation(activeConversation.id, {
        messages: [...updatedMessages, assistantMessage],
      })
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to get response from agent',
        timestamp: Date.now(),
        error: true
      }

      updateConversation(activeConversation.id, {
        messages: [...updatedMessages, errorMessage],
      })

      toast.error('Failed to get response. Check console for details.')
      console.error('Error getting agent response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!activeConversation || activeConversation.messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    const agent = getAgentConfig(activeConversation.agentType)
    const exportText = `Agent: ${agent?.name || activeConversation.agentType}\n` +
      `Conversation: ${activeConversation.title}\n` +
      `Created: ${new Date(activeConversation.createdAt).toLocaleString()}\n\n` +
      activeConversation.messages
        .map((m) => {
          const time = new Date(m.timestamp).toLocaleString()
          const role = m.role === 'user' ? 'User' : 'Assistant'
          return `[${time}] ${role}:\n${m.content}\n`
        })
        .join('\n')

    navigator.clipboard.writeText(exportText)
    toast.success('Conversation copied to clipboard')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleAgentChange = (agentType: AgentType) => {
    if (activeConversation) {
      updateConversation(activeConversation.id, { agentType })
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <TokenManager open={tokenManagerOpen} onOpenChange={setTokenManagerOpen} />
      <AgentSettings open={agentSettingsOpen} onOpenChange={setAgentSettingsOpen} />
      
      <div className="flex h-screen bg-background">
        <aside className="w-80 border-r border-border bg-card flex flex-col">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-4">
              Agent Tester
            </h1>
            <div className="space-y-2">
              <Select onValueChange={(value) => createNewConversation(value as AgentType)}>
                <SelectTrigger asChild>
                  <Button className="w-full" size="sm">
                    <Plus size={16} weight="bold" className="mr-2" />
                    New Conversation
                  </Button>
                </SelectTrigger>
                <SelectContent>
                  {AGENTS.map(agent => (
                    <SelectItem key={agent.type} value={agent.type}>
                      <div className="flex items-center gap-2">
                        <Robot size={14} />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => setTokenManagerOpen(true)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Key size={14} className="mr-1" />
                  Token
                </Button>
                <Button 
                  onClick={() => setAgentSettingsOpen(true)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                >
                  <Gear size={14} className="mr-1" />
                  Agents
                </Button>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <ConversationList
              conversations={conversations || []}
              activeId={activeConversationId || null}
              onSelect={setActiveConversationId}
            />
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                  <h2 className="font-medium text-foreground">
                    {activeConversation.title}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={activeConversation.agentType} onValueChange={handleAgentChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENTS.map(agent => (
                        <SelectItem key={agent.type} value={agent.type}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" onClick={handleExport}>
                    <Export size={18} />
                  </Button>
                </div>
              </header>

              <ScrollArea className="flex-1 px-6" ref={scrollRef}>
                <div className="py-6 flex flex-col gap-4 max-w-4xl mx-auto w-full">
                  {activeConversation.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center text-muted-foreground text-sm py-12">
                      Send a message to start the conversation
                    </div>
                  ) : (
                    activeConversation.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))
                  )}
                  {isLoading && <TypingIndicator />}
                </div>
              </ScrollArea>

              <div className="border-t border-border bg-card px-6 py-4">
                <div className="max-w-4xl mx-auto">
                  {!isTokenValid && (
                    <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive flex items-center justify-between">
                      <span>⚠️ Access token expired or not set</span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setTokenManagerOpen(true)}
                        className="h-7"
                      >
                        Generate Token
                      </Button>
                    </div>
                  )}
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
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </>
  )
}

export default App