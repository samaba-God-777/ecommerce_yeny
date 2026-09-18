// Generar sonido de llamada usando Web Audio API
let audioContext: AudioContext | null = null
let oscillators: OscillatorNode[] = []
let gainNodes: GainNode[] = []

export const playRingtone = () => {
  // Crear contexto de audio si no existe
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  // Detener cualquier sonido anterior
  stopRingtone()

  const ctx = audioContext
  const now = ctx.currentTime

  // Crear dos frecuencias para un sonido más interesante
  const frequencies = [800, 1000] // Hz

  frequencies.forEach((freq) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.frequency.value = freq
    osc.type = 'sine'

    // Patrón de volumen: suena 0.5s, silencio 0.5s
    gain.gain.setValueAtTime(0.3, now)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    // Detener después de 60 segundos (tiempo máximo razonable para llamada)
    osc.stop(now + 60)

    oscillators.push(osc)
    gainNodes.push(gain)
  })

  // Patrón de volumen: encendido/apagado
  const patternInterval = setInterval(() => {
    if (oscillators.length === 0) {
      clearInterval(patternInterval)
      return
    }

    const now = audioContext!.currentTime
    gainNodes.forEach((gain) => {
      gain.gain.setValueAtTime(gain.gain.value > 0.1 ? 0 : 0.3, now)
      gain.gain.linearRampToValueAtTime(
        gain.gain.value > 0.1 ? 0 : 0.3,
        now + 0.1
      )
    })
  }, 1000)

  return patternInterval
}

export const stopRingtone = () => {
  if (audioContext) {
    oscillators.forEach((osc) => {
      try {
        osc.stop(audioContext!.currentTime)
      } catch (e) {
        // Ya fue detenido
      }
    })
    oscillators = []
    gainNodes = []
  }
}

// Sonido de notificación simple
export const playNotificationSound = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  const ctx = audioContext
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.frequency.value = 1000
  osc.type = 'sine'

  gain.gain.setValueAtTime(0.3, now)
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(now)
  osc.stop(now + 0.1)
}
