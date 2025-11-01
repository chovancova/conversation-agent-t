import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Gear, Robot, Palette, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { AgentConfig } from '@/lib/types'
import { AGENTS } from '@/lib/agents'
import { themes, ThemeOption, applyTheme } from '@/lib/themes'

type AgentSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentSettings({ open, onOpenChange }: AgentSettingsProps) {
  const [agentEndpoints, setAgentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [agentNames, setAgentNames] = useKV<Record<string, string>>('agent-names', {})
  const [selectedTheme, setSelectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
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

  const handleThemeChange = (theme: ThemeOption) => {
    setSelectedTheme(theme)
    applyTheme(theme)
    toast.success(`${themes[theme].name} theme applied`)
  }

  const handleSave = () => {
    setAgentEndpoints(endpoints)
    setAgentNames(names)
    toast.success('Settings saved')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gear size={24} weight="duotone" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure agents, themes, and application preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="agents" className="py-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agents">
              <Robot size={16} className="mr-2" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette size={16} className="mr-2" />
              Theme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Visual Theme</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your preferred color scheme
              </p>
            </div>

            <RadioGroup value={selectedTheme} onValueChange={handleThemeChange}>
              <div className="grid gap-4">
                {(Object.keys(themes) as ThemeOption[]).map((themeKey) => {
                  const theme = themes[themeKey]
                  const isSelected = selectedTheme === themeKey
                  
                  return (
                    <div key={themeKey} className="relative">
                      <RadioGroupItem
                        value={themeKey}
                        id={themeKey}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={themeKey}
                        className="cursor-pointer"
                      >
                        <Card className={`p-4 transition-all hover:shadow-lg ${
                          isSelected 
                            ? 'ring-2 ring-primary shadow-md' 
                            : 'hover:border-primary/50'
                        }`}>
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{theme.name}</h3>
                                {isSelected && (
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                                    <Check size={14} weight="bold" className="text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-4">
                                {theme.description}
                              </p>
                              
                              <div className="flex gap-2">
                                <div 
                                  className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                  style={{ backgroundColor: theme.colors.background }}
                                  title="Background"
                                />
                                <div 
                                  className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                  style={{ backgroundColor: theme.colors.primary }}
                                  title="Primary"
                                />
                                <div 
                                  className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                  style={{ backgroundColor: theme.colors.accent }}
                                  title="Accent"
                                />
                                <div 
                                  className="w-10 h-10 rounded-lg border-2 border-border shadow-sm"
                                  style={{ backgroundColor: theme.colors.card }}
                                  title="Card"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </TabsContent>

          <TabsContent value="agents" className="pt-4">
            <Tabs defaultValue={AGENTS[0].type}>
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
          </TabsContent>
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
