import { AgentAdvancedConfig, AgentProtocol } from './types'

export type ValidationResult = {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function validateProtocolConfig(config: AgentAdvancedConfig, endpoint: string): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: []
  }

  if (!endpoint || endpoint.trim() === '') {
    result.errors.push('Endpoint URL is required')
    result.valid = false
  } else if (!isValidUrl(endpoint)) {
    result.errors.push('Invalid endpoint URL format')
    result.valid = false
  }

  switch (config.protocol) {
    case 'custom':
      validateCustomProtocol(config, result)
      break
    case 'a2a':
      validateA2AProtocol(config, endpoint, result)
      break
    case 'mcp':
      validateMCPProtocol(config, endpoint, result)
      break
  }

  return result
}

function validateCustomProtocol(config: AgentAdvancedConfig, result: ValidationResult): void {
  if (!config.requestConfig.bodyTemplate || config.requestConfig.bodyTemplate.trim() === '') {
    result.errors.push('Request body template is required')
    result.valid = false
  } else {
    try {
      const template = config.requestConfig.bodyTemplate
        .replace(/\{\{message\}\}/g, '"test message"')
        .replace(/\{\{sessionId\}\}/g, '"test-session"')
      JSON.parse(template)
    } catch (e) {
      result.errors.push('Request body template must be valid JSON')
      result.valid = false
    }
  }

  if (!config.requestConfig.messageField || config.requestConfig.messageField.trim() === '') {
    result.errors.push('Message field name is required')
    result.valid = false
  }

  if (!config.responseConfig.responseField || config.responseConfig.responseField.trim() === '') {
    result.errors.push('Response field path is required')
    result.valid = false
  }

  const hasContentTypeHeader = config.requestConfig.headers.some(
    h => h.key.toLowerCase() === 'content-type'
  )
  if (!hasContentTypeHeader) {
    result.warnings.push('Content-Type header is recommended for API requests')
  }

  const emptyHeaders = config.requestConfig.headers.filter(
    h => h.key.trim() === '' || h.value.trim() === ''
  )
  if (emptyHeaders.length > 0) {
    result.warnings.push(`${emptyHeaders.length} header(s) with empty key or value will be ignored`)
  }
}

function validateA2AProtocol(config: AgentAdvancedConfig, endpoint: string, result: ValidationResult): void {
  result.warnings.push('A2A protocol is currently in development')

  if (!endpoint.match(/\/a2a\/?$/i)) {
    result.warnings.push('A2A endpoints typically end with "/a2a"')
  }

  const requiredA2AHeaders = ['A2A-Version', 'A2A-Client-ID']
  const presentHeaders = config.requestConfig.headers.map(h => h.key)
  
  requiredA2AHeaders.forEach(required => {
    if (!presentHeaders.some(h => h.toLowerCase() === required.toLowerCase())) {
      result.errors.push(`A2A protocol requires "${required}" header`)
      result.valid = false
    }
  })

  const a2aVersionHeader = config.requestConfig.headers.find(
    h => h.key.toLowerCase() === 'a2a-version'
  )
  if (a2aVersionHeader && !a2aVersionHeader.value.match(/^\d+\.\d+$/)) {
    result.errors.push('A2A-Version header should be in format "X.Y" (e.g., "1.0")')
    result.valid = false
  }

  try {
    const template = config.requestConfig.bodyTemplate
      .replace(/\{\{message\}\}/g, '"test"')
      .replace(/\{\{sessionId\}\}/g, '"test"')
    const parsed = JSON.parse(template)
    
    if (!parsed.intent) {
      result.errors.push('A2A protocol requires "intent" field in request body')
      result.valid = false
    }
    
    if (!parsed.context && !parsed.metadata) {
      result.warnings.push('A2A requests typically include "context" or "metadata" fields')
    }
  } catch (e) {
    result.errors.push('A2A request body must be valid JSON')
    result.valid = false
  }

  if (!config.responseConfig.responseField.includes('result') && 
      !config.responseConfig.responseField.includes('data')) {
    result.warnings.push('A2A responses typically return data in "result" or "data" field')
  }

  if (!config.requestConfig.sessionField && !config.responseConfig.sessionField) {
    result.warnings.push('A2A protocol typically uses session tracking')
  }
}

