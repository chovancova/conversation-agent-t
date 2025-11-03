import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Download, ChartBar, Clock, CheckCircle, XCircle, TrendUp } from '@phosphor-icons/react'
import { Conversation } from '@/lib/types'
import { 
  calculateOverallAnalytics, 
  formatResponseTime, 
  formatPercentage, 
  exportAnalyticsAsJSON, 
  exportAnalyticsAsCSV 
} from '@/lib/analytics'
import { toast } from 'sonner'

type AnalyticsDashboardProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnalyticsDashboard({ open, onOpenChange }: AnalyticsDashboardProps) {
  const [conversations] = useKV<Conversation[]>('conversations', [])
  const [agentNames] = useKV<Record<string, string>>('agent-names', {})
  const [selectedTab, setSelectedTab] = useState<'overview' | 'agents' | 'conversations'>('overview')

  const analytics = useMemo(() => {
    return calculateOverallAnalytics(conversations || [], agentNames || {})
  }, [conversations, agentNames])

  const handleExportJSON = () => {
    const json = exportAnalyticsAsJSON(analytics)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Analytics exported as JSON')
  }

  const handleExportCSV = () => {
    const csv = exportAnalyticsAsCSV(analytics)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Analytics exported as CSV')
  }

  const timeRangeDays = Math.ceil((analytics.timeRange.latest - analytics.timeRange.earliest) / (1000 * 60 * 60 * 24))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <ChartBar size={28} weight="duotone" className="text-primary" />
                Response Time Analytics
              </DialogTitle>
              <DialogDescription className="mt-2">
                Track and analyze agent response times and performance metrics
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportJSON}>
                <Download size={16} className="mr-2" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download size={16} className="mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="px-6 py-4">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalConversations}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Over {timeRangeDays} {timeRangeDays === 1 ? 'day' : 'days'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.totalMessages}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  From agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock size={14} />
                  Avg Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatResponseTime(analytics.averageResponseTime)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all agents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <TrendUp size={14} />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(analytics.successRate)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successful responses
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="agents">By Agent</TabsTrigger>
              <TabsTrigger value="conversations">By Conversation</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Performance</CardTitle>
                      <CardDescription>Summary of all agent interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Response Time</span>
                        <span className="font-semibold">{formatResponseTime(analytics.totalResponseTime)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Response Time</span>
                        <span className="font-semibold">{formatResponseTime(analytics.averageResponseTime)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Success Rate</span>
                        <Badge variant={analytics.successRate >= 90 ? 'default' : analytics.successRate >= 70 ? 'secondary' : 'destructive'}>
                          {formatPercentage(analytics.successRate)}
                        </Badge>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Agents</span>
                        <span className="font-semibold">{analytics.byAgent.length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Performers</CardTitle>
                      <CardDescription>Fastest responding agents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.byAgent
                          .filter(a => a.totalMessages > 0)
                          .sort((a, b) => a.averageResponseTime - b.averageResponseTime)
                          .slice(0, 5)
                          .map((agent, index) => (
                            <div key={agent.agentType} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{agent.agentName}</p>
                                  <p className="text-xs text-muted-foreground">{agent.totalMessages} messages</p>
                                </div>
                              </div>
                              <Badge variant="secondary">{formatResponseTime(agent.averageResponseTime)}</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="agents" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {analytics.byAgent.map((agent) => (
                    <Card key={agent.agentType}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{agent.agentName}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {agent.conversationCount} {agent.conversationCount === 1 ? 'conversation' : 'conversations'} • 
                              Last used {new Date(agent.lastUsed).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant={agent.successRate >= 90 ? 'default' : agent.successRate >= 70 ? 'secondary' : 'destructive'}>
                            {formatPercentage(agent.successRate)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500" weight="fill" />
                            <span className="text-muted-foreground">Successful:</span>
                            <span className="font-semibold">{agent.successfulResponses}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <XCircle size={16} className="text-red-500" weight="fill" />
                            <span className="text-muted-foreground">Failed:</span>
                            <span className="font-semibold">{agent.failedResponses}</span>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Average</p>
                            <p className="font-semibold">{formatResponseTime(agent.averageResponseTime)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Median</p>
                            <p className="font-semibold">{formatResponseTime(agent.medianResponseTime)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Min</p>
                            <p className="font-semibold">{formatResponseTime(agent.minResponseTime)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Max</p>
                            <p className="font-semibold">{formatResponseTime(agent.maxResponseTime)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {analytics.byAgent.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">No agent data available yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Start conversations to see analytics</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="conversations" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {analytics.byConversation.map((conv) => (
                    <Card key={conv.conversationId}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-sm truncate">{conv.conversationTitle}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {conv.agentType} • {conv.messageCount} {conv.messageCount === 1 ? 'message' : 'messages'}
                            </CardDescription>
                          </div>
                          <Badge variant={conv.successRate >= 90 ? 'default' : conv.successRate >= 70 ? 'secondary' : 'destructive'}>
                            {formatPercentage(conv.successRate)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Response Time</span>
                          <span className="font-semibold">{formatResponseTime(conv.averageResponseTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Response Time</span>
                          <span className="font-semibold">{formatResponseTime(conv.totalResponseTime)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Created: {new Date(conv.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(conv.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {analytics.byConversation.length === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">No conversation data available yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Create conversations to see analytics</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
