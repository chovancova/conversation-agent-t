import { CloudSlash, Info, CheckCircle, Warning, ArrowRight } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function CorsProxyQuickGuide() {
  return (
    <div className="space-y-4">
      <Alert>
        <CloudSlash size={16} className="text-primary" weight="fill" />
        <AlertTitle className="text-sm font-semibold">What is a CORS Proxy?</AlertTitle>
        <AlertDescription className="text-xs space-y-2 mt-2">
          <p>
            A CORS (Cross-Origin Resource Sharing) proxy is a server that acts as an intermediary
            between your browser and a target API, adding the necessary CORS headers to allow
            cross-origin requests.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info size={16} className="text-blue-600 dark:text-blue-400" weight="fill" />
            When Do You Need It?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
            <p>
              <strong>CORS Error:</strong> You see "blocked by CORS policy" in the browser console
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
            <p>
              <strong>No Access-Control Headers:</strong> The API doesn't include CORS headers
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-accent mt-0.5 flex-shrink-0" weight="fill" />
            <p>
              <strong>Third-Party APIs:</strong> You're calling an API from a different domain
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ArrowRight size={16} className="text-primary" weight="bold" />
            How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-3">
          <div className="bg-muted p-3 rounded-lg space-y-1 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">1. Your Browser</span>
              <ArrowRight size={12} className="text-muted-foreground" />
              <span className="text-primary">CORS Proxy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">2. CORS Proxy</span>
              <ArrowRight size={12} className="text-muted-foreground" />
              <span className="text-accent">Target API</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-accent">3. Target API</span>
              <ArrowRight size={12} className="text-muted-foreground" />
              <span className="text-primary">CORS Proxy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">4. CORS Proxy</span>
              <ArrowRight size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">Your Browser</span>
            </div>
          </div>
          <p className="text-muted-foreground">
            The proxy adds CORS headers to the response, allowing your browser to accept it.
          </p>
        </CardContent>
      </Card>

      <Alert className="border-yellow-500/50 bg-yellow-500/5">
        <Warning size={16} className="text-yellow-600 dark:text-yellow-500" weight="fill" />
        <AlertTitle className="text-sm text-yellow-800 dark:text-yellow-300 font-semibold">
          Security Considerations
        </AlertTitle>
        <AlertDescription className="text-xs text-yellow-800 dark:text-yellow-300 space-y-2 mt-2">
          <ul className="list-disc list-inside space-y-1">
            <li>CORS proxies can see all your request and response data</li>
            <li>Only use trusted proxy providers for sensitive data</li>
            <li>Free public proxies may have rate limits or be unreliable</li>
            <li>Consider deploying your own proxy for production use</li>
            <li>Always use HTTPS proxies when available</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" weight="fill" />
            Recommended Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-3">
          <div className="space-y-2">
            <p className="font-semibold text-foreground">For Development:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Use local proxies (Charles, Fiddler, mitmproxy)</li>
              <li>Or use free public proxies for testing</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">For Production:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
              <li>Deploy your own Cloudflare Worker or Vercel function</li>
              <li>Use premium proxy services with SLA guarantees</li>
              <li>Implement authentication for your proxy</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-blue-500/50 bg-blue-500/5">
        <Info size={16} className="text-blue-600 dark:text-blue-400" weight="fill" />
        <AlertTitle className="text-sm text-blue-800 dark:text-blue-300 font-semibold">
          Quick Start
        </AlertTitle>
        <AlertDescription className="text-xs text-blue-800 dark:text-blue-300 space-y-2 mt-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Select a proxy provider from the list</li>
            <li>Test the proxy using the built-in test feature</li>
            <li>If authentication is required, enter credentials</li>
            <li>Save the configuration</li>
            <li>Enable "Use CORS Proxy" for your token configuration</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  )
}
