import { ShieldCheck, LockKey, FileArrowDown, Warning, CheckCircle, Info, Browsers, Database, CloudSlash, Lock } from '@phosphor-icons/react'
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
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={24} weight="duotone" className="text-accent" />
            Security & Data Privacy
          </DialogTitle>
          <DialogDescription>
            Complete client-side data storage - zero server transmission
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 pr-4 py-2">
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

            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Lock size={20} weight="duotone" className="text-primary" />
                Privacy & Security Guarantees
              </h3>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Zero Server-Side Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Your credentials, tokens, and conversations are <strong>never transmitted to any server</strong>. 
                    All data remains in your browser's local storage on your device only.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Direct Agent Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    When you send messages, they go <strong>directly from your browser to the agent endpoints</strong> you configure. 
                    This application server acts only as a static file host and never proxies or logs your requests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Browser-Only Encryption</h3>
                  <p className="text-sm text-muted-foreground">
                    All sensitive data (client secrets, passwords, tokens) is stored using Spark KV with 
                    encryption at rest in your browser. Your data never leaves your device.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
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
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Short-Lived Access Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Bearer tokens expire after 15 minutes and must be regenerated, limiting exposure window 
                    if your device is compromised.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">HTTPS Protected Communication</h3>
                  <p className="text-sm text-muted-foreground">
                    All communication with token endpoints and agents should use HTTPS to prevent 
                    man-in-the-middle interception during transit.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Warning size={20} className="text-amber-500" />
                Important Security Considerations
              </h3>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <LockKey size={16} className="text-amber-700 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    <strong>Use Test Credentials Only:</strong> This is a development/testing tool. 
                    Never store production credentials or secrets, even though they stay client-side.
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
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Database size={20} weight="duotone" className="text-primary" />
                What Data Is Stored (Locally in Your Browser)
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3">
                The following data is stored <strong>only in your browser's local storage</strong> 
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
                    <span className="text-xs text-muted-foreground">Current bearer token (15min expiry)</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">access-token</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <div className="flex flex-col">
                    <span className="font-medium">Agent Endpoints</span>
                    <span className="text-xs text-muted-foreground">URLs for your configured agents</span>
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

              <Alert className="mt-4 border-primary/30 bg-primary/5">
                <Browsers size={18} className="text-primary" />
                <AlertDescription className="text-sm text-muted-foreground">
                  All this data exists <strong>only on this device</strong> in your browser. 
                  If you use a different browser or device, you'll need to reconfigure everything.
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Best Practices for Client-Side Security</h3>
              
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Use dedicated test/development credentials, never production</li>
                <li>Rotate credentials regularly and after testing sessions</li>
                <li>Clear stored data when switching projects or environments</li>
                <li>Be aware that anyone with physical access to your unlocked device can access stored data</li>
                <li>Use browser profiles to isolate different project credentials</li>
                <li>Store exported configuration files in encrypted storage</li>
                <li>Delete export files immediately after importing elsewhere</li>
                <li>Use tokens with minimal required permissions</li>
                <li>Never commit export files to version control systems</li>
                <li>Consider using browser private/incognito mode for temporary testing</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-destructive flex items-center gap-2">
                <Database size={20} weight="duotone" />
                Clear All Local Data
              </h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete all stored credentials, tokens, and conversation history from <strong>your browser</strong>.
                This removes all local data but does not affect any server-side resources. This action cannot be undone.
              </p>
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                className="w-full"
              >
                Clear All Stored Data from Browser
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
