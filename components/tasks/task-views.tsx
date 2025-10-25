"use client"

import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { EmptyState } from "@/components/ui/display/empty-state"
import { type Task } from "@/lib/task-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import {
  Clock,
  Calendar,
  Flag,
  Play,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  ListTodo,
  Sparkles
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/navigation/dropdown-menu"
import { formatTimeAgo, cn } from "@/lib/utils"
import { useState, useEffect } from "react"





interface TaskViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onStatusToggle: (task: Task) => void
  onStartFocus: (task: Task) => void
  onDeleteTask?: (task: Task) => void
  onEditTask?: (task: Task) => void
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high': return 'bg-red-500'
    case 'medium': return 'bg-yellow-500'
    case 'low': return 'bg-green-500'
    default: return 'bg-gray-500'
  }
}

const getPriorityStyles = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return "text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800"
    case 'medium':
      return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-950/30 dark:border-yellow-800"
    case 'low':
      return "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200 dark:text-gray-400 dark:bg-gray-950/30 dark:border-gray-800"
  }
}

// List View Component
export function TaskListView({ tasks, onTaskClick, onStatusToggle, onStartFocus, onDeleteTask, onEditTask }: TaskViewProps) {
  const { getCategoryById } = useCategoryStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (tasks.length === 0) {
    return null // Empty state is handled by the parent TaskManager component
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const category = getCategoryById(task.category)
        const isCompleted = task.status === 'completed'
        const isInProgress = task.status === 'in_progress'

        return (
          <Card key={task.id} className="group hover:shadow-lg transition-all duration-200 border bg-card">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header with title and actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Priority indicator */}
                    <div className={cn("w-1 h-16 rounded-full flex-shrink-0", getPriorityColor(task.priority))} />

                    <div className="flex-1 min-w-0">
                      <h3
                        className={cn(
                          "font-semibold text-lg cursor-pointer hover:text-primary transition-colors",
                          isCompleted && 'line-through text-muted-foreground'
                        )}
                        onClick={() => onTaskClick(task)}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status !== 'completed' && task.estimated_hours && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStartFocus(task)}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskClick(task)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {onEditTask && (
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Task
                          </DropdownMenuItem>
                        )}
                        {onDeleteTask && (
                          <DropdownMenuItem
                            onClick={() => onDeleteTask(task)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Task
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Badges and metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {category && (
                      <Badge variant="secondary" className="text-xs">
                        {(() => {
                          const IconComponent = getIconByName(category.icon)
                          return <IconComponent className="w-3 h-3 mr-1" />
                        })()}
                        {category.name}
                      </Badge>
                    )}

                    <Badge variant="outline" className={cn("text-xs", getPriorityStyles(task.priority))}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </Badge>

                    {task.estimated_hours && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimated_hours}h
                      </Badge>
                    )}

                    {task.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}

                    {task.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{task.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {task.scheduled_date
                      ? new Date(task.scheduled_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                      : isClient ? formatTimeAgo(new Date(task.created_at)) : 'Recently'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Board View Component (Kanban style)
export function TaskBoardView({ tasks, onTaskClick, onStatusToggle, onStartFocus, onDeleteTask, onEditTask }: TaskViewProps) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.status === 'completed') }
  ]

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<ListTodo className="w-16 h-16 text-primary/40" />}
        title="No tasks to organize"
        description="Create tasks to see them organized in this beautiful kanban board."
        className="bg-gradient-to-br from-primary/5 via-muted/20 to-muted/10 border-primary/20"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Badge variant="secondary">{column.tasks.length}</Badge>
          </div>

          {column.tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm">No {column.title.toLowerCase()} tasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.id} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <div className={cn("w-1 h-12 rounded-full flex-shrink-0", getPriorityColor(task.priority))} />
                          <div className="flex-1 min-w-0">
                            <h4
                              className={cn(
                                "font-medium text-sm cursor-pointer hover:text-primary transition-colors",
                                task.status === 'completed' && 'line-through text-muted-foreground'
                              )}
                              onClick={() => onTaskClick(task)}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onTaskClick(task)}>
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </DropdownMenuItem>
                            {task.status !== 'completed' && task.estimated_hours && (
                              <DropdownMenuItem onClick={() => onStartFocus(task)}>
                                <Play className="mr-2 h-3 w-3" />
                                Start Focus
                              </DropdownMenuItem>
                            )}
                            {onEditTask && (
                              <DropdownMenuItem onClick={() => onEditTask(task)}>
                                <Edit className="mr-2 h-3 w-3" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDeleteTask && (
                              <DropdownMenuItem
                                onClick={() => onDeleteTask(task)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className={cn("text-xs", getPriorityStyles(task.priority))}>
                            {task.priority}
                          </Badge>

                          {task.estimated_hours && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-2 h-2 mr-1" />
                              {task.estimated_hours}h
                            </Badge>
                          )}
                        </div>

                        {task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 1).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {task.tags.length > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                +{task.tags.length - 1}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Grid View Component
export function TaskGridView({ tasks, onTaskClick, onStatusToggle, onStartFocus, onDeleteTask, onEditTask }: TaskViewProps) {
  const { getCategoryById } = useCategoryStore()
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="w-16 h-16 text-primary/40" />}
        title="No tasks in grid"
        description="Create tasks to see them displayed in this beautiful grid layout."
        className="bg-gradient-to-br from-primary/5 via-muted/20 to-muted/10 border-primary/20"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => {
        const category = getCategoryById(task.category)
        return (
          <Card key={task.id} className={cn(
            "hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group border-0 relative overflow-hidden",
            "bg-gradient-to-br from-card/90 via-card to-card/80 backdrop-blur-sm",
            "hover:scale-105 hover:-translate-y-2",
            task.status === 'completed' && "bg-gradient-to-br from-green-50/40 via-card to-green-50/20 dark:from-green-950/15",
            task.status === 'in_progress' && "bg-gradient-to-br from-blue-50/40 via-card to-blue-50/20 dark:from-blue-950/15",
            task.status === 'todo' && "bg-gradient-to-br from-primary/8 via-card to-primary/5"
          )}>
            {/* Status indicator */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-1",
              task.status === 'completed' && "bg-gradient-to-r from-green-400 to-green-600",
              task.status === 'in_progress' && "bg-gradient-to-r from-blue-400 to-blue-600",
              task.status === 'todo' && "bg-gradient-to-r from-primary/60 to-primary"
            )} />

            <CardContent className="p-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-bold text-lg leading-tight cursor-pointer hover:text-primary transition-all duration-300",
                        "hover:scale-[1.02] origin-left",
                        task.status === 'completed' && 'line-through text-muted-foreground opacity-70'
                      )}
                      onClick={() => onTaskClick(task)}
                    >
                      {task.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskClick(task)}
                      className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    {task.status !== 'completed' && task.estimated_hours && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStartFocus(task)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:scale-110 transition-all duration-200">
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onTaskClick(task)}>
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </DropdownMenuItem>
                        {onEditTask && (
                          <DropdownMenuItem onClick={() => onEditTask(task)}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDeleteTask && (
                          <DropdownMenuItem
                            onClick={() => onDeleteTask(task)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 opacity-80 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="space-y-3">
                  {category && (
                    <Badge variant="secondary" className="text-xs bg-primary/15 text-primary border-primary/30 font-semibold px-3 py-1 rounded-full shadow-sm">
                      {(() => {
                        const IconComponent = getIconByName(category.icon)
                        return <IconComponent className="w-3 h-3 mr-1" />
                      })()}
                      {category.name}
                    </Badge>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-semibold px-3 py-1 rounded-full shadow-sm", getPriorityStyles(task.priority))}
                    >
                      {task.priority}
                    </Badge>

                    {task.estimated_hours && (
                      <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary font-semibold px-3 py-1 rounded-full shadow-sm">
                        <Clock className="w-2 h-2 mr-1" />
                        {task.estimated_hours}h
                      </Badge>
                    )}
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-muted/60 font-medium px-2 py-1 rounded-full">
                          #{tag}
                        </Badge>
                      ))}
                      {task.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-muted/60 font-medium px-2 py-1 rounded-full">
                          +{task.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground font-medium bg-muted/30 px-3 py-2 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {task.scheduled_date
                    ? `Scheduled: ${new Date(task.scheduled_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}`
                    : isClient ? formatTimeAgo(new Date(task.created_at)) : 'Recently'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}