# DevFlow Setup Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Copy the project URL and anon key to `.env.local`
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor

3. **Configure Google OAuth**
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Copy client ID and secret to `.env.local`

4. **Set up Redis (Optional)**
   - Create a Redis Cloud account or use local Redis
   - Add connection URL to `.env.local`

5. **Start development server**
   ```bash
   npm run dev
   ```

## Environment Variables

Make sure your `.env.local` contains:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Redis (Optional)
REDIS_URL=your_redis_url

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- See database/schema.sql for complete setup
```

## Features Available

✅ User Authentication (Google OAuth)
✅ Task Management
✅ Pomodoro Timer
✅ Streak Tracking
✅ Project Overview
✅ Analytics Dashboard
✅ Dark Mode
✅ Responsive Design

## Next Steps

1. Add GitHub OAuth for repository integration
2. Implement calendar integration
3. Add AI-powered insights
4. Create mobile app
5. Add team collaboration features