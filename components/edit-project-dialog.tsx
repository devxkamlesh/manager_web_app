"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useProjectStore, type Project } from "@/lib/project-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { Save, X, FolderOpen, Settings, Play, Pause, CheckSquare, XCircle, Target } from "lucide-react"

interface EditProjectDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectUpdated: () => void
}

const priorities = [
  { id: 'low', label: 'Low Priority', desc: 'Nice to have', color: 'bg-green-500' },
  { id: 'medium', label: 'Medium Priority', desc: 'Important', color: 'bg-yellow-500' },
  { id: 'high', label: 'High Priority', desc: 'Critical', color: 'bg-red-500' }
]

const statuses = [
  { id: 'planning', label: 'Planning', desc: 'Defining requirements', icon: Target },
  { id: 'active', label: 'Active', desc: 'Currently working', icon: Play },
  { id: 'paused', label: 'Paused', desc: 'Temporarily stopped', icon: Pause },
  { id: 'completed', label: 'Completed', desc: 'Successfully finished', icon: CheckSquare },
  { id: 'cancelled', label: 'Cancelled', desc: 'No longer needed', icon: XCircle }
]

export function EditProjectDialog({ project, open, onOpenChange, onProjectUpdated }: EditProjectDialogProps) {
  const { toast } = useToast()
  const { updateProject } = useProjectStore()
  const { categories, initializeDefaultCategories } = useCategoryStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'paused' | 'cancelled',
    progress: 0
  })

  useEffect(() => {
    initializeDefaultCategories()
  }, [initializeDefaultCategories])

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
        category: project.category || '',
        priority: project.priority,
        status: project.status,
        progress: project.progress
      })
    }
  }, [project]) 
 const updateProjectData = async () => {
    if (!project || !formData.name.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      updateProject(project.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        category: formData.category || null,
        priority: formData.priority,
        status: formData.status,
        progress: formData.progress
      })
      
      toast({ 
        title: "✅ Project updated!", 
        description: `"${formData.name}" has been updated successfully.` 
      })
      
      onProjectUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Project update error:', error)
      toast({ 
        title: "Failed to update project", 
        description: "Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FolderOpen className="w-6 h-6 text-primary" />
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Project Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., E-commerce Website, Mobile App..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project goals and objectives..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Category</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Choose a category to organize your project
              </p>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${p.color}`} />
                        <div>
                          <div className="font-medium">{p.label}</div>
                          <div className="text-xs text-muted-foreground">{p.desc}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled') => 
                setFormData(prev => ({ ...prev, status: value }))
              }>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select current status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => {
                    const IconComponent = s.icon
                    return (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex items-center gap-3">
                          <IconComponent className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">{s.desc}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Progress</Label>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span className="font-medium">{formData.progress}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={updateProjectData}
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}