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
  updateSampleTaskDates: () => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: 'sample-1',
          title: 'Review project documentation',
          description: 'Go through the project docs and update any outdated information',
          category: 'work',
          priority: 'high' as const,
          estimated_hours: 2,
          due_date: (() => {
            const now = new Date();
            const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
            const year = indianTime.getFullYear();
            const month = String(indianTime.getMonth() + 1).padStart(2, '0');
            const day = String(indianTime.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          })(), // Today in Indian timezone
          scheduled_date: null,
          project_id: null,
          tags: ['documentation', 'review'],
          status: 'todo' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sample-2',
          title: 'Implement user authentication',
          description: 'Add login and registration functionality with proper validation',
          category: 'development',
          priority: 'high' as const,
          estimated_hours: 4,
          due_date: null,
          scheduled_date: (() => {
            const now = new Date();
            const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
            const year = indianTime.getFullYear();
            const month = String(indianTime.getMonth() + 1).padStart(2, '0');
            const day = String(indianTime.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          })(), // Today in Indian timezone
          project_id: null,
          tags: ['auth', 'security'],
          status: 'in_progress' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sample-3',
          title: 'Design system updates',
          description: 'Update the design system components and documentation',
          category: 'design',
          priority: 'medium' as const,
          estimated_hours: 3,
          due_date: null,
          scheduled_date: null,
          project_id: null,
          tags: ['design', 'ui'],
          status: 'todo' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sample-4',
          title: 'Database optimization',
          description: 'Optimize database queries and improve performance',
          category: 'development',
          priority: 'medium' as const,
          estimated_hours: 1.5,
          due_date: (() => {
            const now = new Date();
            const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
            indianTime.setDate(indianTime.getDate() - 1); // Yesterday
            const year = indianTime.getFullYear();
            const month = String(indianTime.getMonth() + 1).padStart(2, '0');
            const day = String(indianTime.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          })(), // Yesterday in Indian timezone (overdue)
          scheduled_date: null,
          project_id: null,
          tags: ['database', 'performance'],
          status: 'todo' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      
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
      
      getTaskById: (id) => get().tasks.find(task => task.id === id),
      
      updateSampleTaskDates: () => {
        const getIndianDate = () => {
          const now = new Date();
          const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
          const year = indianTime.getFullYear();
          const month = String(indianTime.getMonth() + 1).padStart(2, '0');
          const day = String(indianTime.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        
        const today = getIndianDate();
        const yesterday = (() => {
          const now = new Date();
          const indianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
          indianTime.setDate(indianTime.getDate() - 1);
          const year = indianTime.getFullYear();
          const month = String(indianTime.getMonth() + 1).padStart(2, '0');
          const day = String(indianTime.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })();
        
        set((state) => ({
          tasks: state.tasks.map(task => {
            if (task.id === 'sample-1') {
              return { ...task, due_date: today, updated_at: new Date().toISOString() };
            }
            if (task.id === 'sample-2') {
              return { ...task, scheduled_date: today, updated_at: new Date().toISOString() };
            }
            if (task.id === 'sample-4') {
              return { ...task, due_date: yesterday, updated_at: new Date().toISOString() };
            }
            return task;
          })
        }));
      }
    }),
    {
      name: 'devflow-tasks-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)