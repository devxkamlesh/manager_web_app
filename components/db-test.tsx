"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useSupabaseAuth } from '@/components/supabase-auth-provider'

export function DatabaseTest() {
  const { user } = useSupabaseAuth()
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setLoading(true)
    setResults([])
    
    try {
      addResult('Starting database tests...')
      
      // Test 1: Basic connection
      addResult('Testing basic connection...')
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (connectionError) {
        addResult(`❌ Connection failed: ${connectionError.message}`)
      } else {
        addResult('✅ Basic connection successful')
      }

      // Test 2: Check if user profile exists
      if (user?.id) {
        addResult(`Testing user profile for ID: ${user.id}`)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileError) {
          addResult(`❌ Profile check failed: ${profileError.message}`)
          
          // Try to create profile
          addResult('Attempting to create user profile...')
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            })
          
          if (createError) {
            addResult(`❌ Profile creation failed: ${createError.message}`)
          } else {
            addResult('✅ Profile created successfully')
          }
        } else {
          addResult('✅ User profile exists')
        }
      }

      // Test 3: Try to fetch tasks
      addResult('Testing tasks table access...')
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .limit(5)
      
      if (tasksError) {
        addResult(`❌ Tasks fetch failed: ${tasksError.message}`)
      } else {
        addResult(`✅ Tasks fetch successful (${tasks?.length || 0} tasks found)`)
      }

    } catch (error) {
      addResult(`❌ Unexpected error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p><strong>User:</strong> {user?.email || 'Not logged in'}</p>
            <p><strong>User ID:</strong> {user?.id || 'None'}</p>
          </div>
          <Button onClick={testConnection} disabled={loading || !user}>
            {loading ? 'Testing...' : 'Test Database'}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <div className="space-y-1 text-sm font-mono">
              {results.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}