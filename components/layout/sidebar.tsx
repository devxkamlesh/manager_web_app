"use client"

import { useSupabaseAuth } from "@/components/auth/supabase-auth-provider"
import { signOut } from "@/lib/auth-actions"
import { Button } from "@/components/ui/forms/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/display/avatar"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { 
  CheckSquare, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Home,
  Zap,
  Sparkles,
  Crown,
  HelpCircle,
  Timer
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeView?: string
  setActiveView?: (view: string) => void
}

export function Sidebar({ activeView = 'overview', setActiveView }: SidebarProps) {
  const { user } = useSupabaseAuth()
  const { toast } = useToast()
  const router = useRouter()

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Overview & insights',
      route: '/dashboard'
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare,
      description: 'Manage your work',
      route: '/dashboard/tasks'
    },
    { 
      id: 'focus', 
      label: 'Focus Session', 
      icon: Timer,
      description: 'Pomodoro timer',
      route: '/dashboard/focus'
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: FolderOpen,
      description: 'Track progress',
      route: '/dashboard/projects'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'Performance metrics',
      route: '/dashboard/analytics'
    },
  ]

  return (
    <div className="w-72 bg-card border-r flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold">DevFlow</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">Productivity Suite</p>
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                <Crown className="w-2.5 h-2.5 mr-1" />
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-auto p-3 text-left",
                  isActive && "bg-primary/10 text-primary border border-primary/20"
                )}
                onClick={() => {
                  if (item.route) {
                    router.push(item.route)
                  } else if (setActiveView) {
                    setActiveView(item.id)
                  }
                }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left">
                    {item.description}
                  </p>
                </div>
              </Button>
            )
          })}
        </div>

        <Separator className="my-6" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-auto p-3 text-left",
              activeView === 'settings' && "bg-primary/10 text-primary border border-primary/20"
            )}
            onClick={() => router.push('/dashboard/settings')}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium">Settings</span>
              <p className="text-xs text-muted-foreground text-left">
                Preferences & themes
              </p>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-auto p-3 text-left",
              activeView === 'help' && "bg-primary/10 text-primary border border-primary/20"
            )}
            onClick={() => router.push('/dashboard/help')}
          >
            <HelpCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-medium">Help & Support</span>
              <p className="text-xs text-muted-foreground text-left">
                Get assistance
              </p>
            </div>
          </Button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/20">
            <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ''} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {user?.user_metadata?.full_name?.charAt(0) || user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={async () => {
            const { error } = await signOut()
            if (error) {
              toast({
                title: "Error",
                description: error,
                variant: "destructive",
              })
            } else {
              toast({
                title: "Success",
                description: "Signed out successfully",
              })
              router.push('/auth/login')
            }
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}