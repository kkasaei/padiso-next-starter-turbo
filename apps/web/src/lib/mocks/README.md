# Mock Data

This directory contains all mock/test data for development and testing purposes.

## ⚠️ Important

- **Production Code**: Should ONLY use tRPC for data fetching
- **Mock Data**: Use only for:
  - Development/testing
  - Storybook stories
  - Demo pages
  - Unit tests

## Structure

```
mocks/
├── audit/              # Technical audit mock data
├── tracking/           # AI tracking & analytics mocks
├── legacy-projects.ts  # Old project data (to be removed)
└── legacy-project-details.ts  # Old project details (to be removed)
```

## Migration Path

Components currently using mock data should be migrated to use tRPC:

```typescript
// ❌ Old (using mocks)
import { projects } from '@/lib/mocks/legacy-projects';

// ✅ New (using tRPC)
import { useBrands } from '@/hooks';
const { data: brands } = useBrands(workspaceId);
```
