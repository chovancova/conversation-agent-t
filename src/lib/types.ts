export type AgentType = 'account-opening' | 'payment' | 'moderator' | 'card' | 'rag'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  error?: boolean
}

export type Conversation = {
  id: string
  title: string
  agentType: AgentType
  messages: Message[]
  createdAt: number
  updatedAt: number
  sessionId?: string
}

export type AgentConfig = {
  type: AgentType
  name: string
  endpoint: string
  description: string
}

export type TokenConfig = {
  id: string
  name: string
  endpoint: string
  clientId: string
  clientSecret: string
  username: string
  password: string
}

export type AccessToken = {
  token: string
  expiresAt: number
  refreshCount?: number
  generatedAt?: number
}

export type AutoRefreshConfig = {
  enabled: boolean
  maxRefreshes: number
  currentRefreshes: number
  startTime: number | null
}
