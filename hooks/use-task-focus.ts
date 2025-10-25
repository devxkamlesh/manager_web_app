import { useState, useEffect, useCallback } from 'react'
import { useTaskStore, type Task } from '@/lib/task-store'
import { getIndianDate } from '@/lib/utils'

interface FocusSessionData {
  timeLeft: number
  totalTime: number
  isActive: boolean
  startedAt: string | null
  pausedAt: string | null
}

// Sound management
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {}
  private soundEnabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      // Create simple beep sounds using Web Audio API
      this.soundEnabled = localStorage.getItem('focus-sound-enabled') !== 'false'
    }
  }

  playSound(soundType: 'focusComplete' | 'breakComplete' | 'milestone') {
    if (!this.soundEnabled || typeof window === 'undefined') return
    
    try {
      // Create a simple beep sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Different frequencies for different sounds
      const frequencies = {
        focusComplete: 800,
        breakComplete: 600,
        milestone: 1000
      }
      
      oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    } catch (error) {
      console.log('Could not play sound:', error)
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    localStorage.setItem('focus-sound-enabled', this.soundEnabled.toString())
    return this.soundEnabled
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled
    localStorage.setItem('focus-sound-enabled', enabled.toString())
  }

  isSoundEnabled() {
    return this.soundEnabled
  }
}

