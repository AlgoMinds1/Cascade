import { useState } from 'react'
import { Play, RotateCcw, Loader2 } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const DEMO_SCENARIOS = [
  { label: 'Bridge 17 Collapse', message: 'Bridge 17 has collapsed and is blocked' },
  { label: 'Road 17 Blocked', message: 'Road 17 is blocked due to flooding' },
]

export default function SimulationController() {
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [lastAction, setLastAction] = useState(null)

  const runScenario = async (scenario) => {
    setLoading(scenario.label)
    try {
      const res = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: scenario.message, source: 'simulation' })
      })
      const data = await res.json()
      setLastAction(data.success ? `✓ ${scenario.label} triggered` : `✗ Failed`)
    } catch {
      setLastAction('✗ Server unreachable')
    } finally {
      setLoading(null)
    }
  }

  const handleReset = async () => {
    setResetLoading(true)
    try {
      await fetch(`${API_URL}/api/reset`, { method: 'POST' })
      setLastAction('✓ World state reset')
    } catch {
      setLastAction('✗ Reset failed')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="card px-4 py-3 flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Simulate:</span>
      {DEMO_SCENARIOS.map(s => (
        <button
          key={s.label}
          onClick={() => runScenario(s)}
          disabled={!!loading}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 transition-colors"
        >
          {loading === s.label ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          {s.label}
        </button>
      ))}
      <div className="flex-1" />
      {lastAction && <span className="text-xs text-slate-500">{lastAction}</span>}
      <button
        onClick={handleReset}
        disabled={resetLoading}
        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
      >
        {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
        Reset
      </button>
    </div>
  )
}
