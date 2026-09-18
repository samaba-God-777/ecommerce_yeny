import { Server } from 'socket.io'

// Almacenar conexiones activas
const callRooms = new Map()
const userSockets = new Map()
let io = null

function initializeSignalingServer(server) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 'http://localhost:5179', 'http://localhost:5000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  })

  io.on('connection', (socket) => {
    console.log('New WebRTC connection:', socket.id)

    // Registro de usuario
    socket.on('register-user', (data) => {
      const { userId, username, isAdmin } = data
      userSockets.set(userId, { socket, username, isAdmin })
      console.log(`User registered: ${username} (${userId})`)
    })

    // Iniciar llamada (enviar oferta)
    socket.on('call-user', (data) => {
      const { to, from, offer, fromName } = data
      console.log('🎥 Call attempt FROM:', from, 'TO:', to)
      console.log('📋 Registered users:', Array.from(userSockets.keys()))

      // Buscar usuario exacto o insensible a mayúsculas
      let targetUser = userSockets.get(to)
      if (!targetUser) {
        // Buscar insensible a mayúsculas
        for (const [userId, userData] of userSockets.entries()) {
          if (userId.toLowerCase() === to.toLowerCase()) {
            console.log('✓ Found user with case-insensitive match')
            targetUser = userData
            break
          }
        }
      }

      if (targetUser) {
        console.log('✅ Call routed successfully to:', to)
        targetUser.socket.emit('incoming-call', {
          from,
          fromName,
          offer,
          roomId: socket.id
        })
        socket.emit('call-sent', { message: 'Call sent successfully' })
      } else {
        console.log('❌ User not found:', to)
        socket.emit('call-failed', { message: 'User not available', to, availableUsers: Array.from(userSockets.keys()) })
      }
    })

    // Responder llamada (enviar respuesta)
    socket.on('answer-call', (data) => {
      const { to, answer, roomId } = data
      const targetUser = userSockets.get(to)

      if (targetUser) {
        targetUser.socket.emit('call-answered', {
          answer,
          roomId
        })
      }
    })

    // Compartir ICE candidates
    socket.on('ice-candidate', (data) => {
      const { to, candidate, roomId } = data
      const targetUser = userSockets.get(to)

      if (targetUser) {
        targetUser.socket.emit('ice-candidate', {
          candidate,
          roomId
        })
      }
    })

    // Rechazar llamada
    socket.on('reject-call', (data) => {
      const { to } = data
      const targetUser = userSockets.get(to)

      if (targetUser) {
        targetUser.socket.emit('call-rejected', {
          message: 'Call rejected'
        })
      }
    })

    // Terminar llamada
    socket.on('end-call', (data) => {
      const { to } = data
      const targetUser = userSockets.get(to)

      if (targetUser) {
        targetUser.socket.emit('call-ended', {
          message: 'Call ended'
        })
      }
    })

    // Desconexión
    socket.on('disconnect', () => {
      // Encontrar y remover el usuario
      for (const [userId, userData] of userSockets.entries()) {
        if (userData.socket.id === socket.id) {
          userSockets.delete(userId)
          console.log(`User disconnected: ${userData.username}`)
          break
        }
      }
    })
  })

  return io
}

// Función para obtener usuarios online
function getOnlineUsers() {
  return Array.from(userSockets.entries()).map(([userId, userData]) => ({
    userId,
    username: userData.username,
    isAdmin: userData.isAdmin
  }))
}

// Export io instance for socketService
function getIO() { return io }

export { initializeSignalingServer, getOnlineUsers, getIO }
