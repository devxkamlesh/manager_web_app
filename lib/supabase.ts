import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          github_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          github_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          github_url: string | null
          status: 'active' | 'completed' | 'paused'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          github_url?: string | null
          status?: 'active' | 'completed' | 'paused'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          github_url?: string | null
          status?: 'active' | 'completed' | 'paused'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      streaks: {
        Row: {
          id: string
          user_id: string
          type: 'coding' | 'learning' | 'commits' | 'problems'
          current_count: number
          best_count: number
          last_activity: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'coding' | 'learning' | 'commits' | 'problems'
          current_count?: number
          best_count?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'coding' | 'learning' | 'commits' | 'problems'
          current_count?: number
          best_count?: number
          last_activity?: string
          created_at?: string
          updated_at?: string
        }
      }
      pomodoro_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          duration: number
          completed: boolean
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          duration: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          duration?: number
          completed?: boolean
          started_at?: string
          completed_at?: string | null
        }
      }
    }
  }
}