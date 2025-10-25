"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { useSupabaseAuth } from "@/components/auth/supabase-auth-provider"
import { TaskManager } from "@/components/tasks/task-manager"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { StreakTracker } from "@/components/misc/streak-tracker"
import { ProjectOverview } from "@/components/projects/project-overview"
import { Analytics } from "@/components/dashboard/analytics"
import { Overview } from "@/components/dashboard/overview"
import { ThemeSettings } from "@/components/settings/theme-settings"
import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { 
  Bell, 
  Search, 
  Plus,
  Calendar,
  User
} from "lucide-react"

export function Dashboard() {
  const { user } = useSupabaseAuth()
  const [activeView, setActiveView] = useState('overview')
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false)

  const handleNewButtonClick = () => {
    switch (activeView) {
      case 'tasks':
        setShowCreateTaskDialog(true)
        break
      case 'projects':
        // TODO: Add project creation dialog
        console.log('Create new project')
        break
      case 'overview':
        // Default to creating a task
        setShowCreateTaskDialog(true)
        break
      default:
        setShowCreateTaskDialog(true)
        break
    }
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview />
      case 'tasks':
        return <TaskManager />
      case 'projects':
        return <ProjectOverview />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <ThemeSettings />
      default:
        return <Overview />
    }
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                {activeView === 'overview' && 'Dashboard'}
                {activeView === 'tasks' && 'Task Management'}
                {activeView === 'projects' && 'Projects'}
                {activeView === 'analytics' && 'Analytics'}
                {activeView === 'settings' && 'Settings'}
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <Calendar className="w-3 h-3 mr-1" />
                Today
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button size="sm" onClick={handleNewButtonClick}>
                <Plus className="w-4 h-4 mr-2" />
                {activeView === 'tasks' ? 'New Task' : 
                 activeView === 'projects' ? 'New Project' : 
                 'New Task'}
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-destructive" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Primary Content */}
            <div className="space-y-6">
              {renderActiveView()}
            </div>
            
            {/* Bottom Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
              {/* Streak Tracker */}
              <Card>
                <CardContent className="p-0">
                  <StreakTracker />
                </CardContent>
              </Card>
              
              {/* Quick Stats Widget */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Today&apos;s Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Tasks Completed</span>
                      <span className="font-medium">-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Focus Time</span>
                      <span className="font-medium">0h 0m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Productivity</span>
                      <Badge variant="secondary">-</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions Widget */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline" onClick={() => setShowCreateTaskDialog(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Task
                    </Button>
                    <Button className="w-full justify-start" variant="outline" onClick={() => window.open('/dashboard/focus', '_blank')}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Start Focus Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Create Task Dialog */}
      <CreateTaskDialog 
        open={showCreateTaskDialog} 
        onOpenChange={setShowCreateTaskDialog}
        onTaskCreated={() => {
          // Refresh tasks if we're on the tasks view
          if (activeView === 'tasks') {
            window.location.reload() // Simple refresh for now
          }
        }}
      />
    </div>
  )
}