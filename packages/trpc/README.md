# @workspace/trpc

Shared tRPC utilities for SearchFIT monorepo.

## Usage

### Client Setup (Next.js App Router)

```tsx
// app/layout.tsx
import { TRPCReactProvider } from '@workspace/trpc/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
```

### Client Usage

```tsx
// components/MyComponent.tsx
import { trpc } from '@workspace/trpc/client';

export function MyComponent() {
  const { data } = trpc.brands.list.useQuery();
  // ...
}
```

### Server Setup

Each app needs to:
1. Define its own routers in `server/trpc/routers/`
2. Create app-specific context in `server/trpc/context.ts`
3. Export the AppRouter type
4. Set up the API route handler in `app/api/trpc/[trpc]/route.ts`

## Package Structure

- `@workspace/trpc/client` - Vanilla tRPC client creator
- `@workspace/trpc/react` - React provider with QueryClient setup
- `@workspace/trpc/server` - Shared server utilities (tRPC instance, error formatting)

## Apps Using This Package

- `apps/web` - Main web application
- `apps/admin` - Admin dashboard
- `apps/hub` - Hub application (future)
