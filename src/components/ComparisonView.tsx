import { useMemo, useState } from 'react'
import { Conversation, Message } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, CheckCircle, XCircle, ArrowsLeftRight, TextAa, FileArrowDown } from '@phosphor-icons/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getAgentName } from '@/lib/agents'
import { highlightDifferences } from '@/lib/diffUtils'
import { generateComparisonReport, exportComparisonAsJSON, exportComparisonAsMarkdown } from '@/lib/comparisonExport'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type ComparisonViewProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationA: Conversation | null
  conversationB: Conversation | null
  agentNames?: Record<string, string>
}

type DiffResult = {
  type: 'same' | 'different' | 'only-a' | 'only-b'
  messageA?: Message
  messageB?: Message
  userMessage?: string
}

const calculateSimilarity = (textA: string, textB: string): number => {
  if (textA === textB) return 100
  
  const wordsA = textA.toLowerCase().split(/\s+/)
  const wordsB = textB.toLowerCase().split(/\s+/)
  
  const setA = new Set(wordsA)
  const setB = new Set(wordsB)
  
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  
  return Math.round((intersection.size / union.size) * 100)
}

const DiffIndicator = ({ type, similarity }: { type: string; similarity?: number }) => {
  if (type === 'same') {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
        <CheckCircle size={14} weight="fill" />
        <span className="font-medium">Identical</span>
      </div>
    )
  }
  
  if (type === 'different' && similarity !== undefined) {
    const color = similarity > 70 
      ? 'text-amber-600 dark:text-amber-400' 
      : similarity > 40
      ? 'text-orange-600 dark:text-orange-400'
      : 'text-red-600 dark:text-red-400'
    
    return (
      <div className={`flex items-center gap-1.5 text-xs ${color}`}>
        <ArrowsLeftRight size={14} weight="bold" />
        <span className="font-medium">{similarity}% Similar</span>
      </div>
    )
  }
  
  return (
    <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
      <XCircle size={14} weight="fill" />
      <span className="font-medium">Different</span>
    </div>
  )
}

