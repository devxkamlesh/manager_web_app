"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

import { useProjectStore } from "@/lib/project-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { 
  Plus, ArrowRight, ArrowLeft, CheckCircle2, FolderOpen, 
  Calendar, DollarSign, Code, Flag, Target, Settings, Clock,
  Play, Pause, CheckSquare, XCircle,
  Zap, Building, Rocket, RotateCcw
} from "lucide-react"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: () => void
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



export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const { toast } = useToast()
  const { addProject } = useProjectStore()
  const { categories, initializeDefaultCategories } = useCategoryStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [project, setProject] = useState({
    name: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'planning' as 'planning' | 'active' | 'completed' | 'paused' | 'cancelled',
    scope: '',
    risk_level: '',
    github_url: '',
    website_url: '',
    tech_stack: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    budget: '',
    estimated_hours: '',
    team_members: '',
    tags: '',
    progress: 0
  })

  // Initialize default categories for new users
  useEffect(() => {
    initializeDefaultCategories()
  }, [initializeDefaultCategories])

  const reset = () => {
    setProject({ 
      name: '', 
      description: '', 
      category: '', 
      priority: 'medium',
      status: 'planning',
      scope: '',
      risk_level: '',
      github_url: '',
      website_url: '',
      tech_stack: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      budget: '',
      estimated_hours: '',
      team_members: '',
      tags: '',
      progress: 0
    })
    setCurrentStep(1)
    setIsSubmitting(false)
  }

  const createProject = async () => {
    if (!project.name.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const projectData = {
        name: project.name.trim(),
        description: project.description.trim() || null,
        category: project.category || null,
        priority: project.priority,
        status: project.status,
        scope: project.scope || null,
        risk_level: project.risk_level || null,
        github_url: project.github_url.trim() || null,
        website_url: project.website_url.trim() || null,
        tech_stack: project.tech_stack ? project.tech_stack.split(',').map(t => t.trim()).filter(Boolean) : [],
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        budget: project.budget ? parseFloat(project.budget) : null,
        estimated_hours: project.estimated_hours ? parseFloat(project.estimated_hours) : null,
        team_members: project.team_members ? project.team_members.split(',').map(t => t.trim()).filter(Boolean) : [],
        tags: project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        progress: project.progress
      }

      addProject(projectData)
      
      toast({ 
        title: "✅ Project created!", 
        description: `"${project.name}" has been added to your projects.` 
      })
      
      reset()
      onProjectCreated()
      onOpenChange(false)
    } catch (error) {
      console.error('Project creation error:', error)
      toast({ 
        title: "Failed to create project", 
        description: "Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    const steps = [
      // Step 1: Basic Info
      <div key="step1" className="space-y-4">
        <div className="text-center">
          <FolderOpen className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Project Basics</h3>
          <p className="text-sm text-muted-foreground">What are you building?</p>
        </div>
        
        <div>
          <Label className="text-sm font-medium">Project Name *</Label>
          <Input
            value={project.name}
            onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., E-commerce Website, Mobile App..."
            className="mt-1"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium">Description</Label>
          <Textarea
            value={project.description}
            onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your project goals and objectives..."
            rows={3}
            className="mt-1"
          />
        </div>

        {/* Category Selection */}
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
            <Select value={project.category || "none"} onValueChange={(value) => setProject(prev => ({ ...prev, category: value === "none" ? "" : value }))}>
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
      </div>,

      // Step 2: Priority & Status
      <div key="step2" className="space-y-6">
        <div className="text-center">
          <Flag className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Priority & Status</h3>
          <p className="text-sm text-muted-foreground">Set importance and current state for better project management</p>
        </div>
        
        {/* Priority Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Project Priority *</Label>
          <p className="text-xs text-muted-foreground mb-3">
            How important is this project? This helps with resource allocation and scheduling.
          </p>
          <Select value={project.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
            setProject(prev => ({ ...prev, priority: value }))
          }>
            <SelectTrigger className="w-full">
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

        {/* Status Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Current Status *</Label>
          <p className="text-xs text-muted-foreground mb-3">
            What stage is your project in? You can update this as your project progresses.
          </p>
          <Select value={project.status} onValueChange={(value: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled') => 
            setProject(prev => ({ ...prev, status: value }))
          }>
            <SelectTrigger className="w-full">
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

        {/* Project Type/Scope */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Project Scope (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            What type of project is this? This helps with planning and resource estimation.
          </p>
          <Select value={project.scope || ''} onValueChange={(value) => 
            setProject(prev => ({ ...prev, scope: value }))
          }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div>
                    <div className="font-medium">Small Project</div>
                    <div className="text-xs text-muted-foreground">1-2 weeks, individual work</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Medium Project</div>
                    <div className="text-xs text-muted-foreground">1-3 months, small team</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="large">
                <div className="flex items-center gap-3">
                  <Rocket className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-medium">Large Project</div>
                    <div className="text-xs text-muted-foreground">3+ months, multiple teams</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="ongoing">
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="font-medium">Ongoing Project</div>
                    <div className="text-xs text-muted-foreground">Continuous development</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Risk Level */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Risk Assessment (Optional)</Label>
          <p className="text-xs text-muted-foreground mb-3">
            How complex or risky is this project? This helps with planning and resource allocation.
          </p>
          <Select value={project.risk_level || ''} onValueChange={(value) => 
            setProject(prev => ({ ...prev, risk_level: value }))
          }>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select risk level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div>
                    <div className="font-medium">Low Risk</div>
                    <div className="text-xs text-muted-foreground">Well-defined, familiar technology</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div>
                    <div className="font-medium">Medium Risk</div>
                    <div className="text-xs text-muted-foreground">Some unknowns, moderate complexity</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div>
                    <div className="font-medium">High Risk</div>
                    <div className="text-xs text-muted-foreground">Many unknowns, cutting-edge tech</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>,

      // Step 3: Timeline & Budget
      <div key="step3" className="space-y-4">
        <div className="text-center">
          <Calendar className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Timeline & Budget</h3>
          <p className="text-sm text-muted-foreground">Plan your project schedule</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Start Date</Label>
            <Input
              type="date"
              value={project.start_date}
              onChange={(e) => setProject(prev => ({ ...prev, start_date: e.target.value }))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">End Date (Optional)</Label>
            <Input
              type="date"
              value={project.end_date}
              onChange={(e) => setProject(prev => ({ ...prev, end_date: e.target.value }))}
              className="mt-1"
              min={project.start_date}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Budget (Optional)</Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={project.budget}
                onChange={(e) => setProject(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="0.00"
                className="pl-10"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Estimated Hours (Optional)</Label>
            <div className="relative mt-1">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={project.estimated_hours}
                onChange={(e) => setProject(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="40"
                className="pl-10"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Initial Progress</Label>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="100"
              value={project.progress}
              onChange={(e) => setProject(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="font-medium">{project.progress}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>,

      // Step 4: Additional Details
      <div key="step4" className="space-y-4">
        <div className="text-center">
          <Code className="w-10 h-10 mx-auto text-primary mb-2" />
          <h3 className="text-lg font-semibold">Additional Details</h3>
          <p className="text-sm text-muted-foreground">Optional project information</p>
        </div>

        <div>
          <Label className="text-sm font-medium">GitHub Repository (Optional)</Label>
          <Input
            value={project.github_url}
            onChange={(e) => setProject(prev => ({ ...prev, github_url: e.target.value }))}
            placeholder="https://github.com/username/repo"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Website URL (Optional)</Label>
          <Input
            value={project.website_url}
            onChange={(e) => setProject(prev => ({ ...prev, website_url: e.target.value }))}
            placeholder="https://yourproject.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Tech Stack (Optional)</Label>
          <Input
            value={project.tech_stack}
            onChange={(e) => setProject(prev => ({ ...prev, tech_stack: e.target.value }))}
            placeholder="React, Node.js, PostgreSQL (comma separated)"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Team Members (Optional)</Label>
          <Input
            value={project.team_members}
            onChange={(e) => setProject(prev => ({ ...prev, team_members: e.target.value }))}
            placeholder="John Doe, Jane Smith (comma separated)"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Tags (Optional)</Label>
          <Input
            value={project.tags}
            onChange={(e) => setProject(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="frontend, api, mobile (comma separated)"
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
            Create Project
          </DialogTitle>
        </DialogHeader>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4].map((step) => (
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
        <div className="min-h-[350px] mb-6">
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
              Step {currentStep} of 4
            </Badge>
          </div>

          {currentStep < 4 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={currentStep === 1 && !project.name.trim()}
              className="flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={createProject}
              disabled={isSubmitting || !project.name.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Project
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