import { useRef, useEffect, useState, useMemo } from 'react'
import { useWorldState } from '../hooks/useWorldState.js'
import { fmtTime } from '../utils/formatters.js'
import { Terminal, Radio, Shield, Navigation, Hospital, Flame, AlertOctagon, Search, X } from 'lucide-react'

const EVENT_CONFIG = {
  ROAD_BLOCKED: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/70',
    badge: 'bg-red-100 text-red-700 border-red-200',
    label: 'BLOCKED',
    icon: AlertOctagon,
    category: 'alerts'
  },
  ROAD_OPENED: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/70',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    label: 'ROAD OPEN',
    icon: Navigation,
    category: 'routes'
  },
  REROUTE: {
    border: 'border-l-indigo-500',
    bg: 'bg-indigo-50/70',
    badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    label: 'REROUTE',
    icon: Navigation,
    category: 'routes'
  },
  FIRE: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50/70',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    label: 'FIRE',
    icon: Flame,
    category: 'alerts'
  },
  RESCUE: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50/70',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    label: 'RESCUE',
    icon: Shield,
    category: 'units'
  },
  TEAM_DEPLOYED: {
    border: 'border-l-sky-500',
    bg: 'bg-sky-50/70',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    label: 'DISPATCH',
    icon: Shield,
    category: 'units'
  },
  DISPATCH: {
    border: 'border-l-sky-500',
    bg: 'bg-sky-50/70',
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    label: 'DISPATCH',
    icon: Shield,
    category: 'units'
  },
  HOSPITAL_UPDATE: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50/70',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    label: 'TRIAGE',
    icon: Hospital,
    category: 'triage'
  },
  TRIAGE: {
    border: 'border-l-rose-500',
    bg: 'bg-rose-50/70',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    label: 'TRIAGE',
    icon: Hospital,
    category: 'triage'
  },
  INCIDENT_REPORT: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50/70',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    label: 'REPORT',
    icon: AlertOctagon,
    category: 'alerts'
  },
  SYSTEM_READY: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50/60',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'SYSTEM',
    icon: Terminal,
    category: 'system'
  },
  CORRIDOR_MONITOR: {
    border: 'border-l-teal-500',
    bg: 'bg-teal-50/60',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    label: 'MONITOR',
    icon: Terminal,
    category: 'system'
  },
  MONITOR: {
    border: 'border-l-teal-500',
    bg: 'bg-teal-50/60',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    label: 'MONITOR',
    icon: Terminal,
    category: 'system'
  },
  DEFAULT: {
    border: 'border-l-slate-400',
    bg: 'bg-slate-50',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    label: 'EVENT',
    icon: Terminal,
    category: 'all'
  }
}

/** Formats text by highlighting key entities concisely */
function HighlightedDescription({ text }) {
  if (!text) return null

  const parts = text.split(/(Bridge \d+|Road \d+|South Avenue|Ambulance A\d+|City General|Emergency Care|Alpha Rescue|BLOCKED|OPEN)/gi)

  return (
    <span className="text-slate-700 leading-snug">
      {parts.map((part, i) => {
        if (
          /^(Bridge \d+|Road \d+|South Avenue|Ambulance A\d+|City General|Emergency Care|Alpha Rescue)$/i.test(part)
        ) {
          return <strong key={i} className="text-slate-900 font-semibold">{part}</strong>
        }
        if (/^BLOCKED$/i.test(part)) {
          return <span key={i} className="text-red-600 font-bold">{part}</span>
        }
        if (/^OPEN$/i.test(part)) {
          return <span key={i} className="text-emerald-600 font-bold">{part}</span>
        }
        return part
      })}
    </span>
  )
}

