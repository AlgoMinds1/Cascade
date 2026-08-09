import { useMemo } from 'react'
import { useWorld } from '../store/WorldContext.jsx'

export function useWorldState() {
  const { worldState, alerts, events, isConnected, clearAlert } = useWorld()

  const computed = useMemo(() => {
    if (!worldState) {
      return {
        blockedRoads: [],
        openRoads: [],
        blockedBridges: [],
        activeAmbulances: [],
        reroutedAmbulances: [],
        idleAmbulances: [],
        warningHospitals: [],
        hospitalStats: { total: 0, current: 0, incoming: 0, loadPercent: 0 },
        deployedTeams: [],
        idleTeams: [],
        isReady: false
      }
    }

    const roads = worldState.roads || []
    const hospitals = worldState.hospitals || []
    const ambulances = worldState.ambulances || []
    const rescueTeams = worldState.rescueTeams || []

    const blockedRoads = roads.filter(r => r.status === 'blocked')
    const openRoads = roads.filter(r => r.status === 'open')
    const blockedBridges = blockedRoads.filter(r => r.type === 'bridge')

    const activeAmbulances = ambulances.filter(a => a.status === 'enroute')
    const reroutedAmbulances = ambulances.filter(a => a.route?.rerouted)
    const idleAmbulances = ambulances.filter(a => a.status === 'idle')

    const warningHospitals = hospitals.filter(h => h.status === 'overflow_warning')

    const totalCapacity = hospitals.reduce((sum, h) => sum + (h.capacity?.total || 0), 0)
    const currentOccupied = hospitals.reduce((sum, h) => sum + (h.capacity?.current || 0), 0)
    const incomingPatients = hospitals.reduce((sum, h) => sum + (h.capacity?.incoming || 0), 0)
    const totalLoad = currentOccupied + incomingPatients
    const loadPercent = totalCapacity > 0 ? Math.round((totalLoad / totalCapacity) * 100) : 0

    const deployedTeams = rescueTeams.filter(t => t.status === 'deployed')
    const idleTeams = rescueTeams.filter(t => t.status === 'idle')

    return {
      blockedRoads,
      openRoads,
      blockedBridges,
      activeAmbulances,
      reroutedAmbulances,
      idleAmbulances,
      warningHospitals,
      hospitalStats: {
        total: totalCapacity,
        current: currentOccupied,
        incoming: incomingPatients,
        loadPercent
      },
      deployedTeams,
      idleTeams,
      isReady: true
    }
  }, [worldState])

  return {
    worldState,
    alerts,
    events,
    isConnected,
    clearAlert,
    ...computed
  }
}
