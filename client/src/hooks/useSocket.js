import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useWorld } from '../store/WorldContext.jsx'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const THROTTLE_MS = 200

export function useSocket() {
  const { updateState, addAlert, addEvent, setIsConnected } = useWorld()
  const socketRef = useRef(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 5000
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected to Cascade backend:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected from Cascade backend')
      setIsConnected(false)
    })

    // Throttle rapid state:updated bursts — only apply the latest snapshot
    // within each 200ms window to prevent jank during simulation playback
    let pendingSnapshot = null
    let throttleTimer = null

    socket.on('state:updated', (snapshot) => {
      pendingSnapshot = snapshot
      if (!throttleTimer) {
        throttleTimer = setTimeout(() => {
          if (pendingSnapshot) {
            updateState(pendingSnapshot)
            pendingSnapshot = null
          }
          throttleTimer = null
        }, THROTTLE_MS)
      }
    })

    socket.on('alert', (alert) => {
      addAlert(alert)
    })

    socket.on('event', (evt) => {
      addEvent(evt)
    })

    return () => {
      if (throttleTimer) clearTimeout(throttleTimer)
      socket.disconnect()
    }
  }, [updateState, addAlert, addEvent, setIsConnected])

  return socketRef
}
