/**
 * AI Page Analyzer
 *
 * Uses AI to analyze web pages for SEO/AEO optimization
 */

import { generateText } from 'ai';
import { gateway } from '../gateway';
import { getPageAnalysisPrompt } from './prompts';
import type {
  AIAnalysisResult,
  PageAnalysisInput,
  ExtractedPageData,
} from './types';
import type { PageAnalysis, PageIssue } from '../types/audit-dto';

// ============================================================
// Configuration
// ============================================================

const AI_MODEL = 'openai/gpt-4o-mini';
const AI_TIMEOUT_MS = 60000;

// ============================================================
// Prepare Analysis Input
// ============================================================

export function prepareAnalysisInput(pageData: ExtractedPageData): PageAnalysisInput {
  const { metadata, url, path, textContent } = pageData;

  const hasStructuredData = metadata.structuredData.length > 0;
  const structuredDataTypes = metadata.structuredData.map((item) => item.type);
  const hasOgTags = !!(metadata.ogImage || metadata.ogTitle || metadata.ogDescription);
  const hasCanonical = !!metadata.canonicalUrl;

  const imagesWithoutAlt = metadata.images.filter((img) => !img.alt).length;
  const totalImages = metadata.images.length;

  const internalLinks = metadata.links.filter((link) => link.isInternal).length;
  const externalLinks = metadata.links.filter((link) => !link.isInternal).length;
  const brokenLinks = metadata.links.filter((link) => link.isBroken).length;

  return {
    url,
    path,
    title: metadata.title,
    description: metadata.description,
    h1: metadata.h1,
    h2s: metadata.h2s,
    textContent,
    wordCount: metadata.wordCount,
    hasStructuredData,
    structuredDataTypes,
    hasOgTags,
    hasCanonical,
    imagesWithoutAlt,
    totalImages,
    internalLinks,
    externalLinks,
    brokenLinks,
  };
}

// ============================================================
// AI Analysis
// ============================================================

export async function analyzePageWithAI(pageData: ExtractedPageData): Promise<AIAnalysisResult> {
  const input = prepareAnalysisInput(pageData);
  const prompt = getPageAnalysisPrompt(input);

  try {
    const result = await Promise.race([
      generateText({
        model: gateway(AI_MODEL),
        prompt,
        temperature: 0.3,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('AI analysis timeout')), AI_TIMEOUT_MS)
      ),
    ]);

    // Parse response
    const text = result.text;
    const usage = result.usage;

    // Extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response');
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonText);

    // Calculate cost (AI SDK uses inputTokens/outputTokens)
    const inputTokens = usage.inputTokens ?? 0;
    const outputTokens = usage.outputTokens ?? 0;
    const inputCost = (inputTokens / 1_000_000) * 0.15; // gpt-4o-mini input pricing
    const outputCost = (outputTokens / 1_000_000) * 0.6; // gpt-4o-mini output pricing
    const cost = inputCost + outputCost;

    // Validate and extract scores
    const scores = {
      overall: clampScore(parsed.scores?.overall),
      seo: clampScore(parsed.scores?.seo),
      aeo: clampScore(parsed.scores?.aeo),
      content: clampScore(parsed.scores?.content),
      technical: clampScore(parsed.scores?.technical),
    };

    // Extract analysis
    const analysis: PageAnalysis = {
      strengths: (parsed.analysis?.strengths || []).slice(0, 5),
      issues: (parsed.analysis?.issues || []).slice(0, 5),
      recommendations: (parsed.analysis?.recommendations || []).slice(0, 5),
      aeoReadiness: parsed.analysis?.aeoReadiness || {
        score: scores.aeo,
        status: getStatusFromScore(scores.aeo),
        factors: {
          structuredData: 50,
          contentClarity: 50,
          answerability: 50,
          semanticMarkup: 50,
        },
      },
      contentQuality: parsed.analysis?.contentQuality || {
        readabilityScore: 50,
        uniquenessIndicator: 'medium' as const,
        topicRelevance: 50,
        keywordOptimization: 50,
      },
    };

    // Extract issues from AI response
    const aiIssues: PageIssue[] = (parsed.issues || []).map((issue: Record<string, unknown>) => ({
      type: issue.type || 'other',
      severity: issue.severity || 'info',
      message: issue.message || 'Unknown issue',
      fix: issue.fix || 'Review and fix this issue',
      element: issue.element,
    }));

    // Filter out AI issues that contradict actual data (prevent hallucinations)
    const filteredAiIssues = aiIssues.filter((issue) => {
      // Don't trust AI about alt text if we have actual image count
      if (issue.type === 'missing_alt_text' && input.imagesWithoutAlt === 0) {
        return false;
      }
      // Don't trust AI about images if there are no images
      if (issue.message?.toLowerCase().includes('image') && 
          issue.message?.toLowerCase().includes('alt') && 
          input.totalImages === 0) {
        return false;
      }
      // Don't trust AI about broken links if we didn't detect any
      if (issue.type === 'broken_link' && input.brokenLinks === 0) {
        return false;
      }
      // Don't trust AI about missing title if title exists
      if (issue.type === 'missing_title' && input.title) {
        return false;
      }
      // Don't trust AI about missing description if description exists
      if (issue.type === 'missing_description' && input.description) {
        return false;
      }
      // Don't trust AI about missing H1 if H1 exists
      if (issue.type === 'missing_h1' && input.h1) {
        return false;
      }
      return true;
    });

    // Add automatic issues based on actual metadata (these are trustworthy)
    const autoIssues = generateAutomaticIssues(input);
    const allIssues = deduplicateIssues([...filteredAiIssues, ...autoIssues]);

    return {
      success: true,
      scores,
      analysis,
      issues: allIssues,
      cost,
      tokensUsed: inputTokens + outputTokens,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      scores: {
        overall: 0,
        seo: 0,
        aeo: 0,
        content: 0,
        technical: 0,
      },
      analysis: {
        strengths: [],
        issues: [],
        recommendations: [],
        aeoReadiness: {
          score: 0,
          status: 'poor',
          factors: {
            structuredData: 0,
            contentClarity: 0,
            answerability: 0,
            semanticMarkup: 0,
          },
        },
        contentQuality: {
          readabilityScore: 0,
          uniquenessIndicator: 'low',
          topicRelevance: 0,
          keywordOptimization: 0,
        },
      },
      issues: [],
      cost: 0,
      tokensUsed: 0,
      error: errorMessage,
    };
  }
}

