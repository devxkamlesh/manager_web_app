'use client'

import { useSupabaseAuth } from '@/components/auth/supabase-auth-provider'
import { Sidebar } from '@/components/layout/sidebar'
import { redirect } from 'next/navigation'
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  Timer,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Settings,
  Zap,
  Coffee,
  Target,
  Play,
  Pause,
  RotateCcw,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card'
import { Button } from '@/components/ui/forms/button'
import { Badge } from '@/components/ui/display/badge'
import { Separator } from '@/components/ui/layout/separator'
import { Input } from '@/components/ui/forms/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/layout/tabs'
import { KeyboardShortcuts } from '@/components/misc/keyboard-shortcuts'

export default function HelpPage() {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading help center...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/login')
  }

  const quickActions = [
    {
      title: "Start Focus Session",
      description: "Begin a Pomodoro timer session",
      icon: Timer,
      color: "bg-blue-500",
      href: "/dashboard/focus"
    },
    {
      title: "Create Task",
      description: "Add a new task to your list",
      icon: CheckSquare,
      color: "bg-green-500",
      href: "/dashboard/tasks"
    },
    {
      title: "New Project",
      description: "Start organizing a new project",
      icon: FolderOpen,
      color: "bg-purple-500",
      href: "/dashboard/projects"
    },
    {
      title: "View Analytics",
      description: "Check your productivity stats",
      icon: BarChart3,
      color: "bg-orange-500",
      href: "/dashboard/analytics"
    }
  ]

  const faqs = [
    {
      question: "How does the Pomodoro Technique work?",
      answer: "The Pomodoro Technique involves working in focused 25-minute intervals followed by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break. This helps maintain focus and prevents burnout."
    },
    {
      question: "Can I customize timer durations?",
      answer: "Yes! In the Focus Timer, click the Settings button to customize focus time, short breaks, and long breaks to fit your workflow."
    },
    {
      question: "How do I track my progress?",
      answer: "Visit the Analytics page to see detailed statistics about your completed tasks, focus time, and productivity trends over time."
    },
    {
      question: "Can I organize tasks by project?",
      answer: "Absolutely! Create projects to group related tasks together. You can assign tasks to projects and track progress at both task and project levels."
    },
    {
      question: "What are streaks and how do they work?",
      answer: "Streaks track consecutive days of productivity activities like completing tasks, focus sessions, or coding. They help build consistent habits."
    },
    {
      question: "How do I enable sound notifications?",
      answer: "In the Focus Timer settings, you can enable/disable sound notifications and test different notification sounds for session completions."
    }
  ]

  const features = [
    {
      category: "Focus Timer",
      icon: Timer,
      color: "text-blue-600",
      items: [
        "Customizable Pomodoro sessions",
        "Fullscreen focus mode",
        "Sound notifications",
        "Session tracking",
        "Break reminders"
      ]
    },
    {
      category: "Task Management",
      icon: CheckSquare,
      color: "text-green-600",
      items: [
        "Create and organize tasks",
        "Set priorities and deadlines",
        "Track completion status",
        "Time estimation",
        "Project assignment"
      ]
    },
    {
      category: "Project Organization",
      icon: FolderOpen,
      color: "text-purple-600",
      items: [
        "Create project workspaces",
        "Track project progress",
        "GitHub integration",
        "Status management",
        "Team collaboration"
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart3,
      color: "text-orange-600",
      items: [
        "Productivity metrics",
        "Time tracking charts",
        "Completion rates",
        "Streak monitoring",
        "Weekly/monthly reports"
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar activeView="help" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="h-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Help Center</h1>
                <p className="text-sm text-muted-foreground">Get help and learn how to use DevFlow</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search help articles..." 
                  className="pl-10 w-64 bg-background/50"
                />
              </div>
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8 max-w-6xl">
            
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 ${action.color} rounded-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium">{action.title}</h3>
                            <p className="text-xs text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Tabs defaultValue="getting-started" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 bg-muted/50">
                <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Getting Started with DevFlow</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <Timer className="h-5 w-5 text-blue-600" />
                          <span>1. Start with Focus Sessions</span>
                        </h3>
                        <p className="text-muted-foreground">
                          Begin by trying the Pomodoro timer. Set a 25-minute focus session and work on a single task without distractions.
                        </p>
                        <div className="flex space-x-2">
                          <Badge variant="outline"><Play className="w-3 h-3 mr-1" />Start</Badge>
                          <Badge variant="outline"><Pause className="w-3 h-3 mr-1" />Pause</Badge>
                          <Badge variant="outline"><RotateCcw className="w-3 h-3 mr-1" />Reset</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <CheckSquare className="h-5 w-5 text-green-600" />
                          <span>2. Create Your First Task</span>
                        </h3>
                        <p className="text-muted-foreground">
                          Add tasks to stay organized. Set priorities, deadlines, and estimated time to complete each task effectively.
                        </p>
                        <div className="space-y-2">
                          <div className="text-sm">• Set clear, actionable task titles</div>
                          <div className="text-sm">• Add time estimates</div>
                          <div className="text-sm">• Assign priority levels</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <FolderOpen className="h-5 w-5 text-purple-600" />
                          <span>3. Organize with Projects</span>
                        </h3>
                        <p className="text-muted-foreground">
                          Group related tasks into projects. Perfect for organizing work by client, course, or personal goals.
                        </p>
                        <div className="space-y-2">
                          <div className="text-sm">• Create project workspaces</div>
                          <div className="text-sm">• Link GitHub repositories</div>
                          <div className="text-sm">• Track overall progress</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <BarChart3 className="h-5 w-5 text-orange-600" />
                          <span>4. Monitor Your Progress</span>
                        </h3>
                        <p className="text-muted-foreground">
                          Use the Analytics page to track your productivity patterns and identify areas for improvement.
                        </p>
                        <div className="space-y-2">
                          <div className="text-sm">• View completion rates</div>
                          <div className="text-sm">• Track focus time</div>
                          <div className="text-sm">• Monitor streaks</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Icon className={`h-5 w-5 ${feature.color}`} />
                            <span>{feature.category}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {feature.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="shortcuts" className="space-y-6">
                <KeyboardShortcuts />
              </TabsContent>

              <TabsContent value="faq" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {faqs.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-semibold mb-2">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{faq.answer}</p>
                        {index < faqs.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5" />
                        <span>Contact Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Need help? Our support team is here to assist you with any questions or issues.
                      </p>
                      <div className="space-y-3">
                        <Button className="w-full justify-start">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Support
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Live Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5" />
                        <span>Additional Resources</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Explore more resources to get the most out of DevFlow.
                      </p>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Documentation
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Zap className="w-4 h-4 mr-2" />
                          Productivity Tips
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Coffee className="w-4 h-4 mr-2" />
                          Community Forum
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary rounded-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Pro Tip</h3>
                        <p className="text-sm text-muted-foreground">
                          Start with short 15-minute focus sessions if 25 minutes feels too long. Gradually increase as you build the habit!
                        </p>
                      </div>
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