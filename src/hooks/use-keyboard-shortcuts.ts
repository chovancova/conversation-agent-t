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
        const ctrlOrCmdMatch = shortcut.ctrlOrCmd
          ? (event.metaKey || event.ctrlKey)
          : true
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlOrCmdMatch &&
          shiftMatch &&
          altMatch
        ) {
          if (!event.target || 
              !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
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
