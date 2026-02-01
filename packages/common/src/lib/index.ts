/**
 * Shared library utilities
 * Re-exported from @workspace/common/lib
 */

// Core utilities
export { cn } from './utils';
export * from './formatters';
export * from './navigation';
export * from './view-options';

// Report utilities
export * from './report-utils';
export * from './social-share-text';

// Document utilities
export * from './toc';

// Re-exports
export * from './remove-scroll';

// URL utilities
export * from './url/filters';

// Assets
export * from './assets/avatars';

// Auth utilities (Server-only - import directly when needed)
// export * from './auth';  // Contains server-only code - import from @workspace/common/lib/auth when needed in server components

// Billing utilities
export * from './billing';

// Types (excluding database-dependent types)
// export * from './types/prompts';
// export * from './types/tasks';

// Data
export * from './data/sidebar';
export * from './data/prompts';

// Schema
export * from './shcmea/aeo-report';
export * from './shcmea/types/project-form';
export * from './shcmea/types/activity';
export * from './shcmea/types/content';
export * from './shcmea/types/context-files';
export * from './shcmea/types/integration';
export * from './shcmea/types/prompt-export';
export * from './shcmea/types/prompt-import';
export * from './shcmea/types/site-discovery';

// Types
export * from './types/tasks';

// Mocks
export * from './mocks/legacy-project-details';
export * from './mocks/tracking';

// Note: Some mocks are intentionally not exported as they contain app-specific imports
