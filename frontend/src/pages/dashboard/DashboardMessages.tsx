import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import {
  MessageCircle, Search, Send, Paperclip, Smile, Phone,
  Video, MoreVertical, Headphones, Mail, FileText,
  ChevronDown
} from 'lucide-react'
import VideoCall from '../../components/VideoCall'
import IncomingCallNotification from '../../components/IncomingCallNotification'
import { playRingtone, stopRingtone, playNotificationSound } from '../../utils/ringtone'
import { API_BASE as API, SOCKET_URL } from '../../lib/urls'



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

const faqSections = [
  {
    id: 'shipping',
    title: 'Envíos',
    questions: [
      { q: '¿Cuánto tarda el envío?', a: 'El envío estándar tarda 3-5 días hábiles. El envío express llega en 1-2 días hábiles.' },
      { q: '¿El envío es gratis?', a: 'Sí, envío gratis en pedidos superiores a $80.' },
      { q: '¿Cómo rastreo mi pedido?', a: 'Recibirás un correo con el número de rastreo una vez enviado tu pedido.' },
    ]
  },
  {
    id: 'returns',
    title: 'Devoluciones',
    questions: [
      { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 30 días para devolver productos sin usar con etiqueta original.' },
      { q: '¿Cómo solicito un reembolso?', a: 'Ve a Mis Pedidos > Selecciona el pedido > Solicitar reembolso.' },
    ]
  },
  {
    id: 'account',
    title: 'Cuenta',
    questions: [
      { q: '¿Cómo cambio mi contraseña?', a: 'Ve a Configuración > Seguridad > Cambiar contraseña.' },
      { q: '¿Cómo funciona el programa de fidelidad?', a: 'Ganas puntos con cada compra. 1 punto por cada $1 gastado. Canjea por descuentos.' },
    ]
  }
]

export default function DashboardMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'faq'>('chat')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showMobileList, setShowMobileList] = useState(true)
  const [videoCallActive, setVideoCallActive] = useState(false)
  const [remoteOffer, setRemoteOffer] = useState<RTCSessionDescriptionInit | undefined>()
  const [incomingCall, setIncomingCall] = useState<{ from: string; fromName: string } | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const ringtoneIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const customerUser = (() => {
    const saved = localStorage.getItem('yenyleths_customer')
    return saved ? JSON.parse(saved) : { username: 'Cliente' }
  })()

  // Socket.io setup
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 3000,
      reconnectionAttempts: Infinity,
      transports: ['websocket']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('✅ Connected to signaling server')
      console.log('📱 Registering user:', { userId: customerUser.username, username: customerUser.username })
      socket.emit('register-user', {
        userId: customerUser.username,
        username: customerUser.username,
        isAdmin: false
      })
    })

    socket.on('incoming-call', (data) => {
      console.log('Incoming call from admin:', data)
      setRemoteOffer(data.offer)
      setIncomingCall({ from: data.from, fromName: data.fromName })
      // Reproducir sonido de llamada
      const interval = playRingtone()
      ringtoneIntervalRef.current = interval
    })

    socket.on('call-answered', (data) => {
      console.log('Call answered:', data)
      stopRingtone()
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current)
        ringtoneIntervalRef.current = null
      }
      playNotificationSound()
      if (socketRef.current) {
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
          ]
        })
        peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer))
      }
    })

    socket.on('ice-candidate', (data) => {
      console.log('ICE candidate received:', data)
    })

    socket.on('call-rejected', (data) => {
      console.log('Call rejected:', data)
      stopRingtone()
      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current)
        ringtoneIntervalRef.current = null
      }
      setVideoCallActive(false)
    })

    socket.on('call-ended', (data) => {
      console.log('Call ended:', data)
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
  }, [customerUser.username])

  // Fetch conversations
  useEffect(() => {
    fetchConversations()
    const interval = setInterval(fetchConversations, 3000)
    return () => clearInterval(interval)
  }, [])

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.id)
      markAsRead(selectedConv.id)
      const interval = setInterval(() => fetchMessages(selectedConv.id), 2000)
      return () => clearInterval(interval)
    }
  }, [selectedConv?.id])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API}/chat/conversations`)
      const data = await res.json()
      setConversations(data)
    } catch (err) {
      console.error('Error fetching conversations:', err)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`${API}/chat/conversations/${convId}/messages`)
      const data = await res.json()
      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  const markAsRead = async (convId: string) => {
    try {
      await fetch(`${API}/chat/conversations/${convId}/read`, { method: 'PATCH' })
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, unread: 0 } : c))
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return

    const text = newMessage.trim()
    setNewMessage('')

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      conversationId: selectedConv.id,
      sender: 'customer',
      senderName: customerUser.username,
      text,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      await fetch(`${API}/chat/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'customer',
          senderName: customerUser.username,
          text
        })
      })
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleVideoCall = () => {
    if (!selectedConv || !socketRef.current) return
    setVideoCallActive(true)
  }

  const handleCallStart = async (offer: RTCSessionDescriptionInit) => {
    if (!selectedConv || !socketRef.current) return
    socketRef.current.emit('call-user', {
      to: 'admin',
      from: customerUser.username,
      offer,
      fromName: customerUser.username
    })
  }

  const handleCallAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!socketRef.current) return
    socketRef.current.emit('answer-call', {
      to: 'admin',
      answer
    })
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!socketRef.current) return
    socketRef.current.emit('ice-candidate', {
      to: 'admin',
      candidate
    })
  }

  const handleEndVideoCall = () => {
    stopRingtone()
    if (ringtoneIntervalRef.current) {
      clearInterval(ringtoneIntervalRef.current)
      ringtoneIntervalRef.current = null
    }
    if (!socketRef.current) return
    socketRef.current.emit('end-call', {
      to: 'admin'
    })
    setVideoCallActive(false)
    setRemoteOffer(undefined)
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

  const filteredConversations = conversations.filter(c =>
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-serif text-3xl text-brown">Mensajes y Soporte</h1>
          <p className="text-sm text-brown/60">Comunícate con nuestro equipo de atención</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 rounded-xl bg-white p-1 shadow-sm">
          {[
            { id: 'chat', label: 'Chat', icon: MessageCircle },
            { id: 'tickets', label: 'Mis Tickets', icon: FileText },
            { id: 'faq', label: 'Preguntas Frecuentes', icon: Headphones }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-brown/60 hover:bg-pink-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'chat' && (
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-lg" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
            <div className="flex h-full">
              {/* Conversation List - Responsive */}
              <div className={`${
                showMobileList
                  ? 'w-full md:w-80'
                  : 'hidden md:flex md:w-80'
              } border-r border-pink-100 flex flex-col`}>
                <div className="p-4 border-b border-pink-50">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar conversaciones..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-pink-100 bg-pink-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:bg-white"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedConv(conv)
                        setShowMobileList(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-pink-50 ${
                        selectedConv?.id === conv.id ? 'bg-pink-50 border-r-2 border-pink-500' : ''
                      }`}
                    >
                      <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                          {conv.avatar}
                        </div>
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          conv.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-brown truncate">{conv.customerName}</p>
                          <span className="text-xs text-brown/40">{formatTime(conv.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-brown/50 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area - Responsive */}
              {selectedConv ? (
                <div className={`${showMobileList ? 'hidden md:flex' : 'flex'} flex-1 flex-col w-full`}>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-pink-50 px-4 md:px-6 py-3">
                    <button
                      onClick={() => setShowMobileList(true)}
                      className="md:hidden mr-2 rounded-lg p-2 text-gray-600 hover:bg-pink-50"
                    >
                      <ChevronDown size={20} className="rotate-90" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
                          {selectedConv.avatar}
                        </div>
                        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                          selectedConv.status === 'online' ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-brown">{selectedConv.customerName}</p>
                        <p className="text-xs text-brown/50">
                          {selectedConv.status === 'online' ? 'En línea' : 'Desconectado'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={handleVideoCall}
                        className="hidden sm:flex rounded-lg p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-600 transition"
                        title="Iniciar videollamada"
                      >
                        <Video size={18} />
                      </button>
                      <button className="rounded-lg p-1.5 md:p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${
                          msg.sender === 'customer'
                            ? 'bg-pink-500 text-white rounded-2xl rounded-br-sm'
                            : 'bg-gray-100 text-brown rounded-2xl rounded-bl-sm'
                        } px-4 py-3`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${
                            msg.sender === 'customer' ? 'text-pink-100' : 'text-brown/40'
                          }`}>
                            {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-pink-50 p-3 md:p-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <button className="hidden sm:flex rounded-lg p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-600">
                        <Paperclip size={18} />
                      </button>
                      <button className="hidden sm:flex rounded-lg p-2 text-gray-400 hover:bg-pink-50 hover:text-pink-600">
                        <Smile size={18} />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 rounded-xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:bg-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="rounded-xl bg-pink-500 p-2.5 text-white shadow-md shadow-pink-200 transition-colors hover:bg-pink-600 disabled:opacity-50"
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-4 text-pink-200" />
                    <p className="font-serif text-xl text-brown/40">Selecciona una conversación</p>
                    <p className="mt-1 text-sm text-brown/30">Elige una conversación para comenzar a chatear</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-pink-100 bg-white p-6 shadow-lg"
          >
            <h2 className="font-serif text-xl text-brown mb-4">Mis Tickets de Soporte</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-pink-100">
                    <th className="pb-3 text-left font-medium text-brown/60">Ticket</th>
                    <th className="pb-3 text-left font-medium text-brown/60">Asunto</th>
                    <th className="pb-3 text-left font-medium text-brown/60">Estado</th>
                    <th className="pb-3 text-left font-medium text-brown/60">Fecha</th>
                    <th className="pb-3 text-left font-medium text-brown/60">Última actualización</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                  {[
                    { id: 'TK-4521', subject: 'Cambio de talla - Vestido Floral Primavera', status: 'Abierto', date: '28 Jun 2026', update: 'Hace 1 hora' },
                    { id: 'TK-4498', subject: 'Pedido #YB-2847 - Estado de envío', status: 'Pendiente', date: '26 Jun 2026', update: 'Hace 3 horas' },
                    { id: 'TK-4475', subject: 'Puntos de fidelidad no reflejados', status: 'Resuelto', date: '24 Jun 2026', update: '1 día' },
                    { id: 'TK-4460', subject: 'Envío express programado', status: 'Resuelto', date: '22 Jun 2026', update: '2 días' },
                  ].map(ticket => (
                    <tr key={ticket.id} className="hover:bg-pink-50/50">
                      <td className="py-3 font-mono text-brown">{ticket.id}</td>
                      <td className="py-3 text-brown">{ticket.subject}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ticket.status === 'Abierto' ? 'bg-green-100 text-green-700' :
                          ticket.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 text-brown/60">{ticket.date}</td>
                      <td className="py-3 text-brown/60">{ticket.update}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'faq' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {faqSections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-lg">
                <h3 className="font-serif text-lg text-brown mb-4">{section.title}</h3>
                <div className="space-y-2">
                  {section.questions.map((item, i) => (
                    <div key={i} className="rounded-xl border border-pink-50">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === `${section.id}-${i}` ? null : `${section.id}-${i}`)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-brown hover:bg-pink-50/50"
                      >
                        {item.q}
                        <ChevronDown size={16} className={`text-brown/40 transition-transform ${
                          expandedFaq === `${section.id}-${i}` ? 'rotate-180' : ''
                        }`} />
                      </button>
                      <AnimatePresence>
                        {expandedFaq === `${section.id}-${i}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-3 text-sm text-brown/60">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Contact Options */}
            <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-lg">
              <h3 className="font-serif text-lg text-brown mb-4">¿Necesitas más ayuda?</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: MessageCircle, label: 'Live Chat', color: 'bg-pink-100 text-pink-600' },
                  { icon: Phone, label: 'WhatsApp', color: 'bg-green-100 text-green-600' },
                  { icon: Mail, label: 'Email', color: 'bg-blue-100 text-blue-600' },
                  { icon: Headphones, label: 'Call', color: 'bg-purple-100 text-purple-600' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all hover:scale-105 ${opt.color}`}
                  >
                    <opt.icon size={24} />
                    <span className="text-xs font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

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

      {videoCallActive && (
        <VideoCall
          recipientName={selectedConv?.customerName || 'Admin'}
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
