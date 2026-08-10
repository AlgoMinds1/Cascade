import { useState, useEffect, useRef } from 'react'
import { useWorld } from '../store/WorldContext.jsx'
import { AlertTriangle, X, Radio } from 'lucide-react'

const AUTO_DISMISS_MS = 8000

/**
 * AlertBanner — two modes:
 *  - overlay (default): fixed top-0 full-width drop-down; auto-dismisses after 8s
 *  - inline: compact card for sidebar usage
 */
export default function AlertBanner({ mode = 'overlay' }) {
  const { alerts, clearAlert } = useWorld()
  const [dismissed, setDismissed] = useState(new Set())
  const [exiting, setExiting] = useState(new Set())
  const timersRef = useRef({})

  const visible = alerts.filter(a => !dismissed.has(a.id))
  const latest = visible[0] ?? null

  // Auto-dismiss latest alert after AUTO_DISMISS_MS
  useEffect(() => {
    if (!latest || mode !== 'overlay') return
    if (timersRef.current[latest.id]) return // already scheduled

    const timer = setTimeout(() => {
      handleDismiss(latest.id)
    }, AUTO_DISMISS_MS)

    timersRef.current[latest.id] = timer
    return () => {
      clearTimeout(timer)
      delete timersRef.current[latest.id]
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latest?.id, mode])

  function handleDismiss(id) {
    // Play exit animation first
    setExiting(prev => new Set([...prev, id]))
    setTimeout(() => {
      setDismissed(prev => new Set([...prev, id]))
      clearAlert(id)
      setExiting(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      if (timersRef.current[id]) {
        clearTimeout(timersRef.current[id])
        delete timersRef.current[id]
      }
    }, 280)
  }

  /* ── OVERLAY MODE ──────────────────────────────────────── */
  if (mode === 'overlay') {
    if (!latest) return null

    const isExiting = exiting.has(latest.id)
    return (
      <div
        className={`fixed top-14 left-0 right-0 z-[2000] px-4 pt-2 pointer-events-none`}
      >
        <div
          className={`
            max-w-4xl mx-auto pointer-events-auto
            flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-glow-red
            bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white
            border border-red-400/30 backdrop-blur-sm
            ${isExiting ? 'animate-slide-up' : 'animate-slide-down'}
          `}
        >
          {/* Pulsing radio icon */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-100">
                Critical Alert
              </span>
              {visible.length > 1 && (
                <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">
                  +{visible.length - 1} more
                </span>
              )}
            </div>
            <p className="text-sm font-semibold leading-snug truncate">
              {latest.message}
            </p>
          </div>

          {/* Progress bar showing auto-dismiss countdown */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
            <div
              className="h-full bg-white/40 origin-left"
              style={{
                animation: `shrink ${AUTO_DISMISS_MS}ms linear forwards`,
              }}
            />
          </div>

          <button
            onClick={() => handleDismiss(latest.id)}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  /* ── INLINE MODE (sidebar) ─────────────────────────────── */
  if (visible.length === 0) return null

  return (
    <div className="space-y-1.5">
      {visible.slice(0, 4).map(alert => (
        <div
          key={alert.id}
          className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl border animate-fade-in
            ${alert.severity === 'critical'
              ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300 ring-1 ring-red-400/30'
              : 'bg-amber-50 border-amber-200'}
          `}
        >
          <AlertTriangle
            className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${
              alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
            }`}
          />
          <span className={`text-xs font-medium flex-1 leading-snug ${
            alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'
          }`}>
            {alert.message}
          </span>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
            aria-label="Dismiss"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
