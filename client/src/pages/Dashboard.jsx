import { useState } from 'react'
import { useSocket } from '../hooks/useSocket.js'
import { useWorldState } from '../hooks/useWorldState.js'
import MapContainer from '../components/MapContainer.jsx'
import EntityLayer from '../components/EntityLayer.jsx'
import RouteLayer from '../components/RouteLayer.jsx'
import HospitalCard from '../components/HospitalCard.jsx'
import TeamStatus from '../components/TeamStatus.jsx'
import EventLog from '../components/EventLog.jsx'
import AlertBanner from '../components/AlertBanner.jsx'
import SimulationController from '../components/SimulationController.jsx'
import { Loader2, PanelRightClose, PanelRightOpen } from 'lucide-react'

export default function Dashboard() {
  useSocket()
  const { isReady, blockedRoads } = useWorldState()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="h-[calc(100vh-3.5rem)] flex gap-4 p-4 relative">
      {/* Main column */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 transition-all duration-300">
        <AlertBanner />

        {/* Map area */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-200 shadow-soft bg-slate-100">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="absolute top-3 right-3 z-[1000] p-2 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 shadow-md text-slate-700 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1.5 text-xs font-medium"
          >
            {sidebarOpen ? (
              <>
                <PanelRightClose className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Hide Sidebar</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-4 h-4 text-intel" />
                <span className="hidden sm:inline">Show Sidebar</span>
              </>
            )}
          </button>

          {!isReady ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="text-sm">Connecting to command server…</span>
            </div>
          ) : (
            <MapContainer>
              <EntityLayer />
              <RouteLayer />
            </MapContainer>
          )}

          {/* Blocked roads badge */}
          {blockedRoads.length > 0 && (
            <div className="absolute top-3 left-3 z-[1000] flex gap-2 flex-wrap">
              {blockedRoads.map(r => (
                <span key={r.id} className="pill bg-red-600 text-white shadow-lg">
                  ⛔ {r.name} BLOCKED
                </span>
              ))}
            </div>
          )}
        </div>

        <SimulationController />
      </div>

      {/* Collapsible Sidebar */}
      <aside
        className={`transition-all duration-300 ease-in-out flex flex-col gap-3 overflow-y-auto ${
          sidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none hidden'
        }`}
      >
        <HospitalCard />
        <TeamStatus />
        <EventLog />
      </aside>
    </div>
  )
}
