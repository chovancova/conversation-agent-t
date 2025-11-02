import { useState, useEffect, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { Gear, Robot, Palette, Check, Plus, X, CodeBlock, Info, Flask, Warning, CheckCircle, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AgentConfig, AgentAdvancedConfig, CustomHeader, AgentProtocol } from '@/lib/types'
import { AGENTS } from '@/lib/agents'
import { themes, ThemeOption, applyTheme } from '@/lib/themes'
import { validateProtocolConfig, getProtocolDefaults, ValidationResult } from '@/lib/protocolValidation'
import { ProtocolGuide } from '@/components/ProtocolGuide'

type AgentSettingsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AgentSettings({ open, onOpenChange }: AgentSettingsProps) {
  const [agentEndpoints, setAgentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [agentNames, setAgentNames] = useKV<Record<string, string>>('agent-names', {})
  const [agentAdvancedConfigs, setAgentAdvancedConfigs] = useKV<Record<string, AgentAdvancedConfig>>('agent-advanced-configs', {})
  const [selectedTheme, setSelectedTheme] = useKV<ThemeOption>('selected-theme', 'dark')
  const [endpoints, setEndpoints] = useState<Record<string, string>>({})
  const [names, setNames] = useState<Record<string, string>>({})
  const [advancedConfigs, setAdvancedConfigs] = useState<Record<string, AgentAdvancedConfig>>({})
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({})

  const getDefaultConfig = (): AgentAdvancedConfig => ({
    protocol: 'custom',
    requestConfig: {
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      bodyTemplate: '{\n  "message": "{{message}}"\n}',
      messageField: 'message',
      sessionField: 'sessionId'
    },
    responseConfig: {
      responseField: 'response',
      sessionField: 'sessionId',
      errorField: 'error'
    }
  })

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

  useEffect(() => {
    if (agentAdvancedConfigs) {
      setAdvancedConfigs(agentAdvancedConfigs)
    }
  }, [agentAdvancedConfigs])

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

  const handleProtocolChange = (agentType: string, protocol: AgentProtocol) => {
    const currentConfig = advancedConfigs[agentType] || getDefaultConfig()
    const protocolDefaults = getProtocolDefaults(protocol)
    
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...currentConfig,
        ...protocolDefaults,
        protocol
      }
    }))
    
    toast.success(`Protocol changed to ${protocol.toUpperCase()}`, {
      description: 'Configuration has been updated with protocol-specific defaults'
    })
  }

  const handleHeaderAdd = (agentType: string) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...config,
        requestConfig: {
          ...config.requestConfig,
          headers: [...config.requestConfig.headers, { key: '', value: '' }]
        }
      }
    }))
  }

  const handleHeaderRemove = (agentType: string, index: number) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...config,
        requestConfig: {
          ...config.requestConfig,
          headers: config.requestConfig.headers.filter((_, i) => i !== index)
        }
      }
    }))
  }

  const handleHeaderChange = (agentType: string, index: number, field: 'key' | 'value', value: string) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    const newHeaders = [...config.requestConfig.headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...config,
        requestConfig: {
          ...config.requestConfig,
          headers: newHeaders
        }
      }
    }))
  }

  const handleRequestConfigChange = (agentType: string, field: keyof AgentAdvancedConfig['requestConfig'], value: string) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...config,
        requestConfig: {
          ...config.requestConfig,
          [field]: value
        }
      }
    }))
  }

  const handleResponseConfigChange = (agentType: string, field: keyof AgentAdvancedConfig['responseConfig'], value: string) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    setAdvancedConfigs(prev => ({
      ...prev,
      [agentType]: {
        ...config,
        responseConfig: {
          ...config.responseConfig,
          [field]: value
        }
      }
    }))
  }

  const handleThemeChange = (theme: ThemeOption) => {
    setSelectedTheme(theme)
    applyTheme(theme)
    toast.success(`${themes[theme].name} theme applied`)
  }

  const handleSave = () => {
    const allValidationResults: Record<string, ValidationResult> = {}
    let hasErrors = false
    
    AGENTS.forEach(agent => {
      const config = advancedConfigs[agent.type] || getDefaultConfig()
      const endpoint = endpoints[agent.type] || ''
      const result = validateProtocolConfig(config, endpoint)
      
      allValidationResults[agent.type] = result
      if (!result.valid && endpoint) {
        hasErrors = true
      }
    })
    
    setValidationResults(allValidationResults)
    
    if (hasErrors) {
      toast.error('Configuration has validation errors', {
        description: 'Please fix the errors before saving'
      })
      return
    }
    
    setAgentEndpoints(endpoints)
    setAgentNames(names)
    setAgentAdvancedConfigs(advancedConfigs)
    toast.success('Settings saved successfully', {
      description: 'All agent configurations have been updated'
    })
    onOpenChange(false)
  }
  
  const validateAgent = (agentType: string) => {
    const config = advancedConfigs[agentType] || getDefaultConfig()
    const endpoint = endpoints[agentType] || ''
    const result = validateProtocolConfig(config, endpoint)
    
    setValidationResults(prev => ({
      ...prev,
      [agentType]: result
    }))
    
    if (result.valid) {
      toast.success('Configuration is valid', {
        description: result.warnings.length > 0 
          ? `${result.warnings.length} warning(s) found` 
          : 'No issues detected'
      })
    } else {
      toast.error('Configuration has errors', {
        description: `${result.errors.length} error(s) found`
      })
    }
  }

  const getConfig = (agentType: string) => advancedConfigs[agentType] || getDefaultConfig()

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

              {AGENTS.map(agent => {
                const config = getConfig(agent.type)
                const validation = validationResults[agent.type]
                
                return (
                  <TabsContent key={agent.type} value={agent.type} className="space-y-4 pt-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{names[agent.type] || agent.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>
                    </div>

                    {validation && (
                      <>
                        {validation.errors.length > 0 && (
                          <Alert className="border-destructive/50 bg-destructive/5">
                            <Warning size={18} weight="fill" className="text-destructive" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold text-sm mb-1">Configuration Errors:</p>
                              <ul className="text-xs space-y-0.5 list-disc list-inside">
                                {validation.errors.map((error, i) => (
                                  <li key={i}>{error}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {validation.warnings.length > 0 && validation.errors.length === 0 && (
                          <Alert className="border-amber-500/50 bg-amber-500/5">
                            <Info size={18} weight="fill" className="text-amber-600" />
                            <AlertDescription className="ml-2">
                              <p className="font-semibold text-sm mb-1">Warnings:</p>
                              <ul className="text-xs space-y-0.5 list-disc list-inside">
                                {validation.warnings.map((warning, i) => (
                                  <li key={i}>{warning}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {validation.valid && validation.warnings.length === 0 && (
                          <Alert className="border-green-500/50 bg-green-500/5">
                            <CheckCircle size={18} weight="fill" className="text-green-600" />
                            <AlertDescription className="ml-2 text-sm">
                              Configuration is valid and ready to use
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}

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

                    <Accordion type="single" collapsible className="border rounded-lg">
                      <AccordionItem value="advanced" className="border-none">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center gap-2">
                            <CodeBlock size={18} weight="duotone" />
                            <span className="font-semibold">Advanced Configuration</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Flask size={18} weight="duotone" className="text-primary" />
                                <Label className="text-sm font-semibold">Protocol Type</Label>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => validateAgent(agent.type)}
                                className="h-7 text-xs"
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Validate
                              </Button>
                            </div>
                            <Select 
                              value={config.protocol} 
                              onValueChange={(value: AgentProtocol) => handleProtocolChange(agent.type, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="custom">
                                  <div className="flex items-center gap-2">
                                    <span>Custom HTTP API</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="a2a">
                                  <div className="flex items-center gap-2">
                                    <span>A2A Protocol</span>
                                    <span className="text-xs text-muted-foreground">(Agent-to-Agent)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="mcp">
                                  <div className="flex items-center gap-2">
                                    <span>MCP Protocol</span>
                                    <span className="text-xs text-muted-foreground">(Model Context)</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {config.protocol === 'a2a' && (
                              <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                <Sparkle size={16} weight="fill" className="text-primary mt-0.5 flex-shrink-0" />
                                <div className="text-xs space-y-1">
                                  <p className="font-semibold text-foreground">A2A Protocol (Agent-to-Agent)</p>
                                  <p className="text-muted-foreground">
                                    Standardized protocol for agent communication. Requires specific headers and request format.
                                  </p>
                                </div>
                              </div>
                            )}
                            {config.protocol === 'mcp' && (
                              <div className="flex items-start gap-2 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                                <Sparkle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                                <div className="text-xs space-y-1">
                                  <p className="font-semibold text-foreground">MCP Protocol (Model Context Protocol)</p>
                                  <p className="text-muted-foreground">
                                    JSON-RPC 2.0 based protocol for model interactions. Validates against spec requirements.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {config.protocol !== 'custom' && (
                            <ProtocolGuide protocol={config.protocol} />
                          )}

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold">Custom Headers</Label>
                            <div className="space-y-2">
                              {config.requestConfig.headers.map((header, index) => (
                                <div key={index} className="flex gap-2">
                                  <Input
                                    placeholder="Header Key"
                                    value={header.key}
                                    onChange={(e) => handleHeaderChange(agent.type, index, 'key', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Input
                                    placeholder="Header Value"
                                    value={header.value}
                                    onChange={(e) => handleHeaderChange(agent.type, index, 'value', e.target.value)}
                                    className="flex-1"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleHeaderRemove(agent.type, index)}
                                    className="flex-shrink-0"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleHeaderAdd(agent.type)}
                                className="w-full"
                              >
                                <Plus size={16} className="mr-2" />
                                Add Header
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Custom headers to include in all requests (Authorization header is added automatically)
                            </p>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor={`body-template-${agent.type}`} className="text-sm font-semibold">
                              Request Body Template
                            </Label>
                            <Textarea
                              id={`body-template-${agent.type}`}
                              value={config.requestConfig.bodyTemplate}
                              onChange={(e) => handleRequestConfigChange(agent.type, 'bodyTemplate', e.target.value)}
                              className="font-mono text-xs min-h-32"
                              placeholder='{"message": "{{message}}"}'
                            />
                            <p className="text-xs text-muted-foreground">
                              Use <code className="px-1 py-0.5 bg-muted rounded">{'{{message}}'}</code> for user message and <code className="px-1 py-0.5 bg-muted rounded">{'{{sessionId}}'}</code> for session ID
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`message-field-${agent.type}`} className="text-sm font-semibold">
                                Message Field Name
                              </Label>
                              <Input
                                id={`message-field-${agent.type}`}
                                value={config.requestConfig.messageField}
                                onChange={(e) => handleRequestConfigChange(agent.type, 'messageField', e.target.value)}
                                placeholder="message"
                              />
                              <p className="text-xs text-muted-foreground">
                                Field name for the message in request body
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`session-field-req-${agent.type}`} className="text-sm font-semibold">
                                Session Field (Request)
                              </Label>
                              <Input
                                id={`session-field-req-${agent.type}`}
                                value={config.requestConfig.sessionField || ''}
                                onChange={(e) => handleRequestConfigChange(agent.type, 'sessionField', e.target.value)}
                                placeholder="sessionId"
                              />
                              <p className="text-xs text-muted-foreground">
                                Optional session ID field name
                              </p>
                            </div>
                          </div>

                          <div className="pt-4 border-t space-y-3">
                            <Label className="text-sm font-semibold">Response Mapping</Label>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`response-field-${agent.type}`} className="text-xs">
                                Response Message Field
                              </Label>
                              <Input
                                id={`response-field-${agent.type}`}
                                value={config.responseConfig.responseField}
                                onChange={(e) => handleResponseConfigChange(agent.type, 'responseField', e.target.value)}
                                placeholder="response"
                              />
                              <p className="text-xs text-muted-foreground">
                                Path to the message in response (e.g., "response", "data.message", "content")
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`session-field-res-${agent.type}`} className="text-xs">
                                  Session Field (Response)
                                </Label>
                                <Input
                                  id={`session-field-res-${agent.type}`}
                                  value={config.responseConfig.sessionField || ''}
                                  onChange={(e) => handleResponseConfigChange(agent.type, 'sessionField', e.target.value)}
                                  placeholder="sessionId"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor={`error-field-${agent.type}`} className="text-xs">
                                  Error Field (Optional)
                                </Label>
                                <Input
                                  id={`error-field-${agent.type}`}
                                  value={config.responseConfig.errorField || ''}
                                  onChange={(e) => handleResponseConfigChange(agent.type, 'errorField', e.target.value)}
                                  placeholder="error"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted rounded-lg p-4 space-y-3">
                            <p className="text-xs font-semibold flex items-center gap-2">
                              <Info size={14} />
                              Example Configuration
                            </p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium mb-1">Request:</p>
                                <code className="text-xs block bg-background p-2 rounded border">
                                  POST {endpoints[agent.type] || '[endpoint]'}
                                  <br />
                                  {config.requestConfig.headers.map((h, i) => (
                                    <span key={i}>
                                      {h.key}: {h.value}
                                      <br />
                                    </span>
                                  ))}
                                  Authorization: Bearer [token]
                                  <br /><br />
                                  {config.requestConfig.bodyTemplate}
                                </code>
                              </div>
                              <div>
                                <p className="text-xs font-medium mb-1">Expected Response:</p>
                                <code className="text-xs block bg-background p-2 rounded border">
                                  {`{\n  "${config.responseConfig.responseField}": "Agent response message",\n  "${config.responseConfig.sessionField || 'sessionId'}": "session-123"\n}`}
                                </code>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                )
              })}
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
