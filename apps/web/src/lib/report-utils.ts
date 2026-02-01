// Minimal types for report utilities
interface MarketCompetitionSegment {
  queries: number;
  [key: string]: unknown;
}

/**
 * Calculates the average score from LLM providers
 * Accepts any array of objects with a score property
 */
export function calculateAverageScore(providers: Array<{ score: number; [key: string]: unknown }>): number {
  if (providers.length === 0) return 0;

  const sum = providers.reduce((acc, provider) => acc + provider.score, 0);
  return Math.round(sum / providers.length);
}

/**
 * Calculates total queries analyzed across all market segments
 */
export function calculateTotalQueries(segments: MarketCompetitionSegment[]): number {
  return segments.reduce((acc, segment) => acc + segment.queries, 0);
}

/**
 * Generates the share URL for a report
 */
export function generateReportUrl(domain: string): string {
  if (typeof window === 'undefined') {
    return `https://searchfit.ai/report/${domain}`;
  }
  return window.location.href;
}

/**
 * Decodes and formats domain name for display
 */
export function formatDomain(domain: string): string {
  return decodeURIComponent(domain);
}
