"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Plus, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react"
import { EmptyState } from "@/components/ui/display/empty-state"
import { TaskViewDialog } from "@/components/tasks/task-view-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { TaskFocusTimer } from "@/components/focus/task-focus-timer"
import { TaskListView, TaskBoardView, TaskGridView } from "@/components/tasks/task-views"

import { useTaskStore, type Task } from "@/lib/task-store"
import { useToast } from "@/hooks/use-toast"
import { getPriorityColor, getStatusColor, formatTimeAgo, cn } from "@/lib/utils"

// Task interface now imported from task-store

export interface TaskManagerRef {
  refreshTasks: () => void
  setFilter: (filter: 'all' | 'todo' | 'in_progress' | 'completed') => void
  setViewMode: (mode: 'list' | 'board' | 'grid') => void
  setSearchQuery: (query: string) => void
}

interface TaskManagerProps {
  selectedDate?: string
  onCreateTask?: () => void
}

export const TaskManager = forwardRef<TaskManagerRef, TaskManagerProps>(({ selectedDate, onCreateTask }, ref) => {
  const { toast } = useToast()
  const { tasks, updateTask, deleteTask } = useTaskStore()
  const [loading, setLoading] = useState(false) // No loading needed for local storage
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'board' | 'grid'>('list')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskDialog, setShowTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusTask, setFocusTask] = useState<Task | null>(null)
  const [showFocusTimer, setShowFocusTimer] = useState(false)

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    refreshTasks: () => { }, // No need to refresh with local storage
    setFilter: (newFilter: 'all' | 'todo' | 'in_progress' | 'completed') => {
      setFilter(newFilter)
    },
    setViewMode: (mode: 'list' | 'board' | 'grid') => {
      setViewMode(mode)
    },
    setSearchQuery: (query: string) => {
      setSearchQuery(query)
    }
  }))

  // No useEffect needed - tasks are loaded instantly from localStorage

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    try {
      updateTask(taskId, { status })

      // Show success toast
      const statusLabels = {
        'todo': 'To Do',
        'in_progress': 'In Progress',
        'completed': 'Completed'
      }

      toast({
        title: "✅ Task updated",
        description: `Status changed to ${statusLabels[status]}`,
      })
    } catch (error: any) {
      console.error('Error updating task:', error)

      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleTaskStatus = (task: Task) => {
    // If task has estimated hours and is in progress, don't allow manual completion
    if (task.estimated_hours && task.status === 'in_progress') {
      toast({
        title: "Timer Required",
        description: "Tasks with estimated hours must be completed using the focus timer.",
        variant: "destructive",
      })
      return
    }

    let nextStatus: Task['status']

    switch (task.status) {
      case 'todo':
        nextStatus = 'in_progress'
        break
      case 'in_progress':
        nextStatus = 'completed'
        break
      case 'completed':
        nextStatus = 'todo'
        break
      default:
        nextStatus = 'todo'
    }

    updateTaskStatus(task.id, nextStatus)
  }

  const startFocusTimer = (task: Task) => {
    // Store the task in localStorage for the focus session to pick up
    localStorage.setItem('focusTask', JSON.stringify(task))

    // Redirect to focus session
    window.open('/dashboard/focus', '_blank')

    // Close any open dialogs
    setShowTaskDialog(false)
  }

  const handleTimerComplete = (taskId: string) => {
    // Complete the task when timer finishes
    updateTaskStatus(taskId, 'completed')
    setShowFocusTimer(false)
    setFocusTask(null)
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      try {
        deleteTask(task.id)
        toast({
          title: "✅ Task deleted",
          description: `"${task.title}" has been deleted successfully.`
        })
      } catch (error) {
        toast({
          title: "Failed to delete task",
          description: "Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    if (priority === 'high') {
      return <AlertCircle className="w-4 h-4 text-red-500" />
    }
    return null
  }

  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filter !== 'all' && task.status !== filter) return false

    // Date filter
    if (selectedDate) {
      const taskDate = task.scheduled_date || task.due_date || task.created_at
      const taskDateOnly = new Date(taskDate).toISOString().split('T')[0]
      if (taskDateOnly !== selectedDate) return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(query)
      const matchesDescription = task.description?.toLowerCase().includes(query)
      const matchesTags = task.tags.some(tag => tag.toLowerCase().includes(query))

      if (!matchesTitle && !matchesDescription && !matchesTags) return false
    }

    return true
  })

  // Filter tasks by selected date for counts
  const getTasksForDate = (tasks: Task[]) => {
    if (!selectedDate) return tasks
    
    return tasks.filter(task => {
      const taskDate = task.scheduled_date || task.due_date || task.created_at
      const taskDateOnly = new Date(taskDate).toISOString().split('T')[0]
      return taskDateOnly === selectedDate
    })
  }

  const tasksForSelectedDate = getTasksForDate(tasks)

  const taskCounts = {
    all: tasksForSelectedDate.length,
    todo: tasksForSelectedDate.filter(t => t.status === 'todo').length,
    in_progress: tasksForSelectedDate.filter(t => t.status === 'in_progress').length,
    completed: tasksForSelectedDate.filter(t => t.status === 'completed').length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskCounts.all}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskCounts.todo}</div>
            <div className="text-sm text-muted-foreground">To Do</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{taskCounts.in_progress}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        {(['all', 'todo', 'in_progress', 'completed'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(status)}
            className="capitalize flex-1"
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {/* Tasks Display */}
      <div>
        {viewMode === 'list' && (
          <TaskListView
            tasks={filteredTasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowTaskDialog(true)
            }}
            onStatusToggle={toggleTaskStatus}
            onStartFocus={startFocusTimer}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => {
              setEditingTask(task)
              setShowEditDialog(true)
            }}
          />
        )}

        {viewMode === 'board' && (
          <TaskBoardView
            tasks={filteredTasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowTaskDialog(true)
            }}
            onStatusToggle={toggleTaskStatus}
            onStartFocus={startFocusTimer}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => {
              setEditingTask(task)
              setShowEditDialog(true)
            }}
          />
        )}

        {viewMode === 'grid' && (
          <TaskGridView
            tasks={filteredTasks}
            onTaskClick={(task) => {
              setSelectedTask(task)
              setShowTaskDialog(true)
            }}
            onStatusToggle={toggleTaskStatus}
            onStartFocus={startFocusTimer}
            onDeleteTask={handleDeleteTask}
            onEditTask={(task) => {
              setEditingTask(task)
              setShowEditDialog(true)
            }}
          />
        )}

        {filteredTasks.length === 0 && (
          <EmptyState
            icon={filter === 'completed' ? '🎉' : filter === 'in_progress' ? '⚡' : '📝'}
            title={filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
            description={
              filter === 'all'
                ? "Ready to boost your productivity? Create your first task and start achieving your goals!"
                : `No ${filter.replace('_', ' ')} tasks at the moment. Keep up the great work!`
            }
            action={filter === 'all' ? {
              label: "Create Your First Task",
              onClick: onCreateTask || (() => {})
            } : undefined}
          />
        )}
      </div>

      {/* Task View Dialog */}
      <TaskViewDialog
        task={selectedTask}
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        onEdit={(task) => {
          setEditingTask(task)
          setShowEditDialog(true)
          setShowTaskDialog(false)
        }}
        onStartFocus={startFocusTimer}
        onStatusChange={(taskId, status) => {
          updateTaskStatus(taskId, status)
          setShowTaskDialog(false)
        }}
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onTaskUpdated={() => {
          setEditingTask(null)
        }}
      />

      {/* Focus Timer Dialog */}
      <TaskFocusTimer
        task={focusTask}
        open={showFocusTimer}
        onOpenChange={setShowFocusTimer}
        onComplete={handleTimerComplete}
      />
    </div>
  )
})

TaskManager.displayName = "TaskManager"