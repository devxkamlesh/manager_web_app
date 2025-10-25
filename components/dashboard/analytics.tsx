"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart
} from "recharts"
import { 
  Clock, Target, TrendingUp, Calendar, BarChart3, Zap, 
  Activity, Users, Award, CheckCircle2, Timer, Flame,
  Brain, Coffee, Moon, Sun, Laptop, BookOpen, Code2,
  GitBranch, Star, Trophy, Gauge, Sparkles
} from "lucide-react"

// Generate realistic data
const generateRealisticData = () => {
  const now = new Date()
  
  // Weekly activity data
  const weeklyData = [
    { day: 'Mon', tasks: 8, hours: 6.5, focus: 85, commits: 12 },
    { day: 'Tue', tasks: 12, hours: 8.2, focus: 92, commits: 18 },
    { day: 'Wed', tasks: 6, hours: 5.1, focus: 78, commits: 8 },
    { day: 'Thu', tasks: 15, hours: 9.3, focus: 96, commits: 22 },
    { day: 'Fri', tasks: 10, hours: 7.8, focus: 88, commits: 15 },
    { day: 'Sat', tasks: 4, hours: 3.2, focus: 65, commits: 5 },
    { day: 'Sun', tasks: 7, hours: 4.5, focus: 72, commits: 9 },
  ]

  // Monthly trend data
  const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    productivity: Math.floor(Math.random() * 40) + 60,
    tasks: Math.floor(Math.random() * 15) + 5,
    hours: Math.random() * 6 + 3,
    mood: Math.floor(Math.random() * 30) + 70
  }))

  // Project distribution
  const projectData = [
    { name: 'Web Development', value: 35, color: '#3b82f6' },
    { name: 'Mobile App', value: 25, color: '#10b981' },
    { name: 'Data Analysis', value: 20, color: '#f59e0b' },
    { name: 'DevOps', value: 12, color: '#ef4444' },
    { name: 'Learning', value: 8, color: '#8b5cf6' }
  ]

  // Task priority distribution
  const priorityData = [
    { priority: 'High', completed: 23, pending: 7, color: '#ef4444' },
    { priority: 'Medium', completed: 45, pending: 12, color: '#f59e0b' },
    { priority: 'Low', completed: 32, pending: 8, color: '#10b981' }
  ]

  // Hourly productivity pattern
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    productivity: i < 6 ? 20 + Math.random() * 10 : 
                 i < 9 ? 40 + Math.random() * 20 :
                 i < 12 ? 70 + Math.random() * 25 :
                 i < 14 ? 60 + Math.random() * 20 :
                 i < 18 ? 80 + Math.random() * 15 :
                 i < 22 ? 65 + Math.random() * 20 : 30 + Math.random() * 15,
    tasks: i < 6 ? Math.random() * 2 : 
           i < 9 ? Math.random() * 4 + 2 :
           i < 18 ? Math.random() * 6 + 3 : Math.random() * 3
  }))

  // Skills radar data
  const skillsData = [
    { skill: 'Frontend', current: 85, target: 95 },
    { skill: 'Backend', current: 78, target: 90 },
    { skill: 'DevOps', current: 65, target: 80 },
    { skill: 'Design', current: 72, target: 85 },
    { skill: 'Testing', current: 68, target: 85 },
    { skill: 'Mobile', current: 60, target: 75 }
  ]

  // Streak data
  const streakData = [
    { type: 'Daily Coding', current: 23, best: 45, icon: '💻' },
    { type: 'Task Completion', current: 12, best: 28, icon: '✅' },
    { type: 'Learning', current: 8, best: 15, icon: '📚' },
    { type: 'Git Commits', current: 18, best: 32, icon: '🔥' }
  ]

  // Performance metrics
  const performanceData = [
    { metric: 'Velocity', value: 87, change: +12, color: '#3b82f6' },
    { metric: 'Quality', value: 94, change: +5, color: '#10b981' },
    { metric: 'Efficiency', value: 82, change: -3, color: '#f59e0b' },
    { metric: 'Innovation', value: 76, change: +8, color: '#8b5cf6' }
  ]

  return {
    weeklyData,
    monthlyData,
    projectData,
    priorityData,
    hourlyData,
    skillsData,
    streakData,
    performanceData,
    stats: {
      totalTasks: 156,
      completedTasks: 142,
      totalHours: 89.5,
      activeProjects: 8,
      avgFocusTime: 2.4,
      productivityScore: 87,
      weeklyGrowth: 12,
      monthlyGoalProgress: 78
    }
  }
}

