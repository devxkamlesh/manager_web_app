'use client'

import { ProjectOverview } from '@/components/projects/project-overview'
import { Sidebar } from '@/components/layout/sidebar'
import { FolderOpen, Plus, Search, CalendarDays, Filter, List, Grid3X3, Columns3 } from 'lucide-react'
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/navigation/dropdown-menu'
import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '@/lib/theme-store'
import { getIndianDate } from '@/lib/utils'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    setSelectedDate(getIndianDate())
  }, [])
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'board'>('grid')
  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'>('all')
  const { color: themeColor } = useThemeStore()
  const projectManagerRef = useRef<{
    setFilter: (filter: string) => void;
    setViewMode: (mode: 'list' | 'grid' | 'board') => void;
    setSearchQuery: (query: string) => void;
  }>(null)

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar activeView="projects" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="border-b bg-background p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">My Projects</h1>
                <p className="text-muted-foreground">Build amazing things</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-6">
            <div className="relative">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48 pl-10"
                lang="hi-IN"
              />
              <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            </div>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  projectManagerRef.current?.setSearchQuery(e.target.value)
                }}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter('all')
                  projectManagerRef.current?.setFilter('all')
                }}>
                  All Projects
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter('planning')
                  projectManagerRef.current?.setFilter('planning')
                }}>
                  Planning
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter('active')
                  projectManagerRef.current?.setFilter('active')
                }}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter('completed')
                  projectManagerRef.current?.setFilter('completed')
                }}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setStatusFilter('paused')
                  projectManagerRef.current?.setFilter('paused')
                }}>
                  Paused
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => {
                  setViewMode('list')
                  projectManagerRef.current?.setViewMode('list')
                }}>
                  <List className="w-4 h-4 mr-2" />
                  List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setViewMode('grid')
                  projectManagerRef.current?.setViewMode('grid')
                }}>
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setViewMode('board')
                  projectManagerRef.current?.setViewMode('board')
                }}>
                  <Columns3 className="w-4 h-4 mr-2" />
                  Board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <ProjectOverview 
            ref={projectManagerRef}
            searchQuery={searchQuery} 
            showCreateDialog={showCreateDialog}
            setShowCreateDialog={setShowCreateDialog}
            selectedDate={selectedDate}
            viewMode={viewMode}
            statusFilter={statusFilter}
          />
        </main>
      </div>
    </div>
  )
}