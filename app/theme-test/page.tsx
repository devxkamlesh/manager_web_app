"use client"

import { useThemeStore } from "@/lib/theme-store"
import { Button } from "@/components/ui/forms/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"

export default function ThemeTestPage() {
  const { color, setColor } = useThemeStore()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Current theme: <strong className="text-foreground">{color}</strong></p>
            
            <div className="flex gap-3">
              <Button 
                variant={color === 'default' ? 'default' : 'outline'}
                onClick={() => setColor('default')}
              >
                White Theme
              </Button>
              <Button 
                variant={color === 'blue' ? 'default' : 'outline'}
                onClick={() => setColor('blue')}
              >
                Blue Theme
              </Button>
              <Button 
                variant={color === 'violet' ? 'default' : 'outline'}
                onClick={() => setColor('violet')}
              >
                Violet Theme
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="p-4">
                <h3 className="font-semibold text-foreground">Primary</h3>
                <div className="w-full h-8 bg-primary rounded mt-2"></div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold text-foreground">Secondary</h3>
                <div className="w-full h-8 bg-secondary rounded mt-2"></div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold text-foreground">Accent</h3>
                <div className="w-full h-8 bg-accent rounded mt-2"></div>
              </Card>
            </div>

            <div className="space-y-2">
              <p className="text-foreground">Foreground text</p>
              <p className="text-muted-foreground">Muted foreground text</p>
              <p className="text-blue-600 dark:text-blue-400">Blue link text</p>
              <p className="text-slate-600 dark:text-slate-400">Slate text</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}