import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import {
  MessageCircle, Search, Send, Paperclip, Smile, Phone,
  Video, MoreVertical, Users, Circle, CheckCheck, Trash2, User,
  Mail, Archive, Pin, Volume2, VolumeX, Lock, Eye, EyeOff
} from 'lucide-react'
import VideoCall from './VideoCall'
import IncomingCallNotification from './IncomingCallNotification'
import { playRingtone, stopRingtone, playNotificationSound } from '../utils/ringtone'

const API = 'http://localhost:5000/api'
const SIGNALING_SERVER = 'http://localhost:5000'

interface Message {
  id: string
  conversationId: string
  sender: 'customer' | 'admin'
  senderName: string
  text: string
  timestamp: string
}

interface Conversation {
  id: string
  customerName: string
  customerEmail: string
  customerId: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  status: string
  avatar: string
}

export default function AdminChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'online'>('all')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set())
  const [mutedUsers, setMutedUsers] = useState<Set<string>>(new Set())
  const [archivedConvs, setArchivedConvs] = useState<Set<string>>(new Set())
  const [pinnedConvs, setPinnedConvs] = useState<Set<string>>(new Set())
  const [unreadMarked, setUnreadMarked] = useState<Set<string>>(new Set())
  const [videoCallActive, setVideoCallActive] = useState(false)
  const [remoteOffer, setRemoteOffer] = useState<RTCSessionDescriptionInit | undefined>()
  const [incomingCall, setIncomingCall] = useState<{ from: string; fromName: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const ringtoneIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const username = JSON.parse(localStorage.getItem('adminAuth') || '{}').username || 'Admin'

  // Conectar a Socket.io
  useEffect(() => {
    const socket = io(SIGNALING_SERVER, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: Infinity,
      transports: ['websocket']
    })
    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Connected to signaling server')
      // Registrar usuario como admin
      socket.emit('register-user', {
        userId: 'admin',
        username: 'Admin',
        isAdmin: true
      })
    })

    socket.on('incoming-call', (data) => {
      console.log('Incoming call from:', data.fromName)
      setRemoteOffer(data.offer)
      setIncomingCall({ from: data.from, fromName: data.fromName })
      // Reproducir sonido de llamada
      const interval = playRingtone()
      ringtoneIntervalRef.current = interval
    })

    socket.on('call-answered', (data) => {
      console.log('Call answered')
      stopRingtone()
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current)
        ringtoneIntervalRef.current = null
      }
      playNotificationSound()
    })

    socket.on('ice-candidate', (data) => {
      console.log('Received ICE candidate')
    })

    socket.on('call-rejected', () => {
      console.log('Call was rejected')
      stopRingtone()
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current)
        ringtoneIntervalRef.current = null
      }
      setVideoCallActive(false)
    })

    socket.on('call-ended', () => {
      console.log('Call ended by other party')
      stopRingtone()
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current)
        ringtoneIntervalRef.current = null
      }
      setVideoCallActive(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id)
      markAsRead(selectedConv.id)
      const interval = setInterval(() => fetchMessages(selectedConv.id), 2000)
      return () => clearInterval(interval)
    }
  }, [selectedConv?.id])

  // Auto-scroll desactivado - mantener posición del usuario
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/chat/conversations`)
      const data = await res.json()
      setConversations(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`${API}/chat/conversations/${convId}/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const markAsRead = async (convId: string) => {
    try {
      await fetch(`${API}/chat/conversations/${convId}/read`, { method: 'PATCH' })
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return

    const text = newMessage.trim()
    setNewMessage('')

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConv.id,
      sender: 'admin',
      senderName: username,
      text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      await fetch(`${API}/chat/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'admin',
          senderName: username,
          text
        })
      })
      fetchMessages(selectedConv.id)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const deleteConversation = async () => {
    if (!selectedConv) return

    if (confirm(`¿Eliminar la conversación con ${selectedConv.customerName}?`)) {
      const convIdToDelete = selectedConv.id

      // Eliminar inmediatamente de la lista local
      setConversations(prev => prev.filter(c => c.id !== convIdToDelete))
      setSelectedConv(null)
      setOptionsOpen(false)

      try {
        await fetch(`${API}/chat/conversations/${convIdToDelete}`, {
          method: 'DELETE'
        })
      } catch (err) {
        console.error('Error deleting conversation:', err)
        // Si falla, refrescar para traer la lista correcta
        fetchConversations()
      }
    }
  }

  const deleteUser = async () => {
    if (!selectedConv) return

    if (confirm(`¿Eliminar el usuario ${selectedConv.customerName} completamente? Esta acción no se puede deshacer.`)) {
      const userIdToDelete = selectedConv.customerId

      // Eliminar inmediatamente todas las conversaciones del usuario
      setConversations(prev => prev.filter(c => c.customerId !== userIdToDelete))
      setSelectedConv(null)
      setOptionsOpen(false)

      try {
        await fetch(`${API}/customers/${userIdToDelete}`, {
          method: 'DELETE'
        })
      } catch (err) {
        console.error('Error deleting user:', err)
        // Si falla, refrescar para traer la lista correcta
        fetchConversations()
      }
    }
  }

  const toggleMuted = () => {
    if (!selectedConv) return
    const newMuted = new Set(mutedUsers)
    if (newMuted.has(selectedConv.id)) {
      newMuted.delete(selectedConv.id)
    } else {
      newMuted.add(selectedConv.id)
    }
    setMutedUsers(newMuted)
  }

  const toggleArchived = () => {
    if (!selectedConv) return
    const newArchived = new Set(archivedConvs)
    if (newArchived.has(selectedConv.id)) {
      newArchived.delete(selectedConv.id)
    } else {
      newArchived.add(selectedConv.id)
    }
    setArchivedConvs(newArchived)
  }

  const togglePinned = () => {
    if (!selectedConv) return
    const newPinned = new Set(pinnedConvs)
    if (newPinned.has(selectedConv.id)) {
      newPinned.delete(selectedConv.id)
    } else {
      newPinned.add(selectedConv.id)
    }
    setPinnedConvs(newPinned)
  }

  const toggleBlocked = () => {
    if (!selectedConv) return
    const newBlocked = new Set(blockedUsers)
    if (newBlocked.has(selectedConv.customerId)) {
      newBlocked.delete(selectedConv.customerId)
    } else {
      newBlocked.add(selectedConv.customerId)
    }
    setBlockedUsers(newBlocked)
  }

  const toggleUnreadMarked = () => {
    if (!selectedConv) return
    const newUnread = new Set(unreadMarked)
    if (newUnread.has(selectedConv.id)) {
      newUnread.delete(selectedConv.id)
    } else {
      newUnread.add(selectedConv.id)
    }
    setUnreadMarked(newUnread)
  }

  const handleVideoCall = async () => {
    if (!selectedConv || !socketRef.current) return
    setVideoCallActive(true)
  }

  const handleCallStart = async (offer: RTCSessionDescriptionInit) => {
    if (!selectedConv || !socketRef.current) return
    console.log('📞 Sending call offer to:', selectedConv.customerName)
    console.log('📋 Selected conversation:', selectedConv)
    socketRef.current.emit('call-user', {
      to: selectedConv.customerName,
      from: 'admin',
      fromName: 'Admin',
      offer
    })
  }

  const handleCallAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!selectedConv || !socketRef.current) return
    console.log('Sending call answer')
    socketRef.current.emit('answer-call', {
      to: selectedConv.customerName,
      answer,
      roomId: Date.now()
    })
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!selectedConv || !socketRef.current) return
    socketRef.current.emit('ice-candidate', {
      to: selectedConv.customerName,
      candidate,
      roomId: Date.now()
    })
  }

  const handleEndVideoCall = () => {
    stopRingtone()
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current)
      ringtoneIntervalRef.current = null
    }
    if (selectedConv && socketRef.current) {
      socketRef.current.emit('end-call', {
        to: selectedConv.customerName
      })
    }
    setVideoCallActive(false)
    setIncomingCall(null)
  }

  const handleAcceptCall = () => {
    setIncomingCall(null)
    setVideoCallActive(true)
    stopRingtone()
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current)
      ringtoneIntervalRef.current = null
    }
    playNotificationSound()
  }

  const handleRejectCall = () => {
    stopRingtone()
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current)
      ringtoneIntervalRef.current = null
    }
    if (incomingCall && socketRef.current) {
      socketRef.current.emit('reject-call', {
        to: incomingCall.from
      })
    }
    setIncomingCall(null)
    setRemoteOffer(undefined)
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'Ahora'
    if (mins < 60) return `${mins} min`
    if (hours < 24) return `${hours}h`
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const filteredConversations = conversations
    .filter(c => c.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => {
      if (filter === 'unread') return c.unread > 0
      if (filter === 'online') return c.status === 'online'
      return true
    })
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-line bg-white flex flex-col">
        {/* Header */}
        <div className="border-b border-line p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-brown flex items-center gap-2">
              <MessageCircle size={20} className="text-market" />
              Chat
              {totalUnread > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-market text-[10px] font-bold text-white">
                  {totalUnread}
                </span>
              )}
            </h2>
            <span className="text-xs text-brown/50">{conversations.length} conversaciones</span>
          </div>

          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-line bg-market/5 py-2 pl-10 pr-4 text-sm outline-none focus:border-market focus:bg-white"
            />
          </div>

          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'unread', label: 'No leídos' },
              { id: 'online', label: 'En línea' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-market text-white'
                    : 'bg-market/5 text-brown/60 hover:bg-market/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-market/5 border-b border-market/5 ${
                selectedConv?.id === conv.id ? 'bg-market/5' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-market-bright to-market text-sm font-bold text-white">
                  {conv.avatar}
                </div>
                <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  conv.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-brown text-sm truncate">{conv.customerName}</p>
                  <span className="text-[10px] text-brown/40 flex-shrink-0 ml-2">{formatTime(conv.lastMessageTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-brown/50 truncate">{conv.lastMessage || 'Nueva conversación'}</p>
                  {conv.unread > 0 && (
                    <span className="ml-2 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-market text-[9px] font-bold text-white">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-line px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-market-bright to-market text-sm font-bold text-white">
                  {selectedConv.avatar}
                </div>
                <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                  selectedConv.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                }`} />
              </div>
              <div>
                <p className="font-medium text-brown">{selectedConv.customerName}</p>
                <p className="text-xs text-brown/50">{selectedConv.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative">
              <button className="rounded-lg p-2 text-gray-400 hover:bg-market/5 hover:text-market-deep">
                <Phone size={18} />
              </button>
              <button
                onClick={handleVideoCall}
                className="rounded-lg p-2 text-gray-400 hover:bg-market/5 hover:text-market-deep transition"
                title="Iniciar videollamada"
              >
                <Video size={18} />
              </button>
              <button
                onClick={() => setOptionsOpen(!optionsOpen)}
                className="rounded-lg p-2 text-gray-400 hover:bg-market/5 hover:text-market-deep"
              >
                <MoreVertical size={18} />
              </button>

              {optionsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setOptionsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-line rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => { toggleUnreadMarked(); setOptionsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown hover:bg-market/5 transition-colors"
                    >
                      {unreadMarked.has(selectedConv?.id || '') ? <EyeOff size={16} /> : <Mail size={16} />}
                      {unreadMarked.has(selectedConv?.id || '') ? 'Marcar como leído' : 'Marcar como no leído'}
                    </button>
                    <button
                      onClick={() => { toggleArchived(); setOptionsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown hover:bg-market/5 transition-colors"
                    >
                      <Archive size={16} />
                      {archivedConvs.has(selectedConv?.id || '') ? 'Desarchivar' : 'Archivar'}
                    </button>
                    <button
                      onClick={() => { togglePinned(); setOptionsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown hover:bg-market/5 transition-colors"
                    >
                      <Pin size={16} />
                      {pinnedConvs.has(selectedConv?.id || '') ? 'Desfijar' : 'Fijar'}
                    </button>
                    <button
                      onClick={() => { toggleMuted(); setOptionsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brown hover:bg-market/5 transition-colors"
                    >
                      {mutedUsers.has(selectedConv?.id || '') ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      {mutedUsers.has(selectedConv?.id || '') ? 'Activar sonido' : 'Silenciar'}
                    </button>
                    <button
                      onClick={() => { toggleBlocked(); setOptionsOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-500 hover:bg-orange-50 transition-colors"
                    >
                      <Lock size={16} />
                      {blockedUsers.has(selectedConv?.customerId || '') ? 'Desbloquear' : 'Bloquear'}
                    </button>
                    <div className="border-t border-line" />
                    <button
                      onClick={deleteConversation}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      Eliminar Conversación
                    </button>
                    <button
                      onClick={deleteUser}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                      <User size={16} />
                      Eliminar Usuario
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-market/5 to-white">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-market/10 px-3 py-1 text-xs text-market-deep">
                <Circle size={8} className="fill-market" />
                Conversación con {selectedConv.customerName}
              </span>
            </div>

            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
              >
                <span className={`text-[11px] font-medium mb-1 px-1 ${
                  msg.sender === 'admin' ? 'text-market-bright' : 'text-brown/50'
                }`}>
                  {msg.sender === 'admin' ? username : selectedConv.customerName}
                </span>
                <div className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'customer' && (
                  <div className="mr-2 flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-market/10 text-xs font-bold text-market-deep">
                      {selectedConv.avatar}
                    </div>
                  </div>
                )}
                <div className={`max-w-[65%] ${
                  msg.sender === 'admin'
                    ? 'bg-market text-white rounded-2xl rounded-br-sm'
                    : 'bg-white border border-line text-brown rounded-2xl rounded-bl-sm shadow-sm'
                } px-4 py-3`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    msg.sender === 'admin' ? 'justify-end' : ''
                  }`}>
                    <span className={`text-[10px] ${
                      msg.sender === 'admin' ? 'text-white/70' : 'text-brown/40'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.sender === 'admin' && (
                      <CheckCheck size={12} className="text-white/80" />
                    )}
                  </div>
                </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-line p-4">
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-gray-400 hover:bg-market/5 hover:text-market-deep">
                <Paperclip size={18} />
              </button>
              <button className="rounded-lg p-2 text-gray-400 hover:bg-market/5 hover:text-market-deep">
                <Smile size={18} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu respuesta..."
                className="flex-1 rounded-xl border border-line bg-market/5 px-4 py-2.5 text-sm outline-none focus:border-market focus:bg-white"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="rounded-xl bg-market p-2.5 text-white shadow-md shadow-market/20 transition-colors hover:bg-market-deep disabled:opacity-50"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-market/10">
              <Users size={32} className="text-market-bright" />
            </div>
            <p className="font-serif text-xl text-brown/40">Selecciona una conversación</p>
            <p className="mt-1 text-sm text-brown/30">Elige un cliente para responder</p>
            {totalUnread > 0 && (
              <p className="mt-3 text-sm text-market font-medium">
                Tienes {totalUnread} mensaje{totalUnread > 1 ? 's' : ''} sin leer
              </p>
            )}
          </div>
        </div>
      )}

      {/* Notificación de llamada entrante */}
      <AnimatePresence>
        {incomingCall && (
          <IncomingCallNotification
            callerName={incomingCall.fromName}
            onAccept={handleAcceptCall}
            onReject={handleRejectCall}
          />
        )}
      </AnimatePresence>

      {/* Componente de videollamada */}
      {videoCallActive && selectedConv && (
        <VideoCall
          recipientName={selectedConv.customerName}
          onClose={handleEndVideoCall}
          onCallStart={handleCallStart}
          onCallAnswer={handleCallAnswer}
          onIceCandidate={handleIceCandidate}
          remoteOffer={remoteOffer}
        />
      )}
    </div>
  )
}
