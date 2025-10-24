'use client'

import { useSupabaseAuth } from '@/components/auth/supabase-auth-provider'
import { Dashboard } from '@/components/dashboard/dashboard'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect('/auth/login')
  }

  return <Dashboard />
}