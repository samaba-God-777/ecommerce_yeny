import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, X } from 'lucide-react'

interface VideoCallProps {
  recipientName: string
  onClose: () => void
  onCallStart: (offer: RTCSessionDescriptionInit) => Promise<void>
  onCallAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>
  onIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>
  remoteOffer?: RTCSessionDescriptionInit
}

export default function VideoCall({
  recipientName,
  onClose,
  onCallStart,
  onCallAnswer,
  onIceCandidate,
  remoteOffer
}: VideoCallProps) {
  const [callActive, setCallActive] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const [isAnswering, setIsAnswering] = useState(!!remoteOffer)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Inicializar WebRTC
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        // Obtener acceso a cámara y micrófono
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        })

        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Configurar RTCPeerConnection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }
          ]
        })

        peerConnectionRef.current = peerConnection

        // Agregar stream local
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream)
        })

        // Manejar streams remotos
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0]
          }
        }

        // Manejar ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            onIceCandidate(event.candidate.toJSON())
          }
        }

        // Si estamos respondiendo una llamada
        if (remoteOffer) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer))
          const answer = await peerConnection.createAnswer()
          await peerConnection.setLocalDescription(answer)
          await onCallAnswer(answer)
          setCallActive(true)
          startCallTimer()
        }
      } catch (err) {
        console.error('Error initializing WebRTC:', err)
        alert('Error al acceder a la cámara/micrófono. Verifica los permisos.')
      }
    }

    initializeWebRTC()

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
      localStreamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [remoteOffer, onIceCandidate, onCallAnswer])

  const startCall = async () => {
    try {
      if (!peerConnectionRef.current) return

      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)
      await onCallStart(offer)
      setCallActive(true)
      startCallTimer()
    } catch (err) {
      console.error('Error starting call:', err)
    }
  }

  const endCall = () => {
    try {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current)
        callTimerRef.current = null
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          track.stop()
        })
        localStreamRef.current = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null
      }
      setCallActive(false)
      setCallDuration(0)
    } catch (err) {
      console.error('Error ending call:', err)
    }
    onClose()
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  const startCallTimer = () => {
    setCallDuration(0)
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
      >
        <div className="relative w-full h-full flex flex-col">
          {/* Video remoto (de fondo) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Superposición oscura */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-[70]">
            <div className="text-white">
              <h2 className="text-xl font-bold">{recipientName}</h2>
              {callActive && (
                <p className="text-sm text-gray-300">{formatDuration(callDuration)}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                endCall()
              }}
              className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition shadow-lg z-[80] cursor-pointer"
              type="button"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Video local (esquina) */}
          <div className="absolute bottom-24 right-4 w-32 h-40 rounded-lg overflow-hidden border-2 border-white z-20">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover bg-black"
            />
          </div>

          {/* Controles */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 p-6 z-10">
            {!callActive ? (
              <button
                onClick={() => {
                  console.log('🎤 Start call button clicked - calling startCall()')
                  startCall()
                }}
                className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition shadow-lg z-[100] cursor-pointer"
                type="button"
              >
                <Phone size={28} />
              </button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleVideo}
                  className={`p-4 rounded-full transition shadow-lg ${
                    videoEnabled
                      ? 'bg-market hover:bg-market-deep'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleAudio}
                  className={`p-4 rounded-full transition shadow-lg ${
                    audioEnabled
                      ? 'bg-market hover:bg-market-deep'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition shadow-lg"
                >
                  <PhoneOff size={28} />
                </motion.button>
              </>
            )}
          </div>

          {/* Estado de conexión */}
          {!callActive && !isAnswering && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/30 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold">Llamando a {recipientName}...</p>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
