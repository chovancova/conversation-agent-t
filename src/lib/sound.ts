export type NotificationSound = 'none' | 'beep' | 'chime' | 'alert' | 'gentle'

export type SoundPreferences = {
  enabled: boolean
  sound: NotificationSound
  volume: number
  warningIntervals: {
    fiveMinutes: boolean
    twoMinutes: boolean
    oneMinute: boolean
    thirtySeconds: boolean
  }
}

export const DEFAULT_SOUND_PREFERENCES: SoundPreferences = {
  enabled: true,
  sound: 'chime',
  volume: 0.5,
  warningIntervals: {
    fiveMinutes: true,
    twoMinutes: true,
    oneMinute: true,
    thirtySeconds: false
  }
}

const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null

export const playBeep = (volume: number = 0.5) => {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 800
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.15)
}

export const playChime = (volume: number = 0.5) => {
  if (!audioContext) return

  const notes = [523.25, 659.25, 783.99]
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'sine'

    const startTime = audioContext.currentTime + (index * 0.1)
    gainNode.gain.setValueAtTime(volume * 0.3, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.4)
  })
}

export const playAlert = (volume: number = 0.5) => {
  if (!audioContext) return

  for (let i = 0; i < 2; i++) {
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 880
    oscillator.type = 'square'

    const startTime = audioContext.currentTime + (i * 0.25)
    gainNode.gain.setValueAtTime(volume * 0.4, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.15)
  }
}

export const playGentle = (volume: number = 0.5) => {
  if (!audioContext) return

  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.value = 440
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0, audioContext.currentTime)
  gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.2)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 1.2)
}

export const playNotificationSound = (sound: NotificationSound, volume: number = 0.5) => {
  switch (sound) {
    case 'beep':
      playBeep(volume)
      break
    case 'chime':
      playChime(volume)
      break
    case 'alert':
      playAlert(volume)
      break
    case 'gentle':
      playGentle(volume)
      break
    case 'none':
    default:
      break
  }
}
