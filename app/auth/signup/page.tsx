"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, User, UserPlus } from "lucide-react"
import Link from "next/link"
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth-actions"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoogleSignup = async () => {
    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const { error } = await signInWithGoogle()
      
      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })
        setIsLoading(false)
      } else {
        // Set a timeout to reset loading state if redirect doesn't happen
        setTimeout(() => {
          setIsLoading(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Google signup error:', error)
      toast({
        title: "Error",
        description: "Failed to initiate Google signup",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    const { data, error } = await signUpWithEmail(email, password, fullName)
    
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account.",
      })
      router.push('/auth/login')
    }
    setIsLoading(false)
  }

  // Prevent layout shift by showing consistent layout
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-lg shadow-sm p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
                <p className="text-muted-foreground mt-2">Join DevFlow to boost your productivity</p>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-11 bg-muted/30 rounded-md animate-pulse"></div>
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-11 bg-muted/30 rounded-md animate-pulse"></div>
                <div className="h-11 bg-muted/30 rounded-md animate-pulse"></div>
                <div className="h-11 bg-muted/30 rounded-md animate-pulse"></div>
                <div className="h-11 bg-muted/30 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Create Account</h1>
              <p className="text-muted-foreground mt-2">Join DevFlow to boost your productivity</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Social Signup */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </div>

            {/* Separator */}
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-10 h-11 bg-muted/50 border-0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="pl-10 h-11 bg-muted/50 border-0"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="pl-10 h-11 bg-muted/50 border-0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="mt-1 border-2 border-slate-400 dark:border-slate-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white" 
                />
                <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-5 cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 bg-muted text-foreground hover:bg-muted/80"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign in link */}
            <div className="text-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
              <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}