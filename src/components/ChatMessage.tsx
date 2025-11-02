import { useState } from 'react'
import { Robot, User, Warning, Copy, Check } from '@phosphor-icons/react'
import { Message } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ChatMessageProps = {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      toast.success('Message copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  return (
    <div className={`flex gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
          message.error 
            ? 'bg-destructive text-destructive-foreground' 
            : isUser 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-accent text-accent-foreground'
        }`}
      >
        {message.error ? (
          <Warning size={18} weight="bold" />
        ) : isUser ? (
          <User size={18} weight="bold" />
        ) : (
          <Robot size={18} weight="bold" />
        )}
      </div>
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="relative">
          <Card
            className={`px-4 py-3 ${
              message.error
                ? 'bg-destructive/10 border-destructive text-destructive'
                : isUser
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border-border'
            }`}
          >
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </Card>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={`absolute -top-2 ${isUser ? '-left-10' : '-right-10'} h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border shadow-sm hover:bg-muted`}
            title="Copy message"
          >
            {copied ? (
              <Check size={14} weight="bold" className="text-accent" />
            ) : (
              <Copy size={14} weight="bold" />
            )}
          </Button>
        </div>
        <span className="text-[13px] text-muted-foreground px-1">{time}</span>
      </div>
    </div>
  )
}
