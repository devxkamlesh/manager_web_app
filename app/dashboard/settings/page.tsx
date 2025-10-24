'use client'

import { ThemeSettings } from '@/components/settings/theme-settings'
import { CategoryManagement } from '@/components/settings/category-management'
import { Sidebar } from '@/components/layout/sidebar'
import { Settings, User, Bell, Shield, Palette, Tags } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/layout/tabs'
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms/input'
import { Label } from '@/components/ui/forms/label'
import { Switch } from '@/components/ui/forms/switch'

export default function SettingsPage() {

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar activeView="settings" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8 max-w-4xl">
            <Tabs defaultValue="appearance" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50">
                <TabsTrigger value="appearance" className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center space-x-2">
                  <Tags className="h-4 w-4" />
                  <span>Categories</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Palette className="h-5 w-5" />
                      <span>Theme & Appearance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ThemeSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <CategoryManagement />
              </TabsContent>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value="user@example.com" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us about yourself" />
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="h-5 w-5" />
                      <span>Notification Preferences</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Focus Session Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when it&apos;s time for your next focus session
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Task Deadlines</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts for upcoming task deadlines
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Progress Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Get a summary of your weekly productivity
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Privacy & Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Make Profile Public</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow others to see your productivity stats
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Help us improve by sharing anonymous usage data
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="destructive">Delete Account</Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}