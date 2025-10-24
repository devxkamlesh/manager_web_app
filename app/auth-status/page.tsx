'use client'

import { useSupabaseAuth } from '@/components/auth/supabase-auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/layout/card'
import { Badge } from '@/components/ui/display/badge'
import { Button } from '@/components/ui/forms/button'
import { CheckCircle, XCircle, User, Mail, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function AuthStatusPage() {
  const { user, loading } = useSupabaseAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-400">Loading authentication status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-white">
            {user ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-400" />
                Authentication Status
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400" />
                Not Authenticated
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <>
              <div className="text-center">
                <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400">
                  Authenticated
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Name</div>
                    <div className="text-xs text-slate-400">
                      {user.user_metadata?.full_name || user.user_metadata?.name || 'Not provided'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Email</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Member Since</div>
                    <div className="text-xs text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/">
                <Button className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-center">
                <Badge variant="outline" className="border-red-500/50 bg-red-500/10 text-red-400">
                  Not Authenticated
                </Badge>
              </div>
              
              <p className="text-center text-slate-400 text-sm">
                You need to sign in to access your dashboard and productivity tools.
              </p>
              
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline" className="w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}