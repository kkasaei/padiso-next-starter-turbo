import { generateText } from 'ai';
import type { AEOReport } from '../types/aeo-report';
import type {
  LLMProvider,
  LLMExecutionResult,
  ReportGenerationResult,
  ChatGPTReportData,
  PerplexityReportData,
  GeminiReportData
} from './types';
import { LLM_PROVIDERS } from './prompts';
import { getCachedReport, upsertReport, normalizeDomain } from './database';
import { gateway } from '../gateway';

// ============================================================
// Brand Position Normalization
// Ensures the user's domain is correctly identified as "Your Brand"
// ============================================================

interface BrandPosition {
  name: string;
  domain?: string;
  x: number;
  y: number;
  isYourBrand?: boolean;
}

/**
 * Normalize brand positions to ensure the user's domain is correctly marked
 * This fixes issues where the AI might misidentify the brand
 */
function normalizeBrandPositions(
  positions: BrandPosition[],
  userDomain: string
): BrandPosition[] {
  if (!positions || positions.length === 0) return positions;

  // Normalize the user's domain for comparison (remove www., protocol, etc.)
  const normalizedUserDomain = userDomain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');

  // Check if any position is already marked as "Your Brand"
  const hasYourBrand = positions.some(p => p.isYourBrand === true);

  return positions.map((position, index) => {
    // Normalize the position's domain/name for comparison
    const positionDomain = (position.domain || position.name || '')
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '');

    // Check if this position matches the user's domain
    const matchesUserDomain = 
      positionDomain === normalizedUserDomain ||
      positionDomain.includes(normalizedUserDomain) ||
      normalizedUserDomain.includes(positionDomain);

    // If this position matches the user's domain, mark it as "Your Brand"
    if (matchesUserDomain) {
      return {
        ...position,
        domain: userDomain, // Ensure the domain is set correctly
        isYourBrand: true
      };
    }

    // If no position was marked as "Your Brand" and this is the first position
    // (AI usually puts the analyzed brand first), mark it
    if (!hasYourBrand && index === 0 && position.isYourBrand !== false) {
      return {
        ...position,
        domain: position.domain || userDomain,
        isYourBrand: true
      };
    }

    // For other positions, ensure isYourBrand is false
    return {
      ...position,
      isYourBrand: false
    };
  });
}

// ============================================================
// Configuration
// ============================================================

const GENERATION_TIMEOUT = 90000; // 90 seconds total (increased for complex prompts)
const LLM_TIMEOUT = 45000; // 45 seconds per LLM (increased from 30s)

// ============================================================
// Execute Single LLM Query
// ============================================================

async function executeLLMQuery(
  provider: LLMProvider,
  domain: string,
  vertical?: string
): Promise<LLMExecutionResult> {
  const startTime = Date.now();
  const config = LLM_PROVIDERS[provider];

  try {
    // Use centralized gateway for all providers
    const result = await Promise.race([
      generateText({
        model: gateway(config.model),
        prompt: config.prompt(domain, vertical),
        temperature: 0.3
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), LLM_TIMEOUT)
      )
    ]);

    const executionTimeMs = Date.now() - startTime;

    // @ts-expect-error - result type from race
    const text = result.text;
    // @ts-expect-error - result type from race
    const usage = result.usage;

    // Parse JSON response
    let parsedData;
    try {
      // Extract JSON from response (remove markdown code blocks if present)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError}`);
    }

    // Calculate cost (estimate based on usage)
    const inputCost = (usage.promptTokens / 1_000_000) * 0.005; // $5 per 1M tokens (average)
    const outputCost = (usage.completionTokens / 1_000_000) * 0.015; // $15 per 1M tokens
    const cost = inputCost + outputCost;

    return {
      provider,
      status: 'success',
      data: parsedData,
      executionTimeMs,
      cost,
      inputTokens: usage.promptTokens,
      outputTokens: usage.completionTokens
    };
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      provider,
      status: errorMessage.includes('Timeout') ? 'timeout' : 'error',
      error: errorMessage,
      executionTimeMs
    };
  }
}

// ============================================================
// Merge LLM Results into Complete Report
// ============================================================

