import { useWorldState } from '../hooks/useWorldState.js'
import { fmtTime } from '../utils/formatters.js'

const EVENT_COLORS = {
  ROAD_BLOCKED: 'text-red-600 bg-red-50',
  FIRE: 'text-orange-600 bg-orange-50',
  RESCUE: 'text-blue-600 bg-blue-50',
  REROUTE: 'text-indigo-600 bg-indigo-50',
  DEFAULT: 'text-slate-600 bg-slate-50',
}

export default function EventLog() {
  const { worldState, events } = useWorldState()
  const stateEvents = worldState?.events || []
  const allEvents = [...events, ...stateEvents].slice(0, 15)

  return (
    <div className="card p-4 flex-1">
      <h2 className="font-display font-semibold text-sm text-slate-700 uppercase tracking-wider mb-3">Event Log</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
        {allEvents.length === 0 ? (
          <p className="text-xs text-slate-400">No events yet — waiting for incidents...</p>
        ) : allEvents.map((evt) => {
          const color = EVENT_COLORS[evt.type] || EVENT_COLORS.DEFAULT
          return (
            <div key={evt.id} className={`rounded-lg px-3 py-2 text-xs ${color}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold">{evt.type}</span>
                <span className="opacity-60">{fmtTime(evt.timestamp)}</span>
              </div>
              <p className="opacity-80">{evt.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
