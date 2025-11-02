import { ShieldCheck, LockKey, FileArrowDown, Warning, CheckCircle, Info, Browsers, Database, CloudSlash, Lock, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

type SecurityInfoProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SecurityInfo({ open, onOpenChange }: SecurityInfoProps) {
  const handleClearAllData = async () => {
    try {
      const keys = await window.spark.kv.keys()
      for (const key of keys) {
        await window.spark.kv.delete(key)
      }
      toast.success('All stored data cleared from your browser')
      onOpenChange(false)
      window.location.reload()
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
            Security & Data Privacy
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Complete client-side data storage - zero server transmission
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-6 pr-4">
            <Alert className="border-accent/50 bg-accent/5">
              <CloudSlash size={20} className="text-accent flex-shrink-0" />
              <AlertTitle className="text-accent font-bold text-base">100% Client-Side Storage</AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p className="font-semibold text-foreground">
                  NO data is ever sent to or stored on any server. Everything stays in YOUR browser.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  All credentials, tokens, conversations, and settings are stored exclusively in your browser's 
                  local storage using Spark KV. The application server never sees, processes, or stores any of your data.
                </p>
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lock size={22} weight="duotone" className="text-primary" />
                Privacy & Security Guarantees
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">Zero Server-Side Storage</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your credentials, tokens, and conversations are <strong>never transmitted to any server</strong>. 
                      All data remains in your browser's local storage on your device only.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">Direct Agent Communication</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When you send messages, they go <strong>directly from your browser to the agent endpoints</strong> you configure. 
                      This application server acts only as a static file host and never proxies or logs your requests.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">Browser-Only Encryption</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All sensitive data (client secrets, passwords, tokens) is stored using Spark KV with 
                      encryption at rest in your browser. Your data never leaves your device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">User-Isolated Storage</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Your token configurations and conversations are scoped to your user account 
                      and browser profile. Other users cannot access your data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">Short-Lived Access Tokens</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Bearer tokens expire after 15 minutes and must be regenerated, limiting exposure window 
                      if your device is compromised.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mt-0.5 flex-shrink-0">
                    <CheckCircle size={20} weight="fill" className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1.5">HTTPS Protected Communication</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      All communication with token endpoints and agents should use HTTPS to prevent 
                      man-in-the-middle interception during transit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Warning size={22} className="text-amber-500" />
                Important Security Considerations
              </h3>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <LockKey size={18} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="font-semibold">Use Test Credentials Only:</strong> This is a development/testing tool. 
                      Never store production credentials or secrets, even though they stay client-side.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileArrowDown size={18} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="font-semibold">Export Files Are Plaintext:</strong> When you export token configurations, 
                      they contain unencrypted credentials. Store these files securely and delete when done.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info size={18} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="font-semibold">Browser Environment:</strong> While encrypted in browser storage, credentials must be 
                      decrypted in browser memory to use. This is inherent to all client-side applications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CloudSlash size={18} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
                      <strong className="font-semibold">No Server Backup:</strong> Since nothing is stored server-side, clearing your 
                      browser data or using a different device means losing all configurations and history.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Database size={22} weight="duotone" className="text-primary" />
                What Data Is Stored (Locally in Your Browser)
              </h3>
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                The following data is stored <strong>only in your browser's local storage</strong> 
                and is never sent to any server:
              </p>

              <div className="space-y-0 text-sm bg-card border border-border rounded-lg overflow-hidden">
                <div className="py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Token Configurations</span>
                    <span className="text-xs text-muted-foreground">Client IDs, secrets, usernames, passwords</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">saved-tokens</span>
                </div>
                <div className="py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Active Access Token</span>
                    <span className="text-xs text-muted-foreground">Current bearer token (15min expiry)</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">access-token</span>
                </div>
                <div className="py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Agent Endpoints</span>
                    <span className="text-xs text-muted-foreground">URLs for your configured agents</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">agent-endpoints</span>
                </div>
                <div className="py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Agent Display Names</span>
                    <span className="text-xs text-muted-foreground">Custom names for your agents</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">agent-names</span>
                </div>
                <div className="py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Conversation History</span>
                    <span className="text-xs text-muted-foreground">All messages and chat sessions</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">conversations</span>
                </div>
                <div className="py-3 px-4 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">UI Preferences</span>
                    <span className="text-xs text-muted-foreground">Theme, sidebar state, filters</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground mt-1 inline-block">various keys</span>
                </div>
              </div>

              <Alert className="border-primary/30 bg-primary/5">
                <Browsers size={18} className="text-primary flex-shrink-0" />
                <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
                  All this data exists <strong>only on this device</strong> in your browser. 
                  If you use a different browser or device, you'll need to reconfigure everything.
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Best Practices for Client-Side Security</h3>
              
              <div className="bg-muted/30 rounded-lg p-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Use dedicated test/development credentials, never production</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Rotate credentials regularly and after testing sessions</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Clear stored data when switching projects or environments</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Be aware that anyone with physical access to your unlocked device can access stored data</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Use browser profiles to isolate different project credentials</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Store exported configuration files in encrypted storage</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Delete export files immediately after importing elsewhere</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Use tokens with minimal required permissions</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Never commit export files to version control systems</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>Consider using browser private/incognito mode for temporary testing</span>
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-destructive flex items-center gap-2">
                <Trash size={22} weight="duotone" />
                Clear All Local Data
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Permanently delete all stored credentials, tokens, and conversation history from <strong>your browser</strong>.
                This removes all local data but does not affect any server-side resources. This action cannot be undone.
              </p>
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                <Trash size={18} weight="bold" className="mr-2" />
                Clear All Stored Data from Browser
              </Button>
            </div>

            <div className="h-4"></div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
