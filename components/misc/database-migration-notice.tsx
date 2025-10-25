"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { AlertTriangle, Database, ExternalLink } from "lucide-react"

interface DatabaseMigrationNoticeProps {
  show: boolean
  onDismiss: () => void
}

export function DatabaseMigrationNotice({ show, onDismiss }: DatabaseMigrationNoticeProps) {
  if (!show) return null

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="w-5 h-5" />
          Database Migration Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-orange-700 dark:text-orange-300">
          The focus timer is using localStorage fallback. For full functionality and persistent time tracking, please run the migration script in your Supabase SQL Editor.
        </p>
        
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-md">
          <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
            <strong>Current Status:</strong> Timer works with localStorage backup
          </p>
          <p className="text-xs font-mono text-orange-800 dark:text-orange-200">
            Migration File: database/migrations/add-focus-session-columns.sql
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
          >
            <Database className="w-4 h-4 mr-2" />
            Open Supabase Dashboard
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-orange-600 hover:bg-orange-100"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}