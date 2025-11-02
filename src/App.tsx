import { useState, useRef, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PaperPlaneRight, Export, Key, Gear, Robot, ShieldCheck, Trash, List, Palette, Columns, CaretDown, CaretUp, ChatsCircle, CloudSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { ChatMessage } from '@/components/ChatMessage'
import { TypingIndicator } from '@/components/TypingIndicator'
import { ConversationList } from '@/components/ConversationList'
import { ConversationSearch } from '@/components/ConversationSearch'
import { EmptyState } from '@/components/EmptyState'
import { TokenManager } from '@/components/TokenManager'
import { TokenStatus } from '@/components/TokenStatus'
import { AgentSettings } from '@/components/AgentSettings'
import { SecurityInfo } from '@/components/SecurityInfo'
import { ThemeSettings } from '@/components/ThemeSettings'
import { ConversationPane } from '@/components/ConversationPane'
import { ClientSideInfo } from '@/components/ClientSideInfo'
import { Conversation, Message, AgentType, AccessToken, TokenConfig } from '@/lib/types'
import { AGENTS, getAgentConfig, getAgentName } from '@/lib/agents'
import { ThemeOption, applyTheme } from '@/lib/themes'

function App() {
  const [conversations, setConversations] = useKV<Conversation[]>('conversations', [])
  const [activeConversationId, setActiveConversationId] = useKV<string | null>('activeConversationId', null)
  const [splitConversationId, setSplitConversationId] = useKV<string | null>('splitConversationId', null)
  const [splitMode, setSplitMode] = useKV<boolean>('split-mode', false)
  const [accessToken] = useKV<AccessToken | null>('access-token', null)
  const [agentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [agentNames] = useKV<Record<string, string>>('agent-names', {})
  const [sidebarOpen, setSidebarOpen] = useKV<boolean>('sidebar-open', true)
  const [conversationsVisible, setConversationsVisible] = useKV<boolean>('conversations-visible', true)
  const [selectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
  const [customTheme] = useKV<any>('custom-theme', null)
  const [searchQuery, setSearchQuery] = useKV<string>('search-query', '')
  const [selectedAgentFilters, setSelectedAgentFilters] = useKV<AgentType[]>('selected-agent-filters', [])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingConversationId, setLoadingConversationId] = useState<string | null>(null)
  const [tokenManagerOpen, setTokenManagerOpen] = useState(false)
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false)
  const [securityInfoOpen, setSecurityInfoOpen] = useState(false)
  const [clientSideInfoOpen, setClientSideInfoOpen] = useState(false)
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false)
  const [tokenStatusExpanded, setTokenStatusExpanded] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false)

  const activeConversation = (conversations || []).find((c) => c.id === activeConversationId)
  const splitConversation = (conversations || []).find((c) => c.id === splitConversationId)

  const filteredConversations = useMemo(() => {
    let filtered = conversations || []

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(query) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(query))
      )
    }

    if (selectedAgentFilters && selectedAgentFilters.length > 0) {
      filtered = filtered.filter(conv => 
        selectedAgentFilters.includes(conv.agentType)
      )
    }

    return filtered
  }, [conversations, searchQuery, selectedAgentFilters])

  useEffect(() => {
    if (selectedTheme) {
      if (selectedTheme === 'custom' && customTheme) {
        applyTheme(selectedTheme, customTheme)
      } else {
        applyTheme(selectedTheme)
      }
    }
  }, [selectedTheme, customTheme])

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

  const handleRenameConversation = (id: string, newTitle: string) => {
    updateConversation(id, { title: newTitle })
    toast.success('Conversation renamed')
  }

  const generateConversationTitle = async (firstMessage: string): Promise<string> => {
    try {
      const prompt = spark.llmPrompt`Generate a brief, concise title (3-6 words) for a conversation that starts with this message: "${firstMessage}". Return only the title without quotes or extra punctuation.`
      const title = await spark.llm(prompt, 'gpt-4o-mini')
      return title.trim().replace(/^["']|["']$/g, '')
    } catch (error) {
      console.error('Failed to generate title:', error)
      return firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '')
    }
  }


  const sendMessageToConversation = async (conversationId: string, messageContent: string) => {
    const conversation = conversations?.find(c => c.id === conversationId)
    if (!conversation) return

    if (!isTokenValid) {
      toast.error('Access token expired. Please generate a new token.')
      setTokenManagerOpen(true)
      return
    }

    const endpoint = agentEndpoints?.[conversation.agentType]
    if (!endpoint) {
      toast.error('Agent endpoint not configured. Please set it in Agent Settings.')
      setAgentSettingsOpen(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
    }

    const isFirstMessage = conversation.messages.length === 0
    const isFirstMessage = conversation.messages.length === 0
    
    updateConversation(conversation.id, {
      title: isFirstMessage 
      title: isFirstMessage 
        ? messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '')
        : conversation.title,
    })
    if (isFirstMessage) {
      generateConversationTitle(messageContent).then(generatedTitle => {
        updateConversation(conversation.id, { title: generatedTitle })
      })
    }


    setLoadingConversationId(conversationId)
    setIsLoading(true)

    try {
      const requestBody: { message: string; sessionId?: string } = {
        message: messageContent
      }

      if (conversation.sessionId) {
        requestBody.sessionId = conversation.sessionId
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken!.token}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Agent request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const responseContent = data.response || data.message || data.content || JSON.stringify(data)
      const sessionId = data.sessionId || data.session_id || conversation.sessionId

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      }

      const updatePayload: Partial<Conversation> = {
        messages: [...updatedMessages, assistantMessage],
      }

      if (sessionId && !conversation.sessionId) {
        updatePayload.sessionId = sessionId
      }

      updateConversation(conversation.id, updatePayload)
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Failed to get response from agent',
        timestamp: Date.now(),
        error: true
      }

      updateConversation(conversation.id, {
        messages: [...updatedMessages, errorMessage],
      })

      toast.error('Failed to get response. Check console for details.')
      console.error('Error getting agent response:', error)
    } finally {
      setIsLoading(false)
      setLoadingConversationId(null)
    }
  }

  const handleAgentChange = (conversationId: string, agentType: AgentType) => {
    updateConversation(conversationId, { agentType })
  }

  const handleOpenSplit = () => {
    if (!activeConversation) return
    
    const otherConversations = conversations?.filter(c => c.id !== activeConversation.id) || []
    
    if (otherConversations.length > 0) {
      setSplitConversationId(otherConversations[0].id)
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: 'New Conversation',
        agentType: 'account-opening',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      
      setConversations((current = []) => [newConversation, ...current])
      setSplitConversationId(newConversation.id)
    }
    
    setSplitMode(true)
  }

  const handleCloseSplit = () => {
    setSplitMode(false)
    setSplitConversationId(null)
  }

  const handleQuickTokenRefresh = async () => {
    const [savedTokens, selectedTokenId] = await Promise.all([
      window.spark.kv.get<TokenConfig[]>('saved-tokens'),
      window.spark.kv.get<string | null>('selected-token-id')
    ])

    const selectedToken = savedTokens?.find(t => t.id === selectedTokenId)
    
    if (!selectedToken) {
      toast.error('No saved token configuration found. Please configure in Token Manager.')
      setTokenManagerOpen(true)
      return
    }

    setIsLoading(true)
    toast.info('Generating new token...')

    try {
      const response = await fetch(selectedToken.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: selectedToken.clientId,
          client_secret: selectedToken.clientSecret,
          username: selectedToken.username,
          password: selectedToken.password
        })
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const token = data.access_token || data.token
      if (!token) {
        throw new Error('No access token in response')
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt: Date.now() + (15 * 60 * 1000)
      }

      await window.spark.kv.set('access-token', newAccessToken)
      toast.success('Access token refreshed successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate token')
      console.error('Token generation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteRequest = (id: string) => {
    setConversationToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!conversationToDelete) return

    setConversations((current = []) =>
      current.filter((conv) => conv.id !== conversationToDelete)
    )

    if (activeConversationId === conversationToDelete) {
      setActiveConversationId(null)
    }

    toast.success('Conversation deleted')
    setDeleteDialogOpen(false)
    setConversationToDelete(null)
  }

  const handleClearAllConfirm = () => {
    setConversations([])
    setActiveConversationId(null)
    toast.success('All conversations cleared')
    setClearAllDialogOpen(false)
  }

  const handleAgentFilterToggle = (agent: AgentType) => {
    setSelectedAgentFilters((current = []) => {
      if (current.includes(agent)) {
        return current.filter(a => a !== agent)
      } else {
        return [...current, agent]
      }
    })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedAgentFilters([])
  }

  const hasActiveFilters = (searchQuery && searchQuery.trim() !== '') || (selectedAgentFilters && selectedAgentFilters.length > 0)

  const conversationToDeleteData = conversations?.find((c) => c.id === conversationToDelete)

  return (
    <>
      <Toaster position="top-right" />
      <TokenManager open={tokenManagerOpen} onOpenChange={setTokenManagerOpen} />
      <AgentSettings open={agentSettingsOpen} onOpenChange={setAgentSettingsOpen} />
      <SecurityInfo open={securityInfoOpen} onOpenChange={setSecurityInfoOpen} />
      <ClientSideInfo open={clientSideInfoOpen} onOpenChange={setClientSideInfoOpen} />
      <ThemeSettings open={themeSettingsOpen} onOpenChange={setThemeSettingsOpen} />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{conversationToDeleteData?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConversationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={clearAllDialogOpen} onOpenChange={setClearAllDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Conversations</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all {conversations?.length || 0} conversation{(conversations?.length || 0) !== 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="flex h-screen bg-background overflow-hidden">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out border-r border-border bg-card flex flex-col h-full overflow-hidden flex-shrink-0`}>
          <div className="p-5 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-accent to-accent/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl"></div>
                <Robot size={24} weight="duotone" className="text-primary-foreground relative z-10" />
              </div>
              <div className="flex flex-col min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                  Agent Tester
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Multi-Agent Testing</p>
              </div>
            </div>

            <Button 
              onClick={() => createNewConversation('account-opening')}
              className="w-full h-10 mb-3 shadow-sm hover:shadow-md transition-shadow"
              size="lg"
            >
              <Plus size={18} weight="bold" className="mr-2" />
              New Conversation
            </Button>

            <div className="flex gap-2 mb-3">
              <Button 
                onClick={() => setTokenManagerOpen(true)} 
                variant="outline" 
                size="sm"
                className="h-9 flex-1"
              >
                <Key size={16} className="mr-1.5" />
                Token
              </Button>
              <Button 
                onClick={() => setAgentSettingsOpen(true)} 
                variant="outline" 
                size="sm"
                className="h-9 flex-1"
              >
                <Gear size={16} className="mr-1.5" />
                Agents
              </Button>
            </div>
            
            <Button 
              onClick={() => setThemeSettingsOpen(true)} 
              variant="outline" 
              size="sm"
              className="w-full h-9"
            >
              <Palette size={16} className="mr-1.5" />
              Theme
            </Button>
          </div>

          <div className="px-4 py-3 border-b border-border bg-muted/30 flex-shrink-0">
            <TokenStatus 
              onOpenTokenManager={() => setTokenManagerOpen(true)}
              isExpanded={tokenStatusExpanded}
              onToggle={() => setTokenStatusExpanded(!tokenStatusExpanded)}
            />
          </div>
          
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-border flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConversationsVisible((current) => !current)}
                className="w-full h-8 justify-between px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
              >
                <span>Recent Conversations</span>
                {conversationsVisible ? (
                  <CaretUp size={14} weight="bold" />
                ) : (
                  <CaretDown size={14} weight="bold" />
                )}
              </Button>
              {conversationsVisible && (
                <>
                  <div className="mt-3">
                    <ConversationSearch
                      searchQuery={searchQuery || ''}
                      onSearchChange={setSearchQuery}
                      selectedAgents={selectedAgentFilters || []}
                      onAgentToggle={handleAgentFilterToggle}
                      onClearFilters={handleClearFilters}
                      hasActiveFilters={!!hasActiveFilters}
                    />
                  </div>
                  {(conversations?.length || 0) > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setClearAllDialogOpen(true)}
                      className="w-full h-7 mt-2 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash size={14} className="mr-1.5" />
                      Clear All ({conversations?.length || 0})
                    </Button>
                  )}
                </>
              )}
            </div>

            {conversationsVisible && (
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-2">
                  {hasActiveFilters && filteredConversations.length === 0 && (conversations?.length || 0) > 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                      <p className="text-sm font-medium text-foreground mb-1">No matches found</p>
                      <p className="text-xs text-muted-foreground mb-3">Try adjusting your search or filters</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-7 text-xs"
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <ConversationList
                      conversations={filteredConversations}
                      activeId={activeConversationId || null}
                      splitId={splitConversationId || null}
                      onSelect={setActiveConversationId}
                      onRename={handleRenameConversation}
                      onRename={handleRenameConversation}
                      onSelectForSplit={setSplitConversationId}
                      splitMode={splitMode || false}
                    />
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
          
          <div className="p-4 border-t border-border bg-muted/20 flex-shrink-0 space-y-2">
            <Button 
              onClick={() => setClientSideInfoOpen(true)} 
              variant="ghost" 
              size="sm"
              className="w-full justify-start h-8 px-2 text-muted-foreground hover:text-accent hover:bg-accent/10"
            >
              <CloudSlash size={16} className="mr-2 flex-shrink-0" />
              <span className="text-xs font-semibold">Client-Side Only</span>
            </Button>
            <Button 
              onClick={() => setSecurityInfoOpen(true)} 
              variant="ghost" 
              size="sm"
              className="w-full justify-start h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ShieldCheck size={16} className="mr-2 flex-shrink-0" />
              <span className="text-xs">Security & Privacy</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          {activeConversation ? (
            <div className="flex flex-1 overflow-hidden min-w-0">
              <div className={`${splitMode && splitConversation ? 'w-1/2 border-r border-border' : 'w-full'} flex flex-col min-w-0`}>
                <div className="h-14 border-b border-border px-3 flex items-center justify-between bg-card/50 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen((current) => !current)}
                      className="h-9 w-9 rounded-xl hover:bg-muted transition-all flex-shrink-0"
                      title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                    >
                      <List size={20} weight="bold" />
                    </Button>
                    {!sidebarOpen && (
                      <>
                        <Separator orientation="vertical" className="h-5" />
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => createNewConversation('account-opening')}
                            disabled={isLoading}
                            className="h-8 w-8 rounded-lg"
                            title="New conversation"
                          >
                            <Plus size={16} weight="bold" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleQuickTokenRefresh}
                            disabled={isLoading}
                            className={`h-8 w-8 rounded-lg ${isTokenValid ? 'border-accent/50 text-accent hover:bg-accent/10' : 'border-destructive/50 text-destructive hover:bg-destructive/10'}`}
                            title={isTokenValid ? 'Token valid - Click to refresh' : 'Token expired - Click to generate new'}
                          >
                            <Key size={16} weight="bold" />
                          </Button>
                        </div>
                      </>
                    )}
                    {splitMode && (
                      <div className="ml-2 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-bold tracking-wide flex-shrink-0">
                        PANE A
                      </div>
                    )}
                  </div>
                </div>
                <ConversationPane
                  conversation={activeConversation}
                  isLoading={isLoading && loadingConversationId === activeConversation.id}
                  onSendMessage={sendMessageToConversation}
                  onAgentChange={handleAgentChange}
                  agentNames={agentNames || {}}
                  showSplitButton={!splitMode}
                  onOpenSplit={handleOpenSplit}
                  isPaneA={true}
                />
              </div>
              
              {splitMode && splitConversation && (
                <div className="w-1/2 flex flex-col min-w-0">
                  <div className="h-14 border-b border-border px-3 flex items-center justify-between bg-card/50 backdrop-blur-sm flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-bold tracking-wide flex-shrink-0">
                        PANE B
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          createNewConversation('account-opening')
                          setSplitConversationId(Date.now().toString())
                        }}
                        disabled={isLoading}
                        className="h-8 w-8 rounded-lg"
                        title="New conversation in pane B"
                      >
                        <Plus size={16} weight="bold" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleQuickTokenRefresh}
                        disabled={isLoading}
                        className={`h-8 w-8 rounded-lg ${isTokenValid ? 'border-accent/50 text-accent hover:bg-accent/10' : 'border-destructive/50 text-destructive hover:bg-destructive/10'}`}
                        title={isTokenValid ? 'Token valid - Click to refresh' : 'Token expired - Click to generate new'}
                      >
                        <Key size={16} weight="bold" />
                      </Button>
                    </div>
                  </div>
                  <ConversationPane
                    conversation={splitConversation}
                    isLoading={isLoading && loadingConversationId === splitConversation.id}
                    onSendMessage={sendMessageToConversation}
                    onAgentChange={handleAgentChange}
                    onCloseSplit={handleCloseSplit}
                    agentNames={agentNames || {}}
                    isPaneA={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full min-w-0">
              <header className="h-14 border-b border-border px-3 flex items-center bg-card/50 backdrop-blur-sm flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen((current) => !current)}
                  className="h-9 w-9 rounded-xl hover:bg-muted transition-all"
                  title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                  <List size={20} weight="bold" />
                </Button>
              </header>
              <div className="flex-1">
                <EmptyState />
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default App