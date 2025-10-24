# DevFlow - Developer Productivity Suite

A comprehensive productivity suite designed specifically for developers and students. Track your coding sessions, manage projects, build consistent learning habits, and boost your development workflow.

## 🚀 Features

### Core Productivity Features
- **Smart Pomodoro Timer** - 25/5 minute focus sessions with break reminders
- **Task Management** - Organize coding tasks with priorities, tags, and time tracking
- **Project Organization** - GitHub integration and project progress tracking
- **Streak System** - Build consistent coding and learning habits
- **Analytics Dashboard** - Visual insights into your productivity patterns

### Developer-Focused Tools
- **GitHub Integration** - Auto-sync repositories, issues, and commit tracking
- **Learning Path Management** - Track courses, certifications, and skill progression
- **Time Tracking** - Detailed analytics on coding time and project hours
- **Calendar Integration** - Smart scheduling for coding sessions and deadlines

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js (Google & GitHub OAuth)
- **Caching**: Redis Cloud
- **Charts**: Recharts
- **State Management**: Zustand

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-productivity-suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local` and configure your services:
   ```bash
   cp .env.example .env.local
   ```

4. **Set up Supabase Database**
   Run the SQL schema in your Supabase project:
   ```sql
   -- See database/schema.sql for complete setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profiles and settings
- `projects` - Development projects and repositories
- `tasks` - Individual tasks and todos
- `streaks` - Habit tracking and streak counters
- `pomodoro_sessions` - Focus session history

## 🔧 Configuration

### Authentication Setup
1. **Google OAuth**: Configure in Google Cloud Console
2. **GitHub OAuth**: Set up GitHub App for repository access
3. **Supabase**: Create project and configure RLS policies

### API Integrations
- **GitHub API**: For repository and commit data
- **Google Calendar**: For smart scheduling features
- **OpenAI API**: For AI-powered productivity insights

## 🎯 Usage

### Getting Started
1. **Sign in** with Google or GitHub
2. **Create your first project** and link it to a repository
3. **Add tasks** and start your first Pomodoro session
4. **Track your progress** and build coding streaks

### Key Workflows
- **Daily Coding**: Use Pomodoro timer for focused sessions
- **Project Management**: Organize tasks by project and priority
- **Learning Tracking**: Set goals and track course progress
- **Analytics Review**: Monitor productivity patterns weekly

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Environment Variables for Production
- Set all environment variables in your deployment platform
- Ensure Supabase RLS policies are properly configured
- Configure OAuth redirect URLs for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database powered by [Supabase](https://supabase.com/)

---

**DevFlow** - Boost your development productivity! 🚀