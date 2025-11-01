import { useState, useEffect } from 'react'

export function useCountdown(targetTimestamp: number | null) {
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (!targetTimestamp) {
      setTimeRemaining(0)
      return
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((targetTimestamp - Date.now()) / 1000))
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetTimestamp])

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return { timeRemaining, minutes, seconds }
}
