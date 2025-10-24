"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useThemeStore, themeColors } from "@/lib/theme-store"

function ThemeApplier() {
  const { color } = useThemeStore()

  React.useEffect(() => {
    const root = document.documentElement
    const colorTheme = themeColors[color]
    
    // Force dark mode
    root.classList.add('dark')
    
    // Remove existing theme classes
    root.classList.remove('theme-default', 'theme-blue', 'theme-violet')
    root.classList.add(`theme-${color}`)
    
    // Apply color theme variables
    Object.entries(colorTheme.cssVars.dark).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [color])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      {...props} 
      forcedTheme="dark" 
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ThemeApplier />
      {children}
    </NextThemesProvider>
  )
}