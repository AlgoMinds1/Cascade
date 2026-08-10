import { Polyline, Popup, Marker } from 'react-leaflet'
import L from 'leaflet'
import { useWorldState } from '../hooks/useWorldState.js'

// Red X Marker at Old Route Obstruction Point
const redXIcon = L.divIcon({
  className: 'custom-red-x-icon',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-md border-2 border-white text-xs font-black">
        ✕
      </div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

export default function RouteLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  const ambulancesWithRoutes = worldState.ambulances?.filter(a => a.route?.waypoints) || []

  return (
    <>
      {ambulancesWithRoutes.map(amb => {
        const waypoints = amb.route.waypoints
        const isRerouted = amb.route.rerouted
        const oldWaypoints = amb.route.oldRoute?.waypoints

        // Calculate midpoint for the Red X indicator on obsolete path
        const oldMidpoint = oldWaypoints && oldWaypoints.length >= 2
          ? oldWaypoints[Math.floor(oldWaypoints.length / 2)]
          : null

        return (
          <div key={`route-group-${amb.id}`}>
            {/* 1. Obsolete Old Route (Faded Gray Dashed Line with Red X) */}
            {isRerouted && oldWaypoints && (
              <>
                <Polyline
                  positions={oldWaypoints}
                  pathOptions={{
                    color: '#94A3B8',
                    weight: 3,
                    opacity: 0.65,
                    dashArray: '6 6',
                    lineCap: 'round'
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-red-600 flex items-center gap-1">
                        Obsolete Route Segment
                      </div>
                      <div className="text-slate-500">Route blocked by structural failure/incident.</div>
                    </div>
                  </Popup>
                </Polyline>

                {oldMidpoint && (
                  <Marker position={oldMidpoint} icon={redXIcon}>
                    <Popup>
                      <div className="text-xs space-y-1">
                        <div className="font-bold text-red-600">Blocked Obstruction</div>
                        <div>Ambulance {amb.callSign} diverted away from this node.</div>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </>
            )}

            {/* 2. New Active Route Outer Glow / Halo */}
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

            {/* 3. New Active Route Polyline (Glowing Intelligence Blue) */}
            <Polyline
              positions={waypoints}
              pathOptions={{
                color: isRerouted ? '#2563EB' : '#1D4ED8',
                weight: 4,
                opacity: 0.95,
                dashArray: isRerouted ? '12 6' : '10 6',
                lineCap: 'round'
              }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-intel flex items-center gap-1">
                    {amb.callSign} Active Route Telemetry
                  </div>
                  <div>Status: <span className="font-semibold text-slate-800">{amb.status.toUpperCase()}</span></div>
                  {amb.route.duration && (
                    <div>
                      ETA: <span className="font-semibold text-slate-800">{Math.round(amb.route.duration / 60)} mins</span> ({amb.route.duration}s)
                      {amb.route.deltaDuration && (
                        <span className="text-red-500 font-semibold ml-1">
                          (+{Math.round(amb.route.deltaDuration / 60)}m detour)
                        </span>
                      )}
                    </div>
                  )}
                  {amb.route.distance && (
                    <div>Distance: <span className="font-semibold text-slate-800">{(amb.route.distance / 1000).toFixed(1)} km</span></div>
                  )}
                  {isRerouted && (
                    <div className="pill bg-blue-100 text-intel font-semibold mt-1">
                      REROUTED BYPASS ACTIVE
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
