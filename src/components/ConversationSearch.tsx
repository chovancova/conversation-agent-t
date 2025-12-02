import { useState, forwardRef, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass, X as XIcon, Funnel, ChatCircle, FileText, ClockCounterClockwise, Trash } from '@phosphor-icons/react'
import { AgentType } from '@/lib/types'
import { AGENTS } from '@/lib/agents'

export type SearchScope = 'all' | 'titles' | 'messages'

type SearchHistoryEntry = {
  query: string
  timestamp: number
  scope: SearchScope
}

type ConversationSearchProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  searchScope: SearchScope
  onSearchScopeChange: (scope: SearchScope) => void
  selectedAgents: AgentType[]
  onAgentToggle: (agent: AgentType) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export const ConversationSearch = forwardRef<HTMLInputElement, ConversationSearchProps>(({
  searchQuery,
  onSearchChange,
  searchScope,
  onSearchScopeChange,
  selectedAgents,
  onAgentToggle,
  onClearFilters,
  hasActiveFilters
}, ref) => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useKV<SearchHistoryEntry[]>('search-history', [])
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const MAX_HISTORY_ITEMS = 20

  useEffect(() => {
    if (ref && typeof ref !== 'function') {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = inputRef.current
    }
  }, [ref])

  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length >= 2) {
      const timer = setTimeout(() => {
        addToSearchHistory(searchQuery.trim(), searchScope)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [searchQuery, searchScope])

  const addToSearchHistory = (query: string, scope: SearchScope) => {
    if (!query || query.length < 2) return

    setSearchHistory((current = []) => {
      const filtered = current.filter(
        entry => entry.query.toLowerCase() !== query.toLowerCase()
      )
      
      const newEntry: SearchHistoryEntry = {
        query,
        timestamp: Date.now(),
        scope
      }
      
      const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      return updated
    })
  }

  const handleSelectHistoryItem = (entry: SearchHistoryEntry) => {
    onSearchChange(entry.query)
    onSearchScopeChange(entry.scope)
    setHistoryOpen(false)
    inputRef.current?.focus()
  }

  const handleRemoveHistoryItem = (query: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSearchHistory((current = []) => 
      current.filter(entry => entry.query !== query)
    )
  }

  const handleClearHistory = () => {
    setSearchHistory([])
    setHistoryOpen(false)
  }

  const getPlaceholder = () => {
    switch (searchScope) {
      case 'titles':
        return 'Search conversation titles...'
      case 'messages':
        return 'Search message content...'
      default:
        return 'Search conversations and messages...'
    }
  }

  const filteredHistory = (searchHistory || []).filter(entry => {
    if (!searchQuery) return true
    return entry.query.toLowerCase().includes(searchQuery.toLowerCase())
  }).slice(0, 10)

  const showHistoryDropdown = isFocused && filteredHistory.length > 0

  return (
    <div className="space-y-2">
      <div className="relative">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
          weight="bold"
        />
        <Input
          ref={inputRef}
          type="text"
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-9 pr-20 h-9 bg-background border-border"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(searchHistory || []).length > 0 && (
            <Popover open={historyOpen} onOpenChange={setHistoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Search history"
                >
                  <ClockCounterClockwise size={14} weight="bold" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Search History</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash size={12} className="mr-1" />
                    Clear
                  </Button>
                </div>
                <ScrollArea className="max-h-80">
                  <div className="p-2">
                    {(searchHistory || []).length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground">
                        No search history yet
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {(searchHistory || []).map((entry, index) => (
                          <button
                            key={`${entry.query}-${index}`}
                            onClick={() => handleSelectHistoryItem(entry)}
                            className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-foreground truncate">
                                  {entry.query}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                                    {entry.scope === 'all' ? 'All' : entry.scope === 'titles' ? 'Titles' : 'Messages'}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(entry.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleRemoveHistoryItem(entry.query, e)}
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              >
                                <XIcon size={12} weight="bold" />
                              </Button>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSearchChange('')}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <XIcon size={14} weight="bold" />
            </Button>
          )}
        </div>

        {showHistoryDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
                Recent Searches
              </div>
            </div>
            <ScrollArea className="max-h-60">
              <div className="p-1">
                {filteredHistory.map((entry, index) => (
                  <button
                    key={`${entry.query}-${index}`}
                    onClick={() => handleSelectHistoryItem(entry)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ClockCounterClockwise size={14} className="text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-foreground truncate">
                          {entry.query}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5 flex-shrink-0">
                        {entry.scope === 'all' ? 'All' : entry.scope === 'titles' ? 'Titles' : 'Messages'}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {searchQuery && (
        <Tabs value={searchScope} onValueChange={(value) => onSearchScopeChange(value as SearchScope)} className="w-full">
          <TabsList className="w-full h-8 bg-muted/50">
            <TabsTrigger value="all" className="flex-1 text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All
            </TabsTrigger>
            <TabsTrigger value="titles" className="flex-1 text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText size={12} className="mr-1" />
              Titles
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex-1 text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ChatCircle size={12} className="mr-1" />
              Messages
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <div className="flex items-center gap-2">
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 ${hasActiveFilters ? 'border-primary text-primary' : ''}`}
            >
              <Funnel size={14} weight={hasActiveFilters ? 'fill' : 'bold'} />
              Filter
              {selectedAgents.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {selectedAgents.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="start">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Filter by Agent</h4>
                {selectedAgents.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      selectedAgents.forEach(agent => onAgentToggle(agent))
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="space-y-1.5">
                {Object.values(AGENTS).filter(agent => agent && agent.type).map((agent) => {
                  const isSelected = selectedAgents.includes(agent.type)
                  return (
                    <button
                      key={agent.type}
                      onClick={() => onAgentToggle(agent.type)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{agent?.name || agent.type}</span>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
})

ConversationSearch.displayName = 'ConversationSearch'
