import { useState, useEffect, useRef } from 'react'
import { Video, X, Play, RefreshCw, AlertTriangle, ShieldCheck, Truck, Hospital } from 'lucide-react'

export default function FallbackDemoModal({ isOpen, onClose }) {
  const [videoError, setVideoError] = useState(false)
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true)
      setStep(0)
      setVideoError(false)
    } else {
      setIsPlaying(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen])

  // Canvas animation ticker for fallback sequence when video asset is unrendered
  useEffect(() => {
    if (!isOpen || !videoError || !isPlaying) return

    timerRef.current = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 5000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen, videoError, isPlaying])

  if (!isOpen) return null

  const stepsInfo = [
    {
      title: "01. Incident Reported",
      desc: "Judge submits natural language report: 'Bridge on Road 17 has collapsed'",
      status: "NLP Extraction Agent: High Confidence (100ms)",
      icon: AlertTriangle,
      color: "text-amber-500 bg-amber-50 border-amber-200"
    },
    {
      title: "02. Graph Blockage & Propagation",
      desc: "WorldState graph isolates Bridge 17. Blocked road pulse broadcast via WebSockets.",
      status: "Graph Engine: 1 Entity Blocked, 3 Dependent Nodes Identified",
      icon: ShieldCheck,
      color: "text-red-600 bg-red-50 border-red-200"
    },
    {
      title: "03. OSRM Bypass Recalculation",
      desc: "RouteAgent recalculates ingress paths for Ambulance A1 around blocked bridge.",
      status: "Route Engine: OSRM Bypass Active (+6.2km, +4m ETA)",
      icon: Truck,
      color: "text-blue-600 bg-blue-50 border-blue-200"
    },
    {
      title: "04. Multi-Unit & Hospital Triage",
      desc: "ImpactAgent dispatches Alpha Rescue team and notifies City General of surge.",
      status: "Triage Engine: Alpha Rescue Deployed | City General (+15 Surge)",
      icon: Hospital,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    }
  ]

  const CurrentIcon = stepsInfo[step].icon

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="card w-full max-w-3xl overflow-hidden shadow-2xl border-slate-700 bg-slate-900 text-white relative animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base leading-tight">Stage Fallback Demo</h3>
              <p className="text-white/80 text-[11px]">20-Second High-Fidelity Disaster Cascade Sequence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {!videoError ? (
            /* Video Player */
            <div className="relative rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                src="/fallback-demo.mp4"
                controls
                autoPlay
                className="w-full h-full object-contain"
                onError={() => setVideoError(true)}
              >
                Your browser does not support video playback.
              </video>
            </div>
          ) : (
            /* Interactive Animated Canvas Preview (Fallback when video file is absent) */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="pill bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold">
                    FALLBACK RECORDING ANIMATOR (20s)
                  </span>
                  <span className="font-mono text-xs text-slate-400">Step {step + 1} / 4</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 via-orange-500 to-emerald-500 h-full transition-all duration-700"
                    style={{ width: `${((step + 1) / 4) * 100}%` }}
                  />
                </div>

                {/* Animated Step Card */}
                <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all duration-500 ${stepsInfo[step].color}`}>
                  <div className="p-3 rounded-lg bg-white/80 shadow-sm">
                    <CurrentIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-display font-bold text-base text-slate-900">{stepsInfo[step].title}</h4>
                    <p className="text-xs font-medium text-slate-700">{stepsInfo[step].desc}</p>
                    <p className="text-[11px] font-mono font-semibold pt-1 opacity-90">{stepsInfo[step].status}</p>
                  </div>
                </div>
              </div>

              {/* Step indicator pills */}
              <div className="grid grid-cols-4 gap-2">
                {stepsInfo.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                      step === idx
                        ? 'bg-slate-800 border-red-500 text-white font-semibold shadow-md'
                        : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-60">0{idx + 1}</div>
                    <div className="truncate font-medium mt-0.5">{s.title.split('.')[1]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Stage Fail-safe Active — Click Close or Esc to return to Live Command
            </span>
            <button
              onClick={() => {
                if (videoError) setStep(0)
                else if (videoRef.current) {
                  videoRef.current.currentTime = 0
                  videoRef.current.play()
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Replay Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
