/**
 * RouteAgent — recomputes ambulance routes given a blocked road.
 * TODO: Replace mock with real OSRM call at http://localhost:5000
 */
export async function recomputeRoutes(worldState, blockedRoadId) {
  // Real call would be:
  // const url = `http://localhost:5000/route/v1/driving/${from.join(',')};${to.join(',')}`
  // const res = await fetch(url)
  // const data = await res.json()

  // For now return a mock re-route
  return {
    affectedAmbulances: ['amb-1'],
    newRoutes: {
      'amb-1': {
        from: [19.0700, 72.8700],
        to: [19.0820, 72.8890],
        // Alternate waypoints avoiding blocked road
        waypoints: [
          [19.0700, 72.8700],
          [19.0680, 72.8750],
          [19.0720, 72.8830],
          [19.0820, 72.8890]
        ],
        duration: 420
      }
    }
  }
}
