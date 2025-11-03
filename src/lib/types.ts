export type AgentType = 'account-opening' | 'payment' | 'moderator' | 'card' | 'rag'

export type AgentProtocol = 'custom' | 'a2a' | 'mcp'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  error?: boolean
  responseTime?: number
}

export type Conversation = {
  id: string
  title: string
  agentType: AgentType
  messages: Message[]
  createdAt: number
  updatedAt: number
  sessionId?: string
  tokenConfigId?: string
}

export type AgentConfig = {
  type: AgentType
  name: string
  endpoint: string
  description: string
}

export type CustomHeader = {
  key: string
  value: string
}

export type AgentRequestConfig = {
  headers: CustomHeader[]
  bodyTemplate: string
  messageField: string
  sessionField?: string
}

export type AgentResponseConfig = {
  responseField: string
  sessionField?: string
  errorField?: string
}

export type AgentAdvancedConfig = {
  protocol: AgentProtocol
  requestConfig: AgentRequestConfig
  responseConfig: AgentResponseConfig
}

export type ClientCertificateConfig = {
  certificatePem?: string
  privateKeyPem?: string
  passphrase?: string
  enabled: boolean
}

export type TokenConfig = {
  id: string
  name: string
  endpoint: string
  clientId: string
  clientSecret: string
  username: string
  password: string
  isEncrypted?: boolean
  useFormEncoded?: boolean
  useJWTExpiration?: boolean
  ignoreCertErrors?: boolean
  proxyUrl?: string
  clientCertificate?: ClientCertificateConfig
}

export type EncryptedTokenConfig = {
  id: string
  name: string
  endpoint: string
  encryptedData: {
    encrypted: string
    iv: string
    salt: string
  }
  isEncrypted: true
}

export type AccessToken = {
  token: string
  expiresAt: number
  refreshCount?: number
  generatedAt?: number
  tokenConfigId?: string
}

export type AccessTokenMap = Record<string, AccessToken>

export type AutoRefreshConfig = {
  enabled: boolean
  maxRefreshes: number
  currentRefreshes: number
  startTime: number | null
}
