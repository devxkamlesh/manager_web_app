# Layout Components

Structural components for organizing content and creating layouts.

## Components

- **`card.tsx`** - Container with header, content, and footer sections
- **`dialog.tsx`** - Modal dialog with overlay and focus management
- **`popover.tsx`** - Floating content container with positioning
- **`separator.tsx`** - Visual divider for content sections
- **`tabs.tsx`** - Tabbed interface for organizing content

## Usage

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/layout/card'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/layout/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/layout/tabs'

// Card example
<Card>
  <CardHeader>
    <h3>Project Title</h3>
  </CardHeader>
  <CardContent>
    <p>Project description...</p>
  </CardContent>
</Card>

// Dialog example
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>Modal Title</DialogHeader>
    <p>Modal content...</p>
  </DialogContent>
</Dialog>
```

## Features

- ✅ Responsive layouts that adapt to screen size
- ✅ Proper focus management and accessibility
- ✅ Smooth animations and transitions
- ✅ Flexible composition patterns
- ✅ Theme-aware styling