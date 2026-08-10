import { memo } from 'react'
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

/**
 * Single ambulance route group — memoized.
 * Only re-renders when the ambulance route changes (tracked by duration + rerouted flag).
 */
const AmbRouteGroup = memo(function AmbRouteGroup({ amb }) {
  const waypoints = amb.route.waypoints
  const isRerouted = amb.route.rerouted
  const oldWaypoints = amb.route.oldRoute?.waypoints

  const oldMidpoint = oldWaypoints && oldWaypoints.length >= 2
    ? oldWaypoints[Math.floor(oldWaypoints.length / 2)]
    : null

  return (
    <div>
      {/* 1. Obsolete Old Route (Faded Gray Dashed) */}
      {isRerouted && oldWaypoints && (
        <>
          <Polyline
            positions={oldWaypoints}
            pathOptions={{
              color: '#94A3B8',
              weight: 3,
              opacity: 0.6,
              dashArray: '6 6',
              lineCap: 'round'
            }}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <div className="font-bold text-red-600">Obsolete Route Segment</div>
                <div className="text-slate-500">Route blocked by structural failure.</div>
              </div>
            </Popup>
          </Polyline>

          {oldMidpoint && (
            <Marker position={oldMidpoint} icon={redXIcon}>
              <Popup>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-red-600">Blocked Obstruction</div>
                  <div>Ambulance {amb.callSign} diverted from this node.</div>
                </div>
              </Popup>
            </Marker>
          )}
        </>
      )}

      {/* 2. Active Route Outer Glow */}
      <Polyline
        positions={waypoints}
        pathOptions={{
          color: isRerouted ? '#60A5FA' : '#93C5FD',
          weight: 8,
          opacity: 0.4,
          lineCap: 'round',
          lineJoin: 'round'
        }}
      />

      {/* 3. Active Route Inner Line */}
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
            <div className="font-bold text-intel">{amb.callSign} Active Route Telemetry</div>
            <div>Status: <span className="font-semibold text-slate-800">{amb.status.toUpperCase()}</span></div>
            {amb.route.duration && (
              <div>
                ETA: <span className="font-semibold text-slate-800">{Math.round(amb.route.duration / 60)} mins</span>
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
              <div className="pill bg-blue-100 text-intel font-semibold mt-1">REROUTED BYPASS ACTIVE</div>
            )}
          </div>
        </Popup>
      </Polyline>
    </div>
  )
}, (prev, next) =>
  prev.amb.id === next.amb.id &&
  prev.amb.route?.duration === next.amb.route?.duration &&
  prev.amb.route?.rerouted === next.amb.route?.rerouted &&
  prev.amb.status === next.amb.status
)

export default function RouteLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  const ambulancesWithRoutes = worldState.ambulances?.filter(a => a.route?.waypoints) || []

  return (
    <>
      {ambulancesWithRoutes.map(amb => (
        <AmbRouteGroup key={`route-${amb.id}`} amb={amb} />
      ))}
    </>
  )
}
