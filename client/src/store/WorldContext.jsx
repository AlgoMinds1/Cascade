import { createContext, useContext, useState, useCallback } from 'react'

const WorldContext = createContext(null)

const INITIAL_EVENTS = [
  {
    id: 'evt-init-1',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    type: 'SYSTEM_READY',
    description: 'Cascade Command Engine online • Graph routing active',
    source: 'system',
    affectedEntities: []
  },
  {
    id: 'evt-init-2',
    timestamp: new Date(Date.now() - 45000).toISOString(),
    type: 'CORRIDOR_MONITOR',
    description: 'Corridor telemetry synced: Road 17 & South Ave open',
    source: 'system',
    affectedEntities: ['road-17', 'road-south']
  },
  {
    id: 'evt-init-3',
    timestamp: new Date(Date.now() - 30000).toISOString(),
    type: 'DISPATCH',
    description: 'Ambulance A1 en route to City General • Units A2/A3 staged',
    source: 'dispatch',
    affectedEntities: ['amb-1']
  },
  {
    id: 'evt-init-4',
    timestamp: new Date(Date.now() - 15000).toISOString(),
    type: 'TRIAGE',
    description: 'City General (60% load) & Emergency Care telemetry active',
    source: 'hospital',
    affectedEntities: ['hosp-a', 'hosp-b']
  },
  {
    id: 'evt-init-5',
    timestamp: new Date().toISOString(),
    type: 'MONITOR',
    description: 'Incident ingestion stream active • Ready for field reports',
    source: 'system',
    affectedEntities: []
  }
]

export function WorldProvider({ children }) {
  const [worldState, setWorldState] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [isConnected, setIsConnected] = useState(false)
  const [simRunning, setSimRunning] = useState(false)

  const updateState = useCallback((snapshot) => {
    setWorldState(snapshot)
    if (snapshot?.events && Array.isArray(snapshot.events) && snapshot.events.length > 0) {
      setEvents(snapshot.events)
    }
  }, [])

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 20))
  }, [])

  const addEvent = useCallback((evt) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === evt.id)
      if (exists) return prev
      return [evt, ...prev].slice(0, 50)
    })
  }, [])

  const clearAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }, [])

  return (
    <WorldContext.Provider
      value={{
        worldState,
        alerts,
        events,
        isConnected,
        setIsConnected,
        updateState,
        addAlert,
        addEvent,
        clearAlert,
        simRunning,
        setSimRunning,
      }}
    >
      {children}
    </WorldContext.Provider>
  )
}

export const useWorld = () => {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be inside WorldProvider')
  return ctx
}
