"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  Flame,
  Award,
  BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakAnalyticsProps {
  streaks: Array<{
    id: string
    name: string
    type: string
    current_count: number
    best_count: number
    target_days: number
    created_at: string
    is_active: boolean
    completedDates?: string[]
  }>
}

export function StreakAnalytics({ streaks }: StreakAnalyticsProps) {
  // Calculate analytics
  const totalStreaks = streaks.length
  const activeStreaks = streaks.filter(s => s.is_active).length
  const completedStreaks = streaks.filter(s => s.current_count >= s.target_days).length
  const totalDays = streaks.reduce((sum, s) => sum + s.current_count, 0)
  const longestStreak = Math.max(...streaks.map(s => s.best_count), 0)
  const averageStreak = streaks.length > 0 ? Math.round(totalDays / streaks.length) : 0
  
  // Calculate success rate
  const totalTargetDays = streaks.reduce((sum, s) => sum + s.target_days, 0)
  const successRate = totalTargetDays > 0 ? Math.round((totalDays / totalTargetDays) * 100) : 0
  
  // Calculate streak types distribution
  const typeDistribution = streaks.reduce((acc, streak) => {
    acc[streak.type] = (acc[streak.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Calculate weekly performance (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()
  
  const weeklyCompletion = last7Days.map(date => {
    const completedCount = streaks.filter(streak => 
      streak.completedDates?.includes(date)
    ).length
    return {
      date,
      completed: completedCount,
      total: activeStreaks
    }
  })
  
  const weeklyAverage = weeklyCompletion.reduce((sum, day) => 
    sum + (day.total > 0 ? (day.completed / day.total) * 100 : 0), 0
  ) / 7
  
  // Determine trend
  const recentPerformance = weeklyCompletion.slice(-3).reduce((sum, day) => 
    sum + (day.total > 0 ? (day.completed / day.total) * 100 : 0), 0
  ) / 3
  
  const earlierPerformance = weeklyCompletion.slice(0, 3).reduce((sum, day) => 
    sum + (day.total > 0 ? (day.completed / day.total) * 100 : 0), 0
  ) / 3
  
  const trend = recentPerformance > earlierPerformance ? 'up' : 'down'
  const trendPercentage = Math.abs(recentPerformance - earlierPerformance)
  
  const typeColors = {
    coding: 'bg-blue-500',
    learning: 'bg-green-500',
    fitness: 'bg-red-500',
    reading: 'bg-purple-500',
    meditation: 'bg-indigo-500',
    custom: 'bg-gray-500'
  }
  
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{activeStreaks}</p>
                <p className="text-xs text-muted-foreground">Active Streaks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{completedStreaks}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalDays}</p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{successRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {trend === 'up' ? 'Improving' : 'Declining'} by {trendPercentage.toFixed(1)}%
              </span>
            </div>
            <Badge variant={weeklyAverage >= 80 ? "default" : weeklyAverage >= 60 ? "secondary" : "destructive"}>
              {weeklyAverage.toFixed(0)}% avg
            </Badge>
          </div>
          
          <div className="space-y-2">
            {weeklyCompletion.map((day) => {
              const percentage = day.total > 0 ? (day.completed / day.total) * 100 : 0
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
              
              return (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs font-medium w-8">{dayName}</span>
                  <div className="flex-1">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {day.completed}/{day.total}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Streak Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Streak Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(typeDistribution).map(([type, count]) => {
              const percentage = (count / totalStreaks) * 100
              
              return (
                <div key={type} className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", typeColors[type as keyof typeof typeColors] || 'bg-gray-500')} />
                  <span className="text-sm font-medium capitalize flex-1">{type}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                  <div className="w-20">
                    <Progress value={percentage} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-10 text-right">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Personal Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Streak</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{averageStreak}</div>
              <div className="text-sm text-muted-foreground">Average Streak</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.max(...streaks.map(s => s.current_count), 0)}</div>
              <div className="text-sm text-muted-foreground">Current Best</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}