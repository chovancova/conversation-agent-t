import { Conversation, Message } from './types'

export type ResponseTimeStats = {
  average: number
  min: number
  max: number
  median: number
  count: number
  total: number
}

export type AgentAnalytics = {
  agentType: string
  agentName: string
  totalMessages: number
  successfulResponses: number
  failedResponses: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  medianResponseTime: number
  lastUsed: number
  conversationCount: number
  successRate: number
}

export type ConversationAnalytics = {
  conversationId: string
  conversationTitle: string
  agentType: string
  messageCount: number
  averageResponseTime: number
  totalResponseTime: number
  successRate: number
  createdAt: number
  updatedAt: number
}

export type OverallAnalytics = {
  totalConversations: number
  totalMessages: number
  totalResponseTime: number
  averageResponseTime: number
  successRate: number
  byAgent: AgentAnalytics[]
  byConversation: ConversationAnalytics[]
  timeRange: {
    earliest: number
    latest: number
  }
}

export const calculateResponseTimeStats = (responseTimes: number[]): ResponseTimeStats => {
  if (responseTimes.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      median: 0,
      count: 0,
      total: 0
    }
  }

  const sorted = [...responseTimes].sort((a, b) => a - b)
  const total = sorted.reduce((sum, time) => sum + time, 0)
  const average = total / sorted.length
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)]

  return {
    average,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    median,
    count: sorted.length,
    total
  }
}

export const getAssistantMessages = (messages: Message[]): Message[] => {
  return messages.filter(m => m.role === 'assistant')
}

export const getResponseTimesFromMessages = (messages: Message[]): number[] => {
  return messages
    .filter(m => m.role === 'assistant' && typeof m.responseTime === 'number' && !m.error)
    .map(m => m.responseTime!)
}

export const calculateAgentAnalytics = (
  conversations: Conversation[],
  agentNames: Record<string, string>
): AgentAnalytics[] => {
  const agentMap = new Map<string, {
    messages: Message[]
    conversations: Set<string>
    lastUsed: number
  }>()

  conversations.forEach(conv => {
    if (!agentMap.has(conv.agentType)) {
      agentMap.set(conv.agentType, {
        messages: [],
        conversations: new Set(),
        lastUsed: 0
      })
    }

    const agentData = agentMap.get(conv.agentType)!
    agentData.messages.push(...getAssistantMessages(conv.messages))
    agentData.conversations.add(conv.id)
    agentData.lastUsed = Math.max(agentData.lastUsed, conv.updatedAt)
  })

  const analytics: AgentAnalytics[] = []

  agentMap.forEach((data, agentType) => {
    const totalMessages = data.messages.length
    const successfulResponses = data.messages.filter(m => !m.error).length
    const failedResponses = data.messages.filter(m => m.error).length
    const responseTimes = getResponseTimesFromMessages(data.messages)
    const stats = calculateResponseTimeStats(responseTimes)

    analytics.push({
      agentType,
      agentName: agentNames[agentType] || agentType,
      totalMessages,
      successfulResponses,
      failedResponses,
      averageResponseTime: stats.average,
      minResponseTime: stats.min,
      maxResponseTime: stats.max,
      medianResponseTime: stats.median,
      lastUsed: data.lastUsed,
      conversationCount: data.conversations.size,
      successRate: totalMessages > 0 ? (successfulResponses / totalMessages) * 100 : 0
    })
  })

  return analytics.sort((a, b) => b.totalMessages - a.totalMessages)
}

export const calculateConversationAnalytics = (
  conversations: Conversation[]
): ConversationAnalytics[] => {
  return conversations.map(conv => {
    const assistantMessages = getAssistantMessages(conv.messages)
    const successfulMessages = assistantMessages.filter(m => !m.error)
    const responseTimes = getResponseTimesFromMessages(conv.messages)
    const stats = calculateResponseTimeStats(responseTimes)

    return {
      conversationId: conv.id,
      conversationTitle: conv.title,
      agentType: conv.agentType,
      messageCount: assistantMessages.length,
      averageResponseTime: stats.average,
      totalResponseTime: stats.total,
      successRate: assistantMessages.length > 0 
        ? (successfulMessages.length / assistantMessages.length) * 100 
        : 0,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt
    }
  }).sort((a, b) => b.updatedAt - a.updatedAt)
}

export const calculateOverallAnalytics = (
  conversations: Conversation[],
  agentNames: Record<string, string>
): OverallAnalytics => {
  const allMessages = conversations.flatMap(conv => getAssistantMessages(conv.messages))
  const allResponseTimes = conversations.flatMap(conv => getResponseTimesFromMessages(conv.messages))
  const stats = calculateResponseTimeStats(allResponseTimes)
  
  const successfulMessages = allMessages.filter(m => !m.error)
  const successRate = allMessages.length > 0 
    ? (successfulMessages.length / allMessages.length) * 100 
    : 0

  const timestamps = conversations.flatMap(conv => [conv.createdAt, conv.updatedAt])
  const earliest = timestamps.length > 0 ? Math.min(...timestamps) : Date.now()
  const latest = timestamps.length > 0 ? Math.max(...timestamps) : Date.now()

  return {
    totalConversations: conversations.length,
    totalMessages: allMessages.length,
    totalResponseTime: stats.total,
    averageResponseTime: stats.average,
    successRate,
    byAgent: calculateAgentAnalytics(conversations, agentNames),
    byConversation: calculateConversationAnalytics(conversations),
    timeRange: {
      earliest,
      latest
    }
  }
}

export const formatResponseTime = (ms: number): string => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const exportAnalyticsAsJSON = (analytics: OverallAnalytics): string => {
  return JSON.stringify(analytics, null, 2)
}

export const exportAnalyticsAsCSV = (analytics: OverallAnalytics): string => {
  const headers = [
    'Agent Type',
    'Agent Name',
    'Total Messages',
    'Successful',
    'Failed',
    'Success Rate %',
    'Avg Response Time (ms)',
    'Min Response Time (ms)',
    'Max Response Time (ms)',
    'Median Response Time (ms)',
    'Conversations',
    'Last Used'
  ]

  const rows = analytics.byAgent.map(agent => [
    agent.agentType,
    agent.agentName,
    agent.totalMessages.toString(),
    agent.successfulResponses.toString(),
    agent.failedResponses.toString(),
    agent.successRate.toFixed(2),
    agent.averageResponseTime.toFixed(2),
    agent.minResponseTime.toFixed(2),
    agent.maxResponseTime.toFixed(2),
    agent.medianResponseTime.toFixed(2),
    agent.conversationCount.toString(),
    new Date(agent.lastUsed).toISOString()
  ])

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}
