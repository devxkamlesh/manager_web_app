import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await request.json()
    
    if (!['coding', 'learning', 'commits', 'problems'].includes(type)) {
      return NextResponse.json({ error: 'Invalid streak type' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Get current streak
    const { data: streak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('type', type)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }

    let newCount = 1
    let bestCount = 1

    if (streak) {
      const lastActivity = streak.last_activity?.split('T')[0]
      
      if (lastActivity === today) {
        // Already updated today
        return NextResponse.json(streak)
      } else if (lastActivity === yesterday) {
        // Continue streak
        newCount = streak.current_count + 1
        bestCount = Math.max(streak.best_count, newCount)
      } else {
        // Streak broken, start new
        newCount = 1
        bestCount = streak.best_count
      }
    }

    // Update or insert streak
    const { data, error } = await supabase
      .from('streaks')
      .upsert({
        user_id: session.user.id,
        type,
        current_count: newCount,
        best_count: bestCount,
        last_activity: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Streak update error:', error)
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    )
  }
}