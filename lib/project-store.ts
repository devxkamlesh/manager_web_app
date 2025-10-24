import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Project {
  id: string
  name: string
  description: string | null
  github_url: string | null
  website_url: string | null
  tech_stack: string[]
  priority: 'low' | 'medium' | 'high'
  status: 'planning' | 'active' | 'completed' | 'paused' | 'cancelled'
  scope: string | null // small, medium, large, ongoing
  risk_level: string | null // low, medium, high
  start_date: string | null
  end_date: string | null
  budget: number | null
  estimated_hours: number | null
  team_members: string[]
  tags: string[]
  category: string | null
  progress: number // 0-100
  created_at: string
  updated_at: string
}

interface ProjectStore {
  projects: Project[]
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  getProject: (id: string) => Project | undefined
  getProjectsByStatus: (status: Project['status']) => Project[]
  getProjectsByPriority: (priority: Project['priority']) => Project[]
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        set((state) => ({
          projects: [newProject, ...state.projects]
        }))
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updated_at: new Date().toISOString() }
              : project
          )
        }))
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id)
        }))
      },
      
      getProject: (id) => {
        return get().projects.find((project) => project.id === id)
      },
      
      getProjectsByStatus: (status) => {
        return get().projects.filter((project) => project.status === status)
      },
      
      getProjectsByPriority: (priority) => {
        return get().projects.filter((project) => project.priority === priority)
      },
    }),
    {
      name: 'project-storage',
    }
  )
)