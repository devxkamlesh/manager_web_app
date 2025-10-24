# Navigation Components

Components for navigation menus, dropdowns, and user interaction.

## Components

- **`dropdown-menu.tsx`** - Contextual menu with items, separators, and sub-menus

## Usage

```tsx
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/navigation/dropdown-menu'

// Dropdown menu example
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Features

- ✅ Keyboard navigation support (arrow keys, Enter, Escape)
- ✅ Proper focus management and accessibility
- ✅ Customizable positioning and alignment
- ✅ Support for icons, shortcuts, and nested menus
- ✅ Click-outside-to-close behavior
- ✅ Smooth open/close animations