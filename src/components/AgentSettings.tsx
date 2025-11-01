import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Gear, Robot } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AgentConfig } from '@/lib/types'
import { AGENTS } from '@/lib/agents'

type AgentSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentSettings({ open, onOpenChange }: AgentSettingsProps) {
  const [agentEndpoints, setAgentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [agentNames, setAgentNames] = useKV<Record<string, string>>('agent-names', {})
  const [endpoints, setEndpoints] = useState<Record<string, string>>({})
  const [names, setNames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (agentEndpoints) {
      setEndpoints(agentEndpoints)
    }
  }, [agentEndpoints])

  useEffect(() => {
    if (agentNames) {
      setNames(agentNames)
    }
  }, [agentNames])

  const handleEndpointChange = (agentType: string, value: string) => {
    setEndpoints(prev => ({
      ...prev,
      [agentType]: value
    }))
  }

  const handleNameChange = (agentType: string, value: string) => {
    setNames(prev => ({
      ...prev,
      [agentType]: value
    }))
  }

  const handleSave = () => {
    setAgentEndpoints(endpoints)
    setAgentNames(names)
    toast.success('Agent settings saved')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gear size={24} weight="duotone" />
            Agent Configuration
          </DialogTitle>
          <DialogDescription>
            Configure agent names and HTTP POST endpoints for each agent
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={AGENTS[0].type} className="py-4">
          <TabsList className="grid w-full grid-cols-5">
            {AGENTS.map(agent => (
              <TabsTrigger key={agent.type} value={agent.type} className="text-xs">
                <Robot size={14} className="mr-1" />
                {(names[agent.type] || agent.name).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {AGENTS.map(agent => (
            <TabsContent key={agent.type} value={agent.type} className="space-y-4 pt-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{names[agent.type] || agent.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`name-${agent.type}`}>Custom Agent Name</Label>
                <Input
                  id={`name-${agent.type}`}
                  type="text"
                  placeholder={agent.name}
                  value={names[agent.type] || ''}
                  onChange={(e) => handleNameChange(agent.type, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Give this agent a custom name (leave empty to use default: {agent.name})
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`endpoint-${agent.type}`}>Agent Endpoint URL</Label>
                <Input
                  id={`endpoint-${agent.type}`}
                  type="url"
                  placeholder="https://api.example.com/agent/chat"
                  value={endpoints[agent.type] || ''}
                  onChange={(e) => handleEndpointChange(agent.type, e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This endpoint will receive POST requests with Bearer authentication
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <p className="text-xs font-semibold">Request Format:</p>
                <code className="text-xs block">
                  POST {endpoints[agent.type] || '[endpoint]'}
                  <br />
                  Headers: Authorization: Bearer [token]
                  <br />
                  Body: {JSON.stringify({ message: "user message" }, null, 2)}
                </code>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
