import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

let socket = null

export const getSocket = () => socket

export const connectSocket = (accessToken) => {
  if (!accessToken) return null

  if (socket && socket.connected) {
    return socket
  }

  if (socket) {
    socket.auth = { token: accessToken }
    socket.connect()
    return socket
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: accessToken,
    },
    autoConnect: true,
    transports: ['websocket', 'polling'],
  })

  socket.on('connect', () => {
    console.log('[Socket] Connected to server:', socket.id)
  })

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message)
  })

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const emitSendMessage = (payload, callback) => {
  if (socket && socket.connected) {
    socket.emit('send_message', payload, (ack) => {
      callback?.(ack)
    })
  }
}

export const emitTypingStart = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('typing_start', { conversationId })
  }
}

export const emitTypingStop = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('typing_stop', { conversationId })
  }
}

export const emitReactMessage = (payload, callback) => {
  if (socket && socket.connected) {
    socket.emit('react_message', payload, (ack) => {
      callback?.(ack)
    })
  }
}

export const emitMarkRead = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('mark_read', { conversationId })
  }
}

export const emitJoinConversation = (conversationId) => {
  if (socket && socket.connected) {
    socket.emit('join_conversation', { conversationId })
  }
}
