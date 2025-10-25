'use client'

import { useState, useRef, useEffect } from 'react'
import { TaskManager } from '@/components/tasks/task-manager'
import { Sidebar } from '@/components/layout/sidebar'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  List, 
  Grid3X3, 
  Columns3,
  Search,
  Calendar,
  CalendarDays,
  Clock,
  Target
} from 'lucide-react'
import { useThemeStore } from '@/lib/theme-store'
import { getIndianDate } from '@/lib/utils'
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/navigation/dropdown-menu'

export default function TasksPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    setSelectedDate(getIndianDate())
  }, [])
  const { color: themeColor } = useThemeStore()
  const taskManagerRef = useRef<{ 
    refreshTasks: () => void; 
    setFilter: (filter: string) => void;
    setViewMode: (mode: 'list' | 'board' | 'grid') => void;
    setSearchQuery: (query: string) => void;
  }>(null)

  return (
    <div className="flex h-screen">
      <Sidebar activeView="tasks" />
      
      <div className="flex-1 flex flex-col">
        {/* Simple Header */}
        <header className="border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">My Tasks</h1>
                <p className="text-muted-foreground">Get things done</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-6">
            {isClient ? (
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48 pl-10"
                  lang="hi-IN"
                />
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg w-48">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Loading...</span>
              </div>
            )}
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  taskManagerRef.current?.setSearchQuery(e.target.value)
                }}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setFilter('all')}>
                  All Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setFilter('todo')}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setFilter('in_progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setFilter('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <List className="w-4 h-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setViewMode('list')}>
                  <List className="w-4 h-4 mr-2" />
                  List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setViewMode('board')}>
                  <Columns3 className="w-4 h-4 mr-2" />
                  Board
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => taskManagerRef.current?.setViewMode('grid')}>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <TaskManager 
            ref={taskManagerRef} 
            selectedDate={selectedDate}
            onCreateTask={() => setShowCreateDialog(true)}
          />
        </main>
      </div>

      <CreateTaskDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onTaskCreated={() => {
          taskManagerRef.current?.refreshTasks()
        }}
      />
    </div>
  )
}