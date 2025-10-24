"use client"

import { useState, useMemo, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Github, ExternalLink, Calendar, Target, CheckSquare, Pause, Globe, Users, Code, DollarSign, Flag, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { EmptyState } from "@/components/ui/display/empty-state"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

import { ProjectViewDialog } from "@/components/projects/project-view-dialog"
import { formatTimeAgo } from "@/lib/utils"
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
  setSelectedDate: (date: string) => void
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
  const { color: themeColor } = useThemeStore()
  const { toast } = useToast()
  const [internalShowDialog, setInternalShowDialog] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [internalSelectedDate, setInternalSelectedDate] = useState('')
  const [internalStatusFilter, setInternalStatusFilter] = useState<'all' | 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'>('all')
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'grid' | 'board'>('grid')
  
  // Dialog states
  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const dialogOpen = setShowCreateDialog ? showCreateDialog : internalShowDialog
  const setDialogOpen = setShowCreateDialog || setInternalShowDialog
  const currentSearchQuery = searchQuery || internalSearchQuery
  const currentSelectedDate = selectedDate || internalSelectedDate
  const currentStatusFilter = statusFilter || internalStatusFilter
  const currentViewMode = viewMode || internalViewMode

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
    },
    setSelectedDate: (date: string) => {
      setInternalSelectedDate(date)
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

  const getStatusVariant = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'outline'
      case 'active': return 'default'
      case 'completed': return 'secondary'
      case 'paused': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'text-blue-600'
      case 'active': return 'text-green-600'
      case 'completed': return 'text-gray-600'
      case 'paused': return 'text-yellow-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
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

  const handleViewProject = (project: Project) => {
    setViewProject(project)
    setShowViewDialog(true)
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
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total</p>
                <p className="text-xl font-bold text-foreground">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Planning</p>
                <p className="text-xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'planning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Active</p>
                <p className="text-xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-500 rounded-lg">
                <CheckSquare className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Completed</p>
                <p className="text-xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Pause className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Paused</p>
                <p className="text-xl font-bold text-foreground">
                  {projects.filter(p => p.status === 'paused').length}
                </p>
              </div>
            </div>
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
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {category && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {(() => {
                              const IconComponent = getIconByName(category.icon)
                              return <IconComponent className="w-3 h-3 mr-1" />
                            })()}
                            {category.name}
                          </Badge>
                        )}
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} title={`${project.priority} priority`} />
                      </div>
                      <CardTitle 
                        className="text-lg group-hover:text-primary transition-colors cursor-pointer"
                        onClick={() => handleViewProject(project)}
                      >
                        {project.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getStatusVariant(project.status)}
                        className={`shadow-sm ${getStatusColor(project.status)}`}
                      >
                        {project.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProject(project)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
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
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.tech_stack.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tech_stack.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Project Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatTimeAgo(new Date(project.updated_at))}
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {project.budget.toLocaleString()}
                        </div>
                      )}
                      {project.team_members && project.team_members.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {project.team_members.length}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors p-1 rounded hover:bg-muted"
                          title="GitHub Repository"
                        >
                          <Github className="w-3 h-3" />
                        </a>
                      )}
                      {project.website_url && (
                        <a
                          href={project.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary transition-colors p-1 rounded hover:bg-muted"
                          title="Website"
                        >
                          <Globe className="w-3 h-3" />
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
                icon="🚀"
                title="Ready to start your first project?"
                description="Projects help you organize your work, track progress, and stay focused on what matters most."
                action={{
                  label: "Create Your First Project",
                  onClick: () => setDialogOpen(true)
                }}
                className="bg-gradient-to-br from-muted/50 to-muted/20"
              />
            </div>
          )}

          {filteredProjects.length === 0 && projects.length > 0 && (
            <div className="col-span-full">
              <EmptyState
                icon="🔍"
                title="No projects found"
                description={`No projects match "${searchQuery}". Try adjusting your search terms.`}
                className="bg-gradient-to-br from-muted/50 to-muted/20"
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
          // Edit functionality will be added later
          toast({
            title: "Coming Soon",
            description: "Edit functionality will be available soon!"
          })
        }}
      />
    </div>
  )
})