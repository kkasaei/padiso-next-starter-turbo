import type { AEOReport } from '../types/aeo-report';

// ============================================================
// LLM Provider Types
// ============================================================

export type LLMProvider = 'chatgpt' | 'perplexity' | 'gemini';

export interface LLMProviderConfig {
  name: LLMProvider;
  model: string;
  enabled: boolean;
}

// ============================================================
// Report Generation Types
// ============================================================

export interface ReportGenerationOptions {
  domain: string;
  domainURL: string;
  forceRegenerate?: boolean;
}

export interface LLMExecutionResult {
  provider: LLMProvider;
  status: 'success' | 'error' | 'timeout';
  data?: Partial<AEOReport>;
  error?: string;
  executionTimeMs: number;
  cost?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface ReportGenerationResult {
  success: boolean;
  reportId?: string;
  report?: AEOReport;
  error?: string;
  fromCache: boolean;
  generationTimeMs?: number;
  llmResults?: LLMExecutionResult[];
}

// ============================================================
// Database Types
// ============================================================

export interface CachedReport {
  id: string;
  domain: string;
  domainURL: string;
  data: AEOReport | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'EXPIRED';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// LLM Response Types (Raw responses from each LLM)
// ============================================================

export interface ChatGPTReportData {
  llmProviders: Array<{
    name: string;
    logo: string;
    score: number;
    status: 'excellent' | 'good' | 'average' | 'needs-improvement';
    trend: 'up' | 'down' | 'stable';
  }>;
  brandRecognition: Array<{
    provider: string;
    logo: string;
    score: number;
    marketPosition: string;
    brandArchetype: string;
    confidenceLevel: number;
    mentionDepth: number;
    sourceQuality: number;
    dataRichness: number;
  }>;
  sentimentAnalysis: Array<{
    provider: string;
    totalScore: number;
    polarization: number;
    reliableData: boolean;
    metrics: Array<{
      category: string;
      score: number;
      description: string;
      keyFactors: string[];
    }>;
  }>;
  brandPositioning: {
    xAxisLabel: { low: string; high: string };
    yAxisLabel: { low: string; high: string };
    positions: Array<{
      name: string;
      domain?: string;
      x: number;
      y: number;
      isYourBrand?: boolean;
    }>;
  };
}

export interface PerplexityReportData {
  llmProviders: Array<{
    name: string;
    logo: string;
    score: number;
    status: 'excellent' | 'good' | 'average' | 'needs-improvement';
    trend: 'up' | 'down' | 'stable';
  }>;
  brandRecognition: Array<{
    provider: string;
    logo: string;
    score: number;
    marketPosition: string;
    brandArchetype: string;
    confidenceLevel: number;
    mentionDepth: number;
    sourceQuality: number;
    dataRichness: number;
  }>;
  sentimentAnalysis: Array<{
    provider: string;
    totalScore: number;
    polarization: number;
    reliableData: boolean;
    metrics: Array<{
      category: string;
      score: number;
      description: string;
      keyFactors: string[];
    }>;
  }>;
  marketCompetition: Array<{
    title: string;
    queries: number;
    totalMentions: number;
    data: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    keyFactors: string[];
  }>;
  brandPositioning: {
    xAxisLabel: { low: string; high: string };
    yAxisLabel: { low: string; high: string };
    positions: Array<{
      name: string;
      domain?: string;
      x: number;
      y: number;
      isYourBrand?: boolean;
    }>;
  };
}

export interface GeminiReportData {
  llmProviders: Array<{
    name: string;
    logo: string;
    score: number;
    status: 'excellent' | 'good' | 'average' | 'needs-improvement';
    trend: 'up' | 'down' | 'stable';
  }>;
  brandRecognition: Array<{
    provider: string;
    logo: string;
    score: number;
    marketPosition: string;
    brandArchetype: string;
    confidenceLevel: number;
    mentionDepth: number;
    sourceQuality: number;
    dataRichness: number;
  }>;
  sentimentAnalysis: Array<{
    provider: string;
    totalScore: number;
    polarization: number;
    reliableData: boolean;
    metrics: Array<{
      category: string;
      score: number;
      description: string;
      keyFactors: string[];
    }>;
  }>;
  analysisSummary: {
    strengths: Array<{
      title: string;
      description: string;
    }>;
    opportunities: Array<{
      title: string;
      description: string;
    }>;
    marketTrajectory: {
      status: 'positive' | 'negative' | 'neutral';
      description: string;
    };
  };
  narrativeThemes: string[];
  contentIdeas: Array<{
    title: string;
    description: string;
    category: 'Blog Post' | 'Video' | 'Case Study' | 'Guide' | 'Social Media';
    priority: 'high' | 'medium' | 'low';
    topics: string[];
  }>;
  brandPositioning: {
    xAxisLabel: { low: string; high: string };
    yAxisLabel: { low: string; high: string };
    positions: Array<{
      name: string;
      domain?: string;
      x: number;
      y: number;
      isYourBrand?: boolean;
    }>;
  };
}

