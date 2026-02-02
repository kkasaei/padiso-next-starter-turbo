/**
 * Types for Brand Analyzer
 */

export interface BrandAnalysisResult {
  description: string;
  targetAudiences: string[];
  businessKeywords: string[];
  competitors: string[];
}

export interface BrandAnalysisInput {
  websiteUrl: string;
  brandName?: string;
}
