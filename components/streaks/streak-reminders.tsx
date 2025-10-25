"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Switch } from "@/components/ui/forms/switch"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { 
  Bell, 
  Clock, 
  Smartphone,
  Mail,
  Settings,
  Calendar
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReminderSettings {
  enabled: boolean
  time: string
  frequency: 'daily' | 'weekdays' | 'custom'
  method: 'notification' | 'email' | 'both'
  customDays: string[]
}

interface StreakRemindersProps {
  streaks: Array<{
    id: string
    name: string
    type: string
    is_active: boolean
  }>
}

export function StreakReminders({ streaks }: StreakRemindersProps) {
  const { toast } = useToast()
  const [globalSettings, setGlobalSettings] = useState<ReminderSettings>({
    enabled: true,
    time: '09:00',
    frequency: 'daily',
    method: 'notification',
    customDays: []
  })
  
  const [streakSettings, setStreakSettings] = useState<Record<string, ReminderSettings>>(
    streaks.reduce((acc, streak) => {
      acc[streak.id] = {
        enabled: streak.is_active,
        time: '09:00',
        frequency: 'daily',
        method: 'notification',
        customDays: []
      }
      return acc
    }, {} as Record<string, ReminderSettings>)
  )
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  
  // Check notification permission on component mount
  useState(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  })
  
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled!",
          description: "You'll now receive streak reminders."
        })
      } else {
        toast({
          title: "Notifications blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        })
      }
    }
  }
  
  const updateGlobalSettings = (key: keyof ReminderSettings, value: any) => {
    setGlobalSettings(prev => ({ ...prev, [key]: value }))
  }
  
  const updateStreakSettings = (streakId: string, key: keyof ReminderSettings, value: any) => {
    setStreakSettings(prev => ({
      ...prev,
      [streakId]: { ...prev[streakId], [key]: value }
    }))
  }
  
  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Streak Reminder Test', {
        body: 'This is how your streak reminders will look!',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
      
      toast({
        title: "Test notification sent!",
        description: "Check if you received the notification."
      })
    } else {
      toast({
        title: "Notifications not enabled",
        description: "Please enable notifications first.",
        variant: "destructive"
      })
    }
  }
  
  const saveSettings = () => {
    // Here you would typically save to your backend
    toast({
      title: "Settings saved!",
      description: "Your reminder preferences have been updated."
    })
  }
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  
  return (
    <div className="space-y-6">
      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global Reminder Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notification Permission */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <Label className="text-sm font-medium">Browser Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  {notificationPermission === 'granted' 
                    ? 'Notifications are enabled' 
                    : 'Enable notifications to receive reminders'
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {notificationPermission !== 'granted' && (
                <Button onClick={requestNotificationPermission} size="sm">
                  Enable
                </Button>
              )}
              <Button onClick={testNotification} variant="outline" size="sm">
                Test
              </Button>
            </div>
          </div>
          
          {/* Global Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="global-enabled">Enable Reminders</Label>
              <p className="text-sm text-muted-foreground">Turn on/off all streak reminders</p>
            </div>
            <Switch
              id="global-enabled"
              checked={globalSettings.enabled}
              onCheckedChange={(checked) => updateGlobalSettings('enabled', checked)}
            />
          </div>
          
          {/* Default Time */}
          <div className="space-y-2">
            <Label>Default Reminder Time</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <input
                type="time"
                value={globalSettings.time}
                onChange={(e) => updateGlobalSettings('time', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          
          {/* Default Frequency */}
          <div className="space-y-2">
            <Label>Default Frequency</Label>
            <Select
              value={globalSettings.frequency}
              onValueChange={(value) => updateGlobalSettings('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays Only</SelectItem>
                <SelectItem value="custom">Custom Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Default Method */}
          <div className="space-y-2">
            <Label>Default Method</Label>
            <Select
              value={globalSettings.method}
              onValueChange={(value) => updateGlobalSettings('method', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notification">Browser Notification</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Individual Streak Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Streak Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {streaks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No streaks available. Create a streak to configure reminders.
            </p>
          ) : (
            streaks.map((streak) => {
              const settings = streakSettings[streak.id] || globalSettings
              
              return (
                <Card key={streak.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{streak.name}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {streak.type}
                        </Badge>
                      </div>
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) => 
                          updateStreakSettings(streak.id, 'enabled', checked)
                        }
                      />
                    </div>
                    
                    {settings.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                          <Label className="text-xs">Time</Label>
                          <input
                            type="time"
                            value={settings.time}
                            onChange={(e) => 
                              updateStreakSettings(streak.id, 'time', e.target.value)
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Frequency</Label>
                          <Select
                            value={settings.frequency}
                            onValueChange={(value) => 
                              updateStreakSettings(streak.id, 'frequency', value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekdays">Weekdays</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Method</Label>
                          <Select
                            value={settings.method}
                            onValueChange={(value) => 
                              updateStreakSettings(streak.id, 'method', value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notification">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-3 w-3" />
                                  Notification
                                </div>
                              </SelectItem>
                              <SelectItem value="email">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-3 w-3" />
                                  Email
                                </div>
                              </SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </CardContent>
      </Card>
      
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} className="w-full md:w-auto">
          Save Reminder Settings
        </Button>
      </div>
    </div>
  )
}