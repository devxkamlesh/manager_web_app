# Feedback Components

Components for providing user feedback, loading states, and progress indication.

## Components

- **`toast.tsx`** - Notification messages with auto-dismiss
- **`toaster.tsx`** - Toast container and management system
- **`loading-spinner.tsx`** - Animated loading indicator
- **`loading-state.tsx`** - Full-page loading state with message
- **`skeleton.tsx`** - Placeholder loading animation for content
- **`progress.tsx`** - Progress bar with percentage indication

## Usage

```tsx
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/ui/feedback/loading-spinner'
import { Progress } from '@/components/ui/feedback/progress'
import { Skeleton } from '@/components/ui/feedback/skeleton'

// Toast notification
const { toast } = useToast()
toast({
  title: "Success!",
  description: "Task completed successfully."
})

// Loading states
<LoadingSpinner size="lg" />
<Progress value={75} className="w-full" />
<Skeleton className="h-4 w-full" />
```

## Features

- ✅ Multiple toast types (success, error, warning, info)
- ✅ Configurable auto-dismiss timing
- ✅ Accessible loading states with screen reader support
- ✅ Smooth progress animations
- ✅ Skeleton loading for better perceived performance
- ✅ Queue management for multiple toasts