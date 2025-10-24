"use client"

import { useThemeStore } from "@/lib/theme-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ThemeTest() {
  const { color, setColor } = useThemeStore()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Current theme: {color}</p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant={color === 'default' ? 'default' : 'outline'}
            onClick={() => setColor('default')}
          >
            Default
          </Button>
          <Button 
            size="sm" 
            variant={color === 'blue' ? 'default' : 'outline'}
            onClick={() => setColor('blue')}
          >
            Blue
          </Button>
          <Button 
            size="sm" 
            variant={color === 'violet' ? 'default' : 'outline'}
            onClick={() => setColor('violet')}
          >
            Violet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}