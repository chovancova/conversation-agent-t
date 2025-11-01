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
}

export type AgentConfig = {
  type: AgentType
  name: string
  endpoint: string
  description: string
}

export type TokenConfig = {
  endpoint: string
  clientId: string
  username: string
  password: string
}

export type AccessToken = {
  token: string
  expiresAt: number
}
