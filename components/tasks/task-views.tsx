"use client"

import { Card, CardContent } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Button } from "@/components/ui/forms/button"
import { type Task } from "@/lib/task-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { 
  Clock, 
  Calendar, 
  Flag, 
  Tag, 
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/navigation/dropdown-menu"
import { formatTimeAgo, cn } from "@/lib/utils"

const canManuallyComplete = (task: Task) => {
  // Tasks with estimated hours in progress can't be manually completed
  return !(task.estimated_hours && task.status === 'in_progress')
}



interface TaskViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onStatusToggle: (task: Task) => void
  onStartFocus: (task: Task) => void
  onDeleteTask?: (task: Task) => void
  onEditTask?: (task: Task) => void
}

const getStatusIcon = (status: Task['status']) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />
    default: return <Circle className="w-5 h-5 text-gray-400" />
  }
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
    case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  }
}

// List View Component
export function TaskListView({ tasks, onTaskClick, onStatusToggle, onStartFocus, onDeleteTask, onEditTask }: TaskViewProps) {
  const { getCategoryById } = useCategoryStore()
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const category = getCategoryById(task.category)
        return (
          <Card key={task.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => canManuallyComplete(task) ? onStatusToggle(task) : undefined}
                className={cn(
                  "mt-1 transition-transform",
                  canManuallyComplete(task) ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
                title={!canManuallyComplete(task) ? "Use focus timer to complete this task" : undefined}
              >
                {getStatusIcon(task.status)}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 
                      className={cn(
                        "font-semibold text-lg mb-1 cursor-pointer hover:text-primary transition-colors",
                        task.status === 'completed' && 'line-through text-muted-foreground'
                      )}
                      onClick={() => onTaskClick(task)}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTaskClick(task)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {task.status !== 'completed' && task.estimated_hours && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onStartFocus(task)}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
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
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {category && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {(() => {
                          const IconComponent = getIconByName(category.icon)
                          return <IconComponent className="w-3 h-3 mr-1" />
                        })()}
                        {category.name}
                      </Badge>
                    )}
                    
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(task.priority)}
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </Badge>
                    
                    {task.estimated_hours && (
                      <Badge variant="outline">
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
                        +{task.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                  
                  <span className="text-sm text-muted-foreground">
                    {task.scheduled_date 
                      ? `Scheduled: ${new Date(task.scheduled_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}`
                      : formatTimeAgo(new Date(task.created_at))
                    }
                  </span>
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
  const columns = [
    { id: 'todo', title: 'To Do', tasks: tasks.filter(t => t.status === 'todo') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.status === 'completed') }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <Badge variant="secondary">{column.tasks.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 
                        className={cn(
                          "font-medium text-sm leading-tight",
                          task.status === 'completed' && 'line-through text-muted-foreground'
                        )}
                        onClick={() => onTaskClick(task)}
                      >
                        {task.title}
                      </h4>
                      <button
                        onClick={() => canManuallyComplete(task) ? onStatusToggle(task) : undefined}
                        className={cn(
                          "transition-transform",
                          canManuallyComplete(task) ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-50"
                        )}
                        title={!canManuallyComplete(task) ? "Use focus timer to complete this task" : undefined}
                      >
                        {getStatusIcon(task.status)}
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Badge 
                          variant="outline" 
                          className={cn("text-xs", getPriorityColor(task.priority))}
                        >
                          {task.priority}
                        </Badge>
                        
                        {task.estimated_hours && (
                          <Badge variant="outline" className="text-xs">
                            {task.estimated_hours}h
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTaskClick(task)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        {task.status !== 'completed' && task.estimated_hours && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onStartFocus(task)}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
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
                    
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Grid View Component
export function TaskGridView({ tasks, onTaskClick, onStatusToggle, onStartFocus, onDeleteTask, onEditTask }: TaskViewProps) {
  const { getCategoryById } = useCategoryStore()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => {
        const category = getCategoryById(task.category)
        return (
        <Card key={task.id} className="hover:shadow-lg transition-all duration-200 group">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => canManuallyComplete(task) ? onStatusToggle(task) : undefined}
                  className={cn(
                    "transition-transform",
                    canManuallyComplete(task) ? "hover:scale-110 cursor-pointer" : "cursor-not-allowed opacity-50"
                  )}
                  title={!canManuallyComplete(task) ? "Use focus timer to complete this task" : undefined}
                >
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTaskClick(task)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  {task.status !== 'completed' && task.estimated_hours && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onStartFocus(task)}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
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
              
              <div>
                <h4 
                  className={cn(
                    "font-medium text-sm leading-tight cursor-pointer hover:text-primary transition-colors",
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
              
              <div className="space-y-2">
                {category && (
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    {(() => {
                      const IconComponent = getIconByName(category.icon)
                      return <IconComponent className="w-3 h-3 mr-1" />
                    })()}
                    {category.name}
                  </Badge>
                )}
                
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getPriorityColor(task.priority))}
                  >
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
                  <div className="flex flex-wrap gap-1">
                    {task.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {task.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{task.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {task.scheduled_date 
                  ? `Scheduled: ${new Date(task.scheduled_date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}`
                  : formatTimeAgo(new Date(task.created_at))
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