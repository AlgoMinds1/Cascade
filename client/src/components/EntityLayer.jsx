import { Marker, Popup, Polyline, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import { useWorldState } from '../hooks/useWorldState.js'

// Fix default icon paths for bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ambulanceIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563EB;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(37,99,235,0.4);border:2px solid white;">🚑</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const hospitalIcon = L.divIcon({
  className: '',
  html: `<div style="background:#16a34a;color:#fff;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(22,163,74,0.4);border:2px solid white;">🏥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const teamIcon = L.divIcon({
  className: '',
  html: `<div style="background:#d97706;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(217,119,6,0.4);border:2px solid white;">👥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

export default function EntityLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  return (
    <>
      {/* Roads / Bridges */}
      {worldState.roads?.map(road => (
        road.coords && road.coords.length >= 2 ? (
          <Polyline
            key={road.id}
            positions={road.coords}
            pathOptions={{
              color: road.status === 'blocked' ? '#DC2626' : '#64748B',
              weight: road.type === 'bridge' ? 5 : 3,
              dashArray: road.status === 'blocked' ? '8 4' : null,
              opacity: 0.85
            }}
          >
            <Popup>
              <strong>{road.name}</strong><br />
              Status: <span style={{ color: road.status === 'blocked' ? '#DC2626' : '#16a34a' }}>{road.status.toUpperCase()}</span>
            </Popup>
          </Polyline>
        ) : road.coords && road.coords.length === 1 ? (
          <CircleMarker
            key={road.id}
            center={road.coords[0]}
            radius={8}
            pathOptions={{ color: road.status === 'blocked' ? '#DC2626' : '#64748B', fillOpacity: 0.7 }}
          >
            <Popup><strong>{road.name}</strong><br />Status: {road.status}</Popup>
          </CircleMarker>
        ) : null
      ))}

      {/* Hospitals */}
      {worldState.hospitals?.map(hosp => (
        <Marker key={hosp.id} position={hosp.location} icon={hospitalIcon}>
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
