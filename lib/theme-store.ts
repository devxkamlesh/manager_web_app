import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeColor = 'default' | 'blue' | 'violet'
export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  color: ThemeColor
  mode: ThemeMode
  setColor: (color: ThemeColor) => void
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      color: 'default',
      mode: 'system',
      setColor: (color) => {
        set({ color })
        // Apply theme immediately
        if (typeof window !== 'undefined') {
          applyThemeColors(color)
        }
      },
      setMode: (mode) => set({ mode }),
    }),
    {
      name: 'devflow-theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Function to apply theme colors
function applyThemeColors(color: ThemeColor) {
  const root = document.documentElement
  const colorTheme = themeColors[color]
  
  // Remove existing theme classes
  root.classList.remove('theme-default', 'theme-blue', 'theme-violet')
  
  // Add new theme class
  root.classList.add(`theme-${color}`)
  
  // Apply CSS variables for light mode
  Object.entries(colorTheme.cssVars.light).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

export const themeColors = {
  default: {
    name: 'White',
    primary: 'hsl(222.2 84% 4.9%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(210 40% 96%)',
    accent: 'hsl(210 40% 96%)',
    cssVars: {
      light: {
        '--primary': '222.2 84% 4.9%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--accent': '210 40% 96%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--border': '214.3 31.8% 91.4%',
        '--ring': '222.2 84% 4.9%',
      },
      dark: {
        '--primary': '210 40% 98%',
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '212.7 26.8% 83.9%',
      }
    }
  },
  blue: {
    name: 'Blue',
    primary: 'hsl(221.2 83.2% 53.3%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(214.3 31.8% 91.4%)',
    accent: 'hsl(214.3 31.8% 91.4%)',
    cssVars: {
      light: {
        '--primary': '221.2 83.2% 53.3%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '214.3 31.8% 91.4%',
        '--secondary-foreground': '221.2 83.2% 53.3%',
        '--accent': '214.3 31.8% 91.4%',
        '--accent-foreground': '221.2 83.2% 53.3%',
        '--border': '214.3 31.8% 91.4%',
        '--ring': '221.2 83.2% 53.3%',
      },
      dark: {
        '--primary': '217.2 91.2% 59.8%',
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '224.3 76.3% 94.1%',
      }
    }
  },
  violet: {
    name: 'Violet',
    primary: 'hsl(262.1 83.3% 57.8%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(270 3.2% 91.4%)',
    accent: 'hsl(270 3.2% 91.4%)',
    cssVars: {
      light: {
        '--primary': '262.1 83.3% 57.8%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '270 3.2% 91.4%',
        '--secondary-foreground': '262.1 83.3% 57.8%',
        '--accent': '270 3.2% 91.4%',
        '--accent-foreground': '262.1 83.3% 57.8%',
        '--border': '270 3.2% 91.4%',
        '--ring': '262.1 83.3% 57.8%',
      },
      dark: {
        '--primary': '263.4 70% 50.4%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '263.4 70% 50.4%',
      }
    }
  }
}