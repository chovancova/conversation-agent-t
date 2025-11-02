import { CloudSlash, CheckCircle, Database, Browsers } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type ClientSideInfoProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientSideInfo({ open, onOpenChange }: ClientSideInfoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudSlash size={24} weight="duotone" className="text-accent" />
            Client-Side Only Storage
          </DialogTitle>
          <DialogDescription>
            All data is stored locally in your browser
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-5 py-4">
            <Alert className="border-accent/50 bg-accent/5">
              <CloudSlash size={20} className="text-accent" />
              <AlertTitle className="text-accent font-bold">Zero Server Storage</AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p className="font-semibold text-foreground">
                  NO data is ever sent to or stored on any server.
                </p>
                <p className="text-muted-foreground">
                  All credentials, tokens, conversations, and settings are stored exclusively in your browser's 
                  local storage. The application server never sees, processes, or stores any of your data.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Database size={20} weight="duotone" className="text-primary" />
                How It Works
              </h3>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Browser-Only Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Everything you enter (credentials, tokens, conversations) is saved only in your browser's 
                    local storage using Spark KV. Your data never leaves your device.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Direct API Communication</h4>
                  <p className="text-sm text-muted-foreground">
                    When you send messages to agents, they go <strong>directly from your browser</strong> to 
                    the configured endpoints. This application acts only as a static file host.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <CheckCircle size={20} weight="fill" className="text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Private & Isolated</h4>
                  <p className="text-sm text-muted-foreground">
                    Your data is scoped to your user account and browser. Other users cannot access your 
                    stored configurations or conversations.
                  </p>
                </div>
              </div>
            </div>

            <Alert className="border-primary/30 bg-primary/5">
              <Browsers size={18} className="text-primary" />
              <AlertDescription className="text-sm">
                <p className="font-semibold text-foreground mb-1">Device-Specific Storage</p>
                <p className="text-muted-foreground">
                  All data exists only on this device in your browser. If you use a different browser 
                  or device, you'll need to reconfigure your settings.
                </p>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h3 className="font-semibold text-base flex items-center gap-2">
                <Database size={20} weight="duotone" className="text-primary" />
                What Gets Stored Locally
              </h3>

              <div className="space-y-2 text-sm bg-muted/30 rounded-lg p-4">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Token Configurations</span>
                  <span className="text-xs text-muted-foreground">Client credentials</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Access Tokens</span>
                  <span className="text-xs text-muted-foreground">Bearer tokens</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Agent Endpoints</span>
                  <span className="text-xs text-muted-foreground">API URLs</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="font-medium">Conversations</span>
                  <span className="text-xs text-muted-foreground">Chat history</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">UI Preferences</span>
                  <span className="text-xs text-muted-foreground">Theme, filters</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-2">Benefits of Client-Side Storage:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Complete privacy - no server can access your data</li>
                <li>No data breaches - nothing to leak from servers</li>
                <li>Full control - you can clear data anytime</li>
                <li>No tracking - your usage patterns stay private</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
