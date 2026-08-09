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
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  useSocket()
  const { isReady, blockedRoads } = useWorldState()

  return (
    <div className="h-[calc(100vh-3.5rem)] flex gap-4 p-4">
      {/* Main column */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <AlertBanner />

        {/* Map area */}
        <div className="flex-1 relative rounded-xl overflow-hidden border border-slate-200 shadow-soft bg-slate-100">
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

      {/* Sidebar */}
      <aside className="w-72 flex flex-col gap-3 overflow-y-auto">
        <HospitalCard />
        <TeamStatus />
        <EventLog />
      </aside>
    </div>
  )
}
