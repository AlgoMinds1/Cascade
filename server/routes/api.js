import { Router } from 'express'
import { extractEntities } from '../agents/ExtractionAgent.js'
import { recomputeRoutes, calculateRoute } from '../agents/RouteAgent.js'
import { computeImpact } from '../agents/ImpactAgent.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

router.get('/state', (req, res) => {
  res.json({ success: true, state: req.world.getState() })
})

router.post('/roads/:id/block', (req, res) => {
  const { id } = req.params
  const propagation = req.world.blockRoad(id, req.body.source || 'manual_api')
  const newState = req.world.getState()

  req.io.emit('state:updated', newState)
  req.io.emit('alert', {
    id: `alert-${Date.now()}`,
    level: 'warning',
    message: `Road/Bridge ${id} status updated to BLOCKED.`
  })

  res.json({ success: true, propagation, state: newState })
})

router.post('/roads/:id/unblock', (req, res) => {
  const { id } = req.params
  const newState = req.world.unblockRoad(id, req.body.source || 'manual_api')

  req.io.emit('state:updated', newState)
  req.io.emit('alert', {
    id: `alert-${Date.now()}`,
    level: 'info',
    message: `Road/Bridge ${id} status restored to OPEN.`
  })

  res.json({ success: true, state: newState })
})

router.post('/route', async (req, res) => {
  const { coordinates, from, to, avoid } = req.body

  let origin = null
  let destination = null

  if (coordinates && Array.isArray(coordinates) && coordinates.length >= 2) {
    // Check if coordinates format is [[lon, lat], [lon, lat]] (OSRM standard) or [[lat, lon], [lat, lon]]
    const c1 = coordinates[0]
    const c2 = coordinates[1]
    // If first element looks like longitude (> 50 for India/Mumbai) vs latitude (~19)
    if (c1[0] > 50 && c1[1] < 50) {
      origin = [c1[1], c1[0]]
      destination = [c2[1], c2[0]]
    } else {
      origin = [c1[0], c1[1]]
      destination = [c2[0], c2[1]]
    }
  } else if (from && to) {
    origin = from
    destination = to
  } else {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates. Expected { coordinates: [[lon,lat], [lon,lat]] } or { from: [lat,lon], to: [lat,lon] }'
    })
  }

  try {
    const route = await calculateRoute(origin, destination, avoid)
    return res.json({ success: true, route })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
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
    const impactResult = computeImpact(world.getState(), extracted.entityId, routeResult)

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

    if (impactResult.affectedHospitals && impactResult.affectedHospitals.length > 0) {
      const targetHospId = impactResult.affectedHospitals[0]
      world.updateHospitalStatus(
        targetHospId,
        impactResult.incomingSurge,
        impactResult.newHospitalStatus
      )
      changes.push({ action: 'HOSPITAL_LOAD', target: targetHospId })
    }
  }

  const newState = world.getState()

  req.io.emit('state:updated', newState)
  req.io.emit('alert', {
    id: `alert-${Date.now()}`,
    level: 'critical',
    message: `CRITICAL: Incident reported on ${extracted.entityId} — Multi-agent cascade active.`
  })

  res.json({ success: true, extracted, changes, state: newState })
})

router.post('/reset', (req, res) => {
  const newState = req.world.reset()
  req.io.emit('state:updated', newState)
  // Also reset any running server-side simulation
  if (activeSimTimers.length > 0) {
    activeSimTimers.forEach(t => clearTimeout(t))
    activeSimTimers.length = 0
  }
  res.json({ success: true, state: newState })
})

// Track server-side simulation timers so they can be cancelled
const activeSimTimers = []

/**
 * POST /api/simulate
 * Server-side sequenced simulation replay — fires each report with its delaySeconds offset.
 * Returns immediately; simulation runs asynchronously.
 * Body: { reports: [{ message, source, delaySeconds }], startIndex?: number }
 */
router.post('/simulate', async (req, res) => {
  const { reports, startIndex = 0 } = req.body
  if (!Array.isArray(reports) || reports.length === 0) {
    return res.status(400).json({ success: false, error: 'reports array required' })
  }

  // Cancel any existing server-side simulation
  activeSimTimers.forEach(t => clearTimeout(t))
  activeSimTimers.length = 0

  const world = req.world
  const io = req.io
  let cumulativeDelayMs = 0

  for (let i = startIndex; i < reports.length; i++) {
    const report = reports[i]
    cumulativeDelayMs += (report.delaySeconds ?? 5) * 1000

    const timer = setTimeout(async () => {
      try {
        const extracted = extractEntities(report.message)
        if (!extracted.entityId) return

        if (extracted.type === 'ROAD_BLOCKED') {
          world.blockRoad(extracted.entityId)
          const routeResult = await recomputeRoutes(world.getState(), extracted.entityId)
          const impactResult = computeImpact(world.getState(), extracted.entityId, routeResult)

          for (const ambId of routeResult.affectedAmbulances) {
            if (routeResult.newRoutes[ambId]) {
              world.updateAmbulanceRoute(ambId, routeResult.newRoutes[ambId])
            }
          }
          if (impactResult.teamAssignment) {
            world.assignTeam(impactResult.teamAssignment.teamId, impactResult.teamAssignment.task)
          }
          if (impactResult.affectedHospitals?.length > 0) {
            world.updateHospitalStatus(
              impactResult.affectedHospitals[0],
              impactResult.incomingSurge,
              impactResult.newHospitalStatus
            )
          }
        }

        const newState = world.getState()
        io.emit('state:updated', newState)
        io.emit('alert', {
          id: `alert-sim-${Date.now()}`,
          level: 'critical',
          message: `CRITICAL: Incident on ${extracted.entityId} — ${report.label || 'cascade active'}.`
        })
      } catch (err) {
        console.error('[Simulate] Step error:', err.message)
      }
    }, cumulativeDelayMs)

    activeSimTimers.push(timer)
  }

  res.json({ success: true, started: true, total: reports.length - startIndex })
})

/**
 * POST /api/simulate/stop
 * Cancels any running server-side simulation timers.
 */
router.post('/simulate/stop', (req, res) => {
  activeSimTimers.forEach(t => clearTimeout(t))
  activeSimTimers.length = 0
  res.json({ success: true, stopped: true })
})

export default router

