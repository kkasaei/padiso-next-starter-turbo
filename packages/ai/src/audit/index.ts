/**
 * Website Audit AI Module
 *
 * AI-driven website auditing for SEO/AEO optimization
 */

// Types
export * from './types';

// Crawler
export { discoverPages, fetchPage, extractPageData, fetchSitemap, parseRobotsTxt } from './crawler';

// AI Analyzer
export { analyzePageWithAI } from './analyzer';

// Orchestrator
export { runWebsiteAudit, scanMorePages, analyzeStoredPage } from './orchestrator';

