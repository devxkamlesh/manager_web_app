"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { Progress } from "@/components/ui/feedback/progress"
import { 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2,
  Calendar,
  Activity,
  Plus,
  ArrowRight,
  BarChart3,
  Zap,
  Trophy,
  Sparkles
} from "lucide-react"
import { useTaskStore } from "@/lib/task-store"
import { useProjectStore } from "@/lib/project-store"
import { formatTimeAgo } from "@/lib/utils"

export function Overview() {
  const { tasks } = useTaskStore()
  const { projects } = useProjectStore()
  const [streakData, setStreakData] = useState({ current: 0, best: 0 })

  useEffect(() => {
    // Load streak data from localStorage
    const stored = localStorage.getItem('devflow-streak-data')
    if (stored) {
      const data = JSON.parse(stored)
      setStreakData({
        current: data.currentStreak || 0,
        best: data.longestStreak || 0
      })
    }
  }, [])

  // Get today's date
  const today = new Date().toISOString().split('T')[0]
  
  // Filter tasks for today
  const todayTasks = tasks.filter(task => {
    const taskDate = task.scheduled_date || task.due_date || task.created_at
    const taskDateOnly = new Date(taskDate).toISOString().split('T')[0]
    return taskDateOnly === today
  })

  const completedToday = todayTasks.filter(t => t.status === 'completed').length
  const totalToday = todayTasks.length
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0

  // Calculate total focus time (estimated hours from tasks)
  const totalFocusTime = tasks
    .filter(t => t.status === 'completed' && t.estimated_hours)
    .reduce((sum, t) => sum + (t.estimated_hours || 0), 0)

  // Calculate productivity score based on completion rate and streak
  const productivityScore = Math.min(100, Math.round((completionRate * 0.6) + (streakData.current * 2)))

  const stats = [
    {
      title: "Tasks Completed",
      value: `${completedToday}/${totalToday}`,
      subtitle: "tasks today",
      change: `${completionRate}%`,
      icon: CheckCircle2,
      progress: completionRate,
      color: "text-green-600"
    },
    {
      title: "Focus Time",
      value: `${totalFocusTime.toFixed(1)}h`,
      subtitle: "total tracked",
      change: `${tasks.filter(t => t.estimated_hours).length} tasks`,
      icon: Clock,
      progress: Math.min(100, (totalFocusTime / 40) * 100),
      color: "text-blue-600"
    },
    {
      title: "Current Streak",
      value: `${streakData.current} days`,
      subtitle: streakData.current > 0 ? "keep it up!" : "start your journey",
      change: `Best: ${streakData.best}`,
      icon: Target,
      progress: Math.min(100, (streakData.current / 30) * 100),
      color: "text-orange-600"
    },
    {
      title: "Productivity Score",
      value: `${productivityScore}%`,
      subtitle: productivityScore > 70 ? "excellent!" : "keep going",
      change: `${projects.filter(p => p.status === 'active').length} active projects`,
      icon: TrendingUp,
      progress: productivityScore,
      color: "text-purple-600"
    }
  ]

  // Get recent activity from tasks
  const recentActivity = tasks
    .slice(-5)
    .reverse()
    .map(task => ({
      action: task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'Started' : 'Created',
      item: task.title,
      time: formatTimeAgo(new Date(task.updated_at)),
      type: task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'info' : 'create'
    }))

  // Get upcoming tasks (todo and in_progress, sorted by due date)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5)
    .map(task => {
      const project = projects.find(p => p.id === task.project_id)
      return {
        title: task.title,
        priority: task.priority,
        due: formatTimeAgo(new Date(task.due_date!)),
        project: project?.name || 'No Project'
      }
    })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'info': return <Clock className="w-4 h-4 text-blue-600" />
      case 'create': return <Plus className="w-4 h-4 text-purple-600" />
      case 'achievement': return <Trophy className="w-4 h-4 text-yellow-600" />
      default: return <Activity className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to make today productive? Here&apos;s your overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Dynamic badges will be added here based on real user data */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-card to-card/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-xs bg-muted/50 border-muted">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-semibold text-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className="relative">
                    <Progress value={stat.progress} className="h-3 bg-muted/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              Recent Activity
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length > 0 ? (
              <>
                {recentActivity.map((activity, index) => (
                  <div key={index} className="group flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-background/80 to-background/60 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                    <div className="mt-0.5 p-2 bg-muted/50 rounded-lg group-hover:bg-primary/10 transition-colors">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">{activity.action}:</span>{" "}
                        <span className="text-foreground group-hover:text-primary transition-colors">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 bg-muted/30 px-2 py-1 rounded-full inline-block">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4 hover:bg-primary/5 hover:text-primary">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary/60" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Your journey starts here</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete tasks and track your progress to see activity updates
                </p>
                <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary">
                  <Target className="w-4 h-4 mr-2" />
                  Start Working
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Upcoming Tasks
              <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
                Today
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              <>
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-r from-background/80 to-background/60 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    {/* Priority indicator */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      task.priority === 'high' ? 'bg-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`} />
                    
                    <div className="ml-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                        <Badge 
                          variant="outline"
                          className={`text-xs ml-2 shrink-0 ${
                            task.priority === 'high' ? 'border-red-200 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-300 dark:bg-red-950/30' :
                            task.priority === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50 dark:border-yellow-800 dark:text-yellow-300 dark:bg-yellow-950/30' :
                            'border-green-200 text-green-700 bg-green-50 dark:border-green-800 dark:text-green-300 dark:bg-green-950/30'
                          }`}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{task.due}</span>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          {task.project}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4 hover:bg-primary/5 hover:text-primary">
                  View All Tasks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-primary/60" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first task and start building productive habits
                </p>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-3 hover:bg-primary/5">
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">New Task</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover:bg-primary/5">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-medium">Start Timer</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover:bg-primary/5">
              <Target className="w-6 h-6" />
              <span className="text-sm font-medium">Set Goal</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-3 hover:bg-primary/5">
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm font-medium">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}