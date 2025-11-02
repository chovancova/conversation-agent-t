import { useKV } from '@github/spark/hooks'
import { Key, CaretDown } from '@phosphor-icons/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TokenConfig } from '@/lib/types'
import { cn } from '@/lib/utils'

type TokenSelectorProps = {
  conversationId: string
  selectedTokenId?: string
  onTokenChange: (conversationId: string, tokenId: string | undefined) => void
  className?: string
  compact?: boolean
}

export function TokenSelector({ 
  conversationId, 
  selectedTokenId, 
  onTokenChange,
  className,
  compact = false
}: TokenSelectorProps) {
  const [savedTokens] = useKV<TokenConfig[]>('saved-tokens', [])
  const [globalSelectedTokenId] = useKV<string | null>('selected-token-id', null)

  const activeTokenId = selectedTokenId || globalSelectedTokenId || undefined
  const activeToken = savedTokens?.find(t => t.id === activeTokenId)

  const handleValueChange = (value: string) => {
    if (value === 'default') {
      onTokenChange(conversationId, undefined)
    } else {
      onTokenChange(conversationId, value)
    }
  }

  if (!savedTokens || savedTokens.length === 0) {
    return null
  }

  if (compact) {
    return (
      <Select value={activeTokenId || 'default'} onValueChange={handleValueChange}>
        <SelectTrigger className={cn("h-8 w-[180px] text-xs", className)}>
          <div className="flex items-center gap-1.5">
            <Key size={12} weight="bold" className="text-muted-foreground" />
            <SelectValue placeholder="Token Config" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">
            <div className="flex items-center gap-2">
              <Key size={14} weight="bold" className="text-primary" />
              <span className="text-xs">Default Token</span>
            </div>
          </SelectItem>
          {savedTokens.map((token) => (
            <SelectItem key={token.id} value={token.id}>
              <div className="flex items-center gap-2">
                <Key size={14} weight="bold" className="text-accent" />
                <span className="text-xs">{token.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Select value={activeTokenId || 'default'} onValueChange={handleValueChange}>
      <SelectTrigger className={cn("h-9 w-[220px]", className)}>
        <div className="flex items-center gap-2">
          <Key size={14} weight="bold" className="text-muted-foreground" />
          <SelectValue placeholder="Token Configuration" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Key size={14} weight="bold" className="text-primary" />
              <span className="text-sm font-medium">Default Token</span>
            </div>
            <span className="text-xs text-muted-foreground ml-5">
              Use global token configuration
            </span>
          </div>
        </SelectItem>
        {savedTokens.map((token) => (
          <SelectItem key={token.id} value={token.id}>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <Key size={14} weight="bold" className="text-accent" />
                <span className="text-sm font-medium">{token.name}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-5 truncate max-w-[180px]">
                {token.endpoint.length > 40 ? `${token.endpoint.slice(0, 40)}...` : token.endpoint}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
