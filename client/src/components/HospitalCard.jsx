import { useWorldState } from '../hooks/useWorldState.js'

const statusColors = {
  normal: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  overflow_warning: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
}

function CapacityBar({ capacity }) {
  const { total, current, incoming } = capacity
  const usedPct = Math.min(100, ((current + incoming) / total) * 100)
  const color = usedPct > 85 ? '#DC2626' : usedPct > 65 ? '#F59E0B' : '#16a34a'

  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-slate-500 mb-0.5">
        <span>{current + incoming}/{total}</span>
        <span>{Math.round(usedPct)}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${usedPct}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function HospitalCard() {
  const { worldState } = useWorldState()
  const hospitals = worldState?.hospitals || []

  return (
    <div className="card p-4">
      <h2 className="font-display font-semibold text-sm text-slate-700 uppercase tracking-wider mb-3">Hospitals</h2>
      <div className="space-y-3">
        {hospitals.length === 0 ? (
          <p className="text-xs text-slate-400">No hospital data</p>
        ) : hospitals.map(h => {
          const colors = statusColors[h.status] || statusColors.normal
          return (
            <div key={h.id} className={`rounded-lg p-3 ${colors.bg}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-slate-800">{h.name}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${colors.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  {h.status === 'overflow_warning' ? 'OVERFLOW RISK' : 'NORMAL'}
                </span>
              </div>
              <CapacityBar capacity={h.capacity} />
              {h.capacity.incoming > 0 && (
                <p className="text-xs text-orange-600 mt-1">+{h.capacity.incoming} incoming patients</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
