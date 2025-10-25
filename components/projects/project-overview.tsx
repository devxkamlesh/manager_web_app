"use client"

import { useState, useMemo, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Progress } from "@/components/ui/feedback/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/navigation/dropdown-menu"
import { Plus, Github, Calendar, Target, CheckSquare, Pause, Globe, Users, Code, DollarSign, MoreHorizontal, Eye, Edit, Trash2, Rocket, Sparkles } from "lucide-react"
import { EmptyState } from "@/components/ui/display/empty-state"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { ProjectViewDialog } from "@/components/projects/project-view-dialog"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { formatTimeAgo, cn } from "@/lib/utils"
import { useProjectStore, type Project } from "@/lib/project-store"
import { useCategoryStore } from "@/lib/category-store"
import { getIconByName } from "@/lib/icon-library"
import { useThemeStore } from "@/lib/theme-store"
import { useToast } from "@/hooks/use-toast"

interface ProjectOverviewProps {
  searchQuery?: string
  showCreateDialog?: boolean
  setShowCreateDialog?: (show: boolean) => void
  selectedDate?: string
  viewMode?: 'list' | 'grid' | 'board'
  statusFilter?: 'all' | 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'
}

export interface ProjectManagerRef {
  setFilter: (filter: string) => void
  setViewMode: (mode: 'list' | 'grid' | 'board') => void
  setSearchQuery: (query: string) => void
}