function mergeLLMResults(
  domain: string,
  results: LLMExecutionResult[]
): AEOReport | null {
  const chatgptResult = results.find((r) => r.provider === 'chatgpt');
  const perplexityResult = results.find((r) => r.provider === 'perplexity');
  const geminiResult = results.find((r) => r.provider === 'gemini');

  // Need at least 2 successful responses to generate a report
  const successfulCount = results.filter((r) => r.status === 'success').length;
  if (successfulCount < 2) {
    return null;
  }

  const chatgptData = chatgptResult?.data as ChatGPTReportData | undefined;
  const perplexityData = perplexityResult?.data as PerplexityReportData | undefined;
  const geminiData = geminiResult?.data as GeminiReportData | undefined;

  // ============================================================
  // PERFORMANCE OPTIMIZATION: Merge data from all LLM providers
  // Each LLM now provides data only for itself (1 item each)
  // ============================================================
  
  // Merge llmProviders from all sources (each provides 1 item)
  const llmProviders = [
    ...(chatgptData?.llmProviders || []),
    ...(perplexityData?.llmProviders || []),
    ...(geminiData?.llmProviders || [])
  ];

  // Merge brandRecognition from all sources (each provides 1 item)
  const brandRecognition = [
    ...(chatgptData?.brandRecognition || []),
    ...(perplexityData?.brandRecognition || []),
    ...(geminiData?.brandRecognition || [])
  ];

  // Merge sentimentAnalysis from all sources (each provides 1 item)
  const sentimentAnalysis = [
    ...(chatgptData?.sentimentAnalysis || []),
    ...(perplexityData?.sentimentAnalysis || []),
    ...(geminiData?.sentimentAnalysis || [])
  ];

  const report: AEOReport = {
    llmProviders,
    brandRecognition,
    marketCompetition: perplexityData?.marketCompetition || [],
    analysisSummary: geminiData?.analysisSummary 
      ? {
          // Ensure EXACTLY 4 strengths
          strengths: Array.isArray(geminiData.analysisSummary.strengths)
            ? geminiData.analysisSummary.strengths.slice(0, 4).concat(
                Array(Math.max(0, 4 - geminiData.analysisSummary.strengths.length))
                  .fill({ title: 'Analysis in progress...', description: 'More insights coming soon.' })
              ).slice(0, 4)
            : Array(4).fill({ title: 'Analysis in progress...', description: 'More insights coming soon.' }),
          
          // Ensure EXACTLY 4 opportunities
          opportunities: Array.isArray(geminiData.analysisSummary.opportunities)
            ? geminiData.analysisSummary.opportunities.slice(0, 4).concat(
                Array(Math.max(0, 4 - geminiData.analysisSummary.opportunities.length))
                  .fill({ title: 'Opportunity being analyzed...', description: 'More opportunities coming soon.' })
              ).slice(0, 4)
            : Array(4).fill({ title: 'Opportunity being analyzed...', description: 'More opportunities coming soon.' }),
          
          marketTrajectory: geminiData.analysisSummary.marketTrajectory || {
            status: 'neutral',
            description: 'Insufficient data to determine market trajectory.'
          }
        }
      : {
          strengths: Array(4).fill({ 
            title: 'Analysis in progress...', 
            description: 'More insights coming soon.' 
          }),
          opportunities: Array(4).fill({ 
            title: 'Opportunity being analyzed...', 
            description: 'More opportunities coming soon.' 
          }),
          marketTrajectory: {
            status: 'neutral',
            description: 'Insufficient data to determine market trajectory.'
          }
        },
    sentimentAnalysis, // Use merged array from all 3 LLMs
    narrativeThemes: geminiData?.narrativeThemes || [],
    contentIdeas: geminiData?.contentIdeas || [],
    brandPositioning: {
      // Use Perplexity's axis labels as the default (they're usually most balanced)
      xAxisLabel: perplexityData?.brandPositioning?.xAxisLabel || {
        low: 'Budget-Friendly',
        high: 'Enterprise-Grade'
      },
      yAxisLabel: perplexityData?.brandPositioning?.yAxisLabel || {
        low: 'Traditional',
        high: 'AI-Innovative'
      },
      providers: [
        {
          provider: 'ChatGPT',
          logo: '/icons/openai.svg',
          // Use ChatGPT's own brand positioning data
          // Fallback to Perplexity's data for backward compatibility with old cached reports
          // Apply normalization to ensure user's brand is correctly identified
          positions: normalizeBrandPositions(
            (chatgptData?.brandPositioning?.positions && chatgptData.brandPositioning.positions.length > 0)
              ? chatgptData.brandPositioning.positions
              : perplexityData?.brandPositioning?.positions || [],
            domain
          )
        },
        {
          provider: 'Perplexity',
          logo: '/icons/perplexity.svg',
          // Use Perplexity's own brand positioning data
          // Apply normalization to ensure user's brand is correctly identified
          positions: normalizeBrandPositions(
            perplexityData?.brandPositioning?.positions || [],
            domain
          )
        },
        {
          provider: 'Gemini',
          logo: '/icons/gemini.svg',
          // Use Gemini's own brand positioning data
          // Fallback to Perplexity's data for backward compatibility with old cached reports
          // Apply normalization to ensure user's brand is correctly identified
          positions: normalizeBrandPositions(
            (geminiData?.brandPositioning?.positions && geminiData.brandPositioning.positions.length > 0)
              ? geminiData.brandPositioning.positions
              : perplexityData?.brandPositioning?.positions || [],
            domain
          )
        }
      ]
    }
  };

  return report;
}

