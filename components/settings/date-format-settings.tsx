"use client"

import { useDateFormatStore, getDateFormatExamples, type DateFormat, type TimeZone, type DateStyle } from "@/lib/date-format-store"
import { Button } from "@/components/ui/forms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { Calendar, Clock, Globe, Check } from "lucide-react"

export function DateFormatSettings() {
  const { format, timezone, defaultStyle, setFormat, setTimezone, setDefaultStyle, formatDate } = useDateFormatStore()
  const examples = getDateFormatExamples()

  const dateStyles: { value: DateStyle; label: string; description: string }[] = [
    { value: 'full', label: 'Full Format', description: 'Complete date with weekday and year' },
    { value: 'medium', label: 'Medium Format', description: 'Date with abbreviated weekday and year' },
    { value: 'short', label: 'Short Format', description: 'Compact date without year' }
  ]

  const timezones: { value: TimeZone; label: string; city: string }[] = [
    { value: 'Asia/Kolkata', label: 'India Standard Time', city: 'Mumbai, Delhi, Kolkata' },
    { value: 'America/New_York', label: 'Eastern Time', city: 'New York, Toronto' },
    { value: 'Europe/London', label: 'Greenwich Mean Time', city: 'London, Dublin' },
    { value: 'UTC', label: 'Coordinated Universal Time', city: 'UTC' }
  ]

  return (
    <div className="space-y-6">
      {/* Date Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date Format
          </CardTitle>
          <CardDescription>
            Choose how dates are displayed throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(examples).map(([key, example]) => (
              <Button
                key={key}
                variant={format === key ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => setFormat(key as DateFormat)}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Format indicator */}
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      format === key ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    <span className="font-medium">{example.name}</span>
                  </div>
                  
                  {/* Examples */}
                  <div className="flex-1 text-left">
                    <div className="text-sm">{example.example}</div>
                    <div className="text-xs text-muted-foreground">Short: {example.short}</div>
                  </div>
                  
                  {/* Selection indicator */}
                  {format === key && <Check className="w-4 h-4" />}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Style Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date Style
          </CardTitle>
          <CardDescription>
            Choose the default level of detail for date displays
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {dateStyles.map((style) => (
              <Button
                key={style.value}
                variant={defaultStyle === style.value ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => setDefaultStyle(style.value)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      defaultStyle === style.value ? 'bg-primary' : 'bg-muted-foreground'
                    }`} />
                    <span className="font-medium">{style.label}</span>
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="text-sm">{formatDate(new Date(), style.value)}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                  
                  {defaultStyle === style.value && <Check className="w-4 h-4" />}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timezone Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Timezone
          </CardTitle>
          <CardDescription>
            Select your timezone for accurate date and time display
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={timezone} onValueChange={(value: TimeZone) => setTimezone(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{tz.label}</span>
                    <span className="text-xs text-muted-foreground">{tz.city}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Current Time</span>
            </div>
            <div className="text-lg font-mono">
              {new Date().toLocaleString('en-US', {
                timeZone: timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how dates will appear with your current settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Full Format</div>
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {formatDate(new Date(), 'full')}
              </div>
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Medium Format</div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                {formatDate(new Date(), 'medium')}
              </div>
            </div>
            
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Short Format</div>
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {formatDate(new Date(), 'short')}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Usage Examples</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>• <strong>Tasks & Projects:</strong> {formatDate(new Date(), 'full')}</div>
              <div>• <strong>Focus Session:</strong> {formatDate(new Date(), 'short')}</div>
              <div>• <strong>Analytics:</strong> {formatDate(new Date(), 'medium')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}