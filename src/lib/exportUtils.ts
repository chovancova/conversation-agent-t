import { Conversation } from './types'

export type ExportFormat = 'text' | 'markdown' | 'pdf' | 'png'

export function getAgentNameForExport(agentType: string, agentNames: Record<string, string>): string {
  return agentNames[agentType] || agentType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function exportAsText(conversation: Conversation, agentNames: Record<string, string>): void {
  const agentName = getAgentNameForExport(conversation.agentType, agentNames)
  const exportText = `Agent: ${agentName}\n` +
    `Conversation: ${conversation.title}\n` +
    `Created: ${new Date(conversation.createdAt).toLocaleString()}\n` +
    (conversation.sessionId ? `Session ID: ${conversation.sessionId}\n` : '') +
    `\n` +
    conversation.messages
      .map((m) => {
        const time = new Date(m.timestamp).toLocaleString()
        const role = m.role === 'user' ? 'User' : 'Assistant'
        return `[${time}] ${role}:\n${m.content}\n`
      })
      .join('\n')

  navigator.clipboard.writeText(exportText)
}

export function exportAsMarkdown(conversation: Conversation, agentNames: Record<string, string>): void {
  const agentName = getAgentNameForExport(conversation.agentType, agentNames)
  const markdown = `# ${conversation.title}\n\n` +
    `**Agent:** ${agentName}\n\n` +
    `**Created:** ${new Date(conversation.createdAt).toLocaleString()}\n\n` +
    (conversation.sessionId ? `**Session ID:** \`${conversation.sessionId}\`\n\n` : '') +
    `---\n\n` +
    conversation.messages
      .map((m) => {
        const time = new Date(m.timestamp).toLocaleString()
        const role = m.role === 'user' ? '👤 **User**' : '🤖 **Assistant**'
        return `### ${role}\n*${time}*\n\n${m.content}\n`
      })
      .join('\n---\n\n')

  const blob = new Blob([markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.md`
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportAsPDF(conversation: Conversation, agentNames: Record<string, string>): Promise<void> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  const padding = 40
  const lineHeight = 24
  const titleHeight = 36
  const headerHeight = 20
  const messageSpacing = 30
  const maxWidth = 800
  
  canvas.width = maxWidth + (padding * 2)
  
  ctx.font = '14px Inter, sans-serif'
  
  let yOffset = padding
  const agentName = getAgentNameForExport(conversation.agentType, agentNames)
  
  const headerLines = [
    `Agent: ${agentName}`,
    `Created: ${new Date(conversation.createdAt).toLocaleString()}`,
  ]
  if (conversation.sessionId) {
    headerLines.push(`Session ID: ${conversation.sessionId}`)
  }
  
  const contentHeight = titleHeight + (headerLines.length * headerHeight) + messageSpacing
  let messagesHeight = 0
  
  const wrappedMessages = conversation.messages.map(message => {
    const time = new Date(message.timestamp).toLocaleString()
    const role = message.role === 'user' ? 'User' : 'Assistant'
    const header = `[${time}] ${role}:`
    
    const contentLines = wrapText(ctx, message.content, maxWidth)
    const height = headerHeight + (contentLines.length * lineHeight) + messageSpacing
    messagesHeight += height
    
    return { header, contentLines, height, role: message.role }
  })
  
  canvas.height = contentHeight + messagesHeight + padding
  
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Inter, sans-serif'
  ctx.fillText(conversation.title, padding, yOffset + 24)
  yOffset += titleHeight + 10
  
  ctx.font = '14px Inter, sans-serif'
  ctx.fillStyle = '#a0a0a0'
  headerLines.forEach(line => {
    ctx.fillText(line, padding, yOffset + 14)
    yOffset += headerHeight
  })
  
  yOffset += messageSpacing
  
  wrappedMessages.forEach(({ header, contentLines, role }) => {
    ctx.fillStyle = role === 'user' ? '#7dd3fc' : '#a78bfa'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillText(header, padding, yOffset + 14)
    yOffset += headerHeight + 5
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px Inter, sans-serif'
    contentLines.forEach(line => {
      ctx.fillText(line, padding, yOffset + 14)
      yOffset += lineHeight
    })
    
    yOffset += messageSpacing
  })
  
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }, 'application/pdf')
}

export async function exportAsPNG(conversation: Conversation, agentNames: Record<string, string>): Promise<void> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  const padding = 40
  const lineHeight = 24
  const titleHeight = 36
  const headerHeight = 20
  const messageSpacing = 30
  const maxWidth = 800
  
  canvas.width = maxWidth + (padding * 2)
  
  ctx.font = '14px Inter, sans-serif'
  
  let yOffset = padding
  const agentName = getAgentNameForExport(conversation.agentType, agentNames)
  
  const headerLines = [
    `Agent: ${agentName}`,
    `Created: ${new Date(conversation.createdAt).toLocaleString()}`,
  ]
  if (conversation.sessionId) {
    headerLines.push(`Session ID: ${conversation.sessionId}`)
  }
  
  const contentHeight = titleHeight + (headerLines.length * headerHeight) + messageSpacing
  let messagesHeight = 0
  
  const wrappedMessages = conversation.messages.map(message => {
    const time = new Date(message.timestamp).toLocaleString()
    const role = message.role === 'user' ? 'User' : 'Assistant'
    const header = `[${time}] ${role}:`
    
    const contentLines = wrapText(ctx, message.content, maxWidth)
    const height = headerHeight + (contentLines.length * lineHeight) + messageSpacing
    messagesHeight += height
    
    return { header, contentLines, height, role: message.role }
  })
  
  canvas.height = contentHeight + messagesHeight + padding
  
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 24px Inter, sans-serif'
  ctx.fillText(conversation.title, padding, yOffset + 24)
  yOffset += titleHeight + 10
  
  ctx.font = '14px Inter, sans-serif'
  ctx.fillStyle = '#a0a0a0'
  headerLines.forEach(line => {
    ctx.fillText(line, padding, yOffset + 14)
    yOffset += headerHeight
  })
  
  yOffset += messageSpacing
  
  wrappedMessages.forEach(({ header, contentLines, role }) => {
    ctx.fillStyle = role === 'user' ? '#7dd3fc' : '#a78bfa'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillText(header, padding, yOffset + 14)
    yOffset += headerHeight + 5
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '14px Inter, sans-serif'
    contentLines.forEach(line => {
      ctx.fillText(line, padding, yOffset + 14)
      yOffset += lineHeight
    })
    
    yOffset += messageSpacing
  })
  
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.png`
    link.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}