export const ProjectOverview = forwardRef<ProjectManagerRef, ProjectOverviewProps>(({ 
  searchQuery = '', 
  showCreateDialog = false, 
  setShowCreateDialog,
  selectedDate,
  viewMode = 'grid',
  statusFilter = 'all'
}, ref) => {
  const { projects, deleteProject } = useProjectStore()
  const { getCategoryById } = useCategoryStore()
  const { toast } = useToast()
  const [internalShowDialog, setInternalShowDialog] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [internalSelectedDate, setInternalSelectedDate] = useState('')
  const [internalStatusFilter, setInternalStatusFilter] = useState<'all' | 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'>('all')
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'grid' | 'board'>('grid')
  
  // Dialog states
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const dialogOpen = setShowCreateDialog ? showCreateDialog : internalShowDialog
  const setDialogOpen = setShowCreateDialog || setInternalShowDialog
  const currentSearchQuery = searchQuery || internalSearchQuery
  const currentSelectedDate = selectedDate || internalSelectedDate
  const currentStatusFilter = statusFilter || internalStatusFilter

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    setFilter: (filter: string) => {
      setInternalStatusFilter(filter as any)
    },
    setViewMode: (mode: 'list' | 'grid' | 'board') => {
      setInternalViewMode(mode)
    },
    setSearchQuery: (query: string) => {
      setInternalSearchQuery(query)
    }
  }))

  // Filter projects based on search query, date, and status
  const filteredProjects = useMemo(() => {
    let filtered = projects
    
    // Filter by status
    if (currentStatusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === currentStatusFilter)
    }
    
    // Filter by date if selectedDate is provided
    // Filter by date if selectedDate is provided
    if (currentSelectedDate) {
      const targetDate = new Date(currentSelectedDate).toDateString()
      filtered = filtered.filter(project => {
        const projectDate = new Date(project.created_at).toDateString()
        return projectDate === targetDate
      })
    }

    // Filter by search query
    if (currentSearchQuery.trim()) {
      const query = currentSearchQuery.toLowerCase()
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.tech_stack?.some(tech => tech.toLowerCase().includes(query)) ||
        project.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }, [projects, currentSearchQuery, currentSelectedDate, currentStatusFilter])



  const getStatusStyles = (status: Project['status']) => {
    switch (status) {
      case 'planning': 
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800"
      case 'active': 
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800"
      case 'completed': 
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800"
      case 'paused': 
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800"
      case 'cancelled': 
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
      default: 
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800"
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-500 shadow-green-500/20'
      case 'medium': return 'bg-yellow-500 shadow-yellow-500/20'
      case 'high': return 'bg-red-500 shadow-red-500/20'
      default: return 'bg-gray-500 shadow-gray-500/20'
    }
  }

  const getProjectCardGradient = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return "bg-gradient-to-br from-blue-50/30 via-card to-card/95 dark:from-blue-950/10"
      case 'active':
        return "bg-gradient-to-br from-green-50/30 via-card to-card/95 dark:from-green-950/10"
      case 'completed':
        return "bg-gradient-to-br from-gray-50/30 via-card to-card/95 dark:from-gray-950/10"
      case 'paused':
        return "bg-gradient-to-br from-yellow-50/30 via-card to-card/95 dark:from-yellow-950/10"
      case 'cancelled':
        return "bg-gradient-to-br from-red-50/30 via-card to-card/95 dark:from-red-950/10"
      default:
        return "bg-gradient-to-br from-primary/5 via-card to-card/95"
    }
  }

  const handleViewProject = (project: Project) => {
    setViewProject(project)
    setShowViewDialog(true)
  }

  const handleEditProject = (project: Project) => {
    setEditProject(project)
    setShowEditDialog(true)
  }

  const handleDeleteProject = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      try {
        deleteProject(project.id)
        toast({
          title: "✅ Project deleted",
          description: `"${project.name}" has been deleted successfully.`
        })
      } catch (error) {
        toast({
          title: "Failed to delete project",
          description: "Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredProjects.length}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{filteredProjects.filter(p => p.status === 'planning').length}</div>
            <div className="text-sm text-muted-foreground">Planning</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filteredProjects.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{filteredProjects.filter(p => p.status === 'completed').length}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{filteredProjects.filter(p => p.status === 'paused').length}</div>
            <div className="text-sm text-muted-foreground">Paused</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button className="shadow-sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const category = getCategoryById(project.category || '')
            return (
              <Card key={project.id} className={cn(
                "group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-0 relative overflow-hidden",
                "bg-gradient-to-br from-card/80 via-card to-card/90 backdrop-blur-sm",
                "hover:scale-[1.02] hover:-translate-y-2",
                getProjectCardGradient(project.status)
              )}>
                {/* Status indicator bar */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-1",
                  project.status === 'active' && "bg-gradient-to-r from-green-400 to-green-600",
                  project.status === 'planning' && "bg-gradient-to-r from-blue-400 to-blue-600",
                  project.status === 'completed' && "bg-gradient-to-r from-gray-400 to-gray-600",
                  project.status === 'paused' && "bg-gradient-to-r from-yellow-400 to-yellow-600",
                  project.status === 'cancelled' && "bg-gradient-to-r from-red-400 to-red-600"
                )} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {category && (
                          <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30 font-semibold px-3 py-1 rounded-full shadow-sm">
                            {(() => {
                              const IconComponent = getIconByName(category.icon)
                              return <IconComponent className="w-3 h-3 mr-1" />
                            })()}
                            {category.name}
                          </Badge>
                        )}
                        <div 
                          className={cn(
                            "w-4 h-4 rounded-full shadow-lg ring-2 ring-white/20",
                            getPriorityColor(project.priority)
                          )} 
                          title={`${project.priority} priority`} 
                        />
                      </div>
                      <CardTitle 
                        className="text-xl group-hover:text-primary transition-all duration-300 cursor-pointer font-bold hover:scale-[1.02] origin-left"
                        onClick={() => handleViewProject(project)}
                      >
                        {project.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline"
                        className={cn("shadow-sm font-semibold px-3 py-1 rounded-full", getStatusStyles(project.status))}
                      >
                        {project.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-primary/10 hover:scale-110 transition-all duration-200 rounded-full opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewProject(project)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProject(project)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-6 pb-6">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-80">
                      {project.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-semibold">Progress</span>
                      <span className="font-bold text-primary text-lg">{project.progress}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={project.progress} className="h-4 bg-muted/40 rounded-full overflow-hidden" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary font-semibold px-3 py-1 rounded-full shadow-sm">
                          <Code className="w-2 h-2 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-muted/60 font-semibold px-3 py-1 rounded-full shadow-sm">
                          +{project.tech_stack.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-full font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatTimeAgo(new Date(project.updated_at))}
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-full font-medium">
                          <DollarSign className="w-3 h-3" />
                          {project.budget.toLocaleString()}
                        </div>
                      )}
                      {project.team_members && project.team_members.length > 0 && (
                        <div className="flex items-center gap-1 bg-muted/30 px-2 py-1 rounded-full font-medium">
                          <Users className="w-3 h-3" />
                          {project.team_members.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-all duration-200 p-2 rounded-full hover:bg-primary/10 hover:scale-110"
                          title="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.website_url && (
                        <a
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-all duration-200 p-2 rounded-full hover:bg-primary/10 hover:scale-110"
                          title="Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredProjects.length === 0 && projects.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<Rocket className="w-16 h-16 text-primary/40" />}
                title="Ready to start your first project?"
                description="Projects help you organize your work, track progress, and stay focused on what matters most."
                action={{
                  label: "Create Your First Project",
                  onClick: () => setDialogOpen(true)
                }}
                className="bg-gradient-to-br from-primary/5 via-muted/20 to-muted/10 border-primary/20"
              />
            </div>
          )}

          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<Sparkles className="w-16 h-16 text-primary/40" />}
                title="No projects found"
                description={`No projects match "${currentSearchQuery}". Try adjusting your search terms.`}
                className="bg-gradient-to-br from-primary/5 via-muted/20 to-muted/10 border-primary/20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onProjectCreated={() => {
          // Refresh projects if needed
        }}
      />

      {/* View Project Dialog */}
      <ProjectViewDialog
        project={viewProject}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        onEdit={() => {
          if (viewProject) {
            setShowViewDialog(false)
            handleEditProject(viewProject)
          }
        }}
      />

      {/* Edit Project Dialog */}
      <EditProjectDialog
        project={editProject}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onProjectUpdated={() => {
          setEditProject(null)
        }}
      />
    </div>
  )
})