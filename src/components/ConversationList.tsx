import { useState, useRef, useEffect } from 'react'
import { Conversation } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getAgentConfig } from '@/lib/agents'
import { Chat, Robot, Trash, Columns, PencilSimple, Check, X } from '@phosphor-icons/react'

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
    <div className="flex flex-col gap-1.5">
      {conversations.map((conversation) => {
        const agent = getAgentConfig(conversation.agentType)
        const isActive = activeId === conversation.id
        const isInSplit = splitId === conversation.id
        const isHighlighted = isActive || isInSplit
        const isEditing = editingId === conversation.id
        return (
          <div
            key={conversation.id}
            className={`relative rounded-lg transition-all duration-150 group overflow-hidden ${
              isActive
                ? 'bg-accent text-accent-foreground shadow-sm'
                : isInSplit
                ? 'bg-primary/10 border border-primary/30'
                : 'hover:bg-muted/80'
            }`}
          >
            <button
              onClick={() => !isEditing && onSelect(conversation.id)}
              className="w-full text-left px-3 py-3"
              disabled={isEditing}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isActive 
                    ? 'bg-accent-foreground/10' 
                    : isInSplit 
                    ? 'bg-primary/20'
                    : 'bg-muted group-hover:bg-muted-foreground/10'
                }`}>
                  <Robot size={14} weight="duotone" className={
                    isActive 
                      ? 'text-accent-foreground' 
                      : isInSplit
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  } />
                </div>
                <div className={`flex-1 min-w-0 ${splitMode && onSelectForSplit && !isActive ? 'pr-28' : 'pr-20'}`}>
                  {isEditing ? (
                    <div className="flex items-center gap-1 mb-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`h-7 text-sm font-medium px-2 ${
                          isActive 
                            ? 'bg-accent-foreground/10 border-accent-foreground/30 text-accent-foreground' 
                            : isInSplit
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-background border-input'
                        }`}
                      />
                    </div>
                  ) : (
                    <h3 className={`font-medium text-sm truncate mb-1 ${
                      isActive 
                        ? 'text-accent-foreground' 
                        : isInSplit
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}>
                      {conversation.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className={`text-[10px] px-1.5 py-0 font-medium h-5 flex-shrink-0 ${
                        isActive 
                          ? 'bg-accent-foreground/15 text-accent-foreground border-0' 
                          : isInSplit
                          ? 'bg-primary/20 text-primary border-0'
                          : 'bg-muted'
                      }`}
                    >
                      {agent?.name || conversation.agentType}
                    </Badge>
                    {conversation.messages.length > 0 && (
                      <span className={`text-xs flex-shrink-0 ${
                        isActive 
                          ? 'text-accent-foreground/60' 
                          : isInSplit
                          ? 'text-primary/70'
                          : 'text-muted-foreground'
                      }`}>
                        {conversation.messages.length} msgs
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className={`text-xs pl-9 truncate ${
                isActive 
                  ? 'text-accent-foreground/60' 
                  : isInSplit
                  ? 'text-primary/60'
                  : 'text-muted-foreground/80'
              }`}>
                {new Date(conversation.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </button>
            <div className="absolute top-2 right-2 flex gap-1 items-center">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveEdit()
                    }}
                    className="h-7 w-7 flex-shrink-0 bg-accent/80 text-accent-foreground hover:bg-accent"
                    title="Save"
                  >
                    <Check size={14} weight="bold" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelEdit()
                    }}
                    className="h-7 w-7 flex-shrink-0 hover:bg-muted text-muted-foreground"
                    title="Cancel"
                  >
                    <X size={14} weight="bold" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleStartEdit(e, conversation)}
                    className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                      isHighlighted 
                        ? isActive
                          ? 'hover:bg-accent-foreground/10 text-accent-foreground'
                          : 'hover:bg-primary/10 text-primary'
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
                      className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                        isInSplit
                          ? 'opacity-100 bg-primary/10 text-primary hover:bg-primary/20'
                          : 'hover:bg-primary/10 text-muted-foreground hover:text-primary'
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
                    className={`h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${
                      isHighlighted 
                        ? isActive
                          ? 'hover:bg-accent-foreground/10 text-accent-foreground'
                          : 'hover:bg-primary/10 text-primary'
                        : 'hover:bg-destructive/10 text-muted-foreground hover:text-destructive'
                    }`}
                    title="Delete"
                  >
                    <Trash size={14} weight="bold" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
