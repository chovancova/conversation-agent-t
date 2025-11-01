import { useState, useRef, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Plus, PaperPlaneRight, Export, Key, Gear, Robot, ShieldCheck, Trash, List, Palette, Columns } from '@phosphor-icons/react'
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
import { EmptyState } from '@/components/EmptyState'
import { TokenManager } from '@/components/TokenManager'
import { TokenStatus } from '@/components/TokenStatus'
import { AgentSettings } from '@/components/AgentSettings'
import { SecurityInfo } from '@/components/SecurityInfo'
import { ThemeSettings } from '@/components/ThemeSettings'
import { ConversationPane } from '@/components/ConversationPane'
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
  const [selectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
  const [customTheme] = useKV<any>('custom-theme', null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingConversationId, setLoadingConversationId] = useState<string | null>(null)
  const [tokenManagerOpen, setTokenManagerOpen] = useState(false)
  const [agentSettingsOpen, setAgentSettingsOpen] = useState(false)
  const [securityInfoOpen, setSecurityInfoOpen] = useState(false)
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false)
  const [tokenStatusExpanded, setTokenStatusExpanded] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false)

  const activeConversation = (conversations || []).find((c) => c.id === activeConversationId)
  const splitConversation = (conversations || []).find((c) => c.id === splitConversationId)

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

    const updatedMessages = [...conversation.messages, userMessage]
    
    updateConversation(conversation.id, {
      messages: updatedMessages,
      title: conversation.messages.length === 0 
        ? messageContent.slice(0, 50) + (messageContent.length > 50 ? '...' : '')
        : conversation.title,
    })

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

  const handleExport = () => {
    if (!activeConversation || activeConversation.messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    const agentName = getAgentName(activeConversation.agentType, agentNames)
    const exportText = `Agent: ${agentName}\n` +
      `Conversation: ${activeConversation.title}\n` +
      `Created: ${new Date(activeConversation.createdAt).toLocaleString()}\n` +
      (activeConversation.sessionId ? `Session ID: ${activeConversation.sessionId}\n` : '') +
      `\n` +
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

  const handleExportConversation = (conversation: Conversation) => {
    if (!conversation || conversation.messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    const agentName = getAgentName(conversation.agentType, agentNames)
    const exportText = `Agent: ${agentName}\n` +
      `Conversation: ${conversation.title}\n` +
      `Created: ${new Date(conversation.createdAt).toLocaleString()}\n` +
      (conversation.sessionId ? `Session ID: ${conversation.sessionId}\n` : '') +
      `\n` +
      conversation.messages
        .map((m) => {
          const time = new Date(m.timestamp).toLocaleString()
          const role = m.role === 'user' ? 'User' : 'Assistant'
          return `[${time}] ${role}:\n${m.content}\n`
        })
        .join('\n')

    navigator.clipboard.writeText(exportText)
    toast.success('Conversation copied to clipboard')
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

  const conversationToDeleteData = conversations?.find((c) => c.id === conversationToDelete)

  return (
    <>
      <Toaster position="top-right" />
      <TokenManager open={tokenManagerOpen} onOpenChange={setTokenManagerOpen} />
      <AgentSettings open={agentSettingsOpen} onOpenChange={setAgentSettingsOpen} />
      <SecurityInfo open={securityInfoOpen} onOpenChange={setSecurityInfoOpen} />
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
      
      <div className="flex h-screen bg-background">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-border bg-card flex flex-col h-full overflow-hidden`}>
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Robot size={20} weight="bold" className="text-primary-foreground" />
                </div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  Agent Tester
                </h1>
              </div>
            </div>

            <Button 
              onClick={() => createNewConversation('account-opening')}
              className="w-full h-11 mb-4"
              size="lg"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              New Conversation
            </Button>

            <div className="flex gap-2 mb-2">
              <Button 
                onClick={() => setTokenManagerOpen(true)} 
                variant="outline" 
                size="sm"
                className="flex-1 h-9"
              >
                <Key size={16} className="mr-2" />
                Token
              </Button>
              <Button 
                onClick={() => setAgentSettingsOpen(true)} 
                variant="outline" 
                size="sm"
                className="flex-1 h-9"
              >
                <Gear size={16} className="mr-2" />
                Settings
              </Button>
            </div>
            
            <Button 
              onClick={() => setThemeSettingsOpen(true)} 
              variant="outline" 
              size="sm"
              className="w-full h-9"
            >
              <Palette size={16} className="mr-2" />
              Theme
            </Button>
          </div>

          <div className="px-4 py-3 border-b border-border bg-muted/30">
            <TokenStatus 
              onOpenTokenManager={() => setTokenManagerOpen(true)}
              isExpanded={tokenStatusExpanded}
              onToggle={() => setTokenStatusExpanded(!tokenStatusExpanded)}
            />
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between px-2 py-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Conversations
                </div>
                {(conversations?.length || 0) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setClearAllDialogOpen(true)}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash size={14} className="mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
              <ConversationList
                conversations={conversations || []}
                activeId={activeConversationId || null}
                splitId={splitConversationId || null}
                onSelect={setActiveConversationId}
                onDelete={handleDeleteRequest}
                onSelectForSplit={setSplitConversationId}
                splitMode={splitMode}
              />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-muted/20">
            <Button 
              onClick={() => setSecurityInfoOpen(true)} 
              variant="ghost" 
              size="sm"
              className="w-full justify-start h-9 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ShieldCheck size={16} className="mr-2" />
              Security Info
            </Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          {activeConversation ? (
            <div className="flex flex-1 overflow-hidden">
              <div className={`${splitMode && splitConversation ? 'w-1/2 border-r border-border' : 'w-full'} flex flex-col`}>
                <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen((current) => !current)}
                      className="flex-shrink-0"
                    >
                      <List size={20} weight="bold" />
                    </Button>
                    {!sidebarOpen && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => createNewConversation('account-opening')}
                          disabled={isLoading}
                          className="h-9 w-9"
                          title="New conversation"
                        >
                          <Plus size={16} weight="bold" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleQuickTokenRefresh}
                          disabled={isLoading}
                          className={`h-9 w-9 ${isTokenValid ? 'border-accent text-accent hover:bg-accent/10' : 'border-destructive text-destructive hover:bg-destructive/10'}`}
                          title={isTokenValid ? 'Token valid - Click to refresh' : 'Token expired - Click to generate new'}
                        >
                          <Key size={16} weight="bold" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <ConversationPane
                  conversation={activeConversation}
                  isLoading={isLoading && loadingConversationId === activeConversation.id}
                  onSendMessage={sendMessageToConversation}
                  onAgentChange={handleAgentChange}
                  onExport={handleExportConversation}
                  agentNames={agentNames || {}}
                  showSplitButton={!splitMode}
                  onOpenSplit={handleOpenSplit}
                  isPaneA={true}
                />
              </div>
              
              {splitMode && splitConversation && (
                <div className="w-1/2 flex flex-col">
                  <ConversationPane
                    conversation={splitConversation}
                    isLoading={isLoading && loadingConversationId === splitConversation.id}
                    onSendMessage={sendMessageToConversation}
                    onAgentChange={handleAgentChange}
                    onExport={handleExportConversation}
                    onCloseSplit={handleCloseSplit}
                    agentNames={agentNames || {}}
                    isPaneA={false}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <header className="h-16 border-b border-border px-8 flex items-center bg-card/80 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen((current) => !current)}
                  className="flex-shrink-0"
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