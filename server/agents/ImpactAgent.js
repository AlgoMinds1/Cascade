/**
 * ImpactAgent — determines hospital load and team assignment from a road block.
 * TODO: Add real capacity math and routing distance checks.
 */
export function computeImpact(worldState, blockedRoadId) {
  return {
    affectedHospitals: ['hosp-a'],
    overflowRisk: false,
    teamAssignment: {
      teamId: 'team-1',
      task: `assess_${blockedRoadId}`
    }
  }
}
