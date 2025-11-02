import { Info, CheckCircle, Code } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { AgentProtocol } from '@/lib/types'

type ProtocolGuideProps = {
  protocol: AgentProtocol
}

export function ProtocolGuide({ protocol }: ProtocolGuideProps) {
  if (protocol === 'custom') {
    return null
  }

  const guides = {
    a2a: {
      title: 'A2A Protocol Requirements',
      description: 'Agent-to-Agent communication protocol standards',
      requirements: [
        {
          title: 'Required Headers',
          items: [
            'A2A-Version: Version identifier (e.g., "1.0")',
            'A2A-Client-ID: Unique client identifier',
            'Content-Type: application/json'
          ]
        },
        {
          title: 'Request Body Structure',
          items: [
            '"intent": The primary message or action request',
            '"context": Contextual information including sessionId',
            '"metadata": Additional metadata like timestamps'
          ]
        },
        {
          title: 'Response Format',
          items: [
            '"result": Contains the response data and message',
            '"result.message": The actual response text',
            '"result.sessionId": Session tracking identifier'
          ]
        }
      ],
      example: {
        request: `{
  "intent": "User message here",
  "context": {
    "sessionId": "session-123"
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}`,
        response: `{
  "result": {
    "message": "Agent response",
    "sessionId": "session-123"
  }
}`
      }
    },
    mcp: {
      title: 'MCP Protocol Requirements',
      description: 'Model Context Protocol (JSON-RPC 2.0 based)',
      requirements: [
        {
          title: 'Required Headers',
          items: [
            'Content-Type: application/json-rpc',
          ]
        },
        {
          title: 'Request Body Structure (JSON-RPC 2.0)',
          items: [
            '"jsonrpc": Must be exactly "2.0"',
            '"method": The RPC method name (e.g., "chat.send")',
            '"params": Object containing method parameters',
            '"id": Unique request identifier (number or string)'
          ]
        },
        {
          title: 'Response Format',
          items: [
            '"jsonrpc": "2.0"',
            '"result": Contains the response data on success',
            '"error": Contains error details on failure',
            '"id": Matches the request id'
          ]
        }
      ],
      example: {
        request: `{
  "jsonrpc": "2.0",
  "method": "chat.send",
  "params": {
    "message": "User message",
    "sessionId": "session-123"
  },
  "id": 1
}`,
        response: `{
  "jsonrpc": "2.0",
  "result": "Agent response",
  "id": 1
}`
      }
    }
  }

  const guide = guides[protocol]

  return (
    <Card className="p-4 bg-muted/30 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Info size={18} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{guide.title}</h4>
            <p className="text-xs text-muted-foreground">{guide.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {guide.requirements.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <p className="text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} weight="fill" className="text-primary" />
                {section.title}
              </p>
              <ul className="ml-5 space-y-0.5">
                {section.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2 border-t">
          <p className="text-xs font-semibold flex items-center gap-1.5">
            <Code size={14} weight="duotone" />
            Example Format
          </p>
          <div className="grid gap-2">
            <div>
              <p className="text-xs font-medium mb-1 text-muted-foreground">Request:</p>
              <pre className="text-xs bg-background border rounded p-2 overflow-x-auto">
                <code>{guide.example.request}</code>
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium mb-1 text-muted-foreground">Response:</p>
              <pre className="text-xs bg-background border rounded p-2 overflow-x-auto">
                <code>{guide.example.response}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
