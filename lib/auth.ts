import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { supabase } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          // Check if user exists in Supabase
          const { data: existingUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email!)
            .single()

          if (!existingUser) {
            // Create new user profile
            await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email!,
                name: user.name,
                avatar_url: user.image,
                github_username: account.provider === 'github' ? (profile as any)?.login : null,
              })

            // Initialize streaks for new user
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
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}