function EventEntry({ evt, isNew }) {
  const meta = EVENT_CONFIG[evt.type] || EVENT_CONFIG.DEFAULT
  const Icon = meta.icon || Terminal
  const [flash, setFlash] = useState(isNew)

  useEffect(() => {
    if (!isNew) return
    const t = setTimeout(() => setFlash(false), 1200)
    return () => clearTimeout(t)
  }, [isNew])

  return (
    <div
      className={`
        border-l-2 rounded-r-lg px-2.5 py-1.5 text-xs transition-all duration-300 border border-t-0 border-r-0 border-b-0
        ${meta.border} ${meta.bg}
        ${flash ? 'animate-flash-in ring-1 ring-blue-300 shadow-sm' : ''}
      `}
    >
      {/* Top Metadata Row */}
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${meta.badge}`}>
            <Icon className="w-2.5 h-2.5 flex-shrink-0" />
            {meta.label}
          </span>
          {evt.source && evt.source !== 'system' && (
            <span className="text-[9px] font-mono text-slate-400 uppercase truncate">
              {evt.source}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-slate-400 tabular-nums flex-shrink-0">
          {fmtTime(evt.timestamp)}
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-700 leading-snug">
        <HighlightedDescription text={evt.description} />
      </p>

      {/* Affected Entity Tags */}
      {evt.affectedEntities && evt.affectedEntities.length > 0 && (
        <div className="flex items-center gap-1 mt-1 flex-wrap">
          {evt.affectedEntities.map((entId, idx) => (
            <span
              key={idx}
              className="text-[9px] font-mono text-slate-400 bg-white/80 border border-slate-200/80 px-1 py-0.2 rounded"
            >
              #{entId}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'routes', label: 'Routes' },
  { id: 'units', label: 'Units' },
  { id: 'triage', label: 'Triage' }
]

export default function EventLog() {
  const { worldState, events } = useWorldState()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Deduplicate events by unique key and sort reverse-chronologically
  const allEvents = useMemo(() => {
    const combined = [...(events || []), ...(worldState?.events || [])]
    const seen = new Set()
    const result = []

    for (const evt of combined) {
      if (!evt) continue
      const key = evt.id || `${evt.type}-${evt.timestamp}-${evt.description}`
      if (!seen.has(key)) {
        seen.add(key)
        result.push(evt)
      }
    }

    // Sort newest first
    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 50)
  }, [events, worldState?.events])

  const prevLengthRef = useRef(allEvents.length)
  const newCount = Math.max(0, allEvents.length - prevLengthRef.current)

  useEffect(() => {
    prevLengthRef.current = allEvents.length
  }, [allEvents.length])

  // Filtered event list
  const filteredEvents = useMemo(() => {
    return allEvents.filter(evt => {
      // Category filter
      if (filter !== 'all') {
        const meta = EVENT_CONFIG[evt.type] || EVENT_CONFIG.DEFAULT
        if (meta.category !== filter) return false
      }
      // Text search filter
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchText = (evt.description || '').toLowerCase()
        const matchType = (evt.type || '').toLowerCase()
        const matchSource = (evt.source || '').toLowerCase()
        return matchText.includes(query) || matchType.includes(query) || matchSource.includes(query)
      }
      return true
    })
  }, [allEvents, filter, search])

  return (
    <div className="card flex-1 flex flex-col min-h-0 overflow-hidden shadow-soft border-slate-200 bg-white">
      {/* ── Card Header ────────────────────────────────────────── */}
      <div className="px-3.5 pt-3 pb-2 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-intel" />
            <h2 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">
              Live Event Feed
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="pill bg-slate-100 text-slate-600 text-[10px] font-mono font-medium">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span className="hidden sm:inline text-[9px] uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>

        {/* ── Filter Tabs & Search Bar ─────────────────────────── */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`text-[10px] px-2 py-0.5 rounded font-medium transition-all flex-shrink-0 ${
                  filter === tab.id
                    ? 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1 rounded text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 ${
              showSearch || search ? 'text-blue-600 bg-blue-50' : 'hover:bg-slate-100'
            }`}
            title="Search logs"
          >
            <Search className="w-3 h-3" />
          </button>
        </div>

        {/* Collapsible Search Input */}
        {showSearch && (
          <div className="mt-2 flex items-center gap-1 bg-slate-50 rounded border border-slate-200 px-2 py-1">
            <Search className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter logs by keyword…"
              className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
              autoFocus
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Event Feed List ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0 divide-y-0">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center bg-mesh rounded-lg p-3">
            <Terminal className="w-6 h-6 text-slate-300" />
            <p className="text-xs text-slate-500 font-medium">No matching events</p>
            <p className="text-[10px] text-slate-400 max-w-[200px]">
              {search ? 'Try clearing the search filter' : 'Waiting for real-time incidents or simulation triggers…'}
            </p>
          </div>
        ) : (
          filteredEvents.map((evt, i) => (
            <EventEntry
              key={evt.id || `${evt.type}-${evt.timestamp}-${i}`}
              evt={evt}
              isNew={i < newCount}
            />
          ))
        )}
      </div>
    </div>
  )
}
