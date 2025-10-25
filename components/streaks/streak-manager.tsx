"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { EmptyState } from "@/components/ui/display/empty-state"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/navigation/dropdown-menu"
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  Target, 
  Trophy,
  Code,
  BookOpen,
  GitCommit,
  Dumbbell,
  Coffee,
  Heart,
  Brain,
  Zap,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Play,
  Pause
} from "lucide-react"
import { formatTimeAgo, cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Streak {
  id: string
  name: string
  description?: string
  type: 'coding' | 'learning' | 'fitness' | 'reading' | 'meditation' | 'custom'
  current_count: number
  best_count: number
  target_days: number
  last_activity: string
  created_at: string
  is_active: boolean
}

const streakTypes = [
  { id: 'coding', label: 'Coding', icon: Code, color: 'bg-blue-500' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-500' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-red-500' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: 'bg-purple-500' },
  { id: 'meditation', label: 'Meditation', icon: Brain, color: 'bg-indigo-500' },
  { id: 'custom', label: 'Custom', icon: Target, color: 'bg-gray-500' }
]

export function StreakManager() {
  const { toast } = useToast()
  const [streaks, setStreaks] = useState<Streak[]>([
    {
      id: '1',
      name: 'Daily Coding',
      description: 'Code for at least 1 hour every day',
      type: 'coding',
      current_count: 7,
      best_count: 15,
      target_days: 30,
      last_activity: new Date().toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    },
    {
      id: '2',
      name: 'Morning Workout',
      description: 'Exercise for 30 minutes every morning',
      type: 'fitness',
      current_count: 3,
      best_count: 21,
      target_days: 21,
      last_activity: new Date().toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: true
    },
    {
      id: '3',
      name: 'Daily Reading',
      description: 'Read for 20 minutes before bed',
      type: 'reading',
      current_count: 0,
      best_count: 12,
      target_days: 14,
      last_activity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: false
    }
  ])
  const [loading, setLoading] = useState(false)

  const getStreakIcon = (type: string) => {
    const streakType = streakTypes.find(t => t.id === type)
    if (streakType) {
      const IconComponent = streakType.icon
      return <IconComponent className="w-5 h-5" />
    }
    return <Target className="w-5 h-5" />
  }

  const getStreakColor = (type: string) => {
    const streakType = streakTypes.find(t => t.id === type)
    return streakType?.color || 'bg-gray-500'
  }

  const getStreakEmoji = (count: number) => {
    if (count === 0) return '⭕'
    if (count < 3) return '🔥'
    if (count < 7) return '🚀'
    if (count < 14) return '⚡'
    if (count < 30) return '💎'
    return '👑'
  }

  const handleMarkComplete = (streakId: string) => {
    setStreaks(prev => prev.map(streak => {
      if (streak.id === streakId) {
        const newCount = streak.current_count + 1
        return {
          ...streak,
          current_count: newCount,
          best_count: Math.max(streak.best_count, newCount),
          last_activity: new Date().toISOString(),
          is_active: true
        }
      }
      return streak
    }))
    
    toast({
      title: "🔥 Streak updated!",
      description: "Great job maintaining your streak!"
    })
  }

  const handleToggleActive = (streakId: string) => {
    setStreaks(prev => prev.map(streak => {
      if (streak.id === streakId) {
        return { ...streak, is_active: !streak.is_active }
      }
      return streak
    }))
  }

  const handleDeleteStreak = (streakId: string) => {
    const streak = streaks.find(s => s.id === streakId)
    if (window.confirm(`Are you sure you want to delete "${streak?.name}"? This action cannot be undone.`)) {
      setStreaks(prev => prev.filter(s => s.id !== streakId))
      toast({
        title: "Streak deleted",
        description: "The streak has been removed successfully."
      })
    }
  }

  const totalActiveStreaks = streaks.filter(s => s.is_active).length
  const totalStreakDays = streaks.reduce((sum, s) => sum + s.current_count, 0)
  const longestStreak = Math.max(...streaks.map(s => s.best_count), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your streaks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-500 rounded-xl">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Streaks</p>
                <p className="text-3xl font-bold text-orange-600">{totalActiveStreaks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Days</p>
                <p className="text-3xl font-bold text-blue-600">{totalStreakDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-500 rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Best Streak</p>
                <p className="text-3xl font-bold text-purple-600">{longestStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streaks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Streaks</h2>
        </div>

        {streaks.length === 0 ? (
          <EmptyState
            icon={<Flame className="w-16 h-16 text-orange-500/40" />}
            title="No streaks yet"
            description="Create your first streak to start building consistent habits and tracking your progress."
            className="bg-gradient-to-br from-orange-50/50 via-muted/20 to-muted/10 border-orange-200/40"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {streaks.map((streak) => {
              const progressPercentage = (streak.current_count / streak.target_days) * 100
              const isOverdue = new Date(streak.last_activity) < new Date(Date.now() - 24 * 60 * 60 * 1000)
              
              return (
                <Card key={streak.id} className={cn(
                  "group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden",
                  "bg-gradient-to-br from-card to-card/80 border-0 shadow-lg",
                  !streak.is_active && "opacity-60"
                )}>
                  {/* Status indicator */}
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    streak.is_active ? "bg-gradient-to-r from-green-400 to-green-600" : "bg-gradient-to-r from-gray-400 to-gray-600"
                  )} />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", getStreakColor(streak.type))}>
                          {getStreakIcon(streak.type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold">{streak.name}</CardTitle>
                          {streak.description && (
                            <p className="text-sm text-muted-foreground mt-1">{streak.description}</p>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleActive(streak.id)}>
                            {streak.is_active ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {streak.is_active ? 'Pause Streak' : 'Resume Streak'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteStreak(streak.id)} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Streak
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Current streak display */}
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2">{getStreakEmoji(streak.current_count)}</div>
                      <div className="text-3xl font-bold text-primary">{streak.current_count}</div>
                      <div className="text-sm text-muted-foreground">Current Streak</div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{Math.min(progressPercentage, 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                      <div className="text-xs text-muted-foreground text-center">
                        {streak.current_count} / {streak.target_days} days
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">Best: {streak.best_count}</div>
                        <div className="text-muted-foreground">Personal Record</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatTimeAgo(new Date(streak.last_activity))}</div>
                        <div className="text-muted-foreground">Last Activity</div>
                      </div>
                    </div>

                    {/* Action button */}
                    {streak.is_active && (
                      <Button 
                        onClick={() => handleMarkComplete(streak.id)}
                        className="w-full"
                        disabled={!isOverdue && new Date(streak.last_activity).toDateString() === new Date().toDateString()}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {new Date(streak.last_activity).toDateString() === new Date().toDateString() 
                          ? 'Completed Today!' 
                          : 'Mark Complete'
                        }
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}