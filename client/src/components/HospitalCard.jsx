import { Hospital, AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { useWorldState } from '../hooks/useWorldState.js'

function CapacityBar({ capacity, compact = false }) {
  const total = capacity?.total || 100
  const current = capacity?.current || 0
  const incoming = capacity?.incoming || 0
  const totalLoad = current + incoming
  const usedPct = Math.min(100, Math.round((totalLoad / total) * 100))

  let barGradient = 'from-emerald-500 to-green-400'
  let textColor = 'text-emerald-700'
  if (usedPct > 85) {
    barGradient = 'from-red-500 to-orange-500'
    textColor = 'text-red-600'
  } else if (usedPct > 65) {
    barGradient = 'from-yellow-400 to-amber-500'
    textColor = 'text-amber-700'
  }

  return (
    <div className={`space-y-1 ${compact ? '' : 'mt-2'}`}>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500">
          <strong className="text-slate-800">{totalLoad}</strong>/{total} beds
          {incoming > 0 && <span className="text-red-500 font-semibold ml-1">(+{incoming} surge)</span>}
        </span>
        <span className={`font-bold font-mono text-sm ${textColor}`}>{usedPct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
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

  const systemLoadPct = hospitalStats.loadPercent || 0
  let systemGradient = 'from-emerald-500 to-green-400'
  if (systemLoadPct > 85) systemGradient = 'from-red-500 to-orange-500'
  else if (systemLoadPct > 65) systemGradient = 'from-yellow-400 to-amber-500'

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
        <span className={`pill text-[10px] font-bold ${
          systemLoadPct > 85
            ? 'bg-red-100 text-red-700'
            : systemLoadPct > 65
            ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {systemLoadPct}% System Load
        </span>
      </div>

      {/* System aggregate bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-semibold uppercase tracking-wider">System Aggregate</span>
          <span className="font-mono">{hospitalStats.current + hospitalStats.incoming}/{hospitalStats.total}</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${systemGradient} transition-all duration-700 ease-out`}
            style={{ width: `${systemLoadPct}%` }}
          />
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="space-y-2.5">
        {hospitals.length === 0 ? (
          <div className="py-6 rounded-xl bg-mesh flex flex-col items-center gap-2 text-center border border-dashed border-slate-200">
            <Activity className="w-8 h-8 text-slate-300" />
            <p className="text-xs text-slate-400 font-medium">No hospital telemetry</p>
            <p className="text-[11px] text-slate-300">Waiting for world state…</p>
          </div>
        ) : (
          hospitals.map(h => {
            const isWarning = h.status === 'overflow_warning'
            const incoming = h.capacity?.incoming || 0

            return (
              <div
                key={h.id}
                className={`rounded-xl p-3 border transition-all duration-500 ${
                  isWarning
                    ? 'bg-gradient-to-br from-red-50 to-orange-50/30 border-red-300 ring-1 ring-red-400/30 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Status Header */}
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 leading-tight">{h.name}</h3>
                    <p className="text-[11px] text-slate-400">Emergency & Trauma Center</p>
                  </div>
                  <span className={`pill text-[10px] font-bold flex-shrink-0 flex items-center gap-1 ${
                    isWarning
                      ? 'bg-red-600 text-white animate-pulse shadow-sm'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isWarning ? (
                      <><AlertTriangle className="w-2.5 h-2.5" /> OVERFLOW</>
                    ) : 'NORMAL'}
                  </span>
                </div>

                <CapacityBar capacity={h.capacity} compact />

                {/* Surge Alert */}
                {incoming > 0 && (
                  <div className="mt-2 pt-2 border-t border-red-100/80 flex items-center justify-between text-[11px]">
                    <span className="text-red-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      +{incoming} incoming casualties
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">Triage surge</span>
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