function validateMCPProtocol(config: AgentAdvancedConfig, endpoint: string, result: ValidationResult): void {
  result.warnings.push('MCP protocol is currently in development')

  if (!endpoint.match(/\/mcp\/?$/i) && !endpoint.match(/\/jsonrpc\/?$/i)) {
    result.warnings.push('MCP endpoints typically end with "/mcp" or "/jsonrpc"')
  }

  const contentTypeHeader = config.requestConfig.headers.find(
    h => h.key.toLowerCase() === 'content-type'
  )
  if (!contentTypeHeader || contentTypeHeader.value !== 'application/json-rpc') {
    result.errors.push('MCP protocol requires Content-Type: application/json-rpc')
    result.valid = false
  }

  try {
    const template = config.requestConfig.bodyTemplate
      .replace(/\{\{message\}\}/g, '"test"')
      .replace(/\{\{sessionId\}\}/g, '"test"')
    const parsed = JSON.parse(template)
    
    if (parsed.jsonrpc !== '2.0') {
      result.errors.push('MCP protocol requires "jsonrpc": "2.0" in request body')
      result.valid = false
    }
    
    if (!parsed.method) {
      result.errors.push('MCP protocol requires "method" field in request body')
      result.valid = false
    }
    
    if (!parsed.params) {
      result.warnings.push('MCP requests typically include "params" field')
    }

    if (typeof parsed.id === 'undefined') {
      result.errors.push('MCP protocol requires "id" field for request tracking')
      result.valid = false
    }
  } catch (e) {
    result.errors.push('MCP request body must be valid JSON-RPC 2.0 format')
    result.valid = false
  }

  if (!config.responseConfig.responseField.includes('result')) {
    result.warnings.push('MCP responses return data in "result" field per JSON-RPC 2.0 spec')
  }

  if (!config.responseConfig.errorField) {
    result.warnings.push('MCP protocol uses "error" field for error responses')
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getProtocolTemplate(protocol: AgentProtocol): { bodyTemplate: string; headers: Array<{key: string; value: string}> } {
  switch (protocol) {
    case 'a2a':
      return {
        bodyTemplate: JSON.stringify({
          intent: '{{message}}',
          context: {
            sessionId: '{{sessionId}}'
          },
          metadata: {
            timestamp: new Date().toISOString()
          }
        }, null, 2),
        headers: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'A2A-Version', value: '1.0' },
          { key: 'A2A-Client-ID', value: 'agent-tester' }
        ]
      }
    
    case 'mcp':
      return {
        bodyTemplate: JSON.stringify({
          jsonrpc: '2.0',
          method: 'chat.send',
          params: {
            message: '{{message}}',
            sessionId: '{{sessionId}}'
          },
          id: 1
        }, null, 2),
        headers: [
          { key: 'Content-Type', value: 'application/json-rpc' }
        ]
      }
    
    case 'custom':
    default:
      return {
        bodyTemplate: JSON.stringify({
          message: '{{message}}'
        }, null, 2),
        headers: [
          { key: 'Content-Type', value: 'application/json' }
        ]
      }
  }
}

export function getProtocolDefaults(protocol: AgentProtocol): Partial<AgentAdvancedConfig> {
  const template = getProtocolTemplate(protocol)
  
  switch (protocol) {
    case 'a2a':
      return {
        protocol,
        requestConfig: {
          headers: template.headers,
          bodyTemplate: template.bodyTemplate,
          messageField: 'intent',
          sessionField: 'context.sessionId'
        },
        responseConfig: {
          responseField: 'result.message',
          sessionField: 'result.sessionId',
          errorField: 'error'
        }
      }
    
    case 'mcp':
      return {
        protocol,
        requestConfig: {
          headers: template.headers,
          bodyTemplate: template.bodyTemplate,
          messageField: 'params.message',
          sessionField: 'params.sessionId'
        },
        responseConfig: {
          responseField: 'result',
          sessionField: 'result.sessionId',
          errorField: 'error'
        }
      }
    
    case 'custom':
    default:
      return {
        protocol,
        requestConfig: {
          headers: template.headers,
          bodyTemplate: template.bodyTemplate,
          messageField: 'message',
          sessionField: 'sessionId'
        },
        responseConfig: {
          responseField: 'response',
          sessionField: 'sessionId',
          errorField: 'error'
        }
      }
  }
}
