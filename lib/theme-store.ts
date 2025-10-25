import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ThemeColor = 'default' | 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'pink' | 'yellow' | 'indigo' | 'teal'
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
      color: 'blue',
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
  root.classList.remove('theme-default', 'theme-blue', 'theme-violet', 'theme-green', 'theme-orange', 'theme-red', 'theme-pink', 'theme-yellow', 'theme-indigo', 'theme-teal')
  
  // Add new theme class
  root.classList.add(`theme-${color}`)
  
  // Always use dark mode colors
  Object.entries(colorTheme.cssVars.dark).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

export const themeColors = {
  default: {
    name: 'White',
    primary: 'hsl(0 0% 70%)',
    primaryForeground: 'hsl(222.2 84% 4.9%)',
    secondary: 'hsl(210 40% 96%)',
    accent: 'hsl(210 40% 96%)',
    cssVars: {
      light: {
        '--primary': '0 0% 70%',
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '210 40% 96%',
        '--secondary-foreground': '222.2 84% 4.9%',
        '--accent': '210 40% 96%',
        '--accent-foreground': '222.2 84% 4.9%',
        '--border': '214.3 31.8% 91.4%',
        '--ring': '0 0% 70%',
      },
      dark: {
        '--primary': '0 0% 70%',
        '--primary-foreground': '222.2 84% 4.9%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '0 0% 70%',
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
  },
  green: {
    name: 'Green',
    primary: 'hsl(142.1 76.2% 36.3%)',
    primaryForeground: 'hsl(355.7 100% 97.3%)',
    secondary: 'hsl(138.5 76.2% 96.7%)',
    accent: 'hsl(138.5 76.2% 96.7%)',
    cssVars: {
      light: {
        '--primary': '142.1 76.2% 36.3%',
        '--primary-foreground': '355.7 100% 97.3%',
        '--secondary': '138.5 76.2% 96.7%',
        '--secondary-foreground': '142.1 76.2% 36.3%',
        '--accent': '138.5 76.2% 96.7%',
        '--accent-foreground': '142.1 76.2% 36.3%',
        '--border': '138.5 76.2% 96.7%',
        '--ring': '142.1 76.2% 36.3%',
      },
      dark: {
        '--primary': '142.1 70.6% 45.3%',
        '--primary-foreground': '144.9 80.4% 10%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '142.1 70.6% 45.3%',
      }
    }
  },
  orange: {
    name: 'Orange',
    primary: 'hsl(24.6 95% 53.1%)',
    primaryForeground: 'hsl(60 9.1% 97.8%)',
    secondary: 'hsl(60 4.8% 95.9%)',
    accent: 'hsl(60 4.8% 95.9%)',
    cssVars: {
      light: {
        '--primary': '24.6 95% 53.1%',
        '--primary-foreground': '60 9.1% 97.8%',
        '--secondary': '60 4.8% 95.9%',
        '--secondary-foreground': '24.6 95% 53.1%',
        '--accent': '60 4.8% 95.9%',
        '--accent-foreground': '24.6 95% 53.1%',
        '--border': '60 4.8% 95.9%',
        '--ring': '24.6 95% 53.1%',
      },
      dark: {
        '--primary': '20.5 90.2% 48.2%',
        '--primary-foreground': '60 9.1% 97.8%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '20.5 90.2% 48.2%',
      }
    }
  },
  red: {
    name: 'Red',
    primary: 'hsl(0 84.2% 60.2%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(0 0% 96.1%)',
    accent: 'hsl(0 0% 96.1%)',
    cssVars: {
      light: {
        '--primary': '0 84.2% 60.2%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '0 0% 96.1%',
        '--secondary-foreground': '0 84.2% 60.2%',
        '--accent': '0 0% 96.1%',
        '--accent-foreground': '0 84.2% 60.2%',
        '--border': '0 0% 96.1%',
        '--ring': '0 84.2% 60.2%',
      },
      dark: {
        '--primary': '0 72.2% 50.6%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '0 72.2% 50.6%',
      }
    }
  },
  pink: {
    name: 'Pink',
    primary: 'hsl(322.2 84% 60.5%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(322.2 84% 95.9%)',
    accent: 'hsl(322.2 84% 95.9%)',
    cssVars: {
      light: {
        '--primary': '322.2 84% 60.5%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '322.2 84% 95.9%',
        '--secondary-foreground': '322.2 84% 60.5%',
        '--accent': '322.2 84% 95.9%',
        '--accent-foreground': '322.2 84% 60.5%',
        '--border': '322.2 84% 95.9%',
        '--ring': '322.2 84% 60.5%',
      },
      dark: {
        '--primary': '322.2 84% 60.5%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '322.2 84% 60.5%',
      }
    }
  },
  yellow: {
    name: 'Yellow',
    primary: 'hsl(47.9 95.8% 53.1%)',
    primaryForeground: 'hsl(26 83.3% 14.1%)',
    secondary: 'hsl(60 4.8% 95.9%)',
    accent: 'hsl(60 4.8% 95.9%)',
    cssVars: {
      light: {
        '--primary': '47.9 95.8% 53.1%',
        '--primary-foreground': '26 83.3% 14.1%',
        '--secondary': '60 4.8% 95.9%',
        '--secondary-foreground': '47.9 95.8% 53.1%',
        '--accent': '60 4.8% 95.9%',
        '--accent-foreground': '47.9 95.8% 53.1%',
        '--border': '60 4.8% 95.9%',
        '--ring': '47.9 95.8% 53.1%',
      },
      dark: {
        '--primary': '47.9 95.8% 53.1%',
        '--primary-foreground': '26 83.3% 14.1%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '47.9 95.8% 53.1%',
      }
    }
  },
  indigo: {
    name: 'Indigo',
    primary: 'hsl(239 84% 67%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(239 84% 95%)',
    accent: 'hsl(239 84% 95%)',
    cssVars: {
      light: {
        '--primary': '239 84% 67%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '239 84% 95%',
        '--secondary-foreground': '239 84% 67%',
        '--accent': '239 84% 95%',
        '--accent-foreground': '239 84% 67%',
        '--border': '239 84% 95%',
        '--ring': '239 84% 67%',
      },
      dark: {
        '--primary': '239 84% 67%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '239 84% 67%',
      }
    }
  },
  teal: {
    name: 'Teal',
    primary: 'hsl(173 80% 40%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(173 80% 95%)',
    accent: 'hsl(173 80% 95%)',
    cssVars: {
      light: {
        '--primary': '173 80% 40%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '173 80% 95%',
        '--secondary-foreground': '173 80% 40%',
        '--accent': '173 80% 95%',
        '--accent-foreground': '173 80% 40%',
        '--border': '173 80% 95%',
        '--ring': '173 80% 40%',
      },
      dark: {
        '--primary': '173 80% 40%',
        '--primary-foreground': '210 40% 98%',
        '--secondary': '217.2 32.6% 17.5%',
        '--secondary-foreground': '210 40% 98%',
        '--accent': '217.2 32.6% 17.5%',
        '--accent-foreground': '210 40% 98%',
        '--border': '217.2 32.6% 17.5%',
        '--ring': '173 80% 40%',
      }
    }
  }
}