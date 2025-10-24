# Display Components

Components for displaying data, content, and visual elements.

## Components

- **`avatar.tsx`** - User profile image with fallback initials
- **`badge.tsx`** - Small status indicators and labels
- **`calendar.tsx`** - Date picker and calendar interface
- **`empty-state.tsx`** - Placeholder for empty content areas

## Usage

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/display/avatar'
import { Badge } from '@/components/ui/display/badge'
import { Calendar } from '@/components/ui/display/calendar'
import { EmptyState } from '@/components/ui/display/empty-state'

// Avatar example
<Avatar>
  <AvatarImage src="/profile.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Badge examples
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Error</Badge>

// Empty state
<EmptyState
  icon="📝"
  title="No tasks yet"
  description="Create your first task to get started"
  action={{
    label: "Create Task",
    onClick: handleCreateTask
  }}
/>
```

## Features

- ✅ Responsive image handling with fallbacks
- ✅ Multiple badge variants and sizes
- ✅ Accessible calendar with keyboard navigation
- ✅ Customizable empty states with actions
- ✅ Proper semantic HTML structure
- ✅ Theme integration and consistent styling