'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card'
import { Button } from '@/components/ui/forms/button'
import { Badge } from '@/components/ui/display/badge'
import { Progress } from '@/components/ui/feedback/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/layout/tabs'
import { useThemeStore } from '@/lib/theme-store'
import { 
  Flame, 
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  BarChart3,
  Calendar,
  MousePointer
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StreakData {
  dailyVisits: number
  currentStreak: number
  longestStreak: number
  totalDays: number
  lastVisit: string
  streakHistory: { date: string; visited: boolean }[]
}

export default function StreaksPage() {
  const { color: themeColor } = useThemeStore()
  const [streakData, setStreakData] = useState<StreakData>({
    dailyVisits: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    lastVisit: '',
    streakHistory: []
  })

  const [isLoading, setIsLoading] = useState(true)

  // Get theme-based colors
  const getThemeColors = () => {
    const colors = {
      primary: `hsl(var(--${themeColor}))`,
      primaryBg: `hsl(var(--${themeColor}) / 0.1)`,
      primaryText: `text-${themeColor}-500`,
      primaryBgClass: `bg-${themeColor}-500/10`,
      primaryClass: `text-${themeColor}-500`,
      primaryButton: `bg-${themeColor}-500`
    }
    return colors
  }

  const themeColors = getThemeColors()

  // Auto-count when user opens site
  useEffect(() => {
    const updateStreak = () => {
      const today = new Date().toISOString().split('T')[0]
      const stored = localStorage.getItem('devflow-streak-data')
      
      let data: StreakData = {
        dailyVisits: 1,
        currentStreak: 1,
        longestStreak: 1,
        totalDays: 1,
        lastVisit: today,
        streakHistory: [{ date: today, visited: true }]
      }

      if (stored) {
        const existing = JSON.parse(stored) as StreakData
        const lastVisitDate = existing.lastVisit
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        if (lastVisitDate === today) {
          // Same day - just increment visits
          data = {
            ...existing,
            dailyVisits: existing.dailyVisits + 1
          }
        } else if (lastVisitDate === yesterdayStr) {
          // Consecutive day - continue streak
          data = {
            ...existing,
            dailyVisits: 1,
            currentStreak: existing.currentStreak + 1,
            longestStreak: Math.max(existing.longestStreak, existing.currentStreak + 1),
            totalDays: existing.totalDays + 1,
            lastVisit: today,
            streakHistory: [...existing.streakHistory, { date: today, visited: true }]
          }
        } else {
          // Streak broken - start new
          data = {
            ...existing,
            dailyVisits: 1,
            currentStreak: 1,
            totalDays: existing.totalDays + 1,
            lastVisit: today,
            streakHistory: [...existing.streakHistory, { date: today, visited: true }]
          }
        }
      }

      localStorage.setItem('devflow-streak-data', JSON.stringify(data))
      setStreakData(data)
      setIsLoading(false)
    }

    updateStreak()
  }, [])

  // Calculate analytics
  const getWeeklyData = () => {
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const visited = streakData.streakHistory.some(h => h.date === dateStr && h.visited)
      last7Days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        visited
      })
    }
    return last7Days
  }

  const getMonthlyStats = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    const monthlyVisits = streakData.streakHistory.filter(h => {
      const date = new Date(h.date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             h.visited
    }).length

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const completionRate = (monthlyVisits / daysInMonth) * 100

    return { monthlyVisits, daysInMonth, completionRate }
  }

  const weeklyData = getWeeklyData()
  const monthlyStats = getMonthlyStats()
  const averageVisitsPerDay = streakData.totalDays > 0 ? (streakData.streakHistory.length / streakData.totalDays).toFixed(1) : '0'

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar activeView="streaks" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2 animate-pulse" />
            <p className="text-muted-foreground">Loading your streak...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeView="streaks" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", themeColors.primaryBgClass)}>
                <Flame className={cn("h-5 w-5", themeColors.primaryClass)} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Daily Streak</h1>
                <p className="text-xs text-muted-foreground">Auto-tracked productivity streak</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <MousePointer className="w-3 h-3 mr-1" />
                {streakData.dailyVisits} visits today
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Tabs defaultValue="overview" className="h-full">
            <div className="border-b px-6 pt-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 mt-0">
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Main Streak Card */}
                <Card className="relative overflow-hidden">
                  <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16", 
                    `bg-gradient-to-br from-${themeColor}-500/20 to-${themeColor}-600/20`)} />
                  
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", themeColors.primaryBgClass)}>
                          <Flame className={cn("w-8 h-8", themeColors.primaryClass)} />
                        </div>
                        <div>
                          <CardTitle className="text-2xl">DevFlow Daily Streak</CardTitle>
                          <p className="text-muted-foreground">Automatically tracked when you visit</p>
                        </div>
                      </div>
                      
                      {streakData.currentStreak > 0 && (
                        <div className={cn("flex items-center gap-2 text-white px-4 py-2 rounded-full", themeColors.primaryButton)}>
                          <Flame className="w-5 h-5" />
                          <span className="text-xl font-bold">{streakData.currentStreak}</span>
                          <span className="text-sm">days</span>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Current Streak Display */}
                    <div className="text-center py-8">
                      <div className={cn("text-6xl font-bold mb-2", themeColors.primaryClass)}>
                        {streakData.currentStreak}
                      </div>
                      <p className="text-xl text-muted-foreground mb-4">Current Streak</p>
                      <p className="text-sm text-muted-foreground">
                        {streakData.currentStreak === 0 
                          ? "Start your streak by visiting daily!" 
                          : `Keep it up! Visit tomorrow to reach ${streakData.currentStreak + 1} days`
                        }
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{streakData.longestStreak}</p>
                        <p className="text-sm text-muted-foreground">Longest Streak</p>
                      </div>
                      
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{streakData.totalDays}</p>
                        <p className="text-sm text-muted-foreground">Total Days</p>
                      </div>
                    </div>

                    {/* Weekly Progress */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">This Week</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {weeklyData.map((day, index) => (
                          <div key={index} className="text-center">
                            <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                              day.visited 
                                ? `${themeColors.primaryButton} text-white` 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {day.visited ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6 mt-0">
              <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Analytics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Monthly Visits</p>
                          <p className="text-2xl font-bold">{monthlyStats.monthlyVisits}</p>
                        </div>
                        <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                          <p className="text-2xl font-bold">{monthlyStats.completionRate.toFixed(1)}%</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Streak Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Monthly Progress */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">This Month Progress</h4>
                        <span className="text-sm text-muted-foreground">
                          {monthlyStats.monthlyVisits}/{monthlyStats.daysInMonth} days
                        </span>
                      </div>
                      <Progress value={monthlyStats.completionRate} className="h-3" />
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Recent Activity</h4>
                      <div className="space-y-2">
                        {streakData.streakHistory.slice(-10).reverse().map((entry, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
                            <span className="text-sm">{new Date(entry.date).toLocaleDateString()}</span>
                            <div className="flex items-center gap-2">
                              {entry.visited ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {entry.visited ? 'Visited' : 'Missed'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}