"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard } from "lucide-react"

export function KeyboardShortcuts() {
  const shortcuts = [
    {
      category: "Focus Timer",
      shortcuts: [
        { keys: ["Space"], description: "Start/Pause timer" },
        { keys: ["R"], description: "Reset timer" },
        { keys: ["F"], description: "Toggle fullscreen" },
        { keys: ["S"], description: "Toggle settings" },
      ]
    },
    {
      category: "Navigation",
      shortcuts: [
        { keys: ["Ctrl", "1"], description: "Go to Dashboard" },
        { keys: ["Ctrl", "2"], description: "Go to Tasks" },
        { keys: ["Ctrl", "3"], description: "Go to Focus" },
        { keys: ["Ctrl", "4"], description: "Go to Projects" },
        { keys: ["Ctrl", "5"], description: "Go to Analytics" },
      ]
    },
    {
      category: "Tasks",
      shortcuts: [
        { keys: ["N"], description: "New task" },
        { keys: ["Enter"], description: "Complete task" },
        { keys: ["E"], description: "Edit task" },
        { keys: ["Del"], description: "Delete task" },
      ]
    },
    {
      category: "General",
      shortcuts: [
        { keys: ["Ctrl", "/"], description: "Show help" },
        { keys: ["Ctrl", ","], description: "Open settings" },
        { keys: ["Esc"], description: "Close modal/panel" },
      ]
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Keyboard className="h-5 w-5" />
          <span>Keyboard Shortcuts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {shortcuts.map((category, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-3">{category.category}</h3>
            <div className="space-y-2">
              {category.shortcuts.map((shortcut, shortcutIndex) => (
                <div key={shortcutIndex} className="flex items-center justify-between">
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex items-center space-x-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <div key={keyIndex} className="flex items-center">
                        <Badge variant="outline" className="text-xs px-2 py-1 font-mono">
                          {key}
                        </Badge>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="mx-1 text-xs text-muted-foreground">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}