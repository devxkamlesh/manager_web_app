import { useState, useEffect, useCallback } from 'react'

interface PomodoroState {
  timeLeft: number
  isActive: boolean
  isBreak: boolean
  sessions: number
}

// Sound management
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private soundEnabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload sounds
      this.sounds.focusComplete = new Audio('/sounds/Focus_timer_finish_sound.mp3')
      this.sounds.breakComplete = new Audio('/sounds/new-notification-09-352705.mp3')
      this.sounds.milestone = new Audio('/sounds/level-up-191997.mp3')
      
      // Set volume levels
      Object.values(this.sounds).forEach(audio => {
        audio.volume = 0.7
        audio.preload = 'auto'
      })
    }
  }

  playSound(soundType: 'focusComplete' | 'breakComplete' | 'milestone') {
    if (!this.soundEnabled || typeof window === 'undefined') return
    
    const sound = this.sounds[soundType]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(error => {
        console.log('Could not play sound:', error)
      })
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    return this.soundEnabled
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
  }

  isSoundEnabled() {
    return this.soundEnabled
  }
}

export function usePomodoro() {
  const [focusTime, setFocusTime] = useState(25) // minutes
  const [shortBreakTime, setShortBreakTime] = useState(5) // minutes
  const [longBreakTime, setLongBreakTime] = useState(15) // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [soundManager] = useState(() => new SoundManager())
  const [soundEnabled, setSoundEnabled] = useState(true)

  const toggleTimer = useCallback(() => {
    setIsActive(!isActive)
  }, [isActive])

  const resetTimer = useCallback(() => {
    setIsActive(false)
    setTimeLeft(isBreak ? (sessions % 4 === 0 ? longBreakTime * 60 : shortBreakTime * 60) : focusTime * 60)
  }, [isBreak, sessions, focusTime, shortBreakTime, longBreakTime])

  const startNextSession = useCallback(() => {
    if (!isBreak) {
      // Completed a focus session
      const newSessionCount = sessions + 1
      setSessions(newSessionCount)
      setIsBreak(true)
      
      // Play appropriate sound
      if (newSessionCount % 4 === 0) {
        // Milestone: completed 4 sessions
        soundManager.playSound('milestone')
      } else {
        // Regular focus session complete
        soundManager.playSound('focusComplete')
      }
      
      // Long break every 4 sessions, short break otherwise
      setTimeLeft(newSessionCount % 4 === 0 ? longBreakTime * 60 : shortBreakTime * 60)
    } else {
      // Completed a break
      setIsBreak(false)
      setTimeLeft(focusTime * 60)
      
      // Play break complete sound
      soundManager.playSound('breakComplete')
    }
    setIsActive(false)
  }, [isBreak, sessions, focusTime, shortBreakTime, longBreakTime, soundManager])

  const setCustomTime = useCallback((focus: number, shortBreak: number, longBreak: number) => {
    setFocusTime(focus)
    setShortBreakTime(shortBreak)
    setLongBreakTime(longBreak)
    
    // Reset current timer with new times
    setIsActive(false)
    if (!isBreak) {
      setTimeLeft(focus * 60)
    } else {
      setTimeLeft(sessions % 4 === 0 ? longBreak * 60 : shortBreak * 60)
    }
  }, [isBreak, sessions])

  const toggleSound = useCallback(() => {
    const newSoundState = soundManager.toggleSound()
    setSoundEnabled(newSoundState)
    return newSoundState
  }, [soundManager])

  const playTestSound = useCallback((soundType: 'focusComplete' | 'breakComplete' | 'milestone') => {
    soundManager.playSound(soundType)
  }, [soundManager])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Timer finished
      startNextSession()
      
      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const title = isBreak ? 'Break finished!' : 'Focus session completed!'
        const body = isBreak ? 'Time to get back to work' : 'Time for a break'
        
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'pomodoro-timer'
        })
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, startNextSession, isBreak])

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return {
    timeLeft,
    isActive,
    isBreak,
    sessions,
    toggleTimer,
    resetTimer,
    setCustomTime,
    focusTime,
    shortBreakTime,
    longBreakTime,
    soundEnabled,
    toggleSound,
    playTestSound
  }
}