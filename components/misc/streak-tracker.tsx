"use client"

import { useEffect, useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, BookOpen, GitCommit, Target, TrendingUp } from "lucide-react"
import { getStreakEmoji } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useSupabaseAuth } from "@/components/auth/supabase-auth-provider"

interface Streak {
  id: string
  type: 'coding' | 'learning' | 'commits' | 'problems'
  current_count: number
  best_count: number
  last_activity: string
}

export function StreakTracker() {
  const { user } = useSupabaseAuth()
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchStreaks()
    }
  }, [user?.id])

  const fetchStreaks = async () => {
    try {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user?.id)

      if (error) throw error
      setStreaks(data || [])
    } catch (error) {
      console.error('Error fetching streaks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStreakIcon = (type: string) => {
    switch (type) {
      case 'coding': return <Code className="w-4 h-4 text-blue-600" />
      case 'learning': return <BookOpen className="w-4 h-4 text-green-600" />
      case 'commits': return <GitCommit className="w-4 h-4 text-purple-600" />
      case 'problems': return <Target className="w-4 h-4 text-orange-600" />
      default: return <Code className="w-4 h-4" />
    }
  }

  const getStreakLabel = (type: string) => {
    switch (type) {
      case 'coding': return 'Coding'
      case 'learning': return 'Learning'
      case 'commits': return 'Commits'
      case 'problems': return 'Problems'
      default: return type
    }
  }

  if (loading) {
    return (
      <>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Streaks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading streaks...</p>
            </div>
          </div>
        </CardContent>
      </>
    )
  }

  const totalStreaks = streaks.reduce((sum, streak) => sum + streak.current_count, 0)

  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            Streaks
          </div>
          <Badge variant="secondary" className="text-xs">
            🔥 {totalStreaks}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {streaks.slice(0, 4).map((streak) => (
          <div
            key={streak.id}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              {getStreakIcon(streak.type)}
              <div>
                <div className="font-medium text-sm">
                  {getStreakLabel(streak.type)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Best: {streak.best_count}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="text-right">
                <div className="font-bold text-sm">
                  {streak.current_count}
                </div>
              </div>
              <div className="text-lg">
                {getStreakEmoji(streak.current_count)}
              </div>
            </div>
          </div>
        ))}

        {streaks.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm">Start your first streak!</p>
          </div>
        )}
      </CardContent>
    </>
  )
}