import { useState, useEffect, useRef } from 'react'
import { Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { useWorldState } from '../hooks/useWorldState.js'
import {
  ambulanceIcon,
  hospitalIcon,
  hospitalWarningIcon,
  bridgeIcon,
  bridgeBlockedIcon,
  teamIcon
} from '../assets/markers.js'

// Fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

/**
 * Animated Ambulance Marker that smoothly progresses along its active route waypoints
 */
function AnimatedAmbulance({ amb }) {
  const [currentPos, setCurrentPos] = useState(amb.location)
  const waypointIndexRef = useRef(0)
  const progressRef = useRef(0)

  useEffect(() => {
    const waypoints = amb.route?.waypoints

    if (!waypoints || waypoints.length < 2 || amb.status !== 'enroute') {
      setCurrentPos(amb.location)
      return
    }

    // Reset waypoint tracking when route changes
    waypointIndexRef.current = 0
    progressRef.current = 0

    const interval = setInterval(() => {
      const wps = amb.route?.waypoints
      if (!wps || wps.length < 2) return

      const idx = waypointIndexRef.current
      if (idx >= wps.length - 1) {
        // Loop or stay at destination
        setCurrentPos(wps[wps.length - 1])
        return
      }

      const p1 = wps[idx]
      const p2 = wps[idx + 1]

      progressRef.current += 0.04

      if (progressRef.current >= 1) {
        progressRef.current = 0
        waypointIndexRef.current = idx + 1
        setCurrentPos(p2)
      } else {
        const lat = p1[0] + (p2[0] - p1[0]) * progressRef.current
        const lon = p1[1] + (p2[1] - p1[1]) * progressRef.current
        setCurrentPos([lat, lon])
      }
    }, 100)

    return () => clearInterval(interval)
  }, [amb.route, amb.location, amb.status])

  return (
    <Marker position={currentPos} icon={ambulanceIcon}>
      <Popup>
        <div className="text-xs space-y-1">
          <div className="font-bold text-intel flex items-center gap-1">
            Unit {amb.callSign}
          </div>
          <div>Status: <span className="font-semibold text-slate-800">{amb.status.toUpperCase()}</span></div>
          {amb.route?.duration && (
            <div>ETA: <span className="font-semibold text-slate-800">{Math.round(amb.route.duration / 60)} mins</span></div>
          )}
          {amb.route?.rerouted && (
            <div className="pill bg-blue-100 text-intel font-semibold mt-1">
              REROUTE ACTIVE
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

export default function EntityLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  return (
    <>
      {/* Roads / Bridges */}
      {worldState.roads?.map(road => {
        const isBlocked = road.status === 'blocked'
        const isBridge = road.type === 'bridge'
        const hasCoords = road.coords && road.coords.length >= 2
        const midPoint = hasCoords
          ? road.coords[Math.floor(road.coords.length / 2)]
          : null

        return (
          <div key={`road-group-${road.id}`}>
            {hasCoords ? (
              <Polyline
                positions={road.coords}
                pathOptions={{
                  color: isBlocked ? '#DC2626' : isBridge ? '#334155' : '#64748B',
                  weight: isBridge ? 6 : 4,
                  dashArray: isBlocked ? '8 5' : null,
                  opacity: isBlocked ? 0.95 : 0.85
                }}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-900">{road.name} ({road.type.toUpperCase()})</div>
                    <div>Status: <span className={`font-semibold ${isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>{road.status.toUpperCase()}</span></div>
                  </div>
                </Popup>
              </Polyline>
            ) : null}

            {/* Dedicated Bridge Arch / Blocked Icon at Midpoint */}
            {isBridge && midPoint ? (
              <Marker
                position={midPoint}
                icon={isBlocked ? bridgeBlockedIcon : bridgeIcon}
              >
                <Popup>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-900">{road.name}</div>
                    <div>Infrastructure Type: Bridge</div>
                    <div>Status: <span className={`font-semibold ${isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>{road.status.toUpperCase()}</span></div>
                  </div>
                </Popup>
              </Marker>
            ) : null}
          </div>
        )
      })}

      {/* Hospitals */}
      {worldState.hospitals?.map(hosp => (
        <Marker
          key={hosp.id}
          position={hosp.location}
          icon={hosp.status === 'overflow_warning' ? hospitalWarningIcon : hospitalIcon}
        >
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900">{hosp.name}</div>
              <div>Capacity: <span className="font-semibold">{hosp.capacity.current}/{hosp.capacity.total}</span></div>
              {hosp.capacity.incoming > 0 && (
                <div className="text-red-600 font-semibold">Incoming Surge: +{hosp.capacity.incoming}</div>
              )}
              <div>Status: <span className={`font-semibold ${hosp.status === 'overflow_warning' ? 'text-red-600' : 'text-emerald-600'}`}>{hosp.status.toUpperCase()}</span></div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Ambulances with Smooth GPS Animation */}
      {worldState.ambulances?.map(amb => (
        <AnimatedAmbulance key={amb.id} amb={amb} />
      ))}

      {/* Rescue Teams */}
      {worldState.rescueTeams?.map(team => (
        <Marker key={team.id} position={team.location} icon={teamIcon}>
          <Popup>
            <div className="text-xs space-y-1">
              <div className="font-bold text-slate-900">{team.name}</div>
              <div>Status: <span className="font-semibold text-amber-700">{team.status.toUpperCase()}</span></div>
              <div>Task: <span className="font-semibold text-slate-700">{team.assignedTask || 'Standby'}</span></div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}
