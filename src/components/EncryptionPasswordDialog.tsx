import { useState } from 'react'
import { Lock, Eye, EyeSlash, ShieldCheck } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'

type EncryptionPasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => void
  mode: 'encrypt' | 'decrypt'
  title?: string
  description?: string
}

export function EncryptionPasswordDialog({
  open,
  onOpenChange,
  onConfirm,
  mode,
  title,
  description
}: EncryptionPasswordDialogProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    setError('')

    if (!password) {
      setError('Password is required')
      return
    }

    if (mode === 'encrypt') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    onConfirm(password)
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleCancel = () => {
    setPassword('')
    setConfirmPassword('')
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} weight="duotone" />
            {title || (mode === 'encrypt' ? 'Set Encryption Password' : 'Enter Password')}
          </DialogTitle>
          <DialogDescription>
            {description || (mode === 'encrypt' 
              ? 'Create a strong password to encrypt your credentials. You will need this password to decrypt them later.'
              : 'Enter the password you used to encrypt these credentials.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {mode === 'encrypt' && (
            <Alert className="border-accent/50 bg-accent/10">
              <ShieldCheck size={16} className="text-accent" />
              <AlertDescription className="text-xs text-muted-foreground ml-2">
                Store this password securely! Without it, you cannot decrypt your credentials. It is never saved or transmitted.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter a strong password' : 'Enter password'}
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && mode === 'decrypt') {
                    handleConfirm()
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash size={16} className="text-muted-foreground" />
                ) : (
                  <Eye size={16} className="text-muted-foreground" />
                )}
              </Button>
            </div>
            {mode === 'encrypt' && password && (
              <PasswordStrengthIndicator password={password} className="mt-2" />
            )}
          </div>

          {mode === 'encrypt' && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirm()
                  }
                }}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            {mode === 'encrypt' ? 'Encrypt & Save' : 'Decrypt'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
