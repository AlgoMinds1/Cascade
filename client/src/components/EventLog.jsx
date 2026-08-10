import { useRef, useEffect, useState } from 'react'
import { useWorldState } from '../hooks/useWorldState.js'
import { fmtTime } from '../utils/formatters.js'
import { Terminal, Radio } from 'lucide-react'

const EVENT_META = {
  ROAD_BLOCKED:  { border: 'border-l-red-500',    bg: 'bg-red-50/60',     label: 'text-red-600'    },
  FIRE:          { border: 'border-l-orange-500',  bg: 'bg-orange-50/60',  label: 'text-orange-600' },
  RESCUE:        { border: 'border-l-blue-500',    bg: 'bg-blue-50/60',    label: 'text-blue-600'   },
  REROUTE:       { border: 'border-l-indigo-500',  bg: 'bg-indigo-50/50',  label: 'text-indigo-600' },
  STATE_CHANGE:  { border: 'border-l-slate-400',   bg: 'bg-slate-50',      label: 'text-slate-500'  },
  DEFAULT:       { border: 'border-l-slate-300',   bg: 'bg-slate-50',      label: 'text-slate-500'  },
}

function EventEntry({ evt, isNew }) {
  const meta = EVENT_META[evt.type] || EVENT_META.DEFAULT
  const [flash, setFlash] = useState(isNew)

  useEffect(() => {
    if (!isNew) return
    const t = setTimeout(() => setFlash(false), 1200)
    return () => clearTimeout(t)
  }, [isNew])

  return (
    <div
      className={`
        border-l-2 rounded-r-lg px-3 py-2 text-xs transition-all duration-300
        ${meta.border} ${meta.bg}
        ${flash ? 'animate-flash-in' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className={`font-bold text-[11px] uppercase tracking-wide ${meta.label}`}>
          {evt.type?.replace(/_/g, ' ')}
        </span>
        <span className="font-mono text-[10px] text-slate-400 tabular-nums">
          {fmtTime(evt.timestamp)}
        </span>
      </div>
      <p className="text-slate-600 leading-snug">{evt.description}</p>
    </div>
  )
}

export default function EventLog() {
  const { worldState, events } = useWorldState()
  const stateEvents = worldState?.events || []
  const allEvents = [...events, ...stateEvents].slice(0, 30)
  const prevLengthRef = useRef(allEvents.length)
  const newCount = Math.max(0, allEvents.length - prevLengthRef.current)

  useEffect(() => {
    prevLengthRef.current = allEvents.length
  }, [allEvents.length])

  return (
    <div className="card flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-intel" />
          <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
            Event Log
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          {allEvents.length > 0 && (
            <span className="pill bg-slate-100 text-slate-500 text-[10px] font-mono">
              {allEvents.length} events
            </span>
          )}
          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0">
        {allEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center bg-mesh rounded-lg">
            <Terminal className="w-7 h-7 text-slate-200" />
            <p className="text-xs text-slate-400 font-medium">No events yet</p>
            <p className="text-[11px] text-slate-300">Waiting for incidents…</p>
          </div>
        ) : (
          allEvents.map((evt, i) => (
            <EventEntry
              key={evt.id || i}
              evt={evt}
              isNew={i < newCount}
            />
          ))
        )}
      </div>
    </div>
  )
}
