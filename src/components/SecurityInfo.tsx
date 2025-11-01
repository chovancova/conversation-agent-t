import { ShieldCheck, LockKey, FileArrowDown, Warning, CheckCircle, Info } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
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
      toast.success('All stored data cleared')
      onOpenChange(false)
      window.location.reload()
    } catch (error) {
      toast.error('Failed to clear data')
      console.error('Clear data error:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck size={24} weight="duotone" className="text-accent" />
            Security & Data Privacy
          </DialogTitle>
          <DialogDescription>
            How your credentials and data are protected
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 py-4">
          <div className="space-y-6 pr-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Encrypted at Rest</h3>
                  <p className="text-sm text-muted-foreground">
                    All credentials (client secrets, passwords) and conversation data are stored using Spark KV, 
                    which provides encryption at rest. Your data is never stored in plaintext.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">User-Scoped Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Your token configurations and conversations are isolated to your user session 
                    and persist between page refreshes.
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
                    Bearer tokens expire after 15 minutes and must be regenerated, limiting exposure window.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">HTTPS Required</h3>
                  <p className="text-sm text-muted-foreground">
                    All communication with token endpoints and agents should use HTTPS to prevent interception.
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

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <LockKey size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900">
                    <strong>Use Test Credentials Only:</strong> This is a development/testing tool. 
                    Never store production credentials or secrets.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <FileArrowDown size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900">
                    <strong>Export Files Are Plaintext:</strong> When you export token configurations, 
                    they contain unencrypted credentials. Store these files securely and delete when done.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Info size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-900">
                    <strong>Browser Environment:</strong> While encrypted in storage, credentials must be 
                    decrypted in browser memory to use. This is inherent to client-side applications.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">What Data Is Stored</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Token Configurations</span>
                  <span className="font-mono text-xs">saved-tokens</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Active Access Token</span>
                  <span className="font-mono text-xs">access-token</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Agent Endpoints</span>
                  <span className="font-mono text-xs">agent-endpoints</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Conversation History</span>
                  <span className="font-mono text-xs">conversations</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Best Practices</h3>
              
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Use dedicated test/development credentials, never production</li>
                <li>Rotate credentials regularly and after testing sessions</li>
                <li>Clear stored data when switching projects or environments</li>
                <li>Store exported configuration files in encrypted storage</li>
                <li>Delete export files immediately after importing elsewhere</li>
                <li>Use tokens with minimal required permissions</li>
                <li>Never commit export files to version control systems</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold text-destructive">Clear All Data</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete all stored credentials, tokens, and conversation history from this device.
                This action cannot be undone.
              </p>
              <Button
                onClick={handleClearAllData}
                variant="destructive"
                className="w-full"
              >
                Clear All Stored Data
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
