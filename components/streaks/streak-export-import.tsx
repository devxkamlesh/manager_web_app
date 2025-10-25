"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Textarea } from "@/components/ui/forms/textarea"
import { 
  Download, 
  Upload, 
  FileText,
  Copy,
  Check,
  AlertCircle,
  Database
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StreakExportImportProps {
  streaks: Array<{
    id: string
    name: string
    description?: string
    type: string
    current_count: number
    best_count: number
    target_days: number
    created_at: string
    is_active: boolean
    completedDates?: string[]
  }>
  onImport: (streaks: any[]) => void
}

export function StreakExportImport({ streaks, onImport }: StreakExportImportProps) {
  const { toast } = useToast()
  const [importData, setImportData] = useState('')
  const [copied, setCopied] = useState(false)
  const [importing, setImporting] = useState(false)
  
  const exportStreaks = () => {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      streaks: streaks.map(streak => ({
        ...streak,
        // Remove internal IDs for clean import
        id: undefined
      }))
    }
    
    return JSON.stringify(exportData, null, 2)
  }
  
  const downloadExport = () => {
    const data = exportStreaks()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `streaks-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast({
      title: "Export downloaded!",
      description: `${streaks.length} streaks exported successfully.`
    })
  }
  
  const copyToClipboard = async () => {
    const data = exportStreaks()
    
    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      
      toast({
        title: "Copied to clipboard!",
        description: "Export data has been copied to your clipboard."
      })
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try the download option.",
        variant: "destructive"
      })
    }
  }
  
  const validateImportData = (data: string) => {
    try {
      const parsed = JSON.parse(data)
      
      if (!parsed.streaks || !Array.isArray(parsed.streaks)) {
        throw new Error('Invalid format: missing streaks array')
      }
      
      // Validate each streak has required fields
      for (const streak of parsed.streaks) {
        if (!streak.name || !streak.type) {
          throw new Error('Invalid streak: missing required fields (name, type)')
        }
      }
      
      return { valid: true, data: parsed }
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Invalid JSON format' 
      }
    }
  }
  
  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        title: "No data to import",
        description: "Please paste your export data first.",
        variant: "destructive"
      })
      return
    }
    
    setImporting(true)
    
    const validation = validateImportData(importData)
    
    if (!validation.valid) {
      toast({
        title: "Import failed",
        description: validation.error,
        variant: "destructive"
      })
      setImporting(false)
      return
    }
    
    try {
      // Process the streaks and add new IDs
      const processedStreaks = validation.data.streaks.map((streak: any) => ({
        ...streak,
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: streak.created_at || new Date().toISOString(),
        current_count: streak.current_count || 0,
        best_count: streak.best_count || 0,
        target_days: streak.target_days || 30,
        is_active: streak.is_active !== false, // Default to true
        completedDates: streak.completedDates || []
      }))
      
      onImport(processedStreaks)
      setImportData('')
      
      toast({
        title: "Import successful!",
        description: `${processedStreaks.length} streaks imported successfully.`
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "An error occurred while importing your streaks.",
        variant: "destructive"
      })
    }
    
    setImporting(false)
  }
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
  }
  
  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Streaks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Current Streaks</p>
                <p className="text-sm text-muted-foreground">
                  {streaks.length} streaks ready for export
                </p>
              </div>
            </div>
            <Badge variant="outline">{streaks.length} items</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={downloadExport} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
            <Button onClick={copyToClipboard} variant="outline" className="flex-1">
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-blue-500" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">Export includes:</p>
                <ul className="mt-1 space-y-1 text-blue-600 dark:text-blue-400">
                  <li>• Streak names, descriptions, and types</li>
                  <li>• Current and best streak counts</li>
                  <li>• Target days and completion history</li>
                  <li>• Creation dates and active status</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Streaks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Or Paste JSON Data</label>
            <Textarea
              placeholder="Paste your exported streak data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
          </div>
          
          <Button 
            onClick={handleImport} 
            disabled={!importData.trim() || importing}
            className="w-full"
          >
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Streaks
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300">Import Notes:</p>
                <ul className="mt-1 space-y-1 text-yellow-600 dark:text-yellow-400">
                  <li>• Imported streaks will be added to your existing ones</li>
                  <li>• New unique IDs will be generated for imported streaks</li>
                  <li>• Only valid JSON export files are supported</li>
                  <li>• Backup your current streaks before importing</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}