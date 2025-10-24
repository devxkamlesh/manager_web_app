# Authentication Components

Components related to user authentication and authorization.

## Components

- **`auth-debug.tsx`** - Debug utilities for authentication testing
- **`auth-provider.tsx`** - Main authentication context provider
- **`supabase-auth-provider.tsx`** - Supabase-specific authentication wrapper

## Usage

```tsx
import { AuthProvider } from '@/components/auth/auth-provider'
import { SupabaseAuthProvider } from '@/components/auth/supabase-auth-provider'
```