export function Analytics() {
  const [data, setData] = useState(generateRealisticData())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

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

  const completionRate = Math.round((data.stats.completedTasks / data.stats.totalTasks) * 100)

  return (
    <div className="space-y-8">
      {/* Key Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Productivity Score</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Gauge className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{data.stats.productivityScore}%</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-400">+{data.stats.weeklyGrowth}% this week</span>
            </div>
            <Progress value={data.stats.productivityScore} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Tasks Completed</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{data.stats.completedTasks}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {completionRate}% completion rate
            </p>
            <Progress value={completionRate} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Focus Time</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{data.stats.avgFocusTime}h</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Average per session
            </p>
            <Progress value={(data.stats.avgFocusTime / 4) * 100} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Monthly Goal</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Target className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{data.stats.monthlyGoalProgress}%</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Goal progress
            </p>
            <Progress value={data.stats.monthlyGoalProgress} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Weekly Activity Overview */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Weekly Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar yAxisId="left" dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2. Monthly Productivity Trend */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              30-Day Productivity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.monthlyData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="productivity" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Project Time Distribution */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Project Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.projectData.map((project, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="text-sm text-muted-foreground">{project.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 4. Task Priority Analysis */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Task Priority Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.priorityData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" />
                <YAxis dataKey="priority" type="category" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 5. Hourly Productivity Pattern */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Hourly Productivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.hourlyData.filter((_, i) => i >= 6 && i <= 22)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 6. Skills Development Radar */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-teal-500" />
              Skills Development
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={data.skillsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current" dataKey="current" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                <Radar name="Target" dataKey="target" stroke="#f59e0b" fill="transparent" strokeDasharray="5 5" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 7. Performance Metrics */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.performanceData.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{metric.value}%</span>
                    <span className={`text-xs ${metric.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Streaks and Additional Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 8. Current Streaks */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Current Streaks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {data.streakData.map((streak, index) => (
                <div key={index} className="text-center p-4 bg-gradient-to-br from-muted/50 to-muted/20 rounded-xl border hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-2">{streak.icon}</div>
                  <div className="font-semibold text-sm text-muted-foreground mb-1">{streak.type}</div>
                  <div className="text-2xl font-bold text-primary mb-1">{streak.current}</div>
                  <div className="text-xs text-muted-foreground">Best: {streak.best} days</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 9. Weekly Focus vs Tasks */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-red-500" />
              Focus Score vs Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={data.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area yAxisId="right" type="monotone" dataKey="focus" fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" />
                <Bar yAxisId="left" dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Additional Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 10. Git Activity */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-gray-500" />
              Git Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="commits" fill="#6b7280" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 11. Mood Tracking */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Mood Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.monthlyData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis domain={[60, 100]} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="mood" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 12. Achievement Summary */}
        <Card className="bg-gradient-to-br from-background to-muted/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div className="text-lg">🏆</div>
              <div>
                <div className="text-sm font-medium">Week Warrior</div>
                <div className="text-xs text-muted-foreground">Completed 50+ tasks this week</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div className="text-lg">⚡</div>
              <div>
                <div className="text-sm font-medium">Speed Demon</div>
                <div className="text-xs text-muted-foreground">Fastest task completion time</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div className="text-lg">🎯</div>
              <div>
                <div className="text-sm font-medium">Goal Crusher</div>
                <div className="text-xs text-muted-foreground">Exceeded monthly target</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}