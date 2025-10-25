"use client"

import { useThemeStore, themeColors, type ThemeColor } from "@/lib/theme-store"
import { Button } from "@/components/ui/forms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { Palette, Check, Moon } from "lucide-react"

const getColorDescription = (colorKey: string) => {
  const descriptions: Record<string, string> = {
    default: 'Clean & minimal',
    blue: 'Professional',
    violet: 'Creative',
    green: 'Natural',
    orange: 'Energetic',
    red: 'Bold',
    pink: 'Playful',
    yellow: 'Bright',
    indigo: 'Deep',
    teal: 'Calm'
  }
  return descriptions[colorKey] || 'Custom'
}

export function ThemeSettings() {
  const { color, setColor } = useThemeStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your DevFlow experience</p>
      </div>

      {/* Theme Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Customization
          </CardTitle>
          <CardDescription>
            DevFlow uses a dark-only interface with beautiful color themes. Choose your preferred accent color.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dark mode info */}
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
            <Moon className="w-5 h-5" />
            <div className="flex-1">
              <div className="text-sm font-medium">Dark Mode Active</div>
              <div className="text-xs text-muted-foreground">Optimized for focus and reduced eye strain</div>
            </div>
            <Badge variant="secondary">Always On</Badge>
          </div>

          <Separator />

          {/* Color themes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Color Themes</h3>
            <p className="text-sm text-muted-foreground">Choose your preferred accent color for the interface</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(themeColors).map(([key, colorTheme]) => (
                <Button
                  key={key}
                  variant="ghost"
                  className={`h-auto p-4 flex flex-col gap-3 relative transition-all duration-200 ${
                    color === key 
                      ? 'ring-2 ring-primary bg-primary/5 shadow-lg' 
                      : 'hover:bg-muted/50 hover:shadow-md'
                  }`}
                  onClick={() => setColor(key as ThemeColor)}
                >
                  {/* Selection indicator */}
                  {color === key && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  {/* Color preview circles */}
                  <div className="flex justify-center gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${colorTheme.cssVars.light['--primary']})` }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-white shadow-sm self-center"
                      style={{ backgroundColor: `hsl(${colorTheme.cssVars.light['--secondary']})` }}
                    />
                  </div>
                  
                  {/* Theme name */}
                  <div className="text-center">
                    <div className="font-medium text-sm">{colorTheme.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {getColorDescription(key)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Preview section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Preview</h3>
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Primary Color</div>
                    <div className="text-xs text-muted-foreground">Used for buttons and highlights</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">Primary Button</Button>
                  <Button size="sm" variant="outline">Secondary</Button>
                  <Button size="sm" variant="secondary">Tertiary</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}