import type { MetadataRoute } from 'next';

import { baseURL } from '@workspace/common';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/app/',           // Internal app routes
          '/api/',           // API endpoints
          '/dashboard/',     // Dashboard (private, authenticated)
          '/dashboard/*',    // All dashboard sub-routes
        ]
      },
      // Extra rules for common AI/LLM crawlers
      {
        userAgent: [
          'GPTBot',          // OpenAI
          'ChatGPT-User',    // OpenAI ChatGPT
          'CCBot',           // Common Crawl (used by many AI)
          'anthropic-ai',    // Anthropic Claude
          'Claude-Web',      // Anthropic Claude
          'Google-Extended', // Google Bard/Gemini
          'PerplexityBot',   // Perplexity AI
          'Omgilibot',       // Omgili
          'FacebookBot',     // Meta AI
        ],
        disallow: ['/dashboard/', '/dashboard/*', '/api/', '/app/']
      }
    ],
    sitemap: `${baseURL}/sitemap.xml`
  };
}
