import express from 'express'
import cors from 'cors'
import apiRoutes from '../server/routes/api.js'
import { WorldState } from '../server/state/WorldState.js'

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Mock req.io for serverless execution environment where persistent sockets are absent
const mockIo = {
  emit: (_event, _data) => {}
}

app.use((req, _res, next) => {
  req.world = WorldState
  req.io = req.io || mockIo
  next()
})

app.use('/api', apiRoutes)
app.use('/', apiRoutes)

export default app
