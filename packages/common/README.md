# @workspace/common

Shared utilities, constants, types, and configurations used across the SearchFIT monorepo.

## Structure

```
packages/common/
├── src/
│   ├── constants/     # Shared constants and enums
│   ├── utils/         # Utility functions
│   ├── types/         # Shared TypeScript types and interfaces
│   ├── config/        # Configuration objects
│   └── index.ts       # Main exports
```

## Usage

Import from the package in your apps or other packages:

```typescript
// Import everything
import { BRAND_STATUS, formatDate, type Brand } from '@workspace/common'

// Import specific modules
import { API_ROUTES } from '@workspace/common/constants'
import { parseJSON } from '@workspace/common/utils'
import type { User } from '@workspace/common/types'
```

## Adding New Shared Code

### Constants

Add constants to `src/constants/`:

```typescript
// src/constants/brand.ts
export const BRAND_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const
```

### Utils

Add utility functions to `src/utils/`:

```typescript
// src/utils/format.ts
export function formatDate(date: Date): string {
  return date.toISOString()
}
```

### Types

Add shared types to `src/types/`:

```typescript
// src/types/brand.ts
export interface Brand {
  id: string
  name: string
  status: 'active' | 'inactive' | 'pending'
}
```

### Config

Add configuration objects to `src/config/`:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  baseUrl: process.env.API_URL,
  timeout: 30000,
}
```

## Development

- `pnpm lint` - Run linter
- `pnpm typecheck` - Run TypeScript type checking
