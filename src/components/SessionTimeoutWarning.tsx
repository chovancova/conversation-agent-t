import { Clock, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'

type SessionTimeoutWarningProps = {
  open: boolean
  minutesRemaining: number
  onContinue: () => void
  onLogout: () => void
}

export function SessionTimeoutWarning({ open, minutesRemaining, onContinue, onLogout }: SessionTimeoutWarningProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Warning size={24} weight="fill" className="text-amber-500" />
            Session Timeout Warning
          </DialogTitle>
          <DialogDescription>
            Your session will expire soon due to inactivity
          </DialogDescription>
        </DialogHeader>

        <Alert className="border-amber-500/50 bg-amber-500/10">
          <Clock size={18} className="text-amber-500" />
          <AlertDescription className="ml-2">
            <p className="font-semibold text-foreground mb-2">
              {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''} until automatic logout
            </p>
            <p className="text-sm text-muted-foreground">
              For security, your session will end and all sensitive data will be cleared from memory.
              Click "Continue Session" to stay logged in.
            </p>
          </AlertDescription>
        </Alert>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1"
          >
            Logout Now
          </Button>
          <Button
            onClick={onContinue}
            className="flex-1"
          >
            Continue Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
