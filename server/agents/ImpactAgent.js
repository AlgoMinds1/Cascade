/**
 * ImpactAgent — Geospatial capacity impact assessor & rescue unit dispatcher.
 */

/**
 * Calculates Euclidean distance between two [lat, lon] coordinates
 */
function getDistance(coord1, coord2) {
  if (!coord1 || !coord2) return Infinity
  const dLat = coord1[0] - coord2[0]
  const dLon = coord1[1] - coord2[1]
  return Math.sqrt(dLat * dLat + dLon * dLon)
}

/**
 * Computes multi-entity impact on hospital capacities, overflow risk, and rescue team dispatch
 * @param {Object} worldState Snapshot of current world state graph
 * @param {string} blockedRoadId ID of the newly blocked road or bridge
 * @param {Object} [routeDelta] Optional ETA delta information from RouteAgent
 * @returns {Object} Structured impact analysis and unit deployment directives
 */
export function computeImpact(worldState, blockedRoadId, routeDelta = null) {
  const roads = worldState.roads || []
  const hospitals = worldState.hospitals || []
  const rescueTeams = worldState.rescueTeams || []

  // 1. Locate the incident entity
  const blockedEntity = roads.find(r => r.id === blockedRoadId)
  const incidentCenter = blockedEntity?.coords
    ? blockedEntity.coords[Math.floor(blockedEntity.coords.length / 2)]
    : [18.6475, 73.7486]

  // 2. Identify nearest hospital to the incident zone
  let nearestHospital = null
  let minHospDist = Infinity

  for (const hosp of hospitals) {
    const dist = getDistance(incidentCenter, hosp.location)
    if (dist < minHospDist) {
      minHospDist = dist
      nearestHospital = hosp
    }
  }

  // 3. Hospital Capacity & Surge Assessment
  const incomingSurge = 15 // Standard crisis surge increment
  let overflowRisk = false
  let loadPercentage = 0
  let affectedHospitalId = nearestHospital?.id || 'hosp-a'

  if (nearestHospital) {
    const current = nearestHospital.capacity?.current || 0
    const incoming = (nearestHospital.capacity?.incoming || 0) + incomingSurge
    const total = nearestHospital.capacity?.total || 100

    loadPercentage = Math.round(((current + incoming) / total) * 100)
    // Threshold: > 85% triggers overflow warning
    overflowRisk = (current + incoming) / total > 0.85
  }

  // 4. Auto-Reassign Nearest Idle Rescue Team
  let nearestIdleTeam = null
  let minTeamDist = Infinity

  for (const team of rescueTeams) {
    if (team.status === 'idle') {
      const dist = getDistance(incidentCenter, team.location)
      if (dist < minTeamDist) {
        minTeamDist = dist
        nearestIdleTeam = team
      }
    }
  }

  let teamAssignment = null
  if (nearestIdleTeam) {
    const taskName = blockedEntity?.type === 'bridge'
      ? 'bridge_assessment'
      : `clearance_${blockedRoadId}`

    teamAssignment = {
      teamId: nearestIdleTeam.id,
      teamName: nearestIdleTeam.name,
      task: taskName,
      status: 'deployed',
      targetLocation: incidentCenter
    }
  }

  // 5. ETA Impact
  const etaImpactSeconds = routeDelta?.deltaDuration || 60

  return {
    incidentEntity: blockedRoadId,
    affectedHospitals: [affectedHospitalId],
    incomingSurge,
    loadPercentage,
    overflowRisk,
    newHospitalStatus: overflowRisk ? 'overflow_warning' : 'normal',
    teamAssignment,
    etaImpactSeconds,
    timestamp: new Date().toISOString()
  }
}
