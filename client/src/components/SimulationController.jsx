import { useState, useEffect, useRef } from 'react'
import { Play, Square, RotateCcw, Loader2, Zap, CheckCircle } from 'lucide-react'
import { useWorld } from '../store/WorldContext.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const DEMO_SCENARIOS = [
  { label: 'Bridge 17 Collapse', message: 'Bridge 17 has collapsed and is completely blocked' },
  { label: 'Road 17 Flooded', message: 'Road 17 is flooded and impassable for ambulances' },
  { label: 'South Ave Fire', message: 'Major fire breakout spotted near South Avenue' },
  { label: 'Bridge Damaged', message: 'Road seventeen bridge is damaged and closed to all traffic' },
]

const INTERVAL_MS = 3000

export default function SimulationController() {
  const { setSimRunning } = useWorld()
  const [loading, setLoading] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)
  const [lastAction, setLastAction] = useState(null)
  const [simActive, setSimActive] = useState(false)
  const [simIndex, setSimIndex] = useState(0)
  const [stepStatus, setStepStatus] = useState(null) // 'ok' | 'err'
  const intervalRef = useRef(null)
  const idxRef = useRef(0)

  // Sync sim state to WorldContext for Layout nav pill
  useEffect(() => {
    setSimRunning(simActive)
  }, [simActive, setSimRunning])

  // Auto-play interval
  useEffect(() => {
    if (!simActive) {
      clearInterval(intervalRef.current)
      return
    }

    const fire = async () => {
      const scenario = DEMO_SCENARIOS[idxRef.current % DEMO_SCENARIOS.length]
      idxRef.current = (idxRef.current + 1) % DEMO_SCENARIOS.length
      setSimIndex(idxRef.current)

      setLoading(scenario.label)
      setStepStatus(null)
      try {
        const res = await fetch(`${API_URL}/api/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: scenario.message, source: 'simulation' })
        })
        const data = await res.json()
        setLastAction(data.success ? scenario.label : 'Error')
        setStepStatus(data.success ? 'ok' : 'err')
      } catch {
        setLastAction('Server unreachable')
        setStepStatus('err')
      } finally {
        setLoading(null)
      }
    }

    fire() // fire immediately on start
    intervalRef.current = setInterval(fire, INTERVAL_MS)
    return () => clearInterval(intervalRef.current)
  }, [simActive])

  const toggleSim = () => {
    if (simActive) {
      setSimActive(false)
      setLastAction(null)
      setStepStatus(null)
    } else {
      idxRef.current = 0
      setSimIndex(0)
      setSimActive(true)
    }
  }

  const runSingle = async (scenario) => {
    if (simActive) return
    setLoading(scenario.label)
    setStepStatus(null)
    try {
      const res = await fetch(`${API_URL}/api/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: scenario.message, source: 'simulation' })
      })
      const data = await res.json()
      setLastAction(data.success ? scenario.label : 'Failed')
      setStepStatus(data.success ? 'ok' : 'err')
    } catch {
      setLastAction('Server unreachable')
      setStepStatus('err')
    } finally {
      setLoading(null)
    }
  }

  const handleReset = async () => {
    if (simActive) setSimActive(false)
    setResetLoading(true)
    setStepStatus(null)
    try {
      await fetch(`${API_URL}/api/reset`, { method: 'POST' })
      setLastAction('World state reset')
      setStepStatus('ok')
    } catch {
      setLastAction('Reset failed')
      setStepStatus('err')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className={`card px-4 py-2.5 flex items-center gap-3 flex-wrap transition-all duration-300 ${
      simActive ? 'border-amber-300 bg-amber-50/50 ring-1 ring-amber-400/30 shadow-sm' : ''
    }`}>
      {/* Label */}
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0">
        Simulate:
      </span>

      {/* Auto-play toggle */}
      <button
        onClick={toggleSim}
        disabled={resetLoading}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all duration-200 flex-shrink-0 ${
          simActive
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-sm hover:from-amber-600 hover:to-orange-600'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
        }`}
      >
        {simActive
          ? <><Square className="w-3 h-3" /> Stop Auto</>
          : <><Zap className="w-3 h-3" /> Auto Play</>
        }
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

      {/* Manual scenario buttons */}
      {DEMO_SCENARIOS.slice(0, 2).map(s => (
        <button
          key={s.label}
          onClick={() => runSingle(s)}
          disabled={!!loading || simActive}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
        >
          {loading === s.label
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <Play className="w-3 h-3" />
          }
          {s.label}
        </button>
      ))}

      <div className="flex-1" />

      {/* Status */}
      {lastAction && (
        <span className={`text-xs flex items-center gap-1 flex-shrink-0 ${
          stepStatus === 'ok' ? 'text-emerald-600' : stepStatus === 'err' ? 'text-red-500' : 'text-slate-500'
        }`}>
          {stepStatus === 'ok' && <CheckCircle className="w-3 h-3" />}
          {lastAction}
        </span>
      )}

      {/* Sim progress indicator */}
      {simActive && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-semibold flex-shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />
          Step {simIndex + 1}/{DEMO_SCENARIOS.length}
        </div>
      )}

      {/* Reset */}
      <button
        onClick={handleReset}
        disabled={resetLoading}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors border border-slate-200 flex-shrink-0"
      >
        {resetLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
        Reset
      </button>
    </div>
  )
}
