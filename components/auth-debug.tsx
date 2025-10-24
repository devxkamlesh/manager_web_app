"use client"

import { useSupabaseAuth } from '@/components/supabase-auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export function AuthDebug() {
  const { user, loading } = useSupabaseAuth()

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('tasks').select('count').limit(1)
      console.log('Supabase connection test:', { data, error })
    } catch (error) {
      console.error('Supabase connection error:', error)
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Auth Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.email : 'Not logged in'}
        </div>
        <div>
          <strong>User ID:</strong> {user?.id || 'None'}
        </div>
        <Button onClick={testConnection} className="w-full">
          Test Supabase Connection
        </Button>
        <div className="text-xs text-muted-foreground">
          Check browser console for connection test results
        </div>
      </CardContent>
    </Card>
  )
}