// ============================================================
// Main Report Generation Orchestrator
// ============================================================

export async function generateAEOReport(
  domain: string,
  options: { forceRegenerate?: boolean; vertical?: string } = {}
): Promise<ReportGenerationResult> {
  const startTime = Date.now();
  const normalized = normalizeDomain(domain);

  try {
    // Check cache first (unless force regenerate)
    if (!options.forceRegenerate) {
      const cached = await getCachedReport(normalized);
      if (cached && cached.data) {
        return {
          success: true,
          reportId: cached.id,
          report: cached.data,
          fromCache: true
        };
      }
    }

    // Create pending report
    const reportId = await upsertReport({
      domain: normalized,
      domainURL: domain,
      status: 'PROCESSING'
    });

    // ============================================================
    // PERFORMANCE OPTIMIZATION: Execute all LLM queries in parallel
    // This reduces total generation time from ~90s to ~30s
    // ============================================================
    const { vertical } = options;
    const llmResults = await Promise.race([
      Promise.all([
        executeLLMQuery('chatgpt', domain, vertical),
        executeLLMQuery('perplexity', domain, vertical),
        executeLLMQuery('gemini', domain, vertical)
      ]),
      new Promise<LLMExecutionResult[]>((_, reject) =>
        setTimeout(() => reject(new Error('Generation timeout')), GENERATION_TIMEOUT)
      )
    ]);

    // Merge results into complete report
    const report = mergeLLMResults(domain, llmResults);

    if (!report) {
      await upsertReport({
        domain: normalized,
        domainURL: domain,
        status: 'FAILED',
        llmResults,
        generationTimeMs: Date.now() - startTime
      });

      return {
        success: false,
        error: 'Failed to generate report - insufficient data from LLM providers',
        fromCache: false,
        llmResults
      };
    }

    // Calculate total cost
    const totalCost = llmResults.reduce((sum, r) => sum + (r.cost || 0), 0);

    // Save completed report
    await upsertReport({
      domain: normalized,
      domainURL: domain,
      status: 'COMPLETED',
      data: report,
      llmResults,
      generationTimeMs: Date.now() - startTime,
      totalCost
    });

    // ============================================================
    // TODO: Generate OG image and upload to CDN (post-report generation)
    // Currently disabled - integrate when OG image service is available
    // ============================================================
    // try {
    //   const { generateAndUploadOGImage } = await import('@/lib/og-image/upload-og-image');
    //   
    //   // Generate and upload OG image (don't await - run in background)
    //   void generateAndUploadOGImage(reportId, normalized).catch((error: Error) => {
    //     console.warn('[Report] OG image generation failed:', error);
    //   });
    //   
    //   console.log(`[Report] Started OG image generation for ${normalized}`);
    // } catch (error) {
    //   // Log but don't fail the report generation if OG image fails
    //   console.warn('[Report] Failed to start OG image generation:', error);
    // }

    return {
      success: true,
      reportId,
      report,
      fromCache: false,
      generationTimeMs: Date.now() - startTime,
      llmResults
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Update report status to failed
    try {
      await upsertReport({
        domain: normalized,
        domainURL: domain,
        status: 'FAILED',
        generationTimeMs: Date.now() - startTime
      });
    } catch {
      // Ignore database errors during error handling
    }

    return {
      success: false,
      error: errorMessage,
      fromCache: false
    };
  }
}

