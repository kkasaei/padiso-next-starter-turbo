# Environment Setup for @workspace/integrations

This package uses its own environment configuration, separate from the apps in the monorepo.

## Why Per-Package Environment Files?

In a Turborepo monorepo, packages may have different environment variable requirements:
- **Apps** (web, admin, api) have app-specific env vars (database, auth, etc.)
- **Packages** should be self-contained and only depend on their own env vars

This approach provides:
- ✅ **Type safety** - Validated env vars with TypeScript types
- ✅ **Runtime validation** - Zod schema ensures correctness
- ✅ **Isolation** - Each package manages its own configuration
- ✅ **Reusability** - Packages can be used in different apps with different configs

## Setup Instructions

### 1. Create Environment File

Copy the example file to your project root:

```bash
# From the monorepo root
cp packages/integrations/.env.example .env.local
```

Or add these variables to your existing `.env.local`:

```bash
# Required: Encryption key for sensitive data (32-byte hex string)
INTEGRATION_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Required for Google integrations
INTEGRATION_GOOGLE_CLIENT_ID=your_client_id
INTEGRATION_GOOGLE_CLIENT_SECRET=your_client_secret

# Required for OAuth callbacks
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
```

### 2. Turborepo Configuration

The `turbo.json` file at the root already includes the integration env vars in `globalEnv`:

```json
{
  "globalEnv": [
    "INTEGRATION_ENCRYPTION_KEY",
    "INTEGRATION_GOOGLE_CLIENT_ID",
    "INTEGRATION_GOOGLE_CLIENT_SECRET",
    // ... other vars
  ]
}
```

This ensures these env vars are available to all tasks that need them.

## Usage in Code

### Import the validated env object:

```typescript
import { env, hasEnv, requireEnv } from '@workspace/integrations';

// Use validated env vars (type-safe)
const clientId = env.INTEGRATION_GOOGLE_CLIENT_ID;

// Check if an env var is set
if (hasEnv('INTEGRATION_GOOGLE_CLIENT_ID')) {
  // ...
}

// Require an env var (throws if not set)
const encryptionKey = requireEnv('INTEGRATION_ENCRYPTION_KEY');
```

### Adding New Environment Variables

1. **Add to schema** in `src/env.ts`:
```typescript
const envSchema = z.object({
  // ... existing vars
  INTEGRATION_NEW_API_KEY: z.string().min(1).optional(),
});
```

2. **Add to Turborepo config** in `turbo.json`:
```json
{
  "globalEnv": [
    // ... existing vars
    "INTEGRATION_NEW_API_KEY"
  ]
}
```

3. **Add to example file** `.env.example`:
```bash
# New Integration
INTEGRATION_NEW_API_KEY=
```

## Best Practices

1. **Always use `env` object** - Don't use `process.env` directly
2. **Optional by default** - Mark env vars as `.optional()` unless absolutely required
3. **Validate at boundaries** - Use `requireEnv()` where the var is actually needed
4. **Document in .env.example** - Always add new vars with comments
5. **Prefix with INTEGRATION_** - Keep integration package vars namespaced

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `INTEGRATION_ENCRYPTION_KEY` | Yes (for encryption) | 32-byte hex string for encrypting OAuth tokens |
| `INTEGRATION_GOOGLE_CLIENT_ID` | Yes (for Google) | Google OAuth 2.0 Client ID |
| `INTEGRATION_GOOGLE_CLIENT_SECRET` | Yes (for Google) | Google OAuth 2.0 Client Secret |
| `NEXT_PUBLIC_CLIENT_URL` | Yes (for OAuth) | Base URL for OAuth callbacks |

## Troubleshooting

### Error: "Invalid environment variables in @workspace/integrations"

The env vars failed Zod validation. Check the error message for specific fields.

### Error: "Required environment variable X is not set"

Add the missing variable to your `.env.local` file.

### Changes to .env not taking effect

1. Restart your dev server
2. Clear Turborepo cache: `pnpm turbo clean`
3. Ensure the var is in `globalEnv` in `turbo.json`

## Similar Packages

You can create the same pattern for other packages:

```bash
# Create env.ts in any package
packages/ai/src/env.ts
packages/billing/src/env.ts
packages/email/src/env.ts
```

Each package maintains its own validated environment configuration!
