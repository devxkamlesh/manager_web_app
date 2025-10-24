"use client"

import { Button } from "@/components/ui/forms/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Code, Timer, TrendingUp, Github, Calendar, Target } from "lucide-react"
import Link from "next/link"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            DevFlow
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The productivity suite designed specifically for developers and students.
            Track your coding sessions, manage projects, and build consistent learning habits.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Get Started Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login" className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Timer className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Smart Time Management</CardTitle>
              <CardDescription>
                Pomodoro timers, deep work blocks, and flow state detection to maximize your productivity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Project Organization</CardTitle>
              <CardDescription>
                GitHub integration, task management, and progress tracking for all your coding projects
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Streak System</CardTitle>
              <CardDescription>
                Build consistent coding and learning habits with gamified streak tracking
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Built for Developers</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Github className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">GitHub Integration</h3>
                  <p className="text-muted-foreground">Auto-sync repositories, issues, and track commit streaks</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Smart Scheduling</h3>
                  <p className="text-muted-foreground">Automatically block coding time and manage deadlines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Learning Paths</h3>
                  <p className="text-muted-foreground">Track courses, certifications, and skill progression</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">Daily Coding Streak</span>
                <span className="text-2xl">🔥 0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">Active Projects</span>
                <span className="text-primary font-bold">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <span className="font-medium">This Week</span>
                <span className="text-green-500 font-bold">0h 0m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}