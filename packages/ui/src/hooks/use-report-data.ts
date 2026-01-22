import * as React from 'react';

// ============================================================
// AEO Report Types (extracted from schema)
// ============================================================

type LLMProviderStatus = 'excellent' | 'good' | 'average' | 'needs-improvement';
type Trend = 'up' | 'down' | 'stable';

interface LLMProvider {
  name: string;
  logo: string;
  score: number;
  status: LLMProviderStatus;
  trend: Trend;
}

interface BrandRecognition {
  provider: string;
  logo: string;
  score: number;
  marketPosition: string;
  brandArchetype: string;
  confidenceLevel: number;
  mentionDepth: number;
  sourceQuality: number;
  dataRichness: number;
}

interface CompetitorDataPoint {
  name: string;
  value: number;
  color: string;
}

interface MarketCompetitionSegment {
  title: string;
  queries: number;
  totalMentions: number;
  data: CompetitorDataPoint[];
  keyFactors: string[];
}

interface StrengthOpportunity {
  title: string;
  description: string;
}

interface MarketTrajectory {
  status: 'positive' | 'negative' | 'neutral';
  description: string;
}

interface AnalysisSummary {
  strengths: StrengthOpportunity[];
  opportunities: StrengthOpportunity[];
  marketTrajectory: MarketTrajectory;
}

interface SentimentMetric {
  category: string;
  score: number;
  description: string;
  keyFactors: string[];
}

interface SentimentAnalysis {
  provider: string;
  totalScore: number;
  polarization: number;
  reliableData: boolean;
  metrics: SentimentMetric[];
}

interface ContentIdea {
  title: string;
  description: string;
  category: 'Blog Post' | 'Video' | 'Case Study' | 'Guide' | 'Social Media';
  priority: 'high' | 'medium' | 'low';
  topics: string[];
}

interface AxisLabel {
  low: string;
  high: string;
}

interface BrandPosition {
  name: string;
  domain?: string;
  x: number;
  y: number;
  isYourBrand?: boolean;
}

interface BrandPositioningProvider {
  provider: string;
  logo: string;
  positions: BrandPosition[];
}

interface BrandPositioning {
  xAxisLabel: AxisLabel;
  yAxisLabel: AxisLabel;
  providers: BrandPositioningProvider[];
}

export interface AEOReport {
  llmProviders: LLMProvider[];
  brandRecognition: BrandRecognition[];
  marketCompetition: MarketCompetitionSegment[];
  analysisSummary: AnalysisSummary;
  sentimentAnalysis: SentimentAnalysis[];
  narrativeThemes: string[];
  contentIdeas: ContentIdea[];
  brandPositioning: BrandPositioning;
}

interface UseReportDataOptions {
  domain: string;
  vertical?: string;
}

interface UseReportDataReturn {
  data: AEOReport | null;
  isLoading: boolean;
  isGenerating: boolean;
  isNotFound: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch and manage AEO report data
 * Handles loading states, error handling, and data validation
 */
export function useReportData({ domain, vertical }: UseReportDataOptions): UseReportDataReturn {
  const [data, setData] = React.useState<AEOReport | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchReport() {
      try {
        console.log(`[useReportData] Fetching report for: ${domain}${vertical ? ` (${vertical})` : ''}`);

        // Build URL with optional vertical parameter
        const url = new URL(`/api/reports/${encodeURIComponent(domain)}`, window.location.origin);
        if (vertical) {
          url.searchParams.set('vertical', vertical);
        }

        const response = await fetch(url.toString());

        if (!isMounted) return;

        const responseData = await response.json();

        if (!response.ok) {
          console.error('[useReportData] API error:', {
            status: response.status,
            error: responseData.error,
            llmResults: responseData.llmResults
          });

          setIsNotFound(true);
          setIsGenerating(false);
          setError(new Error(responseData.error || 'Failed to fetch report'));
          return;
        }

        // Check if report was generated fresh (not from cache)
        if (responseData.fromCache === false) {
          console.log('[useReportData] Report generated fresh');
          setIsGenerating(true);
        } else {
          console.log('[useReportData] Report loaded from cache');
        }

        if (responseData.success && responseData.report?.data) {
          const reportData = responseData.report.data;

          // Validate that we have actual data (not empty arrays)
          if (!validateReportData(reportData)) {
            console.error('[useReportData] Report has empty datasets');
            setIsNotFound(true);
            setIsGenerating(false);
            setError(new Error('Report data is incomplete'));
            return;
          }

          console.log('[useReportData] Report loaded successfully');
          setData(reportData);
          setIsNotFound(false);
          setIsGenerating(false);
        } else {
          console.error('[useReportData] Report data invalid or missing');
          setIsNotFound(true);
          setIsGenerating(false);
          setError(new Error('Report data is invalid'));
        }
      } catch (err) {
        if (!isMounted) return;

        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('[useReportData] Fetch error:', error);

        setIsNotFound(true);
        setError(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchReport();

    return () => {
      isMounted = false;
    };
  }, [domain, vertical]);

  return {
    data,
    isLoading,
    isGenerating,
    isNotFound,
    error
  };
}

/**
 * Validates that report data contains required non-empty datasets
 */
function validateReportData(data: AEOReport): boolean {
  const hasLLMProviders = Array.isArray(data.llmProviders) && data.llmProviders.length > 0;
  const hasBrandRecognition = Array.isArray(data.brandRecognition) && data.brandRecognition.length > 0;

  return hasLLMProviders && hasBrandRecognition;
}
