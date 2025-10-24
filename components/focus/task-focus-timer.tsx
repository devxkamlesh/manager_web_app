"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { Card, CardContent } from "@/components/ui/layout/card"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  CheckCircle2,
  X,
  Clock,
  Target
} from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { type Task } from "@/lib/task-store"

interface TaskFocusTimerProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (taskId: string) => void
}

export function TaskFocusTimer({ task, open, onOpenChange, onComplete }: TaskFocusTimerProps) {
  const { toast } = useToast()
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Initialize timer when task changes
  useEffect(() => {
    if (task?.estimated_hours) {
      const seconds = task.estimated_hours * 60 * 60 // Convert hours to seconds
      setTimeLeft(seconds)
      setTotalTime(seconds)
      setIsActive(false)
      setIsCompleted(false)
    }
  }, [task])

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          const newTime = timeLeft - 1
          if (newTime <= 0) {
            setIsActive(false)
            setIsCompleted(true)
            
            // Show completion notification
            toast({
              title: "🎉 Timer Complete!",
              description: `You've completed the focus session for "${task?.title}"`,
            })
            
            // Play completion sound if available
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus Timer Complete!', {
                body: `Task: ${task?.title}`,
                icon: '/favicon.ico',
              })
            }
            
            return 0
          }
          return newTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, task?.title, toast])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(totalTime)
    setIsCompleted(false)
  }

  const handleComplete = () => {
    if (task) {
      onComplete(task.id)
      toast({
        title: "✅ Task Completed!",
        description: `"${task.title}" has been marked as completed.`,
      })
    }
  }

  const handleClose = () => {
    if (isActive) {
      // Warn user about closing active timer
      if (window.confirm("Timer is still running. Are you sure you want to close?")) {
        setIsActive(false)
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  if (!task) return null

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0
  const hoursLeft = Math.floor(timeLeft / 3600)
  const minutesLeft = Math.floor((timeLeft % 3600) / 60)
  const secondsLeft = timeLeft % 60

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Timer className="w-6 h-6 text-blue-600" />
            Focus Timer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {task.estimated_hours}h estimated
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {task.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className={isCompleted ? "text-green-500" : "text-primary"}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">
                  {hoursLeft > 0 ? `${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}` : `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isCompleted ? 'Complete!' : isActive ? 'Focus Time' : 'Ready to Start'}
                </div>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!isCompleted ? (
              <>
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  className="px-6"
                  disabled={timeLeft === 0}
                >
                  {isActive ? (
                    <Pause className="w-5 h-5 mr-2" />
                  ) : (
                    <Play className="w-5 h-5 mr-2" />
                  )}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </>
            ) : (
              <Button
                onClick={handleComplete}
                size="lg"
                className="px-8 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Complete Task
              </Button>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-muted-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Close Timer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}