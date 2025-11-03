import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Certificate, Upload, Info, CheckCircle, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'

export interface ClientCertificateConfig {
  certificateFile?: File
  certificatePem?: string
  privateKeyPem?: string
  passphrase?: string
  enabled: boolean
}

interface ClientCertificateSetupProps {
  value: ClientCertificateConfig
  onChange: (config: ClientCertificateConfig) => void
  className?: string
}

export function ClientCertificateSetup({ value, onChange, className }: ClientCertificateSetupProps) {
  const [showPassphrase, setShowPassphrase] = useState(false)

  const handleCertificateFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validExtensions = ['.cer', '.crt', '.pem', '.p12', '.pfx']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Invalid certificate file format', {
        description: 'Supported formats: .cer, .crt, .pem, .p12, .pfx'
      })
      return
    }

    try {
      const text = await file.text()
      onChange({
        ...value,
        certificateFile: file,
        certificatePem: text,
        enabled: true
      })
      toast.success('Certificate loaded successfully')
    } catch (error) {
      toast.error('Failed to read certificate file')
    }
  }

  const handlePrivateKeyUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      onChange({
        ...value,
        privateKeyPem: text
      })
      toast.success('Private key loaded successfully')
    } catch (error) {
      toast.error('Failed to read private key file')
    }
  }

  const handleCertificatePaste = (pem: string) => {
    onChange({
      ...value,
      certificatePem: pem,
      enabled: true
    })
  }

  const handlePrivateKeyPaste = (pem: string) => {
    onChange({
      ...value,
      privateKeyPem: pem
    })
  }

  const handlePassphraseChange = (passphrase: string) => {
    onChange({
      ...value,
      passphrase
    })
  }

  const handleToggle = (enabled: boolean) => {
    onChange({
      ...value,
      enabled
    })
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Certificate size={20} className="text-primary" />
            <Label className="text-base font-semibold">Client Certificate Authentication</Label>
          </div>
          <Switch
            checked={value.enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {value.enabled && (
          <>
            <Alert>
              <Info size={16} className="text-blue-500" />
              <AlertDescription className="text-xs">
                <strong>Browser Limitation:</strong> Modern browsers don't allow JavaScript to access client certificates for security reasons. 
                The browser will automatically prompt you to select a certificate when connecting to a server that requires mutual TLS (mTLS).
              </AlertDescription>
            </Alert>

            <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/30">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Warning size={16} className="text-amber-500" />
                Browser Certificate Setup Instructions
              </h4>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Windows:</p>
                  <ol className="list-decimal list-inside space-y-0.5 ml-2">
                    <li>Double-click your .cer/.pfx file to install</li>
                    <li>Import to "Current User" or "Local Machine"</li>
                    <li>Place certificate in "Personal" store</li>
                    <li>Browser will auto-detect when needed</li>
                  </ol>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-foreground">macOS:</p>
                  <ol className="list-decimal list-inside space-y-0.5 ml-2">
                    <li>Double-click .cer file to open Keychain Access</li>
                    <li>Import to "login" or "System" keychain</li>
                    <li>Set certificate trust to "Always Trust"</li>
                    <li>Browser will prompt when certificate is required</li>
                  </ol>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Linux (Chrome/Chromium):</p>
                  <ol className="list-decimal list-inside space-y-0.5 ml-2">
                    <li>Settings → Privacy and security → Security → Manage certificates</li>
                    <li>Import your certificate and private key</li>
                    <li>Or use: chrome://settings/certificates</li>
                  </ol>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Linux (Firefox):</p>
                  <ol className="list-decimal list-inside space-y-0.5 ml-2">
                    <li>Settings → Privacy & Security → Certificates → View Certificates</li>
                    <li>Import your PKCS#12 (.p12/.pfx) file</li>
                  </ol>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/30">
              <CheckCircle size={16} className="text-blue-500" />
              <AlertDescription className="text-xs">
                <strong>When accessing an mTLS endpoint:</strong> Your browser will automatically prompt you to select the appropriate client certificate. 
                Make sure your certificate is installed in your system/browser certificate store first.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cert-file" className="text-sm">Upload Certificate File (Optional - For Reference)</Label>
                <div className="flex gap-2">
                  <Input
                    id="cert-file"
                    type="file"
                    accept=".cer,.crt,.pem,.p12,.pfx"
                    onChange={handleCertificateFileUpload}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                    title="Upload certificate"
                  >
                    <Upload size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is for documentation purposes only. The actual authentication happens at the browser level.
                </p>
              </div>

              {value.certificateFile && (
                <Alert className="bg-green-500/10 border-green-500/30">
                  <CheckCircle size={16} className="text-green-500" />
                  <AlertDescription className="text-xs">
                    Certificate loaded: <strong>{value.certificateFile.name}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="cert-pem" className="text-sm">Certificate PEM (Optional - For Reference)</Label>
                <Textarea
                  id="cert-pem"
                  placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
                  value={value.certificatePem || ''}
                  onChange={(e) => handleCertificatePaste(e.target.value)}
                  className="font-mono text-xs h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-file" className="text-sm">Upload Private Key (Optional - For Reference)</Label>
                <Input
                  id="key-file"
                  type="file"
                  accept=".key,.pem"
                  onChange={handlePrivateKeyUpload}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-pem" className="text-sm">Private Key PEM (Optional - For Reference)</Label>
                <Textarea
                  id="key-pem"
                  placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
                  value={value.privateKeyPem || ''}
                  onChange={(e) => handlePrivateKeyPaste(e.target.value)}
                  className="font-mono text-xs h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passphrase" className="text-sm">Certificate Passphrase (If Encrypted)</Label>
                <div className="relative">
                  <Input
                    id="passphrase"
                    type={showPassphrase ? 'text' : 'password'}
                    value={value.passphrase || ''}
                    onChange={(e) => handlePassphraseChange(e.target.value)}
                    placeholder="Enter passphrase if certificate is encrypted"
                  />
                </div>
              </div>
            </div>

            <Alert className="bg-amber-500/10 border-amber-500/30">
              <Warning size={16} className="text-amber-500" />
              <AlertDescription className="text-xs space-y-1">
                <p><strong>Important:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>The browser handles certificate authentication, not JavaScript</li>
                  <li>Install your certificate in your system's certificate store</li>
                  <li>The browser will prompt you when the server requests a client certificate</li>
                  <li>Storing certificate details here is optional and for documentation only</li>
                </ul>
              </AlertDescription>
            </Alert>
          </>
        )}
      </div>
    </div>
  )
}
