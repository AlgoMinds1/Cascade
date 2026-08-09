import { Polyline, Popup } from 'react-leaflet'
import { useWorldState } from '../hooks/useWorldState.js'

export default function RouteLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  const ambulancesWithRoutes = worldState.ambulances?.filter(a => a.route?.waypoints) || []

  return (
    <>
      {ambulancesWithRoutes.map(amb => {
        const waypoints = amb.route.waypoints
        const isRerouted = amb.route.rerouted

        return (
          <div key={`route-group-${amb.id}`}>
            {/* Route Outer Glow / Halo */}
            <Polyline
              positions={waypoints}
              pathOptions={{
                color: isRerouted ? '#60A5FA' : '#93C5FD',
                weight: 8,
                opacity: 0.45,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />

            {/* Main Active Route Polyline */}
            <Polyline
              positions={waypoints}
              pathOptions={{
                color: isRerouted ? '#2563EB' : '#1D4ED8',
                weight: 4,
                opacity: 0.95,
                dashArray: '10 6',
                lineCap: 'round'
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-intel flex items-center gap-1">
                    <span>🚑</span> {amb.callSign} Route Details
                  </div>
                  <div>Status: <span className="font-semibold text-slate-800">{amb.status.toUpperCase()}</span></div>
                  {amb.route.duration && (
                    <div>ETA: <span className="font-semibold text-slate-800">{Math.round(amb.route.duration / 60)} mins</span> ({amb.route.duration}s)</div>
                  )}
                  {amb.route.distance && (
                    <div>Distance: <span className="font-semibold text-slate-800">{(amb.route.distance / 1000).toFixed(1)} km</span></div>
                  )}
                  {isRerouted && (
                    <div className="pill bg-blue-100 text-intel font-semibold mt-1">
                      🔄 REROUTED BYPASS
                    </div>
                  )}
                </div>
              </Popup>
            </Polyline>
          </div>
        )
      })}
    </>
  )
}
