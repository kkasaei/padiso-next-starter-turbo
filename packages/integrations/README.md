# @workspace/integrations

Third-party integrations package for SearchFIT.

## Features

### Encryption Utilities

Secure encryption/decryption utilities for sensitive data (OAuth tokens, API keys, etc.) using AES-256-GCM authenticated encryption.

```typescript
import { encrypt, decrypt, encryptIfPresent, isEncrypted } from '@workspace/integrations';

// Encrypt sensitive data
const encryptedToken = encrypt('my-secret-token');

// Decrypt when needed
const token = decrypt(encryptedToken);

// Safe encryption (handles null/undefined)
const maybeEncrypted = encryptIfPresent(optionalValue);

// Check if a value is encrypted
if (isEncrypted(value)) {
  const decrypted = decrypt(value);
}
```

**Setup:**

1. Copy `.env.example` to `.env.local` in your project root
2. Generate an encryption key:
```bash
openssl rand -hex 32
```
3. Add the required environment variables:
```bash
# In your .env.local
INTEGRATION_ENCRYPTION_KEY=your_generated_key_here
INTEGRATION_GOOGLE_CLIENT_ID=your_client_id
INTEGRATION_GOOGLE_CLIENT_SECRET=your_client_secret
```

**Environment Variables:**

This package has its own environment configuration. See `.env.example` for all available variables.

## Planned Features

- CRM integrations
- Analytics platforms
- Marketing tools
- Data sync services
