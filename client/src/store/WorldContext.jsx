import { createContext, useContext, useState, useCallback } from 'react'

const WorldContext = createContext(null)

export function WorldProvider({ children }) {
  const [worldState, setWorldState] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [events, setEvents] = useState([])

  const updateState = useCallback((snapshot) => {
    setWorldState(snapshot)
  }, [])

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 20))
  }, [])

  const addEvent = useCallback((evt) => {
    setEvents(prev => [evt, ...prev].slice(0, 50))
  }, [])

  return (
    <WorldContext.Provider value={{ worldState, alerts, events, updateState, addAlert, addEvent }}>
      {children}
    </WorldContext.Provider>
  )
}

export const useWorld = () => {
  const ctx = useContext(WorldContext)
  if (!ctx) throw new Error('useWorld must be inside WorldProvider')
  return ctx
}
