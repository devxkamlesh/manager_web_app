"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type Task } from "@/lib/task-store"
import {
  Clock,
  Calendar,
  Flag,
  Tag,
  Edit,
  Play,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"



interface TaskViewDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (task: Task) => void
  onStartFocus: (task: Task) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
}

export function TaskViewDialog({
  task,
  open,
  onOpenChange,
  onEdit,
  onStartFocus,
  onStatusChange
}: TaskViewDialogProps) {
  if (!task) return null

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />
      default: return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getNextStatus = (currentStatus: Task['status']) => {
    switch (currentStatus) {
      case 'todo': return 'in_progress'
      case 'in_progress': return 'completed'
      case 'completed': return 'todo'
    }
  }

  const getStatusLabel = (status: Task['status'], hasEstimatedHours: boolean) => {
    switch (status) {
      case 'todo': return 'Start Task'
      case 'in_progress': return hasEstimatedHours ? 'Use Timer to Complete' : 'Complete Task'
      case 'completed': return 'Reopen Task'
    }
  }

  const canToggleStatus = (status: Task['status'], hasEstimatedHours: boolean) => {
    // Don't allow manual completion for tasks with estimated hours that are in progress
    if (hasEstimatedHours && status === 'in_progress') {
      return false
    }
    return true
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <button
              onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
              className="hover:scale-110 transition-transform"
            >
              {getStatusIcon(task.status)}
            </button>
            <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>
              {task.title}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={getPriorityColor(task.priority)}
            >
              <Flag className="w-3 h-3 mr-1" />
              {task.priority} priority
            </Badge>

            <Badge variant="secondary">
              {task.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4">
            {task.estimated_hours && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Estimated:</strong> {task.estimated_hours}h
                </span>
              </div>
            )}

            {task.due_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-sm text-muted-foreground space-y-1">
            {task.scheduled_date && (
              <p className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Scheduled for {new Date(task.scheduled_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            )}
            <p>Created {formatTimeAgo(new Date(task.created_at))}</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {canToggleStatus(task.status, !!task.estimated_hours) ? (
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
                >
                  {getStatusIcon(task.status)}
                  <span className="ml-2">{getStatusLabel(task.status, !!task.estimated_hours)}</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  className="opacity-50"
                >
                  {getStatusIcon(task.status)}
                  <span className="ml-2">{getStatusLabel(task.status, !!task.estimated_hours)}</span>
                </Button>
              )}

              {task.status !== 'completed' && task.estimated_hours && (
                <Button
                  onClick={() => onStartFocus(task)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Focus Timer ({task.estimated_hours}h)
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => onEdit(task)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}