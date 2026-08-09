import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useWorld } from '../store/WorldContext.jsx'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

    socket.on('state:updated', (snapshot) => {
      updateState(snapshot)
    })

    socket.on('alert', (alert) => {
      addAlert(alert)
    })

    socket.on('event', (evt) => {
      addEvent(evt)
    })

    return () => {
      socket.disconnect()
    }
  }, [updateState, addAlert, addEvent, setIsConnected])

  return socketRef
}
