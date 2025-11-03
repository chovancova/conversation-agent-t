import { ShieldCheck, LockKey, FileArrowDown, Warning, CheckCircle, Info, Browsers, Database, CloudSlash, Trash, Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

type SecurityInfoProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecurityInfo({ open, onOpenChange }: SecurityInfoProps) {
  const [sessionTimeoutEnabled, setSessionTimeoutEnabled] = useKV<boolean>('session-timeout-enabled', true)
  
  const handleClearAllData = async () => {
    try {
      const keys = await window.spark.kv.keys()
      
      const deletePromises = keys.map(key => window.spark.kv.delete(key))
      await Promise.all(deletePromises)
      
      toast.success('All stored data cleared from your browser')
      onOpenChange(false)
      
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      toast.error('Failed to clear data')
      console.error('Clear data error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border bg-card/50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-accent/10">
              <ShieldCheck size={24} weight="duotone" className="text-accent" />
            </div>
            Security & Privacy
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Your data is stored exclusively in your browser and never sent to any server
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 py-6 pr-4">
            <Alert className="border-accent/50 bg-accent/5">
              <CloudSlash size={20} className="text-accent" />
              <AlertTitle className="text-accent font-bold">100% Client-Side Storage</AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p className="font-semibold text-foreground">
                  NO data is ever sent to or stored on any server. Everything stays in YOUR browser.
                </p>
                <p className="text-muted-foreground">
                  All credentials, tokens, conversations, and settings are stored exclusively in your browser's 
                  local storage using Spark KV. The application server never sees, processes, or stores any of your data.
                </p>
              </AlertDescription>
            </Alert>

            <Accordion type="multiple" defaultValue={["guarantees", "security-considerations"]} className="w-full">
              <AccordionItem value="guarantees" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                    <span className="font-semibold text-base">Privacy & Security Guarantees</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Zero Server-Side Storage</h3>
                        <p className="text-sm text-muted-foreground">
                          All data remains in your browser's local storage on your device only.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Direct Agent Communication</h3>
                        <p className="text-sm text-muted-foreground">
                          Your browser connects directly to agent endpoints using your access token.
                          This application server acts only as a static file host and never proxies or logs your requests.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">AES-256-GCM Encryption</h3>
                        <p className="text-sm text-muted-foreground">
                          Credentials can be encrypted using AES-256-GCM with PBKDF2 key derivation (100,000 iterations).
                          All encryption happens in your browser - passwords never leave your device. Encrypted data is stored in Spark KV.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">User-Isolated Storage</h3>
                        <p className="text-sm text-muted-foreground">
                          Your token configurations and conversations are scoped to your user account 
                          and browser profile. Other users cannot access your data.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Short-Lived Access Tokens</h3>
                        <p className="text-sm text-muted-foreground">
                          Access tokens expire after 15 minutes by default, reducing the window of exposure 
                          if your device is compromised.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">HTTPS Communication</h3>
                        <p className="text-sm text-muted-foreground">
                          All communication with token endpoints and agents should use HTTPS to prevent 
                          man-in-the-middle interception during transit.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security-considerations" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Warning size={20} className="text-amber-500" />
                    <span className="font-semibold text-base">Important Security Considerations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 space-y-3 mt-2">
                    <div className="flex items-start gap-2">
                      <LockKey size={16} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Use Test Credentials Only:</strong> This is a development/testing tool. 
                        Never use production credentials or secrets, even though they stay client-side.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <FileArrowDown size={16} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Export Files Are Plaintext:</strong> When you export token configurations, 
                        they contain unencrypted credentials. Store these files securely and delete when done.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Info size={16} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Browser Environment:</strong> While encrypted in browser storage, credentials must be 
                        decrypted in browser memory to use. This is inherent to all client-side applications.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CloudSlash size={16} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>No Server Backup:</strong> Since nothing is stored server-side, clearing your 
                        browser data or using a different device means losing all configurations and history.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="stored-data" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Database size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">What Data Is Stored Locally</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-muted-foreground">
                      The following data is stored in your browser's Spark KV storage 
                      and is never sent to any server:
                    </p>
                    <div className="space-y-2 text-sm bg-muted/30 rounded-lg p-4">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium">Token Configurations</span>
                          <span className="text-xs text-muted-foreground">Client IDs, secrets, usernames, passwords</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">saved-tokens</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium">Active Access Token</span>
                          <span className="text-xs text-muted-foreground">Current bearer token and expiration</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">access-token</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium">Agent Endpoints</span>
                          <span className="text-xs text-muted-foreground">URLs for each agent type</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">agent-endpoints</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium">Agent Display Names</span>
                          <span className="text-xs text-muted-foreground">Custom names for your agents</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">agent-names</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium">Conversation History</span>
                          <span className="text-xs text-muted-foreground">All messages and chat sessions</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">conversations</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex flex-col">
                          <span className="font-medium">UI Preferences</span>
                          <span className="text-xs text-muted-foreground">Theme, sidebar state, filters</span>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">various keys</span>
                      </div>
                    </div>

                    <Alert className="border-primary/30 bg-primary/5">
                      <Browsers size={18} className="text-primary" />
                      <AlertDescription className="text-sm">
                        All this data exists <strong>only on this device</strong> in your browser. 
                        No servers involved.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="best-practices" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">Best Practices for Client-Side Security</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside pt-2">
                    <li>Use dedicated test/development credentials, never production</li>
                    <li>Rotate credentials regularly and after testing sessions</li>
                    <li>Clear stored data when switching projects or environments</li>
                    <li>Be aware that anyone with physical access to your unlocked device can access stored data</li>
                    <li>Use browser profiles to isolate different project credentials</li>
                    <li>Store exported configuration files in encrypted storage</li>
                    <li>Delete export files immediately after importing elsewhere</li>
                    <li>Use tokens with minimal required permissions</li>
                    <li>Consider using browser private/incognito mode for temporary testing</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security-features" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">Security Features</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30">
                      <div className="flex flex-col flex-1">
                        <Label htmlFor="session-timeout" className="text-sm font-semibold cursor-pointer">
                          Session Timeout
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically clear sensitive data after 30 minutes of inactivity (5 minute warning)
                        </p>
                      </div>
                      <Switch
                        id="session-timeout"
                        checked={sessionTimeoutEnabled}
                        onCheckedChange={(checked) => {
                          setSessionTimeoutEnabled(checked)
                          toast.success(checked ? 'Session timeout enabled' : 'Session timeout disabled', {
                            description: checked ? 'Page will reload to activate' : 'Disabled for this session'
                          })
                          if (checked) {
                            setTimeout(() => window.location.reload(), 1000)
                          }
                        }}
                      />
                    </div>
                    
                    <Alert className="border-accent/50 bg-accent/5">
                      <Info size={18} className="text-accent" />
                      <AlertDescription className="text-sm">
                        When enabled, access tokens and cached credentials will be automatically cleared after 30 minutes 
                        of inactivity to protect against unauthorized access on unattended devices.
                      </AlertDescription>
                    </Alert>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="clear-data" className="border rounded-lg px-4 mb-3 border-destructive/30 bg-destructive/5">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Trash size={20} weight="duotone" className="text-destructive" />
                    <span className="font-semibold text-base">Clear All Stored Data</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2">
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all saved token configurations, access tokens, and conversation history from <strong>your browser</strong>.
                      This action cannot be undone.
                    </p>
                    <Button
                      onClick={handleClearAllData}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash size={16} weight="bold" className="mr-2" />
                      Clear All Data from Browser
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}