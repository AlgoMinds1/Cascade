import { useEffect, useRef } from 'react'
import { MapContainer as LeafletMap, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MAP_CENTER, MAP_ZOOM } from '../utils/constants.js'
import { useWorldState } from '../hooks/useWorldState.js'
import 'leaflet/dist/leaflet.css'

/**
 * Automatically fits map viewport bounds to encompass all active entities on load or updates
 */
function MapBoundsHandler() {
  const map = useMap()
  const { worldState } = useWorldState()
  const hasFittedRef = useRef(false)

  useEffect(() => {
    if (!worldState || !map) return

    const points = []

    // Collect road/bridge coordinates
    worldState.roads?.forEach(road => {
      if (Array.isArray(road.coords)) {
        road.coords.forEach(coord => {
          if (Array.isArray(coord) && coord.length === 2) {
            points.push(coord)
          }
        })
      }
    })

    // Collect hospital coordinates
    worldState.hospitals?.forEach(hosp => {
      if (Array.isArray(hosp.location) && hosp.location.length === 2) {
        points.push(hosp.location)
      }
    })

    // Collect ambulance coordinates & route waypoints
    worldState.ambulances?.forEach(amb => {
      if (Array.isArray(amb.location) && amb.location.length === 2) {
        points.push(amb.location)
      }
      if (amb.route?.waypoints) {
        amb.route.waypoints.forEach(wp => {
          if (Array.isArray(wp) && wp.length === 2) {
            points.push(wp)
          }
        })
      }
    })

    // Collect rescue team coordinates
    worldState.rescueTeams?.forEach(team => {
      if (Array.isArray(team.location) && team.location.length === 2) {
        points.push(team.location)
      }
    })

    if (points.length > 0 && !hasFittedRef.current) {
      const bounds = L.latLngBounds(points)
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 14,
          animate: true,
          duration: 1
        })
        hasFittedRef.current = true
      }
    }
  }, [worldState, map])

  return null
}

export default function MapContainer({ children }) {
  return (
    <LeafletMap
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      style={{ height: '100%', width: '100%', minHeight: '500px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <MapBoundsHandler />
      {children}
    </LeafletMap>
  )
}
