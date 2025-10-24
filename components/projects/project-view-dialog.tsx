"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { type Project } from "@/lib/project-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { 
  FolderOpen, Github, ExternalLink, Calendar, Target, Users, Code, DollarSign, 
  Flag, Clock, Edit, X, Play, Pause, CheckSquare, XCircle
} from "lucide-react"

interface ProjectViewDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: () => void
}

export function ProjectViewDialog({ project, open, onOpenChange, onEdit }: ProjectViewDialogProps) {
  if (!project) return null

  const { getCategoryById } = useCategoryStore()
  const category = getCategoryById(project.category || '')

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning': return Target
      case 'active': return Play
      case 'paused': return Pause
      case 'completed': return CheckSquare
      case 'cancelled': return XCircle
      default: return Target
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'completed': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="w-6 h-6 text-primary" />
              {project.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </DialogHeader> 
       <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {category && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {(() => {
                    const IconComponent = getIconByName(category.icon)
                    return <IconComponent className="w-3 h-3 mr-1" />
                  })()}
                  {category.name}
                </Badge>
              )}
              <div className="flex items-center gap-3">
                <Badge className={`${getStatusColor(project.status)}`}>
                  {(() => {
                    const StatusIcon = getStatusIcon(project.status)
                    return <StatusIcon className="w-3 h-3 mr-1" />
                  })()}
                  {project.status}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(project.priority)}`} />
                  <span className="text-sm text-muted-foreground capitalize">{project.priority} Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Progress</h3>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {project.start_date && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Start Date</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {project.budget && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Budget</h4>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {project.estimated_hours && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Estimated Hours</h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{project.estimated_hours} hours</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {project.end_date && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">End Date</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{new Date(project.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {project.team_members && project.team_members.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Team Members</h4>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{project.team_members.length} members</span>
                  </div>
                </div>
              )}

              {project.scope && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">Project Scope</h4>
                  <Badge variant="outline" className="capitalize">
                    {project.scope}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Tech Stack */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-4">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                View Repository
              </a>
            )}
            {project.website_url && (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </a>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}