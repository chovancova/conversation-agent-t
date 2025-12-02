import { useEffect } from 'react'

type ShortcutConfig = {
  key: string
  ctrlOrCmd?: boolean
  shift?: boolean
  alt?: boolean
  callback: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlOrCmdPressed = event.metaKey || event.ctrlKey
        const ctrlOrCmdMatch = shortcut.ctrlOrCmd ? ctrlOrCmdPressed : !ctrlOrCmdPressed
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlOrCmdMatch &&
          shiftMatch &&
          altMatch
        ) {
          const target = event.target as HTMLElement
          const isTyping = target && ['INPUT', 'TEXTAREA'].includes(target.tagName)
          
          if (!isTyping || ctrlOrCmdPressed) {
            event.preventDefault()
            shortcut.callback()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

export const SHORTCUT_DESCRIPTIONS = {
  newConversation: '⌘/Ctrl + N',
  toggleSidebar: '⌘/Ctrl + B',
  search: '⌘/Ctrl + K',
  toggleSplit: '⌘/Ctrl + \\',
}
