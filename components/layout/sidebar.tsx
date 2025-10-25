"use client"

import { useSupabaseAuth } from "@/components/auth/supabase-auth-provider"
import { signOut } from "@/lib/auth-actions"
import { Button } from "@/components/ui/forms/button"
import { Badge } from "@/components/ui/display/badge"
import { Separator } from "@/components/ui/layout/separator"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useThemeStore } from "@/lib/theme-store"
import { 
  CheckSquare, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Home,
  HelpCircle,
  Timer,
  Flame,
  Zap
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
  const { color } = useThemeStore()

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: Home,
      route: '/dashboard'
    },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: CheckSquare,
      route: '/dashboard/tasks'
    },
    { 
      id: 'streaks', 
      label: 'Streaks', 
      icon: Flame,
      route: '/dashboard/streaks',
      isNew: true
    },
    { 
      id: 'focus', 
      label: 'Focus', 
      icon: Timer,
      route: '/dashboard/focus'
    },
    { 
      id: 'projects', 
      label: 'Projects', 
      icon: FolderOpen,
      route: '/dashboard/projects'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      route: '/dashboard/analytics'
    },
  ]

  return (
    <div className="w-72 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur-xl border-r border-border/30 flex flex-col shadow-xl">
      {/* Premium Header */}
      <div className="p-6 border-b border-border/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden bg-primary">
            <div className="absolute inset-0 bg-white/20 rounded-3xl" />
            <Zap className="w-6 h-6 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              DevFlow
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Productivity Suite</p>
          </div>
        </div>
      </div>

      {/* Premium Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 h-12 px-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-lg border border-primary/20" 
                    : "hover:bg-muted/60 hover:shadow-md"
                )}
                onClick={() => {
                  if (item.route) {
                    router.push(item.route)
                  } else if (setActiveView) {
                    setActiveView(item.id)
                  }
                }}
              >
                <div className={cn(
                  "w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden",
                  isActive 
                    ? "bg-primary shadow-lg" 
                    : "bg-muted/80 group-hover:bg-muted"
                )}>
                  {isActive && <div className="absolute inset-0 bg-white/20 rounded-2xl" />}
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300 relative z-10",
                    isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                </div>
                <span className={cn(
                  "flex-1 text-left font-semibold transition-colors duration-300",
                  isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
                )}>{item.label}</span>
                {item.isNew && (
                  <Badge className="text-xs px-2 py-1 rounded-full font-medium shadow-sm bg-primary text-white border-0">
                    New
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>

        <Separator className="my-6 opacity-30" />

        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-4 h-12 px-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              activeView === 'settings' 
                ? "bg-primary/10 text-primary shadow-lg border border-primary/20" 
                : "hover:bg-muted/60 hover:shadow-md"
            )}
            onClick={() => router.push('/dashboard/settings')}
          >
            <div className={cn(
              "w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden",
              activeView === 'settings' 
                ? "bg-primary shadow-lg" 
                : "bg-muted/80 group-hover:bg-muted"
            )}>
              {activeView === 'settings' && <div className="absolute inset-0 bg-white/20 rounded-2xl" />}
              <Settings className={cn(
                "w-5 h-5 transition-all duration-300 relative z-10",
                activeView === 'settings' ? "text-white" : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>
            <span className={cn(
              "flex-1 text-left font-semibold transition-colors duration-300",
              activeView === 'settings' ? "text-primary" : "text-foreground group-hover:text-foreground"
            )}>Settings</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-4 h-12 px-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
              activeView === 'help' 
                ? "bg-primary/10 text-primary shadow-lg border border-primary/20" 
                : "hover:bg-muted/60 hover:shadow-md"
            )}
            onClick={() => router.push('/dashboard/help')}
          >
            <div className={cn(
              "w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 relative overflow-hidden",
              activeView === 'help' 
                ? "bg-primary shadow-lg" 
                : "bg-muted/80 group-hover:bg-muted"
            )}>
              {activeView === 'help' && <div className="absolute inset-0 bg-white/20 rounded-2xl" />}
              <HelpCircle className={cn(
                "w-5 h-5 transition-all duration-300 relative z-10",
                activeView === 'help' ? "text-white" : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>
            <span className={cn(
              "flex-1 text-left font-semibold transition-colors duration-300",
              activeView === 'help' ? "text-primary" : "text-foreground group-hover:text-foreground"
            )}>Help</span>
          </Button>
        </div>
      </nav>

      {/* Premium Footer */}
      <div className="p-4 border-t border-border/20">
        <div className="flex items-center gap-4 mb-4 p-4 rounded-3xl bg-gradient-to-r from-muted/40 to-muted/20 backdrop-blur-sm border border-border/30">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden",
            `bg-gradient-to-br from-${color}-400 to-${color}-600`
          )}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl" />
            <span className="text-sm font-bold text-white relative z-10">
              {user?.user_metadata?.full_name?.charAt(0) || user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">
              {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              {color.charAt(0).toUpperCase() + color.slice(1)} Theme
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 h-11 px-4 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-300 group"
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
          <LogOut className="w-4 h-4 group-hover:text-red-500 transition-colors" />
          <span className="font-medium">Sign out</span>
        </Button>
      </div>
    </div>
  )
}