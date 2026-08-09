import { useWorld } from '../store/WorldContext.jsx'

export function useWorldState() {
  const { worldState, alerts, events } = useWorld()

  const blockedRoads = worldState?.roads?.filter(r => r.status === 'blocked') || []
  const activeAmbulances = worldState?.ambulances?.filter(a => a.status === 'enroute') || []
  const warningHospitals = worldState?.hospitals?.filter(h => h.status === 'overflow_warning') || []

  return {
    worldState,
    alerts,
    events,
    blockedRoads,
    activeAmbulances,
    warningHospitals,
    isReady: !!worldState
  }
}
