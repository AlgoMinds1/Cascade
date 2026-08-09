import { Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'
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
            <strong>{hosp.name}</strong><br />
            Capacity: {hosp.capacity.current}/{hosp.capacity.total}<br />
            Incoming: +{hosp.capacity.incoming}<br />
            Status: <span style={{ color: hosp.status === 'overflow_warning' ? '#DC2626' : '#16a34a' }}>{hosp.status}</span>
          </Popup>
        </Marker>
      ))}

      {/* Ambulances */}
      {worldState.ambulances?.map(amb => (
        <Marker key={amb.id} position={amb.location} icon={ambulanceIcon}>
          <Popup>
            <strong>{amb.callSign}</strong><br />
            Status: {amb.status}
          </Popup>
        </Marker>
      ))}

      {/* Rescue Teams */}
      {worldState.rescueTeams?.map(team => (
        <Marker key={team.id} position={team.location} icon={teamIcon}>
          <Popup>
            <strong>{team.name}</strong><br />
            Status: {team.status}<br />
            Task: {team.assignedTask || 'None'}
          </Popup>
        </Marker>
      ))}
    </>
  )
}
