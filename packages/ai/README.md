# @workspace/ai

AI-powered functionality for SearchFit - completely self-contained with no external database dependencies.

## Features

- 🤖 **AI Gateway** - Unified interface for multiple LLM providers
- 📊 **AEO Reports** - Answer Engine Optimization analysis
- 🔍 **Website Audits** - Comprehensive SEO/AEO auditing
- 📈 **Project Scanner** - Brand visibility tracking across AI platforms
- ✨ **Content Generation** - Project descriptions, guidelines, and targeting
- 🎨 **Image Generation** - AI-powered image creation
- 📝 **Prompt Generation** - Smart prompt suggestions

## Installation

This package is part of the SearchFit monorepo:

```bash
pnpm install
```

## Usage

### AI Gateway

```typescript
import { gateway } from '@workspace/ai';
import { generateText } from 'ai';

const result = await generateText({
  model: gateway('openai/gpt-4'),
  prompt: 'Analyze this website...',
});
```

### AEO Report Generation

```typescript
import { generateAEOReport } from '@workspace/ai';

const report = await generateAEOReport({
  domain: 'example.com',
  domainURL: 'https://example.com',
  forceRegenerate: false,
});
```

### Website Audit

```typescript
import { runWebsiteAudit } from '@workspace/ai';

const audit = await runWebsiteAudit({
  projectId: 'project-123',
  auditId: 'audit-456',
  websiteUrl: 'https://example.com',
  maxPagesToAudit: 100,
  maxPagesToScan: 50,
});
```

### Project Scanner

```typescript
import { runProjectScan } from '@workspace/ai';

const scan = await runProjectScan(
  {
    projectId: 'project-123',
    organizationId: 'org-456',
    brandName: 'My Brand',
    websiteUrl: 'https://mybrand.com',
    industry: 'Technology',
    targetAudience: 'Developers',
    trackedPrompts: [
      { prompt: 'best project management tools', category: 'product' },
    ],
  },
  {
    providers: ['chatgpt', 'perplexity', 'gemini'],
    useRichAnalysis: true,
  }
);
```

## Architecture

### Self-Contained Design

This package is **completely self-contained**:

- ✅ No external database dependencies
- ✅ Internal type definitions
- ✅ Mock database for development
- ✅ Ready for production integration

### Directory Structure

```
src/
├── types/              # Internal type definitions
│   ├── audit-dto.ts
│   └── aeo-report.ts
├── mock-db.ts          # Mock database implementation
├── gateway.ts          # AI gateway configuration
├── aeo-report/         # AEO report generation
├── audit/              # Website audit system
├── project-scanner/    # Brand visibility scanning
├── project/            # Project content generators
├── prompt/             # Prompt generation
├── image-generation.ts # Image generation
└── icons.tsx           # React icon components
```

## Development

### Using Mock Database

The package includes a mock database for development and testing:

```typescript
import { mockPrisma, addMockProject, clearMockData } from '@workspace/ai';

// Add test data
addMockProject('project-123', {
  name: 'Test Project',
  websiteUrl: 'https://example.com',
});

// Clear all mock data
clearMockData();
```

### Type Definitions

All types are defined internally in `src/types/`:

```typescript
import type {
  PageIssue,
  PageAnalysis,
  PageMetadata,
} from '@workspace/ai';

import type {
  AEOReport,
  LLMProviderData,
  BrandRecognitionData,
} from '@workspace/ai';
```

## Integration

### Production Database

To integrate with a real database, see [REFACTOR.md](./REFACTOR.md) for migration instructions.

### Environment Variables

Required environment variables:

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic (optional)
ANTHROPIC_API_KEY=sk-...

# Google (optional)
GOOGLE_GENERATIVE_AI_API_KEY=...

# Perplexity (optional)
PERPLEXITY_API_KEY=...
```

## API Reference

See individual module documentation:

- [Gateway](./src/gateway.ts)
- [AEO Reports](./src/aeo-report/)
- [Audits](./src/audit/)
- [Project Scanner](./src/project-scanner/)
- [Project Generators](./src/project/)

## Contributing

1. Make changes in `src/`
2. Run type check: `pnpm type-check`
3. Run linter: `pnpm lint`
4. Test with mock database
5. Submit PR

## License

MIT
