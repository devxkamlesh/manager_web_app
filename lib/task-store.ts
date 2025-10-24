import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Task {
  id: string
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high'
  estimated_hours: number | null
  due_date: string | null
  scheduled_date: string | null // When the task is scheduled to be worked on
  project_id: string | null // Optional project association
  tags: string[]
  status: 'todo' | 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasks: () => Task[]
  getTaskById: (id: string) => Task | undefined
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }))
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updated_at: new Date().toISOString() }
              : task
          )
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }))
      },
      
      getTasks: () => get().tasks,
      
      getTaskById: (id) => get().tasks.find(task => task.id === id)
    }),
    {
      name: 'devflow-tasks-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)