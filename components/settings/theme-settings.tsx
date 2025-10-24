"use client"

import { useThemeStore, themeColors, type ThemeColor } from "@/lib/theme-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Palette, Check, Moon } from "lucide-react"

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
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(themeColors).map(([key, colorTheme]) => (
                <Button
                  key={key}
                  variant={color === key ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setColor(key as ThemeColor)}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Color preview */}
                    <div className="flex gap-1.5">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: `hsl(${colorTheme.cssVars.dark['--primary']})` }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: `hsl(${colorTheme.cssVars.dark['--secondary']})` }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: `hsl(${colorTheme.cssVars.dark['--accent']})` }}
                      />
                    </div>
                    
                    {/* Theme info */}
                    <div className="flex-1 text-left">
                      <div className="font-medium">{colorTheme.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {key === 'default' && 'Clean and minimal design'}
                        {key === 'blue' && 'Professional and trustworthy'}
                        {key === 'violet' && 'Creative and modern'}
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    {color === key && <Check className="w-4 h-4" />}
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