import { useState } from 'react'
import { Info, CheckCircle, XCircle, Warning, ShieldCheck, CloudArrowDown, Globe, LockKey } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ValidationRulesGuideProps = {
  className?: string
}

export function ValidationRulesGuide({ className = '' }: ValidationRulesGuideProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck size={20} weight="duotone" />
          Endpoint Validation Rules
        </CardTitle>
        <CardDescription>
          Comprehensive validation checks for secure and reliable API configurations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="security">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <LockKey size={16} weight="duotone" />
                Security Validation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>HTTPS Required:</strong> Production endpoints must use HTTPS protocol for encrypted communication
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>No Credentials in URL:</strong> Authentication credentials should be in headers, not URL parameters
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Safe Ports:</strong> Validates against known insecure protocol ports (21, 23, 25)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Warning size={16} className="mt-0.5 text-yellow-600 flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>HTTP Warning:</strong> HTTP endpoints trigger warnings for unencrypted data transmission
                  </div>
                </div>
              </div>

              <Alert className="py-2">
                <Info size={14} className="mt-0.5" weight="fill" />
                <AlertDescription className="text-xs ml-2">
                  Local development (localhost, 127.0.0.1) is exempt from HTTPS requirement
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="reachability">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Globe size={16} weight="duotone" />
                Reachability Validation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Valid URL Format:</strong> Ensures URL follows proper syntax with protocol, host, and path
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Domain Validation:</strong> Checks for valid TLD and rejects placeholder domains (example.com)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Private IP Detection:</strong> Identifies private network ranges (10.x, 192.168.x, 172.16-31.x)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Warning size={16} className="mt-0.5 text-yellow-600 flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Environment Detection:</strong> Warns about test/dev/staging endpoints in production
                  </div>
                </div>
              </div>

              <Alert className="py-2 border-blue-500/50 bg-blue-500/5">
                <Info size={14} className="mt-0.5 text-blue-600" weight="fill" />
                <AlertDescription className="text-xs ml-2 text-blue-800 dark:text-blue-300">
                  Private IP warnings ensure you're aware of network accessibility requirements
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="compliance">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} weight="duotone" />
                API Compliance
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Path Convention:</strong> Recommends standard API paths (/api/*, /v1/*, etc.)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>URL Length:</strong> Validates against excessive URL length (max 2048 chars)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Query Parameter Security:</strong> Detects API keys and tokens in query strings
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 text-destructive flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Path Traversal:</strong> Blocks suspicious patterns (../, //) in URL paths
                  </div>
                </div>
              </div>

              <Alert className="py-2 border-yellow-500/50 bg-yellow-500/5">
                <Warning size={14} className="mt-0.5 text-yellow-600" weight="fill" />
                <AlertDescription className="text-xs ml-2 text-yellow-800 dark:text-yellow-300">
                  API keys in query strings are visible in logs and browser history - use Authorization headers
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cors">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <CloudArrowDown size={16} weight="duotone" />
                CORS Proxy Validation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Proxy URL Format:</strong> Validates proxy server URL structure and protocol
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Authentication Check:</strong> Ensures credentials are provided when proxy requires auth
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Credential Detection:</strong> Identifies embedded credentials in proxy URL
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Warning size={16} className="mt-0.5 text-yellow-600 flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Security Warning:</strong> HTTP proxies with authentication expose credentials
                  </div>
                </div>
              </div>

              <Alert className="py-2">
                <Info size={14} className="mt-0.5" weight="fill" />
                <AlertDescription className="text-xs ml-2">
                  Use CORS proxy to bypass browser CORS restrictions when server doesn't send CORS headers
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tokens">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <LockKey size={16} weight="duotone" />
                Bearer Token Validation
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Format Detection:</strong> Recognizes JWT, Base64, and hexadecimal token formats
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} className="mt-0.5 text-accent flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Length Validation:</strong> Ensures token length is within acceptable ranges (20-8192 chars)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Warning size={16} className="mt-0.5 text-yellow-600 flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Prefix Check:</strong> Warns if "Bearer " prefix is included (added automatically)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle size={16} className="mt-0.5 text-destructive flex-shrink-0" weight="fill" />
                  <div className="text-xs">
                    <strong>Whitespace Detection:</strong> Blocks tokens with unexpected spaces
                  </div>
                </div>
              </div>

              <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                <div className="text-xs font-semibold mb-1">Supported Token Formats:</div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">JWT</Badge>
                  <Badge variant="secondary" className="text-xs">Base64</Badge>
                  <Badge variant="secondary" className="text-xs">Hexadecimal</Badge>
                  <Badge variant="secondary" className="text-xs">Custom</Badge>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Alert>
          <Info size={16} className="mt-0.5" weight="fill" />
          <AlertTitle className="text-sm mb-1">Validation Levels</AlertTitle>
          <AlertDescription className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <XCircle size={12} className="text-destructive" weight="fill" />
              <strong>Errors:</strong> Must be fixed before saving configuration
            </div>
            <div className="flex items-center gap-2">
              <Warning size={12} className="text-yellow-600" weight="fill" />
              <strong>Warnings:</strong> Recommendations that can be ignored if intentional
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={12} className="text-accent" weight="fill" />
              <strong>Valid:</strong> Configuration passes all validation checks
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
