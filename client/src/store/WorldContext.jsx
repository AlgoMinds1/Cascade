import { createContext, useContext, useState, useCallback } from 'react'

const WorldContext = createContext(null)

export function WorldProvider({ children }) {
  const [worldState, setWorldState] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [events, setEvents] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [simRunning, setSimRunning] = useState(false)

  const updateState = useCallback((snapshot) => {
    setWorldState(snapshot)
    if (snapshot?.events && Array.isArray(snapshot.events)) {
      setEvents(snapshot.events)
    }
  }, [])

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 20))
  }, [])

  const addEvent = useCallback((evt) => {
    setEvents(prev => [evt, ...prev].slice(0, 50))
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
