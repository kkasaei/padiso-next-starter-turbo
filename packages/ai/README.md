# @workspace/ai

Self-contained AI module for SearchFit with AI Gateway integration for multiple LLM providers.

## Features

- 🤖 **AI Gateway Integration**: Centralized access to multiple LLM providers
- 📊 **AEO Report Generation**: Comprehensive Answer Engine Optimization reports
- 🔍 **Website Audits**: AI-powered website content analysis
- 🎯 **Project Scanner**: Automated project analysis and insights
- 💡 **Prompt Suggestions**: AI-generated prompt recommendations
- 🖼️ **Image Generation**: AI-powered image creation capabilities
- 🧪 **Mock Database**: Built-in testing infrastructure

## Supported Models

- **OpenAI**: GPT-5 Mini (primary)
- **Anthropic**: Claude Sonnet 4.5
- **DeepSeek**: DeepSeek V3.2
- **Google**: Gemini 2.5 Flash
- **Perplexity**: Sonar (search-optimized)
- **xAI**: Grok 3

## Installation

This package is part of the workspace monorepo. Install dependencies:

```bash
pnpm install
```

## Environment Variables

Required environment variables (add to your `.env` file):

```bash
# AI Gateway Configuration
AI_GATEWAY_API_KEY=your_gateway_api_key_here  # Required
AI_GATEWAY_BASE_URL=https://your-gateway.com  # Optional (uses AI SDK defaults)

# Node Environment
NODE_ENV=development  # development | production | test
```

## Usage

### Environment Configuration

```typescript
import { env, validateEnv } from '@workspace/ai';

// Validate environment on startup
validateEnv();

console.log('AI Gateway configured:', !!env.AI_GATEWAY_API_KEY);
```

### Using AI Gateway

```typescript
import { gateway, DEFAULT_MODEL } from '@workspace/ai';
import { generateText } from 'ai';

const result = await generateText({
  model: gateway(DEFAULT_MODEL),
  prompt: 'Explain quantum computing',
});

console.log(result.text);
```

### Generate AEO Reports

```typescript
import { generateAEOReport } from '@workspace/ai';

const report = await generateAEOReport({
  domain: 'example.com',
  brandName: 'Example Inc',
  industry: 'Technology',
});

console.log('AEO Score:', report.overallScore);
```

### Generate Prompt Suggestions

```typescript
import { generatePromptSuggestions } from '@workspace/ai';

const result = await generatePromptSuggestions({
  projectName: 'SearchFit',
  domain: 'searchfit.ai',
  description: 'AI-powered search visibility platform',
  count: 10,
});

if (result.success) {
  console.log('Generated suggestions:', result.suggestions);
}
```

### Website Audit

```typescript
import { auditWebsite } from '@workspace/ai';

const audit = await auditWebsite({
  url: 'https://example.com',
  includeContent: true,
  maxPages: 10,
});

console.log('Pages analyzed:', audit.pages.length);
```

## Development

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

## Architecture

```
src/
├── env.ts                    # Environment configuration
├── index.ts                  # Central exports
├── gateway.ts                # AI Gateway setup
├── aeo-report/              # AEO report generation
├── audit/                   # Website auditing
├── project-scanner/         # Project analysis
├── project/                 # Project utilities
│   └── prompt-suggestions-generator.ts
├── prompt/                  # Prompt generation
├── image-generation.ts      # Image creation
├── mock-db.ts              # Testing utilities
└── types/                  # TypeScript types
```

## License

Private workspace package
