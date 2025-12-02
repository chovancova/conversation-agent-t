import { useState, forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MagnifyingGlass, X as XIcon, Funnel, ChatCircle, FileText } from '@phosphor-icons/react'
import { AgentType } from '@/lib/types'
import { AGENTS } from '@/lib/agents'

export type SearchScope = 'all' | 'titles' | 'messages'

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

  return (
    <div className="space-y-2">
      <div className="relative">
        <MagnifyingGlass
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          weight="bold"
        />
        <Input
          ref={ref}
          type="text"
          placeholder={getPlaceholder()}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9 h-9 bg-background border-border"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSearchChange('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <XIcon size={14} weight="bold" />
          </Button>
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
