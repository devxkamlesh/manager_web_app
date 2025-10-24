"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Textarea } from "@/components/ui/forms/textarea"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { supabase } from "@/lib/supabase"
import { useSupabaseAuth } from "@/components/auth/supabase-auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { CalendarIcon, Clock, Flag, Tag, Save, X, Settings } from "lucide-react"
import { type Task } from "@/lib/task-store"



interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: () => void
}

export function EditTaskDialog({ task, open, onOpenChange, onTaskUpdated }: EditTaskDialogProps) {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const { categories, initializeDefaultCategories } = useCategoryStore()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimated_hours: '',
    due_date: undefined as Date | undefined,
    scheduled_date: undefined as Date | undefined,
    tags: '',
    status: 'todo' as 'todo' | 'in_progress' | 'completed'
  })



  useEffect(() => {
    initializeDefaultCategories()
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category || '',
        priority: task.priority,
        estimated_hours: task.estimated_hours?.toString() || '',
        due_date: task.due_date ? new Date(task.due_date) : undefined,
        scheduled_date: task.scheduled_date ? new Date(task.scheduled_date) : undefined,
        tags: task.tags.join(', '),
        status: task.status
      })
    }
  }, [task, initializeDefaultCategories])



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !formData.title.trim() || !task) {
      toast({
        title: "Validation Error",
        description: "Please enter a task title and make sure you're logged in.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category || null,
        priority: formData.priority,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        due_date: formData.due_date ? formData.due_date.toISOString() : null,
        scheduled_date: formData.scheduled_date ? formData.scheduled_date.toISOString() : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        status: formData.status,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', task.id)

      if (error) {
        throw error
      }

      toast({
        title: "✅ Task updated successfully!",
        description: `"${formData.title}" has been updated.`,
      })

      onTaskUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Task update error:', error)
      
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Tag className="w-6 h-6" />
            Edit Task
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what needs to be done..."
                rows={3}
              />
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label>Category</Label>
              {categories.length === 0 ? (
                <div className="text-center py-4 border-2 border-dashed border-muted rounded-lg">
                  <Settings className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No categories available</p>
                </div>
              ) : (
                <Select value={formData.category || "none"} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value === "none" ? "" : value }))}>
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
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'todo' | 'in_progress' | 'completed') => 
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated Hours
            </Label>
            <div className="space-y-2">
              <Input
                type="number"
                step="0.25"
                min="0"
                max="40"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="2.5"
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
                    onClick={() => setFormData(prev => ({ ...prev, estimated_hours: option.value }))}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Scheduled Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduled Date & Time
            </Label>
            <div className="relative">
              <DatePicker
                selected={formData.scheduled_date}
                onChange={(date: Date | null) => setFormData(prev => ({ ...prev, scheduled_date: date || undefined }))}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                placeholderText="When do you want to work on this?"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                minDate={new Date()}
                showPopperArrow={false}
                popperClassName="z-50"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Due Date and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Due Date
              </Label>
              <div className="relative">
                <DatePicker
                  selected={formData.due_date}
                  onChange={(date: Date | null) => setFormData(prev => ({ ...prev, due_date: date || undefined }))}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a due date"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  minDate={new Date()}
                  showPopperArrow={false}
                  popperClassName="z-50"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="frontend, react, urgent (comma separated)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}