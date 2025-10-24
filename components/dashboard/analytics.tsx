"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Clock, Target, TrendingUp, Calendar, BarChart3, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useSupabaseAuth } from "@/components/supabase-auth-provider"

interface AnalyticsData {
  totalTasks: number
  completedTasks: number
  totalHours: number
  activeProjects: number
  weeklyData: Array<{
    day: string
    tasks: number
    hours: number
  }>
  streakData: Array<{
    type: string
    current: number
    best: number
  }>
}

export function Analytics() {
  const { user } = useSupabaseAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics()
    }
  }, [user?.id])

  const fetchAnalytics = async () => {
    try {
      // Fetch tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)

      // Fetch projects
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)

      // Fetch streaks
      const { data: streaks } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user?.id)

      // Process data
      const totalTasks = tasks?.length || 0
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0
      const totalHours = tasks?.reduce((sum, task) => sum + (task.actual_hours || task.estimated_hours || 0), 0) || 0
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0

      // Generate weekly data (mock for now)
      const weeklyData = [
        { day: 'Mon', tasks: 3, hours: 4.5 },
        { day: 'Tue', tasks: 5, hours: 6.0 },
        { day: 'Wed', tasks: 2, hours: 3.5 },
        { day: 'Thu', tasks: 4, hours: 5.5 },
        { day: 'Fri', tasks: 6, hours: 7.0 },
        { day: 'Sat', tasks: 1, hours: 2.0 },
        { day: 'Sun', tasks: 2, hours: 3.0 },
      ]

      const streakData = streaks?.map(streak => ({
        type: streak.type,
        current: streak.current_count,
        best: streak.best_count
      })) || []

      setAnalytics({
        totalTasks,
        completedTasks,
        totalHours,
        activeProjects,
        weeklyData,
        streakData
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  const completionRate = analytics.totalTasks > 0 
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) 
    : 0

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Tasks</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{analytics.totalTasks}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {analytics.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completion Rate</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{completionRate}%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Hours Tracked</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{analytics.totalHours.toFixed(1)}h</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Total time logged
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Projects</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{analytics.activeProjects}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <div className="p-1 bg-blue-500 rounded">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span>Weekly Activity</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Tasks completed each day</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <div className="p-1 bg-green-500 rounded">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>Hours This Week</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">Time tracked daily</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Streaks Overview */}
      <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-1 bg-orange-500 rounded">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span>Current Streaks</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Keep the momentum going!</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {analytics.streakData.length > 0 ? analytics.streakData.map((streak) => (
              <div key={streak.type} className="text-center p-6 bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl border hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">
                  {streak.type === 'coding' && '💻'}
                  {streak.type === 'learning' && '📚'}
                  {streak.type === 'commits' && '🔥'}
                  {streak.type === 'problems' && '🎯'}
                </div>
                <div className="font-semibold capitalize text-sm text-muted-foreground mb-2">{streak.type}</div>
                <div className="text-3xl font-bold text-primary mb-1">{streak.current}</div>
                <div className="text-xs text-muted-foreground">
                  Best: {streak.best} days
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-medium mb-2">Start Your First Streak!</h3>
                <p className="text-muted-foreground">
                  Complete tasks consistently to build your productivity streaks.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}