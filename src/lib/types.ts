export type ModelType = 'gpt-4o' | 'gpt-4o-mini'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type Conversation = {
  id: string
  title: string
  model: ModelType
  messages: Message[]
  createdAt: number
  updatedAt: number
}
