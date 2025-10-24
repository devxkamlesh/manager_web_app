"use client"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, RotateCcw, Coffee, Timer } from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { usePomodoro } from "@/hooks/use-pomodoro"

export function PomodoroTimer() {
  const { timeLeft, isActive, isBreak, sessions, toggleTimer, resetTimer } = usePomodoro()

  const progress = isBreak 
    ? ((sessions % 4 === 0 ? 15 * 60 : 5 * 60) - timeLeft) / (sessions % 4 === 0 ? 15 * 60 : 5 * 60) * 100
    : (25 * 60 - timeLeft) / (25 * 60) * 100

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            {isBreak ? (
              <Coffee className="w-5 h-5 text-green-600" />
            ) : (
              <Timer className="w-5 h-5 text-blue-600" />
            )}
            {isBreak ? 'Break Time' : 'Focus Session'}
          </div>
          <Badge variant="secondary" className="text-xs">
            {sessions}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">
            {formatDuration(timeLeft)}
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
        
        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={toggleTimer}
            className="flex-1"
            size="sm"
          >
            {isActive ? (
              <Pause className="w-4 h-4 mr-1" />
            ) : (
              <Play className="w-4 h-4 mr-1" />
            )}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Session Info */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {sessions} sessions today
          </p>
          {sessions > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Next break in {sessions % 4 === 0 ? '4' : 4 - (sessions % 4)} sessions
            </p>
          )}
        </div>
      </CardContent>
    </>
  )
}