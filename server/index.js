import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import apiRoutes from './routes/api.js'
import { WorldState } from './state/WorldState.js'

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
})

export { io }
