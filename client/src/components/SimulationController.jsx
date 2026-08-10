import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Play, Pause, Square, RotateCcw, Loader2, Zap, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { useWorld } from '../store/WorldContext.jsx'
import simulationData from '../data/simulationData.json'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const REPORTS = simulationData.reports

// State machine states
const SIM_STATE = { IDLE: 'idle', PLAYING: 'playing', PAUSED: 'paused' }

async function postReport(report) {
  const res = await fetch(`${API_URL}/api/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: report.message, source: report.source })
  })
  return res.json()
}

async function postReset() {
  await fetch(`${API_URL}/api/reset`, { method: 'POST' })
}

/**
 * SimulationController — Play/Pause/Reset choreographed 12-step demo.
 * Exposes play(), pause(), reset() via ref for keyboard shortcut integration.
 */
const SimulationController = forwardRef(function SimulationController(_, ref) {
  const { setSimRunning } = useWorld()
  const [simState, setSimState] = useState(SIM_STATE.IDLE)
  const [currentStep, setCurrentStep] = useState(-1) // -1 = not started
  const [stepStatus, setStepStatus] = useState({}) // { [stepIndex]: 'ok' | 'err' | 'pending' }
  const [resetLoading, setResetLoading] = useState(false)
  const timerRef = useRef(null)
  const stepRef = useRef(-1)  // track step in closure
  const stateRef = useRef(SIM_STATE.IDLE)

  // Sync sim state to global context for nav pill
  useEffect(() => {
    setSimRunning(simState === SIM_STATE.PLAYING)
  }, [simState, setSimRunning])

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const fireStep = useCallback(async (index) => {
    if (index >= REPORTS.length) {
      // Sequence complete
      setSimState(SIM_STATE.IDLE)
      stateRef.current = SIM_STATE.IDLE
      stepRef.current = -1
      return
    }

    stepRef.current = index
    setCurrentStep(index)
    setStepStatus(prev => ({ ...prev, [index]: 'pending' }))

    try {
      const data = await postReport(REPORTS[index])
      setStepStatus(prev => ({ ...prev, [index]: data.success ? 'ok' : 'err' }))
    } catch {
      setStepStatus(prev => ({ ...prev, [index]: 'err' }))
    }

    // Schedule next step if still playing
    const nextIndex = index + 1
    if (nextIndex < REPORTS.length && stateRef.current === SIM_STATE.PLAYING) {
      const delay = (REPORTS[nextIndex].delaySeconds ?? 5) * 1000
      timerRef.current = setTimeout(() => {
        if (stateRef.current === SIM_STATE.PLAYING) {
          fireStep(nextIndex)
        }
      }, delay)
    } else if (nextIndex >= REPORTS.length) {
      setSimState(SIM_STATE.IDLE)
      stateRef.current = SIM_STATE.IDLE
    }
  }, [])

  const play = useCallback(() => {
    if (stateRef.current === SIM_STATE.PLAYING) return
    const resumeFrom = stateRef.current === SIM_STATE.PAUSED
      ? stepRef.current + 1
      : 0

    if (resumeFrom >= REPORTS.length) return // Already finished

    stateRef.current = SIM_STATE.PLAYING
    setSimState(SIM_STATE.PLAYING)

    if (!resumeFrom && stepRef.current === -1) {
      // Fresh start — fire immediately
      fireStep(0)
    } else {
      // Resuming from pause — fire next step immediately
      fireStep(resumeFrom)
    }
  }, [fireStep])

  const pause = useCallback(() => {
    if (stateRef.current !== SIM_STATE.PLAYING) return
    clearTimer()
    stateRef.current = SIM_STATE.PAUSED
    setSimState(SIM_STATE.PAUSED)
  }, [])

  const toggle = useCallback(() => {
    if (stateRef.current === SIM_STATE.PLAYING) pause()
    else play()
  }, [play, pause])

  const reset = useCallback(async () => {
    clearTimer()
    stateRef.current = SIM_STATE.IDLE
    stepRef.current = -1
    setSimState(SIM_STATE.IDLE)
    setCurrentStep(-1)
    setStepStatus({})
    setResetLoading(true)
    try { await postReset() } catch { /* ignore */ }
    setResetLoading(false)
  }, [])

  // Expose imperative handle for keyboard shortcuts
  useImperativeHandle(ref, () => ({ play, pause, toggle, reset }), [play, pause, toggle, reset])

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [])

  const isPlaying = simState === SIM_STATE.PLAYING
  const isPaused = simState === SIM_STATE.PAUSED
  const isIdle = simState === SIM_STATE.IDLE
  const progressPct = currentStep >= 0 ? Math.round(((currentStep + 1) / REPORTS.length) * 100) : 0
  const isTriggerStep = currentStep === simulationData.meta.triggerIndex

  return (
    <div className={`card transition-all duration-300 overflow-hidden ${
      isPlaying ? 'border-amber-300 ring-1 ring-amber-400/40 shadow-sm' :
      isPaused  ? 'border-blue-300 ring-1 ring-blue-400/30' : ''
    }`}>

      {/* ── Progress Bar ────────────────────────────────── */}
      <div className="h-1 bg-slate-100 w-full">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            isTriggerStep
              ? 'bg-gradient-to-r from-red-500 to-orange-500'
              : isPlaying
              ? 'bg-gradient-to-r from-amber-400 to-amber-500'
              : isPaused
              ? 'bg-gradient-to-r from-blue-400 to-blue-500'
              : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Main Controls Row ───────────────────────────── */}
      <div className="px-4 py-2.5 flex items-center gap-2.5 flex-wrap">

        {/* State label */}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-shrink-0">
          Demo Script
        </span>

        {/* Play / Pause */}
        <button
          onClick={toggle}
          disabled={resetLoading || (isIdle && currentStep >= REPORTS.length - 1)}
          title={isPlaying ? 'Pause (Space)' : 'Play (S)'}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all duration-200 flex-shrink-0 ${
            isPlaying
              ? 'bg-amber-500 text-white border-amber-400 hover:bg-amber-600 shadow-sm'
              : isPaused
              ? 'bg-blue-500 text-white border-blue-400 hover:bg-blue-600 shadow-sm'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-500 hover:from-emerald-600 hover:to-emerald-700 shadow-sm'
          }`}
        >
          {isPlaying
            ? <><Pause className="w-3 h-3" /> Pause</>
            : isPaused
            ? <><Play className="w-3 h-3" /> Resume</>
            : <><Zap className="w-3 h-3" /> Play Demo</>
          }
        </button>

        {/* Reset */}
        <button
          onClick={reset}
          disabled={resetLoading}
          title="Reset World (R)"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 transition-all border border-slate-200 flex-shrink-0"
        >
          {resetLoading
            ? <Loader2 className="w-3 h-3 animate-spin" />
            : <RotateCcw className="w-3 h-3" />
          }
          Reset
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

        {/* Current step label */}
        {currentStep >= 0 && currentStep < REPORTS.length ? (
          <div className={`flex items-center gap-1.5 text-xs flex-shrink-0 min-w-0 ${
            isTriggerStep ? 'text-red-600 font-bold' : 'text-slate-700'
          }`}>
            {stepStatus[currentStep] === 'pending' && <Loader2 className="w-3 h-3 animate-spin flex-shrink-0 text-amber-500" />}
            {stepStatus[currentStep] === 'ok'      && <CheckCircle className="w-3 h-3 flex-shrink-0 text-emerald-500" />}
            {stepStatus[currentStep] === 'err'     && <AlertCircle className="w-3 h-3 flex-shrink-0 text-red-500" />}
            <span className="truncate max-w-[160px] font-medium">
              {REPORTS[currentStep].label}
            </span>
            {currentStep + 1 < REPORTS.length && isPlaying && (
              <span className="text-slate-400 flex-shrink-0 flex items-center gap-0.5">
                <ChevronRight className="w-3 h-3" />
                <span className="text-[10px]">{REPORTS[currentStep + 1]?.label}</span>
              </span>
            )}
          </div>
        ) : isIdle && currentStep === -1 ? (
          <span className="text-xs text-slate-400 flex-shrink-0">
            12 scripted reports — Press S to start
          </span>
        ) : (
          <span className="text-xs text-emerald-600 font-semibold flex-shrink-0 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Demo complete
          </span>
        )}

        <div className="flex-1" />

        {/* Step counter */}
        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0 tabular-nums">
          {currentStep >= 0 ? `${currentStep + 1}/${REPORTS.length}` : `0/${REPORTS.length}`}
        </span>

        {/* Keyboard hint */}
        <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-300 flex-shrink-0">
          <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">S</kbd>
          <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">Space</kbd>
          <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">R</kbd>
        </div>
      </div>

      {/* ── Step Dots ───────────────────────────────────── */}
      <div className="px-4 pb-2.5 flex items-center gap-1 overflow-x-auto">
        {REPORTS.map((report, i) => {
          const status = stepStatus[i]
          const isActive = i === currentStep
          const isDone = status === 'ok'
          const isErr = status === 'err'
          const isTrigger = i === simulationData.meta.triggerIndex

          return (
            <div
              key={report.id}
              title={`Step ${i + 1}: ${report.label}`}
              className={`flex-shrink-0 transition-all duration-300 rounded-full ${
                isTrigger
                  ? isActive ? 'w-3 h-3 bg-red-500 ring-2 ring-red-300 shadow-sm' :
                    isDone   ? 'w-2.5 h-2.5 bg-red-400' :
                               'w-2.5 h-2.5 bg-red-200'
                  : isActive ? 'w-3 h-3 bg-amber-500 ring-2 ring-amber-200 shadow-sm' :
                    isDone   ? 'w-2 h-2 bg-emerald-400' :
                    isErr    ? 'w-2 h-2 bg-red-400' :
                               'w-2 h-2 bg-slate-200'
              }`}
            />
          )
        })}
        <span className="ml-1 text-[9px] text-red-400 font-bold flex-shrink-0">
          ^ Step 7 = TRIGGER
        </span>
      </div>
    </div>
  )
})

export default SimulationController
