import { Keyboard } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type KeyboardShortcutsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shortcutSections = [
  {
    title: 'General',
    shortcuts: [
      { key: '⌘/Ctrl + N', description: 'Create new conversation' },
      { key: '⌘/Ctrl + B', description: 'Toggle sidebar' },
      { key: '⌘/Ctrl + K', description: 'Focus search' },
      { key: '⌘/Ctrl + E', description: 'Open Data Manager' },
      { key: '?', description: 'Show keyboard shortcuts' },
    ]
  },
  {
    title: 'View Management',
    shortcuts: [
      { key: '⌘/Ctrl + \\', description: 'Toggle split view' },
      { key: '⌘/Ctrl + C', description: 'Compare conversations' },
      { key: '⌘/Ctrl + Shift + A', description: 'Open Analytics Dashboard' },
    ]
  },
  {
    title: 'Agent Switching',
    shortcuts: [
      { key: '⌘/Ctrl + 1', description: 'Switch to Agent 1 (Account Opening)' },
      { key: '⌘/Ctrl + 2', description: 'Switch to Agent 2 (Payment)' },
      { key: '⌘/Ctrl + 3', description: 'Switch to Agent 3 (Moderator)' },
      { key: '⌘/Ctrl + 4', description: 'Switch to Agent 4 (Card)' },
      { key: '⌘/Ctrl + 5', description: 'Switch to Agent 5 (RAG)' },
    ]
  },
  {
    title: 'Messages',
    shortcuts: [
      { key: 'Enter', description: 'Send message' },
      { key: 'Shift + Enter', description: 'New line in message' },
    ]
  }
]

export function KeyboardShortcuts({ open, onOpenChange }: KeyboardShortcutsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard size={20} weight="duotone" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-2">
            {shortcutSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide px-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-sm text-foreground">{shortcut.description}</span>
                      <kbd className="px-2.5 py-1.5 text-xs font-mono font-semibold text-muted-foreground bg-muted border border-border rounded-md shadow-sm whitespace-nowrap">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
