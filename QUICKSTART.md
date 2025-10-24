# 🚀 DevFlow - Quick Start Guide

## Instant Demo (No Setup Required)

**Try DevFlow immediately without any configuration:**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to:
   ```
   http://localhost:3001/demo
   ```

3. **That's it!** You can now explore all features in demo mode.

## Demo Features Available

✅ **Task Management** - Create, organize, and track tasks
✅ **Pomodoro Timer** - 25-minute focus sessions with breaks  
✅ **Streak Tracking** - Build coding and learning habits
✅ **Project Overview** - Organize your development projects
✅ **Analytics Dashboard** - Visual productivity insights
✅ **Dark Mode** - Developer-friendly interface
✅ **Responsive Design** - Works on all devices

*Note: Demo mode uses mock data that won't persist between sessions.*

---

## Full Setup (For Production Use)

### 1. **Database Setup (Supabase)**
- Create account at [supabase.com](https://supabase.com)
- Create new project
- Copy URL and keys to `.env.local`
- Run SQL from `database/schema.sql` in Supabase SQL Editor

### 2. **Google OAuth Setup**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credentials
- Add redirect URI: `http://localhost:3001/api/auth/callback/google`
- Copy Client ID and Secret to `.env.local`

### 3. **Environment Variables**
Update your `.env.local` file:
```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth (Required for auth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth (Required)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_random_secret_key

# Optional Services
REDIS_URL=your_redis_url
OPENAI_API_KEY=your_openai_key
```

### 4. **Start Development**
```bash
npm install
npm run dev
```

Visit `http://localhost:3001` and sign in with Google!

---

## 🎯 What's Next?

### Immediate Use
- **Demo Mode**: Perfect for testing and showcasing
- **Local Development**: Full features with your own data
- **Team Sharing**: Share demo link with colleagues

### Production Deployment
- **Vercel**: One-click deployment (recommended)
- **Netlify**: Static hosting option
- **Docker**: Containerized deployment
- **Custom Server**: Full control setup

### Feature Extensions
- **GitHub Integration**: Repository and commit tracking
- **Calendar Sync**: Smart scheduling features  
- **AI Insights**: Productivity recommendations
- **Team Collaboration**: Multi-user workspaces
- **Mobile App**: React Native version

---

## 🆘 Need Help?

### Common Issues
- **Port 3000 in use**: App automatically uses 3001
- **Auth redirect loop**: Check Google OAuth settings
- **Database errors**: Verify Supabase configuration
- **Build failures**: Run `npm run build` to check

### Resources
- **Setup Guide**: `scripts/setup.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Database Schema**: `database/schema.sql`
- **Feature Docs**: `DEVELOPER_FEATURES.md`

**Happy coding with DevFlow! 🚀**