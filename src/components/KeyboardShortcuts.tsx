import { Keyboard } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

type KeyboardShortcutsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcuts = [
  { key: '⌘/Ctrl + N', description: 'Create new conversation' },
  { key: '⌘/Ctrl + B', description: 'Toggle sidebar' },
  { key: '⌘/Ctrl + K', description: 'Focus search' },
  { key: '⌘/Ctrl + \\', description: 'Toggle split view' },
  { key: 'Enter', description: 'Send message' },
  { key: 'Shift + Enter', description: 'New line in message' },
  { key: '?', description: 'Show keyboard shortcuts' },
]

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard size={20} weight="duotone" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <kbd className="px-2.5 py-1.5 text-xs font-mono font-semibold text-muted-foreground bg-muted border border-border rounded-md shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
