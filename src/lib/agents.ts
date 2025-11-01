import { AgentConfig } from './types'

export const AGENTS: AgentConfig[] = [
  {
    type: 'account-opening',
    name: 'Account Opening Agent',
    endpoint: '',
    description: 'Handles account opening requests and onboarding'
  },
  {
    type: 'payment',
    name: 'Payment Agent',
    endpoint: '',
    description: 'Processes payments and transaction queries'
  },
  {
    type: 'moderator',
    name: 'Moderator Agent',
    endpoint: '',
    description: 'Content moderation and compliance checks'
  },
  {
    type: 'card',
    name: 'Card Agent',
    endpoint: '',
    description: 'Card management and operations'
  },
  {
    type: 'rag',
    name: 'RAG Agent',
    endpoint: '',
    description: 'Retrieval-augmented generation for knowledge queries'
  }
]

export const getAgentConfig = (type: string): AgentConfig | undefined => {
  return AGENTS.find(agent => agent.type === type)
}
