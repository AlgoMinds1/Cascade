import { useState, useEffect } from 'react'
import { useWorld } from '../store/WorldContext.jsx'
import { AlertTriangle, X } from 'lucide-react'

export default function AlertBanner() {
  const { alerts } = useWorld()
  const [dismissed, setDismissed] = useState(new Set())

  const visible = alerts.filter(a => !dismissed.has(a.id))

  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {visible.slice(0, 3).map(alert => (
        <div
          key={alert.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-600 text-white shadow-lg animate-pulse"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">{alert.message}</span>
          <button
            onClick={() => setDismissed(prev => new Set([...prev, alert.id]))}
            className="hover:bg-white/20 rounded p-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
