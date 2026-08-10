import { useEffect } from 'react'

/**
 * useKeyboardShortcuts — Global keyboard shortcuts for demo control.
 * Guards against firing when focus is inside an input/textarea/select.
 *
 * @param {Object} handlers
 * @param {Function} handlers.onReset   — 'R' key
 * @param {Function} handlers.onStart   — 'S' key
 * @param {Function} handlers.onToggle  — 'Space' key (play/pause toggle)
 */
export function useKeyboardShortcuts({ onReset, onStart, onToggle }) {
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't fire when typing inside form elements
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (document.activeElement?.isContentEditable) return

      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault()
          onReset?.()
          break
        case 's':
          e.preventDefault()
          onStart?.()
          break
        case ' ':
          e.preventDefault()
          onToggle?.()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onReset, onStart, onToggle])
}
