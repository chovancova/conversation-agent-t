import { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Circle, Robot, Key, Gear, Rocket, CaretRight, CaretLeft, Eye, EyeSlash, Info, Warning, ShieldWarning, Upload, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AccessToken, TokenConfig, AgentType } from '@/lib/types'
import { AGENTS } from '@/lib/agents'
import { cn } from '@/lib/utils'
import { generateExportPackage, downloadExportPackage, importDataPackage, type ImportOptions } from '@/lib/dataManager'

interface SetupWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete?: () => void
}

type WizardStep = 'welcome' | 'token' | 'agents' | 'complete'

export function SetupWizard({ open, onOpenChange, onComplete }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome')
  const [, setAccessToken] = useKV<AccessToken | null>('access-token', null)
  const [, setSavedTokens] = useKV<TokenConfig[]>('saved-tokens', [])
  const [, setSelectedTokenId] = useKV<string | null>('selected-token-id', null)
  const [, setAgentEndpoints] = useKV<Record<string, string>>('agent-endpoints', {})
  const [, setAgentNames] = useKV<Record<string, string>>('agent-names', {})
  const [setupComplete, setSetupComplete] = useKV<boolean>('setup-complete', false)

  const [tokenEndpoint, setTokenEndpoint] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showClientSecret, setShowClientSecret] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)
  const [tokenGenerated, setTokenGenerated] = useState(false)
  const [ignoreCertErrors, setIgnoreCertErrors] = useState(false)

  const [selectedAgent, setSelectedAgent] = useState<AgentType>('account-opening')
  const [agentEndpoint, setAgentEndpoint] = useState('')
  const [agentCustomName, setAgentCustomName] = useState('')
  const [configuredAgents, setConfiguredAgents] = useState<AgentType[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const steps: WizardStep[] = ['welcome', 'token', 'agents', 'complete']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  useEffect(() => {
    if (open && setupComplete) {
      setCurrentStep('complete')
    }
  }, [open, setupComplete])

  const handleGenerateToken = async () => {
    if (!tokenEndpoint.trim() || !clientId.trim() || !clientSecret.trim() || !username.trim() || !password.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsGeneratingToken(true)

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          username: username,
          password: password
        })
      })

      if (!response.ok) {
        throw new Error(`Token generation failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      const token = data.access_token || data.token
      if (!token) {
        throw new Error('No access token in response')
      }

      const newAccessToken: AccessToken = {
        token,
        expiresAt: Date.now() + (15 * 60 * 1000)
      }

      await setAccessToken(newAccessToken)

      const tokenConfig: TokenConfig = {
        id: Date.now().toString(),
        name: 'Setup Token',
        endpoint: tokenEndpoint,
        clientId: clientId,
        clientSecret: clientSecret,
        username: username,
        password: password,
        isEncrypted: false,
        ignoreCertErrors: ignoreCertErrors
      }

      await setSavedTokens([tokenConfig])
      await setSelectedTokenId(tokenConfig.id)

      setTokenGenerated(true)
      toast.success('Access token generated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate token')
      console.error('Token generation error:', error)
    } finally {
      setIsGeneratingToken(false)
    }
  }

  const handleAddAgent = () => {
    if (!agentEndpoint.trim()) {
      toast.error('Please enter an agent endpoint')
      return
    }

    setAgentEndpoints((current = {}) => ({
      ...current,
      [selectedAgent]: agentEndpoint
    }))

    if (agentCustomName.trim()) {
      setAgentNames((current = {}) => ({
        ...current,
        [selectedAgent]: agentCustomName
      }))
    }

    setConfiguredAgents((current) => [...current, selectedAgent])
    toast.success(`${AGENTS[selectedAgent].name} configured`)

    setAgentEndpoint('')
    setAgentCustomName('')

    const remainingAgents = Object.keys(AGENTS).filter(
      (agent) => !configuredAgents.includes(agent as AgentType) && agent !== selectedAgent
    ) as AgentType[]

    if (remainingAgents.length > 0) {
      setSelectedAgent(remainingAgents[0])
    }
  }

  const handleSkipAgentSetup = () => {
    setCurrentStep('complete')
  }

  const handleComplete = () => {
    setSetupComplete(true)
    onOpenChange(false)
    if (onComplete) {
      onComplete()
    }
  }

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('token')
    } else if (currentStep === 'token') {
      if (!tokenGenerated) {
        toast.error('Please generate an access token first')
        return
      }
      setCurrentStep('agents')
    } else if (currentStep === 'agents') {
      setCurrentStep('complete')
    }
  }

  const handleBack = () => {
    if (currentStep === 'token') {
      setCurrentStep('welcome')
    } else if (currentStep === 'agents') {
      setCurrentStep('token')
    } else if (currentStep === 'complete') {
      setCurrentStep('agents')
    }
  }

  const canProceed = () => {
    if (currentStep === 'welcome') return true
    if (currentStep === 'token') return tokenGenerated
    if (currentStep === 'agents') return true
    return false
  }

  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)

    try {
      const text = await file.text()
      const pkg = JSON.parse(text)

      const importOptions: ImportOptions = {
        includeConversations: false,
        includeAgentSettings: true,
        includeTokenConfigs: true,
        includePreferences: false,
        mergeStrategy: 'merge'
      }

      const result = await importDataPackage(pkg, importOptions)

      if (result.success) {
        toast.success('Settings imported successfully', {
          description: `Imported ${result.imported.agentSettings} agent settings and ${result.imported.tokenConfigs} token configs`
        })

        if (result.imported.tokenConfigs > 0) {
          setTokenGenerated(true)
        }

        if (result.imported.agentSettings > 0) {
          const endpoints = await window.spark.kv.get<Record<string, string>>('agent-endpoints') || {}
          const configuredTypes = Object.keys(endpoints) as AgentType[]
          setConfiguredAgents(configuredTypes)
        }

        if (result.warnings.length > 0) {
          result.warnings.forEach(warning => {
            toast.warning(warning)
          })
        }
      } else {
        toast.error('Failed to import settings', {
          description: result.errors.join(', ')
        })
      }
    } catch (error) {
      toast.error('Failed to import settings', {
        description: error instanceof Error ? error.message : 'Invalid file format'
      })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportSettings = async () => {
    setIsExporting(true)

    try {
      const pkg = await generateExportPackage(false, true, true, false)
      
      downloadExportPackage(pkg, `agent-tester-settings-${Date.now()}.json`)
      
      toast.success('Settings exported successfully', {
        description: 'Your configuration has been downloaded'
      })
    } catch (error) {
      toast.error('Failed to export settings', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsExporting(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                index <= currentStepIndex
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'bg-muted border-border text-muted-foreground'
              )}
            >
              {index < currentStepIndex ? (
                <CheckCircle size={20} weight="fill" />
              ) : (
                <Circle size={20} weight={index === currentStepIndex ? 'fill' : 'regular'} />
              )}
            </div>
            <span className="text-xs mt-2 font-medium">
              {step === 'welcome' && 'Welcome'}
              {step === 'token' && 'Token'}
              {step === 'agents' && 'Agents'}
              {step === 'complete' && 'Done'}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2 transition-all',
                index < currentStepIndex ? 'bg-primary' : 'bg-border'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Setup Wizard</DialogTitle>
          <DialogDescription>
            Let's get you started with Agent Tester
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Progress value={progress} className="h-2 mb-6" />
          {renderStepIndicator()}

          {currentStep === 'welcome' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-accent/80 flex items-center justify-center mb-6 shadow-lg">
                  <Robot size={40} weight="duotone" className="text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Welcome to Agent Tester</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  This wizard will help you set up authentication and configure your AI agents in just a few steps.
                </p>
                <div className="w-full max-w-md space-y-3 text-left">
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Key size={16} weight="bold" className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Authentication Setup</p>
                      <p className="text-xs text-muted-foreground">Configure HTTP Bearer token for secure API access</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Gear size={16} weight="bold" className="text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Agent Configuration</p>
                      <p className="text-xs text-muted-foreground">Set up endpoints for your AI agents</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                      <Rocket size={16} weight="bold" className="text-chart-3" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1">Start Testing</p>
                      <p className="text-xs text-muted-foreground">Create conversations and evaluate agent responses</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="font-medium">Already have settings?</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportSettings}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  variant="outline"
                  className="w-full h-11"
                  size="lg"
                >
                  <Upload size={18} weight="bold" className="mr-2" />
                  {isImporting ? 'Importing...' : 'Import Settings from File'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Import your previously exported agent and token configurations to get started quickly
                </p>
              </div>
            </div>
          )}

          {currentStep === 'token' && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <Info size={20} weight="fill" className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Generate Access Token</p>
                  <p className="text-muted-foreground text-xs">
                    Enter your OAuth credentials to generate a Bearer token for API authentication. This token will be used to communicate with your AI agents.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="token-endpoint">Token Endpoint *</Label>
                  <Input
                    id="token-endpoint"
                    placeholder="https://api.example.com/oauth/token"
                    value={tokenEndpoint}
                    onChange={(e) => setTokenEndpoint(e.target.value)}
                    disabled={tokenGenerated}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID *</Label>
                    <Input
                      id="client-id"
                      placeholder="your-client-id"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      disabled={tokenGenerated}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client-secret">Client Secret *</Label>
                    <div className="relative">
                      <Input
                        id="client-secret"
                        type={showClientSecret ? 'text' : 'password'}
                        placeholder="your-client-secret"
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        disabled={tokenGenerated}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowClientSecret(!showClientSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={tokenGenerated}
                      >
                        {showClientSecret ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="your-username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={tokenGenerated}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="your-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={tokenGenerated}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={tokenGenerated}
                      >
                        {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="setup-ignore-cert-errors" className="text-sm font-semibold cursor-pointer">
                      Ignore Certificate Errors
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Enable for self-signed certs or ERR_CERT_AUTHORITY_INVALID errors
                    </p>
                  </div>
                  <Switch
                    id="setup-ignore-cert-errors"
                    checked={ignoreCertErrors}
                    onCheckedChange={setIgnoreCertErrors}
                    disabled={tokenGenerated}
                  />
                </div>

                {ignoreCertErrors && (
                  <Alert className="border-amber-500/50 bg-amber-500/10">
                    <Warning size={16} className="text-amber-500" />
                    <AlertDescription className="text-xs text-amber-900 dark:text-amber-200">
                      This is a client-side app running in your browser. Certificate validation is controlled by your browser's security settings. Self-signed certificates may still require you to accept them manually in your browser.
                    </AlertDescription>
                  </Alert>
                )}

                {tokenGenerated ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl border border-primary bg-primary/5">
                    <CheckCircle size={20} weight="fill" className="text-primary" />
                    <span className="text-sm font-medium">Token generated successfully!</span>
                  </div>
                ) : (
                  <Button
                    onClick={handleGenerateToken}
                    disabled={isGeneratingToken}
                    className="w-full"
                    size="lg"
                  >
                    {isGeneratingToken ? 'Generating...' : 'Generate Token'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'agents' && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-accent/20 bg-accent/5">
                <Info size={20} weight="fill" className="text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Configure Agent Endpoints</p>
                  <p className="text-muted-foreground text-xs">
                    Set up the API endpoints for your AI agents. You can configure multiple agents or skip this step and add them later.
                  </p>
                </div>
              </div>

              {configuredAgents.length > 0 && (
                <div className="space-y-2">
                  <Label>Configured Agents</Label>
                  <div className="flex flex-wrap gap-2">
                    {configuredAgents.map((agent) => (
                      <Badge key={agent} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                        <CheckCircle size={14} weight="fill" className="text-primary" />
                        {AGENTS[agent].name}
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="agent-type">Agent Type</Label>
                  <Select value={selectedAgent} onValueChange={(value) => setSelectedAgent(value as AgentType)}>
                    <SelectTrigger id="agent-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AGENTS)
                        .filter(([key]) => !configuredAgents.includes(key as AgentType))
                        .map(([key, agent]) => (
                          <SelectItem key={key} value={key}>
                            {agent.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-endpoint">Agent Endpoint *</Label>
                  <Input
                    id="agent-endpoint"
                    placeholder="https://api.example.com/agent/endpoint"
                    value={agentEndpoint}
                    onChange={(e) => setAgentEndpoint(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent-name">Custom Name (Optional)</Label>
                  <Input
                    id="agent-name"
                    placeholder={`e.g., "${AGENTS[selectedAgent].name} - Production"`}
                    value={agentCustomName}
                    onChange={(e) => setAgentCustomName(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleAddAgent}
                  variant="outline"
                  className="w-full"
                  disabled={configuredAgents.includes(selectedAgent)}
                >
                  Add Agent Configuration
                </Button>

                {configuredAgents.length === 0 && (
                  <Button
                    onClick={handleSkipAgentSetup}
                    variant="ghost"
                    className="w-full"
                  >
                    Skip for now
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle size={40} weight="fill" className="text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Setup Complete!</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You're all set to start testing your AI agents. Create your first conversation to begin.
                </p>
                <div className="w-full max-w-md space-y-3 text-left">
                  <div className="p-4 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} weight="fill" className="text-primary" />
                      <span className="font-semibold text-sm">Authentication Configured</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Your access token is ready to use</p>
                  </div>
                  {configuredAgents.length > 0 && (
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={16} weight="fill" className="text-primary" />
                        <span className="font-semibold text-sm">{configuredAgents.length} Agent{configuredAgents.length !== 1 ? 's' : ''} Configured</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Ready to start testing</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="font-medium">Save your configuration</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <Button
                  onClick={handleExportSettings}
                  disabled={isExporting}
                  variant="outline"
                  className="w-full h-11"
                  size="lg"
                >
                  <Download size={18} weight="bold" className="mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Settings to File'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Save your configuration to easily restore it later or use it on another device
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 'welcome' || currentStep === 'complete'}
          >
            <CaretLeft size={16} weight="bold" className="mr-1" />
            Back
          </Button>
          <div className="flex gap-2">
            {currentStep !== 'complete' && (
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            )}
            {currentStep === 'complete' ? (
              <Button onClick={handleComplete} size="lg">
                <Rocket size={18} weight="bold" className="mr-2" />
                Get Started
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
                <CaretRight size={16} weight="bold" className="ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
