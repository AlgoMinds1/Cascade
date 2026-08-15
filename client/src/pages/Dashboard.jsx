import { useState, useRef, useCallback } from 'react'
import { useSocket } from '../hooks/useSocket.js'
import { useWorldState } from '../hooks/useWorldState.js'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.js'
import MapContainer from '../components/MapContainer.jsx'
import EntityLayer from '../components/EntityLayer.jsx'
import RouteLayer from '../components/RouteLayer.jsx'
import HospitalCard from '../components/HospitalCard.jsx'
import TeamStatus from '../components/TeamStatus.jsx'
import EventLog from '../components/EventLog.jsx'
import AlertBanner from '../components/AlertBanner.jsx'
import SimulationController from '../components/SimulationController.jsx'
import FallbackDemoModal from '../components/FallbackDemoModal.jsx'
import { Loader2, Wifi, WifiOff, Keyboard, Video } from 'lucide-react'

export default function Dashboard() {
  useSocket()
  const { isReady, isConnected, blockedRoads, alerts } = useWorldState()
  const [showFallback, setShowFallback] = useState(false)
  const simRef = useRef(null)

  // Keyboard shortcut handlers wired to SimulationController's imperative API
  const onReset  = useCallback(() => simRef.current?.reset(),  [])
  const onStart  = useCallback(() => simRef.current?.play(),   [])
  const onToggle = useCallback(() => simRef.current?.toggle(), [])

  useKeyboardShortcuts({ onReset, onStart, onToggle })

  return (
    <div className="h-[calc(100vh-3.5rem)] flex gap-0 overflow-hidden">

      {/* ── LEFT — Map (Expands to fill all remaining space) ────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200">
        {/* Map toolbar */}
        <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center gap-2 flex-shrink-0">
          {/* Connection indicator */}
          <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${isConnected ? 'text-emerald-600' : 'text-red-500'}`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {isConnected ? 'Connected to Cascade' : 'Reconnecting…'}
          </span>

          {/* Blocked roads badge row */}
          {blockedRoads.length > 0 && (
            <div className="flex gap-1.5 flex-wrap ml-2">
              {blockedRoads.map(r => (
                <span key={r.id} className="pill bg-red-600 text-white text-[10px] font-bold shadow-sm animate-pulse">
                  {r.name} BLOCKED
                </span>
              ))}
            </div>
          )}

          <div className="flex-1" />

          {/* Fallback & Keyboard shortcut hints */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowFallback(true)}
              className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Open Stage Fallback Video Demo"
            >
              <Video className="w-3 h-3 text-red-500" />
              <span>Show Fallback</span>
            </button>
            <div className="flex items-center gap-1 text-[10px] text-slate-300">
              <Keyboard className="w-3 h-3 text-slate-300" />
              <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">S</kbd>
              <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">Space</kbd>
              <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono">R</kbd>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative bg-slate-100">
          {!isReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400 bg-mesh">
              <div className="w-14 h-14 rounded-full bg-white shadow-soft flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">Connecting to Command Server</p>
                <p className="text-xs text-slate-400 mt-0.5">Waiting for world state…</p>
              </div>
            </div>
          ) : (
            <MapContainer>
              <EntityLayer />
              <RouteLayer />
            </MapContainer>
          )}
        </div>

        {/* Simulation controller bar */}
        <div className="flex-shrink-0 px-3 py-2 bg-white border-t border-slate-200">
          <SimulationController ref={simRef} />
        </div>
      </div>

      {/* ── RIGHT — Sidebar ─────────────────────────────────── */}
      <aside className="w-80 sm:w-[380px] lg:w-[420px] xl:w-[440px] flex-shrink-0 flex flex-col bg-slate-50/80 overflow-y-auto divide-y divide-slate-200">

        {/* Live Alerts */}
        {alerts.length > 0 && (
          <div className="flex-shrink-0 px-4 pt-3 pb-2.5 bg-white">
            <AlertBanner mode="inline" />
          </div>
        )}

        {/* Hospital Status */}
        <div className="px-4 pt-3 pb-2.5 flex-shrink-0">
          <HospitalCard />
        </div>

        {/* Active Units */}
        <div className="px-4 pt-3 pb-2.5 flex-shrink-0">
          <TeamStatus />
        </div>

        {/* Event Log */}
        <div className="px-4 pt-3 pb-4 flex-1 min-h-[320px] flex flex-col">
          <EventLog />
        </div>
      </aside>

      {/* Fallback Demo Modal */}
      <FallbackDemoModal isOpen={showFallback} onClose={() => setShowFallback(false)} />
    </div>
  )
}
