# UI Components

Reusable UI components built with Radix UI primitives and styled with Tailwind CSS. These components provide the foundation for the entire application interface.

## 📁 Folder Structure

### `/forms`
Interactive form elements and input controls
- `button.tsx` - Clickable buttons with multiple variants
- `input.tsx` - Text input fields with validation
- `textarea.tsx` - Multi-line text input
- `label.tsx` - Accessible form labels
- `checkbox.tsx` - Checkbox inputs with states
- `radio-group.tsx` - Radio button groups
- `select.tsx` - Dropdown select menus
- `switch.tsx` - Toggle switches

### `/layout`
Structural components for organizing content
- `card.tsx` - Content containers with sections
- `dialog.tsx` - Modal dialogs and overlays
- `popover.tsx` - Floating content containers
- `separator.tsx` - Visual content dividers
- `tabs.tsx` - Tabbed interfaces

### `/feedback`
User feedback and loading states
- `toast.tsx` - Notification messages
- `toaster.tsx` - Toast management system
- `loading-spinner.tsx` - Loading indicators
- `loading-state.tsx` - Full-page loading states
- `skeleton.tsx` - Content placeholders
- `progress.tsx` - Progress bars

### `/navigation`
Navigation and menu components
- `dropdown-menu.tsx` - Context menus and dropdowns

### `/display`
Data display and visual elements
- `avatar.tsx` - User profile images
- `badge.tsx` - Status indicators and labels
- `calendar.tsx` - Date picker interface
- `empty-state.tsx` - Empty content placeholders

## 🎨 Design System

### Color Variants
- **Primary** - Main brand color for primary actions
- **Secondary** - Subtle background for secondary elements
- **Destructive** - Red for dangerous actions (delete, error)
- **Outline** - Bordered style for subtle emphasis
- **Ghost** - Minimal style for low-priority actions

### Size Variants
- **sm** - Small size for compact interfaces
- **md** - Default medium size
- **lg** - Large size for prominent elements
- **xl** - Extra large for hero elements

## 🔧 Usage Patterns

### Import Structure
```tsx
// Organized imports by category
import { Button } from '@/components/ui/forms/button'
import { Card } from '@/components/ui/layout/card'
import { Toast } from '@/components/ui/feedback/toast'
```

### Composition Example
```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/layout/card'
import { Button } from '@/components/ui/forms/button'
import { Badge } from '@/components/ui/display/badge'

function TaskCard({ task }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3>{task.title}</h3>
          <Badge variant="secondary">{task.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
        <Button className="mt-4">Edit Task</Button>
      </CardContent>
    </Card>
  )
}
```

## ✨ Features

- ✅ **Accessibility First** - WCAG compliant with proper ARIA labels
- ✅ **Keyboard Navigation** - Full keyboard support for all interactive elements
- ✅ **Theme Integration** - Consistent with application theme system
- ✅ **TypeScript Support** - Fully typed with proper prop interfaces
- ✅ **Responsive Design** - Mobile-first responsive components
- ✅ **Animation Support** - Smooth transitions and micro-interactions
- ✅ **Customizable** - Easy to extend and customize with Tailwind classes

## 🚀 Performance

- **Tree Shaking** - Only import what you use
- **Lazy Loading** - Components load on demand
- **Optimized Bundle** - Minimal runtime overhead
- **CSS-in-JS Free** - Pure Tailwind CSS for better performance

---

Built with ❤️ using [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/)