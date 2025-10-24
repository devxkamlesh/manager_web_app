# Task Management Components

Components for comprehensive task management with multiple view modes.

## Components

- **`create-task-dialog.tsx`** - Task creation with scheduling
- **`edit-task-dialog.tsx`** - Task editing interface
- **`task-manager.tsx`** - Main task management hub
- **`task-view-dialog.tsx`** - Detailed task information
- **`task-views.tsx`** - Multiple view modes (List, Board, Grid)

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Multiple view modes: List, Kanban Board, Grid
- ✅ Task scheduling with date and time
- ✅ Custom time estimates with quick-select buttons
- ✅ Priority and status management
- ✅ Category organization with colors and icons
- ✅ Project association
- ✅ Tags and filtering
- ✅ Focus timer integration

## Usage

```tsx
import { TaskManager } from '@/components/tasks/task-manager'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { TaskListView, TaskBoardView, TaskGridView } from '@/components/tasks/task-views'
```