import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import apiRoutes from './routes/api.js'
import { WorldState } from './state/WorldState.js'
import { calculateRoute } from './agents/RouteAgent.js'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: '*' }
})

app.use(cors())
app.use(express.json())

// Attach world state and io to every request
app.use((req, _res, next) => {
  req.world = WorldState
  req.io = io
  next()
})

app.use('/api', apiRoutes)

// Socket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  // Send current snapshot immediately on connect
  socket.emit('state:updated', WorldState.getState())
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Cascade server running on http://localhost:${PORT}`)

  // OSRM Warmup — fire a dummy route query to pre-connect the OSRM container.
  // This ensures the first real demo route resolves in <200ms instead of 1-2s cold start.
  const warmupFrom = [19.0700, 72.8700]
  const warmupTo   = [19.0820, 72.8890]

  calculateRoute(warmupFrom, warmupTo)
    .then(route => {
      if (route.source === 'osrm') {
        console.log(`[OSRM] Warmup OK — ${route.distance}m, ${route.duration}s via OSRM`)
      } else {
        console.log(`[OSRM] Warmup fallback — OSRM not reachable, using interpolated engine`)
      }
    })
    .catch(() => {
      console.log('[OSRM] Warmup skipped — service unavailable')
    })
})

export { io }
