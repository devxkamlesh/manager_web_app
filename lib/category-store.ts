import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Category {
  id: string
  name: string
  icon: string // Icon name from lucide-react
  color: string // Color class for theming
  created_at: string
}

interface CategoryState {
  categories: Category[]
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void
  getCategories: () => Category[]
  getCategoryById: (id: string) => Category | undefined
  initializeDefaultCategories: () => void
}

// Default categories for new users
const defaultCategories: Omit<Category, 'id' | 'created_at'>[] = [
  { name: 'Development', icon: 'Code', color: 'blue' },
  { name: 'Design', icon: 'Palette', color: 'purple' },
  { name: 'Research', icon: 'Search', color: 'green' },
  { name: 'Meeting', icon: 'Users', color: 'orange' },
  { name: 'Documentation', icon: 'FileText', color: 'gray' },
  { name: 'Library', icon: 'BookOpen', color: 'indigo' },
]

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        }
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }))
      },
      
      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map(category =>
            category.id === id
              ? { ...category, ...updates }
              : category
          )
        }))
      },
      
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter(category => category.id !== id)
        }))
      },
      
      getCategories: () => get().categories,
      
      getCategoryById: (id) => get().categories.find(category => category.id === id),
      
      initializeDefaultCategories: () => {
        const currentCategories = get().categories
        if (currentCategories.length === 0) {
          const defaultCats = defaultCategories.map(cat => ({
            ...cat,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
          }))
          set({ categories: defaultCats })
        }
      }
    }),
    {
      name: 'devflow-categories-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)