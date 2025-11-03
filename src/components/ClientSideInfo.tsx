import { CloudSlash, CheckCircle, Database, Browsers, ShieldCheck, FileText } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

type ClientSideInfoProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientSideInfo({ open, onOpenChange }: ClientSideInfoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border bg-card/50">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-accent/10">
              <CloudSlash size={24} weight="duotone" className="text-accent" />
            </div>
            Client-Side Only Storage
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            All your data stays in your browser - nothing is sent to any server
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-5 py-6 pr-4">
            <Alert className="border-accent/50 bg-accent/5">
              <CloudSlash size={20} className="text-accent flex-shrink-0" />
              <AlertTitle className="text-accent font-bold text-base">100% Client-Side Application</AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p className="font-semibold text-foreground">
                  NO data is EVER sent to or stored on ANY server.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This application runs entirely in your browser. All credentials, tokens, conversations, and settings 
                  are stored exclusively in your browser's local storage using Spark KV. The application server only 
                  serves the static HTML/JS/CSS files - it never sees, processes, logs, or stores any of your data.
                </p>
                <p className="text-foreground font-semibold mt-3">
                  ✓ Zero server communication for data storage<br/>
                  ✓ Zero analytics or tracking<br/>
                  ✓ Zero data collection of any kind
                </p>
              </AlertDescription>
            </Alert>

            <Accordion type="multiple" defaultValue={["how-it-works", "stored-data"]} className="w-full">
              <AccordionItem value="how-it-works" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">How It Works</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">Browser-Only Storage</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Everything you enter (credentials, tokens, conversations) is saved only in your browser's 
                          local storage using Spark KV. Your data never leaves your device.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">Direct API Communication</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          When you send messages to agents, they go <strong>directly from your browser</strong> to 
                          the configured endpoints. This application acts only as a static file host.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <div className="mt-0.5 flex-shrink-0">
                        <CheckCircle size={18} weight="fill" className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">Private & Isolated</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Your data is scoped to your user account and browser. Other users cannot access your 
                          stored configurations or conversations.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="stored-data" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Database size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">What Gets Stored Locally</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-0 text-sm bg-card border border-border rounded-lg overflow-hidden mt-2">
                    <div className="flex justify-between items-center py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <span className="font-medium">Token Configurations</span>
                      <span className="text-xs text-muted-foreground">Client credentials</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <span className="font-medium">Access Tokens</span>
                      <span className="text-xs text-muted-foreground">Bearer tokens</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <span className="font-medium">Agent Endpoints</span>
                      <span className="text-xs text-muted-foreground">API URLs</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <span className="font-medium">Conversations</span>
                      <span className="text-xs text-muted-foreground">Chat history</span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 hover:bg-muted/30 transition-colors">
                      <span className="font-medium">UI Preferences</span>
                      <span className="text-xs text-muted-foreground">Theme, filters</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="benefits" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} weight="fill" className="text-primary" />
                    <span className="font-semibold text-base">Benefits of Client-Side Storage</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <ul className="space-y-2 text-sm text-muted-foreground pt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Complete privacy - no server can access your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>No data breaches - nothing to leak from servers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Full control - you can clear data anytime</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>No tracking - your usage patterns stay private</span>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="device-specific" className="border rounded-lg px-4 mb-3">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <Browsers size={20} className="text-primary" />
                    <span className="font-semibold text-base">Device-Specific Storage</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                    All data exists only on this device in your browser. If you use a different browser 
                    or device, you'll need to reconfigure your settings. This is because everything is 
                    stored locally and there is no synchronization across devices.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="browser-limitations" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} weight="duotone" className="text-primary" />
                    <span className="font-semibold text-base">Browser Security & Limitations</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-semibold text-sm mb-2">Certificate Validation</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                        If you see <code className="text-xs bg-destructive/20 px-1 py-0.5 rounded">ERR_CERT_AUTHORITY_INVALID</code> errors, 
                        your browser is blocking connections to endpoints with self-signed or untrusted certificates.
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        <strong>Solutions:</strong>
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mt-1 ml-4">
                        <li>• Visit the endpoint URL directly in your browser and accept the certificate warning</li>
                        <li>• Install the self-signed certificate in your OS/browser trust store</li>
                        <li>• Use a valid SSL certificate from a trusted authority</li>
                        <li>• Note: The "Ignore Certificate Errors" setting in Token Manager is informational only - browsers enforce certificate validation for security</li>
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-semibold text-sm mb-2">Proxy Configuration</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Browser fetch API automatically uses your system's proxy settings. The proxy field in Token Manager 
                        is for documentation purposes - you cannot override proxy settings from JavaScript for security reasons.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-muted/30">
                      <h4 className="font-semibold text-sm mb-2">CORS (Cross-Origin Requests)</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Since requests go directly from your browser to agent endpoints, those endpoints must have proper 
                        CORS headers configured to allow requests from this origin. This is a browser security feature, 
                        not a limitation of this application.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Alert className="border-primary/50 bg-primary/5">
              <FileText size={20} className="text-primary flex-shrink-0" />
              <AlertTitle className="text-primary font-bold text-base">Documentation</AlertTitle>
              <AlertDescription className="text-sm space-y-2 mt-2">
                <p className="text-muted-foreground">
                  For detailed information about certificate validation, proxy configuration, and client-side architecture:
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <a 
                    href="/CERTIFICATE_AND_PROXY_GUIDE.md" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold text-sm"
                  >
                    📄 Certificate & Proxy Configuration Guide
                  </a>
                  <a 
                    href="/CLIENT_SIDE_CONFIRMATION.md" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold text-sm"
                  >
                    📄 100% Client-Side Architecture Confirmation
                  </a>
                </div>
              </AlertDescription>
            </Alert>

            <div className="h-4"></div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
