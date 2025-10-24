"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Textarea } from "@/components/ui/forms/textarea"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Badge } from "@/components/ui/display/badge"
// Removed Supabase imports for local storage approach
import { useToast } from "@/hooks/use-toast"

import { useTaskStore } from "@/lib/task-store"
import { useCategoryStore } from "@/lib/category-store"
import { useProjectStore } from "@/lib/project-store"
import { getIconByName } from "@/lib/icon-library"
import { 
  Plus, Clock, Flag, ArrowRight, ArrowLeft, CheckCircle2, Target, CalendarDays, Settings
} from "lucide-react"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: () => void
}



const priorities = [
  { id: 'low', label: 'Low Priority', desc: 'Can wait' },
  { id: 'medium', label: 'Medium Priority', desc: 'Important' },
  { id: 'high', label: 'High Priority', desc: 'Urgent' }
]

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
  const { toast } = useToast()
  const { addTask } = useTaskStore()
  const { categories, initializeDefaultCategories } = useCategoryStore()
  const { projects } = useProjectStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [task, setTask] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimated_hours: '',
    due_date: '',
    scheduled_date: new Date().toISOString().split('T')[0], // Default to today
    scheduled_time: '09:00', // Default to 9 AM
    project_id: '',
    tags: ''
  })

  // Initialize default categories for new users
  useEffect(() => {
    initializeDefaultCategories()
  }, [initializeDefaultCategories])

  const reset = () => {
    setTask({ 
      title: '', 
      description: '', 
      category: '', 
      priority: 'medium', 
      estimated_hours: '', 
      due_date: '', 
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '09:00',
      project_id: '',
      tags: '' 
    })
    setCurrentStep(1)
    setIsSubmitting(false)
  }

  const createTask = async () => {
    if (!task.title.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Combine scheduled date and time
      const scheduledDateTime = task.scheduled_date && task.scheduled_time 
        ? `${task.scheduled_date}T${task.scheduled_time}:00.000Z`
        : null

      const taskData = {
        title: task.title.trim(),
        description: task.description.trim(),
        category: task.category,
        priority: task.priority,
        estimated_hours: task.estimated_hours ? parseFloat(task.estimated_hours) : null,
        due_date: task.due_date || null,
        scheduled_date: scheduledDateTime,
        project_id: task.project_id || null,
        tags: task.tags ? task.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: 'todo' as const
      }

      addTask(taskData)
      
      toast({ 
        title: "✅ Task created!", 
        description: `"${task.title}" added to your tasks.` 
      })
      
      reset()
      onTaskCreated()
      onOpenChange(false)
    } catch (error) {
      console.error('Task creation error:', error)
      toast({ 
        title: "Failed to create task", 
        description: "Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    const steps = [
      // Step 1: Basic Info & Schedule
      <div key="step1" className="space-y-4">
        <div className="text-center">
          <Target className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">What needs to be done?</h3>
          <p className="text-sm text-muted-foreground">Create your task and schedule when to work on it</p>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Task Title *</Label>
          <Input
            value={task.title}
            onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Fix login button, Write documentation..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">Description</Label>
          <Textarea
            value={task.description}
            onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
            placeholder="What needs to be done..."
            rows={2}
            className="mt-1"
          />
        </div>

        {/* Schedule Section */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="w-4 h-4 text-primary" />
            When do you want to work on this?
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Date</Label>
              <Input
                type="date"
                value={task.scheduled_date}
                onChange={(e) => setTask(prev => ({ ...prev, scheduled_date: e.target.value }))}
                className="mt-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Time</Label>
              <Input
                type="time"
                value={task.scheduled_time}
                onChange={(e) => setTask(prev => ({ ...prev, scheduled_time: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {task.scheduled_date && task.scheduled_time && (
              <>
                Scheduled for: {new Date(`${task.scheduled_date}T${task.scheduled_time}`).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {new Date(`${task.scheduled_date}T${task.scheduled_time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </>
            )}
          </div>
        </div>
      </div>,

      // Step 2: Category & Priority
      <div key="step2" className="space-y-4">
        <div className="text-center">
          <Flag className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Category & Priority</h3>
        </div>
        <div>
          <Label className="text-sm font-medium">Category</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Choose a category to organize your task
          </p>
          {categories.length === 0 ? (
            <div className="text-center py-4 border-2 border-dashed border-muted rounded-lg">
              <Settings className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No categories available</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Create Categories",
                    description: "Go to Settings > Categories to create your first category.",
                  })
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Create Categories
              </Button>
            </div>
          ) : (
            <Select value={task.category || "none"} onValueChange={(value) => setTask(prev => ({ ...prev, category: value === "none" ? "" : value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Category</SelectItem>
                {categories.map((cat) => {
                  const IconComponent = getIconByName(cat.icon)
                  const getColorClass = (color: string) => {
                    const colorMap: Record<string, string> = {
                      blue: 'bg-blue-500',
                      purple: 'bg-purple-500',
                      green: 'bg-green-500',
                      orange: 'bg-orange-500',
                      red: 'bg-red-500',
                      pink: 'bg-pink-500',
                      indigo: 'bg-indigo-500',
                      yellow: 'bg-yellow-500',
                      gray: 'bg-gray-500',
                      teal: 'bg-teal-500',
                    }
                    return colorMap[color] || 'bg-gray-500'
                  }
                  
                  return (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getColorClass(cat.color)}`}>
                          <IconComponent className="w-3 h-3 text-white" />
                        </div>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium">Priority</Label>
          <p className="text-xs text-muted-foreground mb-2">
            How urgent is this task?
          </p>
          <Select value={task.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
            setTask(prev => ({ ...prev, priority: value }))
          }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => {
                const dotColor = p.id === 'low' ? 'bg-green-500' : p.id === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                return (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                      <div>
                        <div className="font-medium">{p.label}</div>
                        <div className="text-xs text-muted-foreground">{p.desc}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>,

      // Step 3: Details
      <div key="step3" className="space-y-4">
        <div className="text-center">
          <Clock className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Timeline & Details</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Time Estimate (Hours)</Label>
            <div className="space-y-2 mt-1">
              <Input
                type="number"
                step="0.25"
                min="0"
                max="40"
                value={task.estimated_hours}
                onChange={(e) => setTask(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="2.5"
                className="w-full"
              />
              <div className="flex flex-wrap gap-1">
                {[
                  { label: '30m', value: '0.5' },
                  { label: '1h', value: '1' },
                  { label: '2h', value: '2' },
                  { label: '4h', value: '4' },
                  { label: '8h', value: '8' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => setTask(prev => ({ ...prev, estimated_hours: option.value }))}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Due Date</Label>
            <Input
              type="date"
              value={task.due_date}
              onChange={(e) => setTask(prev => ({ ...prev, due_date: e.target.value }))}
              className="mt-1"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Project Association */}
        <div>
          <Label className="text-sm font-medium">Project (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Associate this task with a project for better organization
          </p>
          <Select value={task.project_id || "none"} onValueChange={(v) => setTask(prev => ({ ...prev, project_id: v === "none" ? "" : v }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      project.status === 'active' ? 'bg-green-500' :
                      project.status === 'planning' ? 'bg-blue-500' :
                      project.status === 'completed' ? 'bg-gray-500' :
                      project.status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span>{project.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Tags</Label>
          <Input
            value={task.tags}
            onChange={(e) => setTask(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="frontend, urgent, api (comma separated)"
            className="mt-1"
          />
        </div>
      </div>
    ]

    return steps[currentStep - 1]
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) reset()
      onOpenChange(isOpen)
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="w-6 h-6 text-primary" />
            Create Task
          </DialogTitle>
        </DialogHeader>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1 rounded-full transition-all duration-300 ${
                step === currentStep ? 'bg-primary w-8' : 
                step < currentStep ? 'bg-primary w-4' : 'bg-muted w-4'
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px] mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Button 
            variant="ghost" 
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : (reset(), onOpenChange(false))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep > 1 ? 'Back' : 'Cancel'}
          </Button>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium">
              Step {currentStep} of 3
            </Badge>
          </div>

          {currentStep < 3 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && !task.title.trim()}
              className="flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={createTask}
              disabled={isSubmitting || !task.title.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Task
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}