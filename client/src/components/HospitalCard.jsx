import { Hospital, AlertTriangle, Users, TrendingUp } from 'lucide-react'
import { useWorldState } from '../hooks/useWorldState.js'

function CapacityBar({ capacity }) {
  const total = capacity?.total || 100
  const current = capacity?.current || 0
  const incoming = capacity?.incoming || 0
  const totalLoad = current + incoming
  const usedPct = Math.min(100, Math.round((totalLoad / total) * 100))

  // Gradient based on load
  let barGradient = 'from-emerald-500 to-green-500'
  let textColor = 'text-emerald-700'
  if (usedPct > 85) {
    barGradient = 'from-amber-500 to-red-600'
    textColor = 'text-red-600'
  } else if (usedPct > 65) {
    barGradient = 'from-yellow-400 to-amber-500'
    textColor = 'text-amber-700'
  }

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">
          Occupancy: <strong className="text-slate-800">{totalLoad}</strong>/{total} beds
        </span>
        <span className={`font-bold font-mono ${textColor}`}>{usedPct}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 ease-out`}
          style={{ width: `${usedPct}%` }}
        />
      </div>
    </div>
  )
}

export default function HospitalCard() {
  const { worldState, hospitalStats } = useWorldState()
  const hospitals = worldState?.hospitals || []

  return (
    <div className="card p-4 space-y-3.5 shadow-soft border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <Hospital className="w-4 h-4 text-intel" />
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
            Hospital Load & Triage
          </h2>
        </div>
        <span className="pill bg-slate-100 text-slate-600 text-[11px] font-mono">
          {hospitalStats.current + hospitalStats.incoming}/{hospitalStats.total} Total
        </span>
      </div>

      {/* Hospital Cards */}
      <div className="space-y-3">
        {hospitals.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No hospital telemetry connected</p>
        ) : (
          hospitals.map(h => {
            const isWarning = h.status === 'overflow_warning'
            const current = h.capacity?.current || 0
            const incoming = h.capacity?.incoming || 0
            const total = h.capacity?.total || 100
            const loadPct = Math.round(((current + incoming) / total) * 100)

            return (
              <div
                key={h.id}
                className={`rounded-xl p-3 border transition-all duration-500 ${
                  isWarning
                    ? 'bg-gradient-to-br from-red-50 to-orange-50/40 border-red-300 shadow-sm ring-1 ring-red-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Status Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">{h.name}</h3>
                    <p className="text-[11px] text-slate-500">Emergency & Trauma Center</p>
                  </div>
                  <span
                    className={`pill text-[10px] uppercase font-bold flex items-center gap-1 ${
                      isWarning
                        ? 'bg-red-600 text-white animate-pulse shadow-sm'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isWarning ? (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        OVERFLOW WARNING
                      </>
                    ) : (
                      'NORMAL LOAD'
                    )}
                  </span>
                </div>

                {/* Progress Bar */}
                <CapacityBar capacity={h.capacity} />

                {/* Surge Alert Badge */}
                {incoming > 0 && (
                  <div className="mt-2 pt-2 border-t border-red-100/70 flex items-center justify-between text-[11px]">
                    <span className="text-red-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-600" />
                      +{incoming} incoming casualties
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">Triage surge active</span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
