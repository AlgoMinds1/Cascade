import { Router } from 'express'
import { extractEntities } from '../agents/ExtractionAgent.js'
import { recomputeRoutes } from '../agents/RouteAgent.js'
import { computeImpact } from '../agents/ImpactAgent.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.post('/report', async (req, res) => {
  const { message, source } = req.body
  if (!message) return res.status(400).json({ success: false, error: 'message required' })

  const extracted = extractEntities(message)

  if (!extracted.entityId) {
    return res.status(400).json({
      success: false,
      error: 'Could not extract a known location from the message',
      hint: 'Try mentioning "Road 17" or "Bridge 17"'
    })
  }

  const world = req.world
  const changes = []

  if (extracted.type === 'ROAD_BLOCKED') {
    world.blockRoad(extracted.entityId)
    changes.push({ action: 'BLOCK_ROAD', target: extracted.entityId })

    const routeResult = await recomputeRoutes(world.getState(), extracted.entityId)
    const impactResult = computeImpact(world.getState(), extracted.entityId)

    for (const ambId of routeResult.affectedAmbulances) {
      if (routeResult.newRoutes[ambId]) {
        world.updateAmbulanceRoute(ambId, routeResult.newRoutes[ambId])
        changes.push({ action: 'REROUTE', target: ambId })
      }
    }

    if (impactResult.teamAssignment) {
      world.assignTeam(impactResult.teamAssignment.teamId, impactResult.teamAssignment.task)
      changes.push({ action: 'DEPLOY_TEAM', target: impactResult.teamAssignment.teamId })
    }

    world.updateHospitalStatus(
      impactResult.affectedHospitals[0],
      5,
      impactResult.overflowRisk ? 'overflow_warning' : 'normal'
    )
    changes.push({ action: 'HOSPITAL_LOAD', target: impactResult.affectedHospitals[0] })
  }

  const newState = world.getState()

  req.io.emit('state:updated', newState)
  req.io.emit('alert', {
    id: `alert-${Date.now()}`,
    level: 'critical',
    message: `Incident: ${message.slice(0, 120)}`
  })

  res.json({ success: true, extracted, changes, state: newState })
})

router.post('/reset', (req, res) => {
  const newState = req.world.reset()
  req.io.emit('state:updated', newState)
  res.json({ success: true, state: newState })
})

export default router
