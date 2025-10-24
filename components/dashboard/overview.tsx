"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  Flame,
  Star
} from "lucide-react"

export function Overview() {
  const stats = [
    {
      title: "Tasks Completed",
      value: "0",
      subtitle: "tasks today",
      change: "-",
      icon: CheckCircle2,
      progress: 0,
      color: "text-green-600"
    },
    {
      title: "Focus Time",
      value: "0h",
      subtitle: "deep work sessions",
      change: "-",
      icon: Clock,
      progress: 0,
      color: "text-blue-600"
    },
    {
      title: "Current Streak",
      value: "0 days",
      subtitle: "start your journey",
      change: "-",
      icon: Target,
      progress: 0,
      color: "text-orange-600"
    },
    {
      title: "Productivity Score",
      value: "0%",
      subtitle: "get started",
      change: "-",
      icon: TrendingUp,
      progress: 0,
      color: "text-purple-600"
    }
  ]

  const recentActivity: Array<{
    action: string
    item: string
    time: string
    type: string
  }> = []

  const upcomingTasks: Array<{
    title: string
    priority: string
    due: string
    project: string
  }> = []

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
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    <p className="text-sm font-medium">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
              <Badge variant="secondary" className="ml-auto">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              <>
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className="text-muted-foreground">{activity.action}:</span>{" "}
                        <span className="text-foreground">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Start working on tasks to see your activity here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length > 0 ? (
              <>
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
                      <Badge 
                        variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs ml-2 shrink-0"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{task.due}</p>
                    <p className="text-xs text-muted-foreground">Project: {task.project}</p>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-4">
                  View All Tasks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-muted-foreground mb-2">No Upcoming Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Create tasks to see them here
                </p>
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