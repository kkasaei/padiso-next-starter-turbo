/**
 * Type definitions for report page components
 */

export interface ReportPageProps {
  params: {
    domain: string;
  };
}

export interface ReportMetrics {
  averageScore: number;
  totalQueries: number;
  platformsCount: number;
  recommendationsCount: number;
}

export interface ReportSharingConfig {
  url: string;
  domain: string;
  score: number;
}
