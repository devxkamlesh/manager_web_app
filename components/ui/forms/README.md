# Form Components

Interactive form elements and input controls.

## Components

- **`button.tsx`** - Clickable button with variants (primary, secondary, outline, ghost)
- **`input.tsx`** - Text input field with validation states
- **`textarea.tsx`** - Multi-line text input
- **`label.tsx`** - Form field labels with accessibility
- **`checkbox.tsx`** - Checkbox input with indeterminate state
- **`radio-group.tsx`** - Radio button group selection
- **`select.tsx`** - Dropdown select with search and multi-select
- **`switch.tsx`** - Toggle switch for boolean values

## Usage

```tsx
import { Button } from '@/components/ui/forms/button'
import { Input } from '@/components/ui/forms/input'
import { Label } from '@/components/ui/forms/label'
import { Select } from '@/components/ui/forms/select'

// Form example
<form>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
  <Button type="submit">Submit</Button>
</form>
```

## Features

- ✅ Full accessibility support (ARIA labels, keyboard navigation)
- ✅ Form validation states (error, success, disabled)
- ✅ Consistent styling with theme integration
- ✅ TypeScript support with proper prop types
- ✅ Responsive design for all screen sizes