export function useTaskFocus() {
  const { tasks: allTasks, updateTask, updateSampleTaskDates } = useTaskStore()
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [loading] = useState(false) // No loading needed for local storage
  const [soundManager] = useState(() => new SoundManager())
  const [soundEnabled, setSoundEnabled] = useState(() => soundManager.isSoundEnabled())
  const [columnsExist] = useState(true) // Always true for local storage

  // Get today's tasks for focus sessions - same filtering as tasks page
  const today = getIndianDate()
  
  const tasks = allTasks.filter(task => {
    // Must not be completed and must have estimated hours for focus work
    if (task.status === 'completed' || !task.estimated_hours || task.estimated_hours <= 0) {
      return false
    }
    
    // Date filter - same logic as task manager
    const taskDate = task.scheduled_date || task.due_date || task.created_at
    const taskDateOnly = new Date(taskDate).toISOString().split('T')[0]
    
    // Only show tasks for today's date
    return taskDateOnly === today
  })

  // Load progress from localStorage
  const loadProgressFromLocalStorage = useCallback((taskId: string) => {
    try {
      const key = `task_progress_${taskId}`
      const saved = localStorage.getItem(key)
      if (saved) {
        const data = JSON.parse(saved)
        console.log('Loaded progress from localStorage:', data)
        return data
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
    }
    return null
  }, [])

  // Start focus session for a task
  const startTaskFocus = useCallback((task: Task) => {
    console.log('Starting focus session for task:', task.title, 'Estimated hours:', task.estimated_hours)
    
    if (!task.estimated_hours) {
      console.warn('Task has no estimated hours, cannot start focus session')
      return
    }

    // Check if there's existing session data in localStorage
    const localData = loadProgressFromLocalStorage(task.id)
    let sessionData: FocusSessionData

    if (localData) {
      console.log('Restored session from localStorage:', localData)
      sessionData = localData
      setTimeLeft(sessionData.timeLeft)
      setTotalTime(sessionData.totalTime)
    } else {
      // Create new session
      const totalSeconds = task.estimated_hours * 60 * 60
      console.log('Creating new session with', totalSeconds, 'seconds')
      sessionData = {
        timeLeft: totalSeconds,
        totalTime: totalSeconds,
        isActive: false,
        startedAt: null,
        pausedAt: null
      }
      setTimeLeft(totalSeconds)
      setTotalTime(totalSeconds)
    }

    setCurrentTask(task)
    setIsActive(false)
    console.log('Focus session initialized for task:', task.title)
  }, [loadProgressFromLocalStorage])

  // Save progress to localStorage
  const saveProgressToLocalStorage = useCallback((sessionData: FocusSessionData) => {
    if (!currentTask) return
    
    try {
      const key = `task_progress_${currentTask.id}`
      localStorage.setItem(key, JSON.stringify({
        ...sessionData,
        savedAt: new Date().toISOString()
      }))
      console.log('Progress saved to localStorage:', timeLeft, 'seconds left')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [currentTask, timeLeft])

  // Save current progress
  const saveProgress = useCallback(() => {
    if (!currentTask) return

    const now = new Date().toISOString()
    const sessionData: FocusSessionData = {
      timeLeft,
      totalTime,
      isActive,
      startedAt: now,
      pausedAt: isActive ? null : now
    }

    saveProgressToLocalStorage(sessionData)
  }, [currentTask, isActive, timeLeft, totalTime, saveProgressToLocalStorage])

  // Toggle timer
  const toggleTimer = useCallback(() => {
    if (!currentTask) {
      console.log('No current task to toggle timer for')
      return
    }

    const newIsActive = !isActive
    console.log('Toggling timer:', isActive ? 'pausing' : 'starting')
    setIsActive(newIsActive)

    const now = new Date().toISOString()
    const sessionData: FocusSessionData = {
      timeLeft,
      totalTime,
      isActive: newIsActive,
      startedAt: newIsActive ? now : now,
      pausedAt: newIsActive ? null : now
    }

    // Save to localStorage
    saveProgressToLocalStorage(sessionData)
  }, [currentTask, isActive, timeLeft, totalTime, saveProgressToLocalStorage])

  // Reset timer
  const resetTimer = useCallback(() => {
    if (!currentTask?.estimated_hours) return

    const totalSeconds = currentTask.estimated_hours * 60 * 60
    setTimeLeft(totalSeconds)
    setTotalTime(totalSeconds)
    setIsActive(false)

    const sessionData: FocusSessionData = {
      timeLeft: totalSeconds,
      totalTime: totalSeconds,
      isActive: false,
      startedAt: null,
      pausedAt: null
    }

    saveProgressToLocalStorage(sessionData)
    console.log('Timer reset successfully')
  }, [currentTask, saveProgressToLocalStorage])

  // Complete task when timer finishes
  const completeTask = useCallback((taskId: string) => {
    try {
      // Update task status to completed
      updateTask(taskId, { status: 'completed' })

      console.log('Task completed:', taskId)

      // Clean up localStorage
      try {
        localStorage.removeItem(`task_progress_${taskId}`)
      } catch (e) {
        console.log('Could not clean localStorage:', e)
      }

      // Play completion sound
      soundManager.playSound('focusComplete')

      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Completed! 🎉', {
          body: `You've completed "${currentTask?.title}"`,
          icon: '/favicon.ico',
        })
      }

      setCurrentTask(null)
      setIsActive(false)
    } catch (error: any) {
      console.error('Error completing task:', error)
    }
  }, [currentTask, soundManager, updateTask])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0 && currentTask) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1
          
          // Save progress every 30 seconds
          if (newTime % 30 === 0) {
            const sessionData: FocusSessionData = {
              timeLeft: newTime,
              totalTime,
              isActive: true,
              startedAt: new Date().toISOString(),
              pausedAt: null
            }
            saveProgressToLocalStorage(sessionData)
          }

          // Complete when timer reaches 0
          if (newTime <= 0) {
            setIsActive(false)
            completeTask(currentTask.id)
            return 0
          }
          
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, currentTask, totalTime, completeTask, saveProgressToLocalStorage])

  // Sound controls
  const toggleSound = useCallback(() => {
    const newSoundState = soundManager.toggleSound()
    setSoundEnabled(newSoundState)
    return newSoundState
  }, [soundManager])

  const playTestSound = useCallback((soundType: 'focusComplete' | 'breakComplete' | 'milestone') => {
    soundManager.playSound(soundType)
  }, [soundManager])

  // Check for task from localStorage on mount and update sample task dates
  useEffect(() => {
    const checkStoredTask = () => {
      // Update sample task dates to current Indian timezone
      updateSampleTaskDates();
      
      const storedTask = localStorage.getItem('focusTask')
      if (storedTask) {
        try {
          const task = JSON.parse(storedTask)
          startTaskFocus(task)
          localStorage.removeItem('focusTask') // Clean up
        } catch (error) {
          console.error('Error parsing stored task:', error)
        }
      }
    }
    
    // Small delay to ensure the hook is ready
    setTimeout(checkStoredTask, 500)
  }, [startTaskFocus, updateSampleTaskDates])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Save progress when component unmounts or user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentTask && isActive) {
        saveProgress()
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden && currentTask && isActive) {
        saveProgress()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      // Save progress on cleanup
      if (currentTask) {
        saveProgress()
      }
    }
  }, [currentTask, isActive, saveProgress])

  return {
    tasks,
    currentTask,
    timeLeft,
    totalTime,
    isActive,
    loading,
    soundEnabled,
    columnsExist,
    startTaskFocus,
    toggleTimer,
    resetTimer,
    completeTask,
    toggleSound,
    playTestSound,
    fetchTodaysTasks: () => {}, // No-op for local storage
    saveProgress,
    setCurrentTask: (task: Task | null) => setCurrentTask(task)
  }
}