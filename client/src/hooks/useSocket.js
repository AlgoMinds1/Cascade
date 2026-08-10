import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useWorld } from '../store/WorldContext.jsx'

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:3001' : '')

const THROTTLE_MS = 200

export function useSocket() {
  const { updateState, addAlert, addEvent, setIsConnected } = useWorld()
  const socketRef = useRef(null)

  useEffect(() => {
    // 1. Initial REST fetch for instant state load
    fetch(`${API_URL}/api/state`)
      .then(res => res.json())
      .then(data => {
        if (data?.state) {
          updateState(data.state)
        }
      })
      .catch(() => {})

    let connected = false
    let socket = null

    try {
      socket = io(API_URL || window.location.origin, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 3000,
        transports: ['websocket', 'polling']
      })
      socketRef.current = socket

      socket.on('connect', () => {
        console.log('Socket connected to Cascade backend:', socket.id)
        connected = true
        setIsConnected(true)
      })

      socket.on('disconnect', () => {
        console.log('Socket disconnected from Cascade backend')
        connected = false
        setIsConnected(false)
      })

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
    } catch (err) {
      console.warn('Socket initialization fallback:', err)
    }

    // 2. HTTP Polling fallback when socket is unavailable or in serverless environment
    const pollInterval = setInterval(() => {
      if (!connected) {
        fetch(`${API_URL}/api/state`)
          .then(res => res.json())
          .then(data => {
            if (data?.state) {
              updateState(data.state)
            }
          })
          .catch(() => {})
      }
    }, 2500)

    return () => {
      clearInterval(pollInterval)
      if (socket) socket.disconnect()
    }
  }, [updateState, addAlert, addEvent, setIsConnected])

  return socketRef
}
