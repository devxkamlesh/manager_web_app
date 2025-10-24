"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallback() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)
  const [status, setStatus] = useState('Processing authentication...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking authentication status...')
        console.log('Auth callback started')
        
        // First, check if we have hash parameters (OAuth callback)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken })
        
        if (accessToken && refreshToken) {
          setStatus('Setting up your session...')
          
          // Set the session using the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (error) {
            console.error('Error setting session:', error)
            throw error
          }
          
          if (data.session?.user) {
            console.log('Session established for user:', data.session.user.email)
            setStatus('Creating your profile...')
            
            // Create user profile if needed
            await createUserProfileIfNeeded(data.session.user)
            
            setStatus('Redirecting to dashboard...')
            
            toast({
              title: "Welcome!",
              description: "Successfully signed in with Google!",
            })
            
            // Clear the hash from URL and redirect
            window.history.replaceState(null, '', window.location.pathname)
            
            // Redirect to dashboard
            setTimeout(() => {
              router.replace('/dashboard')
            }, 1000)
            
            return
          }
        }
        
        // Fallback: try to get existing session
        setStatus('Checking existing session...')
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }
        
        if (sessionData.session?.user) {
          console.log('Found existing session for:', sessionData.session.user.email)
          setStatus('Redirecting...')
          
          toast({
            title: "Welcome back!",
            description: "You're already signed in.",
          })
          
          router.replace('/dashboard')
          return
        }
        
        // No valid session found
        console.log('No valid session found, redirecting to login')
        setStatus('Authentication failed, redirecting...')
        
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        })
        
        setTimeout(() => {
          router.replace('/auth/login')
        }, 2000)
        
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('Authentication failed')
        
        toast({
          title: "Authentication Error",
          description: "Something went wrong during sign in. Please try again.",
          variant: "destructive",
        })
        
        setTimeout(() => {
          router.replace('/auth/login')
        }, 3000)
      } finally {
        setIsProcessing(false)
      }
    }

    // Small delay to ensure the page is fully loaded
    const timer = setTimeout(handleAuthCallback, 500)
    
    return () => clearTimeout(timer)
  }, [router, toast])

  const createUserProfileIfNeeded = async (user: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        // Create new profile
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          })

        // Initialize streaks
        const streakTypes = ['coding', 'learning', 'commits', 'problems']
        for (const type of streakTypes) {
          await supabase
            .from('streaks')
            .insert({
              user_id: user.id,
              type: type as any,
              current_count: 0,
              best_count: 0,
              last_activity: new Date().toISOString(),
            })
        }
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-xl font-semibold">Completing Sign In</h1>
          <p className="text-muted-foreground">{status}</p>
        </div>
        
        {!isProcessing && (
          <div className="text-xs text-muted-foreground">
            If you're not redirected automatically, <button 
              onClick={() => router.replace('/dashboard')}
              className="text-primary underline hover:no-underline"
            >
              click here
            </button>
          </div>
        )}
      </div>
    </div>
  )
}