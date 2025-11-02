import { useState, useRef, useEffect } from 'react'
import { Conversation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAgentConfig } from '@/lib/agents'
import { Chat, Robot, Trash, Columns, PencilSimple, Check, X, ChatCircle, Clock } from '@phosphor-icons/react'

type ConversationListProps = {
  conversations: Conversation[]
  activeId: string | null
  splitId?: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
  onSelectForSplit?: (id: string) => void
  splitMode?: boolean
}

export function ConversationList({ conversations, activeId, splitId, onSelect, onDelete, onRename, onSelectForSplit, splitMode }: ConversationListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingId])

  const handleStartEdit = (e: React.MouseEvent, conversation: Conversation) => {
    e.stopPropagation()
    setEditingId(conversation.id)
    setEditValue(conversation.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim())
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  const formatDate = (timestamp: number) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else if (diffInHours < 168) {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }
  }

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
    <div className="flex flex-col gap-2">
      {conversations.map((conversation) => {
        const agent = getAgentConfig(conversation.agentType)
        const isActive = activeId === conversation.id
        const isInSplit = splitId === conversation.id
        const isHighlighted = isActive || isInSplit
        const isEditing = editingId === conversation.id
        const hasMessages = conversation.messages.length > 0
        
        return (
          <div
            key={conversation.id}
            className={`relative rounded-xl transition-all duration-200 group ${
              isActive
                ? 'bg-gradient-to-br from-primary/15 to-accent/10 shadow-sm ring-1 ring-primary/20'
                : isInSplit
                ? 'bg-accent/10 shadow-sm ring-1 ring-accent/30'
                : 'bg-card hover:bg-muted/50 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => !isEditing && onSelect(conversation.id)}
              className="w-full text-left p-3.5"
              disabled={isEditing}
            >
              <div className="flex items-start gap-3 mb-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-primary/20 ring-1 ring-primary/30' 
                    : isInSplit 
                    ? 'bg-accent/20 ring-1 ring-accent/30'
                    : 'bg-muted/50 group-hover:bg-muted'
                }`}>
                  <Robot size={18} weight="duotone" className={
                    isActive 
                      ? 'text-primary' 
                      : isInSplit
                      ? 'text-accent'
                      : 'text-muted-foreground'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mb-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`h-8 text-sm font-semibold px-2.5 ${
                          isActive 
                            ? 'bg-primary/10 border-primary/30 text-foreground' 
                            : isInSplit
                            ? 'bg-accent/10 border-accent/30 text-foreground'
                            : 'bg-background border-input'
                        }`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSaveEdit()
                        }}
                        className="h-8 w-8 flex-shrink-0 bg-primary/20 text-primary hover:bg-primary/30"
                        title="Save"
                      >
                        <Check size={16} weight="bold" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCancelEdit()
                        }}
                        className="h-8 w-8 flex-shrink-0 hover:bg-muted text-muted-foreground"
                        title="Cancel"
                      >
                        <X size={16} weight="bold" />
                      </Button>
                    </div>
                  ) : (
                    <h3 className={`font-semibold text-sm leading-snug mb-2 line-clamp-2 ${
                      isActive 
                        ? 'text-foreground' 
                        : isInSplit
                        ? 'text-foreground'
                        : 'text-foreground/90'
                    }`}>
                      {conversation.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] px-2 py-0.5 font-medium h-5 flex-shrink-0 ${
                        isActive 
                          ? 'bg-primary/20 text-primary border-0' 
                          : isInSplit
                          ? 'bg-accent/25 text-accent border-0'
                          : 'bg-muted/80 text-muted-foreground'
                      }`}
                    >
                      {agent?.name || conversation.agentType}
                    </Badge>
                    {hasMessages && (
                      <div className={`flex items-center gap-1 text-[11px] flex-shrink-0 ${
                        isActive 
                          ? 'text-primary/70' 
                          : isInSplit
                          ? 'text-accent/70'
                          : 'text-muted-foreground/80'
                      }`}>
                        <ChatCircle size={12} weight="fill" />
                        <span className="font-medium">{conversation.messages.length}</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1 text-[11px] ${
                    isActive 
                      ? 'text-primary/60' 
                      : isInSplit
                      ? 'text-accent/60'
                      : 'text-muted-foreground/70'
                  }`}>
                    <Clock size={11} />
                    <span>{formatDate(conversation.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </button>
            {!isEditing && (
              <div className="absolute top-2.5 right-2.5 flex gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartEdit(e, conversation)
                  }}
                  className={`h-7 w-7 flex-shrink-0 ${
                    isHighlighted 
                      ? isActive
                        ? 'hover:bg-primary/15 text-primary'
                        : 'hover:bg-accent/15 text-accent'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                  title="Rename"
                >
                  <PencilSimple size={14} weight="bold" />
                </Button>
                {splitMode && onSelectForSplit && !isActive && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectForSplit(conversation.id)
                    }}
                    className={`h-7 w-7 flex-shrink-0 ${
                      isInSplit
                        ? 'opacity-100 bg-accent/20 text-accent hover:bg-accent/30'
                        : 'hover:bg-accent/15 text-muted-foreground hover:text-accent'
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
                  className="h-7 w-7 flex-shrink-0 hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash size={14} weight="bold" />
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
                  className="h-7 w-7 flex-shrink-0 hover:bg-destructive/15 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash size={14} weight="bold" />
                </Button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}