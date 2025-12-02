import { AgentConfig, AgentType } from './types'

export const AGENTS: Record<AgentType, AgentConfig> = {
  'account-opening': {
    type: 'account-opening',
    name: 'Agent 1',
    endpoint: '',
    description: 'Handles account opening requests and onboarding'
  },
  'payment': {
    type: 'payment',
    name: 'Agent 2',
    endpoint: '',
    description: 'Processes payments and transaction queries'
  },
  'moderator': {
    type: 'moderator',
    name: 'Agent 3',
    endpoint: '',
    description: 'Content moderation and compliance checks'
  },
  'card': {
    type: 'card',
    name: 'Agent 4',
    endpoint: '',
    description: 'Card management and operations'
  },
  'rag': {
    type: 'rag',
    name: 'Agent 5',
    endpoint: '',
    description: 'Retrieval-augmented generation for knowledge queries'
  }
}

export const getAgentConfig = (type: string): AgentConfig | undefined => {
  if (!type) return undefined
  return AGENTS[type as AgentType]
}

export const getAgentName = (type: string, customNames?: Record<string, string>): string => {
  if (!type) return 'Unknown Agent'
  if (customNames?.[type]) {
    return customNames[type]
  }
  const agent = getAgentConfig(type)
  return agent?.name ?? type
}
