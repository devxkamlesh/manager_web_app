import { supabase } from './supabase'

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw error
    }

    // If signup successful, create user profile
    if (data.user) {
      await createUserProfile(data.user.id, {
        email: data.user.email!,
        name: fullName,
        avatar_url: null,
      })
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function signInWithGoogle() {
  try {
    // Get the current URL to determine the correct redirect
    const currentUrl = window.location.origin
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${currentUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      throw error
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Helper function to create user profile in database
async function createUserProfile(userId: string, userData: {
  email: string
  name: string
  avatar_url: string | null
}) {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      // Create new user profile
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userData.email,
          name: userData.name,
          avatar_url: userData.avatar_url,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      // Initialize streaks for new user
      const streakTypes = ['coding', 'learning', 'commits', 'problems']
      for (const type of streakTypes) {
        await supabase
          .from('streaks')
          .insert({
            user_id: userId,
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