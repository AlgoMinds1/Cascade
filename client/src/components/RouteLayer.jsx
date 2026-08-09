import { Polyline } from 'react-leaflet'
import { useWorldState } from '../hooks/useWorldState.js'

export default function RouteLayer() {
  const { worldState } = useWorldState()
  if (!worldState) return null

  const ambulancesWithRoutes = worldState.ambulances?.filter(a => a.route?.waypoints) || []

  return (
    <>
      {ambulancesWithRoutes.map(amb => (
        <Polyline
          key={`route-${amb.id}`}
          positions={amb.route.waypoints}
          pathOptions={{
            color: '#2563EB',
            weight: 3,
            dashArray: '6 4',
            opacity: 0.75
          }}
        />
      ))}
    </>
  )
}
