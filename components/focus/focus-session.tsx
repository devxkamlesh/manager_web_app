'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Sidebar } from "@/components/layout/sidebar"
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Timer,
  Settings,
  Clock,
  Target,
  Zap,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Flag,
  CheckCircle2,
  TrendingUp,
  Focus,
  Brain,
  Grid3X3,
  Calendar
} from "lucide-react"
import { formatDuration } from "@/lib/utils"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useTaskFocus } from "@/hooks/use-task-focus"

import { cn } from "@/lib/utils"

export function FocusSession() {
  const [isClient, setIsClient] = useState(false)



  useEffect(() => {
    setIsClient(true)
  }, [])

  // Pomodoro timer for general sessions
  const {
    timeLeft: pomodoroTimeLeft,
    isActive: pomodoroIsActive,
    isBreak,
    sessions,
    toggleTimer: togglePomodoroTimer,
    resetTimer: resetPomodoroTimer,
    setCustomTime,
    focusTime,
    shortBreakTime,
    longBreakTime,
    soundEnabled: pomodoroSoundEnabled,
    toggleSound: togglePomodoroSound,
    playTestSound: playPomodoroTestSound
  } = usePomodoro()

  // Task-based focus sessions
  const {
    tasks,
    currentTask,
    timeLeft: taskTimeLeft,
    totalTime: taskTotalTime,
    isActive: taskIsActive,
    soundEnabled: taskSoundEnabled,
    startTaskFocus,
    toggleTimer: toggleTaskTimer,
    resetTimer: resetTaskTimer,
    toggleSound: toggleTaskSound,
    playTestSound: playTaskTestSound
  } = useTaskFocus()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [customFocusTime, setCustomFocusTime] = useState(focusTime)
  const [customBreakTime, setCustomBreakTime] = useState(shortBreakTime)
  const [customLongBreakTime, setCustomLongBreakTime] = useState(longBreakTime)
  const [focusMode, setFocusMode] = useState<'pomodoro' | 'task'>('task')


  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Use appropriate values based on focus mode
  const timeLeft = focusMode === 'task' ? taskTimeLeft : pomodoroTimeLeft
  const isActive = focusMode === 'task' ? taskIsActive : pomodoroIsActive
  const soundEnabled = focusMode === 'task' ? taskSoundEnabled : pomodoroSoundEnabled
  const toggleTimer = focusMode === 'task' ? toggleTaskTimer : togglePomodoroTimer
  const resetTimer = focusMode === 'task' ? resetTaskTimer : resetPomodoroTimer
  const toggleSound = focusMode === 'task' ? toggleTaskSound : togglePomodoroSound
  const playTestSound = focusMode === 'task' ? playTaskTestSound : playPomodoroTestSound

  const progress = focusMode === 'task' && currentTask
    ? ((taskTotalTime - timeLeft) / taskTotalTime) * 100
    : isBreak
      ? ((sessions % 4 === 0 ? customLongBreakTime * 60 : customBreakTime * 60) - timeLeft) / (sessions % 4 === 0 ? customLongBreakTime * 60 : customBreakTime * 60) * 100
      : (customFocusTime * 60 - timeLeft) / (customFocusTime * 60) * 100

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }

  const applyCustomSettings = () => {
    setCustomTime(customFocusTime, customBreakTime, customLongBreakTime)
    setShowSettings(false)
  }



  // Fullscreen Mode with Animated Grid Background
  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">


        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

        {/* Main Content Grid */}
        <div className="relative z-10 min-h-screen grid grid-rows-[auto_1fr_auto] p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {focusMode === 'task' && currentTask ? currentTask.title : `Session ${sessions + 1}`}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {focusMode === 'task' ? 'Task Focus Mode' : 'Pomodoro Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSound}
                className={soundEnabled ? "text-primary" : "text-muted-foreground"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Minimize className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex items-center justify-center">
            <div className="text-center space-y-12 max-w-2xl">

              {/* Large Timer Display */}
              <div className="relative">
                <div className="w-80 h-80 mx-auto relative">
                  <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="1"
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
                      strokeLinecap="round"
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold mb-3 text-foreground">
                      {formatDuration(timeLeft)}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {focusMode === 'task'
                        ? (currentTask ? 'Deep Focus' : 'Select Task')
                        : isBreak ? 'Break Time' : 'Focus Time'
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(progress)}% Complete
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{sessions}</div>
                  <div className="text-sm text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.floor(sessions * customFocusTime / 60)}h
                  </div>
                  <div className="text-sm text-muted-foreground">Focus Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.floor(sessions / 4)}
                  </div>
                  <div className="text-sm text-muted-foreground">Breaks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-center gap-6 mt-8">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="px-8 py-4 text-lg"
              disabled={focusMode === 'task' && !currentTask}
            >
              {isActive ? <Pause className="w-6 h-6 mr-3" /> : <Play className="w-6 h-6 mr-3" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
              disabled={focusMode === 'task' && !currentTask}
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Fullscreen Settings Panel */}
        {showSettings && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-8">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Focus Settings
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Settings - Only show for Pomodoro mode */}
                {focusMode === 'pomodoro' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Timer Durations</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Focus (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="120"
                          value={customFocusTime}
                          onChange={(e) => setCustomFocusTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Short Break</Label>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={customBreakTime}
                          onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Long Break</Label>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={customLongBreakTime}
                          onChange={(e) => setCustomLongBreakTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Focus Info - Show for Task mode */}
                {focusMode === 'task' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Task Focus Mode</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        In Task Focus mode, timer duration is determined by the estimated hours of your selected task.
                        Select a task from the list below to start a focused work session.
                      </p>
                      {currentTask && (
                        <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">Current Task: {currentTask.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {currentTask.estimated_hours}h ({formatDuration(taskTotalTime)} total)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}



                {/* Sound Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Sound Settings</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {soundEnabled ? (
                        <Volume2 className="w-5 h-5 text-primary" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <Label>Sound Notifications</Label>
                        <p className="text-xs text-muted-foreground">Play sounds when sessions complete</p>
                      </div>
                    </div>
                    <Button
                      variant={soundEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={toggleSound}
                    >
                      {soundEnabled ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  {soundEnabled && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playTestSound('focusComplete')}
                      >
                        Test Sound
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={applyCustomSettings}>
                    Apply Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  // Main Interface
  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Static Grid Background for Main Interface */}
      {isClient && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      )}

      <Sidebar activeView="focus" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Professional Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Focus Session</h1>
                <p className="text-xs text-muted-foreground">Deep work & productivity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSound}
                className={soundEnabled ? "text-primary" : "text-muted-foreground"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Focus Mode Toggle */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Focus className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">Focus Mode</h3>
                      <p className="text-sm text-muted-foreground">Choose between task-based sessions or Pomodoro technique</p>
                    </div>
                  </div>
                  <div className="flex gap-1 p-1 bg-muted rounded-lg">
                    <Button
                      variant={focusMode === 'task' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFocusMode('task')}
                      className="px-4"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Task Focus
                    </Button>
                    <Button
                      variant={focusMode === 'pomodoro' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFocusMode('pomodoro')}
                      className="px-4"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Pomodoro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Timer Section */}
              <div className="lg:col-span-2 space-y-6">

                {/* Timer Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {focusMode === 'task' ? (
                          <Target className="w-6 h-6 text-primary" />
                        ) : isBreak ? (
                          <Coffee className="w-6 h-6 text-primary" />
                        ) : (
                          <Timer className="w-6 h-6 text-primary" />
                        )}
                        <span>
                          {focusMode === 'task'
                            ? (currentTask ? currentTask.title : 'Select a Task')
                            : isBreak ? 'Break Time' : 'Focus Session'
                          }
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {focusMode === 'task'
                          ? (currentTask?.estimated_hours ? `${currentTask.estimated_hours}h` : 'No time')
                          : `${customFocusTime}m`
                        }
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">

                    {/* Circular Timer Display */}
                    <div className="flex justify-center">
                      <div className="relative w-72 h-72">
                        <svg className="w-72 h-72 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-muted"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 42}`}
                            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="text-primary transition-all duration-1000"
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-4xl font-bold mb-2">
                            {formatDuration(timeLeft)}
                          </div>
                          <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                            {focusMode === 'task'
                              ? (currentTask ? 'Deep Focus' : 'Select Task')
                              : isBreak ? 'Break Time' : 'Focus Time'
                            }
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(progress)}% Complete
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={toggleTimer}
                        size="lg"
                        className="px-6 py-3"
                        disabled={focusMode === 'task' && !currentTask}
                      >
                        {isActive ? (
                          <Pause className="w-5 h-5 mr-2" />
                        ) : (
                          <Play className="w-5 h-5 mr-2" />
                        )}
                        {focusMode === 'task' && !currentTask
                          ? 'Select a Task First'
                          : isActive ? 'Pause' : 'Start'
                        }
                      </Button>

                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        size="lg"
                        className="px-6 py-3"
                        disabled={focusMode === 'task' && !currentTask}
                      >
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Session Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Task Selection (only show in task mode) */}
                {focusMode === 'task' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          Available Tasks
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium" key={isClient ? 'client' : 'server'}>
                            {isClient ? (() => {
                              const now = new Date();
                              const indianDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                              return indianDate.toLocaleDateString('en-IN', { 
                                weekday: 'short', 
                                day: 'numeric', 
                                month: 'short',
                                timeZone: 'Asia/Kolkata'
                              });
                            })() : 'Today'}
                          </span>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tasks.length > 0 ? (
                        <div className="grid gap-4">
                          {tasks.map((task) => (
                            <div
                              key={task.id}
                              className={cn(
                                "p-4 rounded-lg cursor-pointer transition-all",
                                currentTask?.id === task.id
                                  ? "bg-primary/10 border-2 border-primary"
                                  : "bg-muted/50 hover:bg-muted border border-border"
                              )}
                              onClick={() => startTaskFocus(task)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-lg">{task.title}</h4>
                                    <Badge variant={getPriorityColor(task.priority)}>
                                      <Flag className="w-3 h-3 mr-1" />
                                      {task.priority}
                                    </Badge>
                                    {task.estimated_hours && (
                                      <Badge variant="secondary">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {task.estimated_hours}h
                                      </Badge>
                                    )}
                                  </div>
                                  {task.description && (
                                    <p className="text-muted-foreground">{task.description}</p>
                                  )}
                                </div>
                                <div className="ml-4">
                                  {currentTask?.id === task.id ? (
                                    <Badge>Selected</Badge>
                                  ) : (
                                    <Button variant="outline" size="sm">
                                      <Play className="w-4 h-4 mr-1" />
                                      Focus
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Tasks Available</h3>
                          <p className="text-muted-foreground">
                            Create tasks with estimated hours to use task-based focus sessions
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">

                {/* Session Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Today's Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{sessions}</div>
                        <div className="text-sm text-muted-foreground">Sessions</div>
                      </div>
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {Math.floor(sessions * customFocusTime / 60)}h
                        </div>
                        <div className="text-sm text-muted-foreground">Focus Time</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Next Break</span>
                        <span className="font-medium">
                          {sessions % 4 === 0 ? `Long (${customLongBreakTime}m)` : `${4 - (sessions % 4)} sessions`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Status</span>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Quick Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {/* Show timer settings only for Pomodoro mode */}
                      {focusMode === 'pomodoro' ? (
                        <>
                          <div>
                            <Label className="text-sm">Focus Duration</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="number"
                                min="1"
                                max="120"
                                value={customFocusTime}
                                onChange={(e) => setCustomFocusTime(Number(e.target.value))}
                                className="text-center"
                              />
                              <span className="text-sm text-muted-foreground self-center">min</span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Break Duration</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                type="number"
                                min="1"
                                max="30"
                                value={customBreakTime}
                                onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                                className="text-center"
                              />
                              <span className="text-sm text-muted-foreground self-center">min</span>
                            </div>
                          </div>

                          <Button onClick={applyCustomSettings} className="w-full">
                            Apply Timer Settings
                          </Button>
                        </>
                      ) : (
                        /* Task Focus mode info */
                        <div className="text-center py-4">
                          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                          <h4 className="font-medium mb-1">Task Focus Mode</h4>
                          <p className="text-xs text-muted-foreground mb-3">
                            Timer duration is set by your task's estimated hours
                          </p>
                          {currentTask ? (
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <p className="text-sm font-medium">{currentTask.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {currentTask.estimated_hours}h estimated
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              Select a task to start focusing
                            </p>
                          )}
                        </div>
                      )}

                      {/* Sound and Animation controls - always visible */}
                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm">Sound</Label>
                            <p className="text-xs text-muted-foreground">Completion notifications</p>
                          </div>
                          <Button
                            variant={soundEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={toggleSound}
                          >
                            {soundEnabled ? 'On' : 'Off'}
                          </Button>
                        </div>


                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Focus Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-orange-600" />
                      Focus Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <p>Eliminate all distractions before starting</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <p>Focus on one task at a time</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <p>Take breaks seriously - they help maintain focus</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <p>Stay hydrated and maintain good posture</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Main Interface Settings Panel */}
        {showSettings && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Focus Settings
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Settings - Only show for Pomodoro mode */}
                {focusMode === 'pomodoro' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Timer Durations</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>Focus Duration (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="120"
                          value={customFocusTime}
                          onChange={(e) => setCustomFocusTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Short Break (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="30"
                          value={customBreakTime}
                          onChange={(e) => setCustomBreakTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Long Break (minutes)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="60"
                          value={customLongBreakTime}
                          onChange={(e) => setCustomLongBreakTime(Number(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Task Focus Info - Show for Task mode */}
                {focusMode === 'task' && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Task Focus Mode</h4>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        In Task Focus mode, timer duration is determined by the estimated hours of your selected task.
                        Select a task from the list to start a focused work session.
                      </p>
                      {currentTask && (
                        <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm font-medium">Current Task: {currentTask.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Duration: {currentTask.estimated_hours}h ({formatDuration(taskTotalTime)} total)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sound Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Sound Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {soundEnabled ? (
                          <Volume2 className="w-5 h-5 text-primary" />
                        ) : (
                          <VolumeX className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                          <Label>Sound Notifications</Label>
                          <p className="text-xs text-muted-foreground">Play sounds when sessions complete</p>
                        </div>
                      </div>
                      <Button
                        variant={soundEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={toggleSound}
                      >
                        {soundEnabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>

                    {soundEnabled && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playTestSound('focusComplete')}
                        >
                          Test Sound
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  {focusMode === 'pomodoro' && (
                    <Button onClick={applyCustomSettings}>
                      Apply Settings
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}