const MessageCard = ({ 
  message, 
  label, 
  isOnlyOne,
  highlightDiff,
  diffHighlights
}: { 
  message?: Message; 
  label: string;
  isOnlyOne?: boolean;
  highlightDiff?: boolean;
  diffHighlights?: Array<{ text: string; highlight: boolean }>;
}) => {
  if (!message) {
    return (
      <Card className="p-4 bg-muted/30 border-dashed">
        <p className="text-sm text-muted-foreground text-center italic">No response</p>
      </Card>
    )
  }

  const bgClass = message.error 
    ? 'bg-destructive/10 border-destructive/30' 
    : isOnlyOne
    ? 'bg-accent/10 border-accent/30'
    : highlightDiff
    ? 'bg-amber-500/10 border-amber-500/30'
    : 'bg-card'

  return (
    <Card className={`p-4 ${bgClass} transition-colors`}>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs font-semibold">
          {label}
        </Badge>
        {message.responseTime !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{message.responseTime.toFixed(0)}ms</span>
          </div>
        )}
      </div>
      {diffHighlights && diffHighlights.length > 0 ? (
        <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
          {diffHighlights.map((part, index) => (
            <span
              key={index}
              className={cn(
                part.highlight && "bg-amber-500/30 dark:bg-amber-500/20 px-0.5 rounded font-semibold"
              )}
            >
              {part.text}{index < diffHighlights.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      ) : (
        <p className="text-sm text-foreground whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
      )}
      {message.error && (
        <div className="mt-2 pt-2 border-t border-destructive/20">
          <p className="text-xs text-destructive font-medium">Error Response</p>
        </div>
      )}
    </Card>
  )
}

export function ComparisonView({ 
  open, 
  onOpenChange, 
  conversationA, 
  conversationB,
  agentNames = {}
}: ComparisonViewProps) {
  const [showDiffHighlights, setShowDiffHighlights] = useState(true)
  const comparisons = useMemo(() => {
    if (!conversationA || !conversationB) return []

    const results: DiffResult[] = []
    const messagesA = conversationA.messages
    const messagesB = conversationB.messages

    const userMessagesA = messagesA.filter(m => m.role === 'user')
    const userMessagesB = messagesB.filter(m => m.role === 'user')

    const maxUserMessages = Math.max(userMessagesA.length, userMessagesB.length)

    for (let i = 0; i < maxUserMessages; i++) {
      const userMsgA = userMessagesA[i]
      const userMsgB = userMessagesB[i]
      
      const userMessage = userMsgA?.content || userMsgB?.content || ''

      const assistantA = messagesA.find(m => 
        m.role === 'assistant' && 
        m.timestamp > (userMsgA?.timestamp || 0) &&
        (!userMessagesA[i + 1] || m.timestamp < userMessagesA[i + 1].timestamp)
      )

      const assistantB = messagesB.find(m => 
        m.role === 'assistant' && 
        m.timestamp > (userMsgB?.timestamp || 0) &&
        (!userMessagesB[i + 1] || m.timestamp < userMessagesB[i + 1].timestamp)
      )

      if (assistantA && assistantB) {
        const type = assistantA.content === assistantB.content ? 'same' : 'different'
        results.push({ 
          type, 
          messageA: assistantA, 
          messageB: assistantB, 
          userMessage 
        })
      } else if (assistantA && !assistantB) {
        results.push({ 
          type: 'only-a', 
          messageA: assistantA, 
          userMessage 
        })
      } else if (!assistantA && assistantB) {
        results.push({ 
          type: 'only-b', 
          messageB: assistantB, 
          userMessage 
        })
      }
    }

    return results
  }, [conversationA, conversationB])

  const stats = useMemo(() => {
    const same = comparisons.filter(c => c.type === 'same').length
    const different = comparisons.filter(c => c.type === 'different').length
    const onlyA = comparisons.filter(c => c.type === 'only-a').length
    const onlyB = comparisons.filter(c => c.type === 'only-b').length

    const messagesWithTimeA = conversationA?.messages.filter(m => m.role === 'assistant' && m.responseTime) || []
    const avgResponseTimeA = messagesWithTimeA.length > 0
      ? messagesWithTimeA.reduce((sum, m) => sum + (m.responseTime || 0), 0) / messagesWithTimeA.length
      : 0

    const messagesWithTimeB = conversationB?.messages.filter(m => m.role === 'assistant' && m.responseTime) || []
    const avgResponseTimeB = messagesWithTimeB.length > 0
      ? messagesWithTimeB.reduce((sum, m) => sum + (m.responseTime || 0), 0) / messagesWithTimeB.length
      : 0

    return { 
      same, 
      different, 
      onlyA, 
      onlyB, 
      total: comparisons.length,
      avgResponseTimeA,
      avgResponseTimeB
    }
  }, [comparisons, conversationA, conversationB])

  if (!conversationA || !conversationB) return null

  const agentNameA = agentNames[conversationA.agentType] || getAgentName(conversationA.agentType)
  const agentNameB = agentNames[conversationB.agentType] || getAgentName(conversationB.agentType)

  const handleExportJSON = () => {
    const report = generateComparisonReport(conversationA, conversationB, agentNameA, agentNameB)
    exportComparisonAsJSON(report)
    toast.success('Comparison exported as JSON')
  }

  const handleExportMarkdown = () => {
    const report = generateComparisonReport(conversationA, conversationB, agentNameA, agentNameB)
    exportComparisonAsMarkdown(report)
    toast.success('Comparison exported as Markdown')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">Conversation Comparison</DialogTitle>
              <DialogDescription className="text-sm mt-2">
                Side-by-side comparison of agent responses
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDiffHighlights(!showDiffHighlights)}
                className="gap-2"
              >
                <TextAa size={16} weight="bold" />
                {showDiffHighlights ? 'Hide' : 'Show'} Highlights
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileArrowDown size={16} weight="bold" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleExportJSON}>
                    Export as JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportMarkdown}>
                    Export as Markdown
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Conversation A</h3>
              <p className="text-base font-bold text-foreground">{conversationA.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agent: <span className="font-semibold text-primary">{agentNameA}</span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-1">Conversation B</h3>
              <p className="text-base font-bold text-foreground">{conversationB.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agent: <span className="font-semibold text-primary">{agentNameB}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 text-center">
            <Card className="p-3 bg-card">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Exchanges</p>
            </Card>
            <Card className="p-3 bg-emerald-500/10 border-emerald-500/30">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.same}</p>
              <p className="text-xs text-muted-foreground mt-1">Identical</p>
            </Card>
            <Card className="p-3 bg-amber-500/10 border-amber-500/30">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.different}</p>
              <p className="text-xs text-muted-foreground mt-1">Different</p>
            </Card>
            <Card className="p-3 bg-card">
              <p className="text-2xl font-bold text-foreground">
                {stats.avgResponseTimeA.toFixed(0)}ms
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Time A</p>
            </Card>
            <Card className="p-3 bg-card">
              <p className="text-2xl font-bold text-foreground">
                {stats.avgResponseTimeB.toFixed(0)}ms
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg Time B</p>
            </Card>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            {comparisons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No messages to compare</p>
              </div>
            ) : (
              comparisons.map((comparison, index) => {
                const similarity = comparison.messageA && comparison.messageB 
                  ? calculateSimilarity(comparison.messageA.content, comparison.messageB.content)
                  : 0

                const diffData = comparison.messageA && comparison.messageB && showDiffHighlights
                  ? highlightDifferences(comparison.messageA.content, comparison.messageB.content)
                  : null

                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          #{index + 1}
                        </Badge>
                        <p className="text-sm font-medium text-muted-foreground">
                          {comparison.userMessage && comparison.userMessage.length > 80 
                            ? `${comparison.userMessage.slice(0, 80)}...` 
                            : comparison.userMessage}
                        </p>
                      </div>
                      <DiffIndicator 
                        type={comparison.type} 
                        similarity={comparison.type === 'different' ? similarity : undefined}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <MessageCard 
                        message={comparison.messageA} 
                        label={agentNameA}
                        isOnlyOne={comparison.type === 'only-a'}
                        highlightDiff={comparison.type === 'different'}
                        diffHighlights={diffData?.highlightedA}
                      />
                      <MessageCard 
                        message={comparison.messageB} 
                        label={agentNameB}
                        isOnlyOne={comparison.type === 'only-b'}
                        highlightDiff={comparison.type === 'different'}
                        diffHighlights={diffData?.highlightedB}
                      />
                    </div>

                    {index < comparisons.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
