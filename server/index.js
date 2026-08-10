import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import apiRoutes from './routes/api.js'
import { WorldState } from './state/WorldState.js'
import { calculateRoute } from './agents/RouteAgent.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Serve production static assets from client/dist if available
const clientDistPath = path.join(__dirname, '../client/dist')
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDistPath, 'index.html'))
  })
}

// Socket handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  // Send current snapshot immediately on connect
  socket.emit('state:updated', WorldState.getState())
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Cascade server running on http://localhost:${PORT}`)

  // Verify OSRM Docker / Service health on startup
  const osrmHealthUrl = process.env.OSRM_URL || 'http://localhost:5000'
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 1200)

  fetch(`${osrmHealthUrl}/nearest/v1/driving/72.8777,19.0760`, { signal: controller.signal })
    .then((res) => {
      clearTimeout(timeout)
      if (res.ok) {
        console.log(`[OSRM Docker]: Online & Ready on ${osrmHealthUrl}`)
      } else {
        console.log(`[OSRM Docker]: Responded with status ${res.status} — Fallback engine active`)
      }
    })
    .catch(() => {
      clearTimeout(timeout)
      console.log(`[OSRM Docker]: Container offline/unreachable on ${osrmHealthUrl} — Smart Fallback Route Engine active`)
    })

  // OSRM Warmup query
  const warmupFrom = [19.0700, 72.8700]
  const warmupTo   = [19.0820, 72.8890]

  calculateRoute(warmupFrom, warmupTo)
    .then(route => {
      if (route.source === 'osrm') {
        console.log(`[OSRM Engine]: Warmup OK — ${route.distance}m, ${route.duration}s via OSRM`)
      } else {
        console.log(`[OSRM Engine]: Warmup fallback — Interpolated route engine ready`)
      }
    })
    .catch(() => {
      console.log('[OSRM Engine]: Warmup completed with fallback route')
    })
})

export { io }