// ============================================================
// Helper Functions
// ============================================================

function clampScore(score: unknown): number {
  if (typeof score !== 'number') return 50;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getStatusFromScore(score: number): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'needs-improvement';
  return 'poor';
}

function generateAutomaticIssues(input: PageAnalysisInput): PageIssue[] {
  const issues: PageIssue[] = [];

  // Missing title
  if (!input.title) {
    issues.push({
      type: 'missing_title',
      severity: 'critical',
      message: 'Page is missing a title tag',
      fix: 'Add a unique, descriptive title tag (50-60 characters)',
    });
  }

  // Missing description
  if (!input.description) {
    issues.push({
      type: 'missing_description',
      severity: 'warning',
      message: 'Page is missing a meta description',
      fix: 'Add a compelling meta description (120-160 characters)',
    });
  }

  // Missing H1
  if (!input.h1) {
    issues.push({
      type: 'missing_h1',
      severity: 'critical',
      message: 'Page is missing an H1 heading',
      fix: 'Add a single, descriptive H1 heading to the page',
    });
  }

  // Missing alt text on images
  if (input.imagesWithoutAlt > 0) {
    issues.push({
      type: 'missing_alt_text',
      severity: 'warning',
      message: `${input.imagesWithoutAlt} images are missing alt text`,
      fix: 'Add descriptive alt text to all images for accessibility and SEO',
    });
  }

  // Missing canonical
  if (!input.hasCanonical) {
    issues.push({
      type: 'missing_canonical',
      severity: 'warning',
      message: 'Page is missing a canonical URL',
      fix: 'Add a canonical link tag to prevent duplicate content issues',
    });
  }

  // Missing OG tags
  if (!input.hasOgTags) {
    issues.push({
      type: 'missing_og_tags',
      severity: 'info',
      message: 'Page is missing Open Graph meta tags',
      fix: 'Add og:title, og:description, and og:image for better social sharing',
    });
  }

  // Missing structured data
  if (!input.hasStructuredData) {
    issues.push({
      type: 'missing_structured_data',
      severity: 'info',
      message: 'Page has no structured data (JSON-LD)',
      fix: 'Add relevant schema.org structured data to improve AI understanding',
    });
  }

  // Thin content
  if (input.wordCount < 300) {
    issues.push({
      type: 'thin_content',
      severity: 'warning',
      message: `Page has only ${input.wordCount} words (thin content)`,
      fix: 'Expand content to at least 500-1000 words for better ranking potential',
    });
  }

  return issues;
}

function deduplicateIssues(issues: PageIssue[]): PageIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    const key = `${issue.type}:${issue.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

