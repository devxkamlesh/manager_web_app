# Components Directory

This directory contains all React components organized by functionality.

## 📁 Folder Structure

### `/auth`
Authentication-related components
- `auth-debug.tsx` - Debug component for authentication testing
- `auth-provider.tsx` - Main authentication provider
- `supabase-auth-provider.tsx` - Supabase authentication wrapper

### `/dashboard`
Main dashboard and overview components
- `dashboard.tsx` - Main dashboard layout
- `overview.tsx` - Dashboard overview/summary
- `analytics.tsx` - Analytics and statistics

### `/projects`
Project management components
- `create-project-dialog.tsx` - Project creation dialog
- `edit-project-dialog.tsx` - Project editing dialog
- `project-overview.tsx` - Projects listing and management
- `project-view-dialog.tsx` - Project details view

### `/tasks`
Task management components
- `create-task-dialog.tsx` - Task creation dialog
- `edit-task-dialog.tsx` - Task editing dialog
- `task-manager.tsx` - Main task management component
- `task-view-dialog.tsx` - Task details view
- `task-views.tsx` - Different task view modes (list, board, grid)

### `/focus`
Focus and productivity components
- `focus-session.tsx` - Focus session management
- `pomodoro-timer.tsx` - Pomodoro timer component
- `task-focus-timer.tsx` - Task-specific focus timer

### `/settings`
Settings and configuration components
- `category-management.tsx` - Category management interface
- `theme-provider.tsx` - Theme context provider
- `theme-settings.tsx` - Theme configuration UI

### `/layout`
Layout and navigation components
- `sidebar.tsx` - Main navigation sidebar
- `landing-page.tsx` - Landing page component

### `/misc`
Miscellaneous utility components
- `database-migration-notice.tsx` - Database migration notifications
- `db-test.tsx` - Database testing component
- `keyboard-shortcuts.tsx` - Keyboard shortcuts help
- `streak-tracker.tsx` - Productivity streak tracking
- `theme-test.tsx` - Theme testing component

### `/ui`
Reusable UI components (shadcn/ui based)
- Basic UI primitives and styled components
- Buttons, inputs, dialogs, cards, etc.

## 🔧 Usage

Import components using their new paths:
```tsx
// Old way
import { TaskManager } from '@/components/task-manager'

// New way
import { TaskManager } from '@/components/tasks/task-manager'
```

## 📝 Notes

- Each folder contains related components for better organization
- UI components remain in the `/ui` folder as they are shared across all features
- This structure follows feature-based organization for better maintainability