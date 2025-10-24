"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function TestAuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")
  const { toast } = useToast()

  const testConnection = async () => {
    setIsLoading(true)
    setResult("")
    
    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setResult(`Error: ${error.message}`)
        toast({
          title: "Connection Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setResult(`Connection successful! Session: ${data.session ? 'Active' : 'None'}`)
        toast({
          title: "Success",
          description: "Supabase connection is working!",
        })
      }
    } catch (error: any) {
      setResult(`Unexpected error: ${error.message}`)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testGoogleAuth = async () => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      
      if (error) {
        setResult(`Google Auth Error: ${error.message}`)
        toast({
          title: "Google Auth Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setResult("Google Auth initiated successfully")
      }
    } catch (error: any) {
      setResult(`Google Auth Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={testConnection}
                disabled={isLoading}
              >
                Test Supabase Connection
              </Button>
              
              <Button 
                onClick={testGoogleAuth}
                disabled={isLoading}
                variant="outline"
              >
                Test Google Auth
              </Button>
            </div>
            
            {result && (
              <div className="p-4 bg-muted rounded-md">
                <pre className="text-sm">{result}</pre>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
              <p>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}