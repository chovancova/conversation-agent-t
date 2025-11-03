import { Conversation } from './types'

export type ComparisonReport = {
  timestamp: number
  conversationA: {
    id: string
    title: string
    agentType: string
  }
  conversationB: {
    id: string
    title: string
    agentType: string
  }
  statistics: {
    totalExchanges: number
    identicalResponses: number
    differentResponses: number
    averageResponseTimeA: number
    averageResponseTimeB: number
  }
  exchanges: Array<{
    index: number
    userMessage: string
    responseA?: {
      content: string
      responseTime?: number
      error?: boolean
    }
    responseB?: {
      content: string
      responseTime?: number
      error?: boolean
    }
    similarity?: number
  }>
}

export function generateComparisonReport(
  conversationA: Conversation,
  conversationB: Conversation,
  agentNameA: string,
  agentNameB: string
): ComparisonReport {
  const messagesA = conversationA.messages
  const messagesB = conversationB.messages
  const userMessagesA = messagesA.filter(m => m.role === 'user')
  const userMessagesB = messagesB.filter(m => m.role === 'user')
  const maxUserMessages = Math.max(userMessagesA.length, userMessagesB.length)

  const exchanges: ComparisonReport['exchanges'] = []
  let identicalCount = 0
  let differentCount = 0

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
      if (assistantA.content === assistantB.content) {
        identicalCount++
      } else {
        differentCount++
      }

      const wordsA = assistantA.content.toLowerCase().split(/\s+/)
      const wordsB = assistantB.content.toLowerCase().split(/\s+/)
      const setA = new Set(wordsA)
      const setB = new Set(wordsB)
      const intersection = new Set([...setA].filter(x => setB.has(x)))
      const union = new Set([...setA, ...setB])
      const similarity = Math.round((intersection.size / union.size) * 100)

      exchanges.push({
        index: i + 1,
        userMessage,
        responseA: {
          content: assistantA.content,
          responseTime: assistantA.responseTime,
          error: assistantA.error
        },
        responseB: {
          content: assistantB.content,
          responseTime: assistantB.responseTime,
          error: assistantB.error
        },
        similarity
      })
    } else if (assistantA) {
      exchanges.push({
        index: i + 1,
        userMessage,
        responseA: {
          content: assistantA.content,
          responseTime: assistantA.responseTime,
          error: assistantA.error
        }
      })
    } else if (assistantB) {
      exchanges.push({
        index: i + 1,
        userMessage,
        responseB: {
          content: assistantB.content,
          responseTime: assistantB.responseTime,
          error: assistantB.error
        }
      })
    }
  }

  const messagesWithTimeA = messagesA.filter(m => m.role === 'assistant' && m.responseTime)
  const avgResponseTimeA = messagesWithTimeA.length > 0
    ? messagesWithTimeA.reduce((sum, m) => sum + (m.responseTime || 0), 0) / messagesWithTimeA.length
    : 0

  const messagesWithTimeB = messagesB.filter(m => m.role === 'assistant' && m.responseTime)
  const avgResponseTimeB = messagesWithTimeB.length > 0
    ? messagesWithTimeB.reduce((sum, m) => sum + (m.responseTime || 0), 0) / messagesWithTimeB.length
    : 0

  return {
    timestamp: Date.now(),
    conversationA: {
      id: conversationA.id,
      title: conversationA.title,
      agentType: agentNameA
    },
    conversationB: {
      id: conversationB.id,
      title: conversationB.title,
      agentType: agentNameB
    },
    statistics: {
      totalExchanges: exchanges.length,
      identicalResponses: identicalCount,
      differentResponses: differentCount,
      averageResponseTimeA: Math.round(avgResponseTimeA),
      averageResponseTimeB: Math.round(avgResponseTimeB)
    },
    exchanges
  }
}

export function exportComparisonAsJSON(report: ComparisonReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparison-report-${new Date(report.timestamp).toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportComparisonAsMarkdown(report: ComparisonReport): void {
  let markdown = `# Conversation Comparison Report\n\n`
  markdown += `**Generated:** ${new Date(report.timestamp).toLocaleString()}\n\n`
  
  markdown += `## Conversations\n\n`
  markdown += `### Conversation A\n`
  markdown += `- **Title:** ${report.conversationA.title}\n`
  markdown += `- **Agent:** ${report.conversationA.agentType}\n\n`
  
  markdown += `### Conversation B\n`
  markdown += `- **Title:** ${report.conversationB.title}\n`
  markdown += `- **Agent:** ${report.conversationB.agentType}\n\n`
  
  markdown += `## Statistics\n\n`
  markdown += `| Metric | Value |\n`
  markdown += `|--------|-------|\n`
  markdown += `| Total Exchanges | ${report.statistics.totalExchanges} |\n`
  markdown += `| Identical Responses | ${report.statistics.identicalResponses} |\n`
  markdown += `| Different Responses | ${report.statistics.differentResponses} |\n`
  markdown += `| Avg Response Time A | ${report.statistics.averageResponseTimeA}ms |\n`
  markdown += `| Avg Response Time B | ${report.statistics.averageResponseTimeB}ms |\n\n`
  
  markdown += `## Detailed Comparison\n\n`
  
  report.exchanges.forEach(exchange => {
    markdown += `### Exchange ${exchange.index}\n\n`
    markdown += `**User:** ${exchange.userMessage}\n\n`
    
    if (exchange.responseA) {
      markdown += `**${report.conversationA.agentType}**${exchange.responseA.responseTime ? ` (${exchange.responseA.responseTime.toFixed(0)}ms)` : ''}:\n`
      markdown += `\`\`\`\n${exchange.responseA.content}\n\`\`\`\n\n`
    } else {
      markdown += `**${report.conversationA.agentType}:** _(No response)_\n\n`
    }
    
    if (exchange.responseB) {
      markdown += `**${report.conversationB.agentType}**${exchange.responseB.responseTime ? ` (${exchange.responseB.responseTime.toFixed(0)}ms)` : ''}:\n`
      markdown += `\`\`\`\n${exchange.responseB.content}\n\`\`\`\n\n`
    } else {
      markdown += `**${report.conversationB.agentType}:** _(No response)_\n\n`
    }
    
    if (exchange.similarity !== undefined) {
      markdown += `**Similarity:** ${exchange.similarity}%\n\n`
    }
    
    markdown += `---\n\n`
  })

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparison-report-${new Date(report.timestamp).toISOString().split('T')[0]}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
