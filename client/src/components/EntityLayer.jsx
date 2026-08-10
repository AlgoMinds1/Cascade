import { useState, useEffect, useRef, memo } from 'react'
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
 * Animated Ambulance Marker — smoothly progresses along active route waypoints.
 * Memoized: only re-renders when route, location, or status changes.
 */
const AnimatedAmbulance = memo(function AnimatedAmbulance({ amb }) {
  const [currentPos, setCurrentPos] = useState(amb.location)
  const waypointIndexRef = useRef(0)
  const progressRef = useRef(0)

  useEffect(() => {
    const waypoints = amb.route?.waypoints

    if (!waypoints || waypoints.length < 2 || amb.status !== 'enroute') {
      setCurrentPos(amb.location)
      return
    }

    waypointIndexRef.current = 0
    progressRef.current = 0

    const interval = setInterval(() => {
      const wps = amb.route?.waypoints
      if (!wps || wps.length < 2) return

      const idx = waypointIndexRef.current
      if (idx >= wps.length - 1) {
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
          <div className="font-bold text-intel">Unit {amb.callSign}</div>
          <div>Status: <span className="font-semibold text-slate-800">{amb.status.toUpperCase()}</span></div>
          {amb.route?.duration && (
            <div>ETA: <span className="font-semibold text-slate-800">{Math.round(amb.route.duration / 60)} mins</span></div>
          )}
          {amb.route?.rerouted && (
            <div className="pill bg-blue-100 text-intel font-semibold mt-1">REROUTE ACTIVE</div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}, (prev, next) =>
  prev.amb.id === next.amb.id &&
  prev.amb.status === next.amb.status &&
  prev.amb.route?.duration === next.amb.route?.duration &&
  prev.amb.route?.rerouted === next.amb.route?.rerouted
)

/**
 * Hospital Marker — memoized, re-renders only on status or capacity changes.
 */
const HospitalMarker = memo(function HospitalMarker({ hosp }) {
  const isWarning = hosp.status === 'overflow_warning'
  return (
    <Marker
      position={hosp.location}
      icon={isWarning ? hospitalWarningIcon : hospitalIcon}
    >
      <Popup>
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-900">{hosp.name}</div>
          <div>Capacity: <span className="font-semibold">{hosp.capacity.current}/{hosp.capacity.total}</span></div>
          {hosp.capacity.incoming > 0 && (
            <div className="text-red-600 font-semibold">Incoming Surge: +{hosp.capacity.incoming}</div>
          )}
          <div>Status: <span className={`font-semibold ${isWarning ? 'text-red-600' : 'text-emerald-600'}`}>{hosp.status.toUpperCase()}</span></div>
        </div>
      </Popup>
    </Marker>
  )
}, (prev, next) =>
  prev.hosp.id === next.hosp.id &&
  prev.hosp.status === next.hosp.status &&
  prev.hosp.capacity.current === next.hosp.capacity.current &&
  prev.hosp.capacity.incoming === next.hosp.capacity.incoming
)

/**
 * Rescue Team Marker — memoized, re-renders only on status or task changes.
 */
const TeamMarker = memo(function TeamMarker({ team }) {
  return (
    <Marker position={team.location} icon={teamIcon}>
      <Popup>
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-900">{team.name}</div>
          <div>Status: <span className="font-semibold text-amber-700">{team.status.toUpperCase()}</span></div>
          <div>Task: <span className="font-semibold text-slate-700">{team.assignedTask || 'Standby'}</span></div>
        </div>
      </Popup>
    </Marker>
  )
}, (prev, next) =>
  prev.team.id === next.team.id &&
  prev.team.status === next.team.status &&
  prev.team.assignedTask === next.team.assignedTask
)

/**
 * Road/Bridge layer group — memoized per road entity.
 */
const RoadGroup = memo(function RoadGroup({ road }) {
  const isBlocked = road.status === 'blocked'
  const isBridge = road.type === 'bridge'
  const hasCoords = road.coords && road.coords.length >= 2
  const midPoint = hasCoords ? road.coords[Math.floor(road.coords.length / 2)] : null

  return (
    <div>
      {hasCoords ? (
        <>
          {isBlocked && (
            <Polyline
              positions={road.coords}
              pathOptions={{ color: '#DC2626', weight: 10, opacity: 0, className: 'blocked-road-halo' }}
            />
          )}
          <Polyline
            positions={road.coords}
            pathOptions={{
              color: isBlocked ? '#DC2626' : isBridge ? '#334155' : '#64748B',
              weight: isBridge ? 6 : 4,
              dashArray: isBlocked ? '8 5' : null,
              opacity: isBlocked ? 0.95 : 0.85,
              className: isBlocked ? 'blocked-road-line' : ''
            }}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900">{road.name} ({road.type.toUpperCase()})</div>
                <div>Status: <span className={`font-semibold ${isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>{road.status.toUpperCase()}</span></div>
                {isBlocked && <div className="pill bg-red-100 text-red-700 font-bold mt-1">BLOCKED — AI REROUTING</div>}
              </div>
            </Popup>
          </Polyline>
        </>
      ) : null}

      {isBridge && midPoint ? (
        <Marker position={midPoint} icon={isBlocked ? bridgeBlockedIcon : bridgeIcon}>
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
}, (prev, next) =>
  prev.road.id === next.road.id &&
  prev.road.status === next.road.status
)

export default function EntityLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  return (
    <>
      {worldState.roads?.map(road => (
        <RoadGroup key={road.id} road={road} />
      ))}

      {worldState.hospitals?.map(hosp => (
        <HospitalMarker key={hosp.id} hosp={hosp} />
      ))}

      {worldState.ambulances?.map(amb => (
        <AnimatedAmbulance key={amb.id} amb={amb} />
      ))}

      {worldState.rescueTeams?.map(team => (
        <TeamMarker key={team.id} team={team} />
      ))}
    </>
  )
}
