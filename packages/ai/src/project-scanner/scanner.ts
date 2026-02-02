/**
 * Project AEO Scanner Service
 *
 * Queries LLMs with tracked user prompts to check brand visibility
 * Inspired by aeo-report/orchestrator.ts but adapted for project-based scanning
 * 
 * TODO: Replace with actual vector analytics implementation
 */

import { generateText } from 'ai';
import { gateway } from '../gateway';
import { getBatchPromptAnalysisPrompt, getRichPromptAnalysisPrompt, getOpportunityGenerationPrompt, type EnrichedProjectContext, SCANNER_PROVIDERS } from './prompts';
import type {
  ProjectScanContext,
  ProviderScanResult,
  ProjectScanResult,
  BrandMentionResult,
  OpportunityInsight,
  ScannerLLMProvider,
  TrackedPromptInput,
  RichPromptAnalysisResponse,
} from './types';
import {
  mockVectorAnalytics,
} from '../mock-db';

// Alias mock functions for compatibility
const queryAnalysisHistory = mockVectorAnalytics.queryAnalysisHistory;
const queryCompetitorInsights = mockVectorAnalytics.queryCompetitorInsights;

// ============================================================
// Configuration
// ============================================================

const LLM_TIMEOUT = 90000; // 90 seconds per LLM (increased for rich prompts)
const MAX_PROMPTS_PER_BATCH = 5; // Process prompts in batches

// ============================================================
// JSON Repair Helper
// Attempts to fix common JSON issues from LLM responses
// ============================================================

function repairJSON(jsonString: string): string {
  let repaired = jsonString;

  // Remove any text before the first { or [
  const firstBrace = repaired.indexOf('{');
  const firstBracket = repaired.indexOf('[');
  const startIndex = Math.min(
    firstBrace >= 0 ? firstBrace : Infinity,
    firstBracket >= 0 ? firstBracket : Infinity
  );
  if (startIndex !== Infinity && startIndex > 0) {
    repaired = repaired.slice(startIndex);
  }

  // Remove any text after the last } or ]
  const lastBrace = repaired.lastIndexOf('}');
  const lastBracket = repaired.lastIndexOf(']');
  const endIndex = Math.max(lastBrace, lastBracket);
  if (endIndex > 0 && endIndex < repaired.length - 1) {
    repaired = repaired.slice(0, endIndex + 1);
  }

  // Fix trailing commas before } or ]
  repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

  // Fix missing commas between objects/arrays
  repaired = repaired.replace(/}(\s*){/g, '},{');
  repaired = repaired.replace(/](\s*)\[/g, '],[');
  repaired = repaired.replace(/}(\s*)\[/g, '},[');
  repaired = repaired.replace(/](\s*){/g, '],{');

  // Fix unescaped quotes in strings (basic attempt)
  // This is tricky - we try to find strings with unescaped quotes
  repaired = repaired.replace(/"([^"]*)"([^,:}\]\s])([^"]*?)"/g, '"$1\\"$2$3"');

  // Fix common newline issues in strings
  repaired = repaired.replace(/:\s*"([^"]*)\n([^"]*)"/g, (match, p1, p2) => {
    return `: "${p1}\\n${p2}"`;
  });

  // ============================================================
  // Gemini-specific fixes for improperly escaped quotes
  // Gemini sometimes returns: {"prompt": \"value\"} instead of {"prompt": "value"}
  // ============================================================

  // Fix escaped quotes at string value boundaries: ": \"value\"" -> ": "value""
  repaired = repaired.replace(/:\s*\\"/g, ': "');
  repaired = repaired.replace(/\\"\s*([,}\]])/g, '"$1');

  // Fix double-double quotes at key start: {""key" -> {"key"
  repaired = repaired.replace(/{""([^"]+)"/g, '{"$1"');
  repaired = repaired.replace(/,""([^"]+)"/g, ',"$1"');

  // Fix standalone backslash-quotes that shouldn't be escaped
  // This catches remaining \" that should just be "
  repaired = repaired.replace(/([^\\])\\"/g, '$1"');

  return repaired;
}

function safeJSONParse<T>(jsonString: string, fallback: T | null = null): T | null {
  // First try direct parse
  try {
    return JSON.parse(jsonString);
  } catch {
    // Try with repair
    try {
      const repaired = repairJSON(jsonString);
      return JSON.parse(repaired);
    } catch (repairError) {
      console.error('JSON repair also failed:', repairError);
      return fallback;
    }
  }
}

// ============================================================
// Execute Rich Prompt Analysis (for individual prompts)
// Returns comprehensive data for prompt details page
// ============================================================

async function executeRichPromptAnalysis(
  provider: ScannerLLMProvider,
  context: ProjectScanContext,
  prompt: TrackedPromptInput
): Promise<BrandMentionResult | null> {
  const startTime = Date.now();
  const config = SCANNER_PROVIDERS[provider];

  if (!config.enabled) {
    return null;
  }

  try {
    const promptText = getRichPromptAnalysisPrompt(context, prompt, provider as 'chatgpt' | 'perplexity' | 'gemini');

    const result = await Promise.race([
      generateText({
        model: gateway(config.model),
        prompt: promptText,
        temperature: 0.3,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), LLM_TIMEOUT)
      ),
    ]);

    const text = result.text;
    const usage = result.usage;

    // Extract JSON - look for JSON block or object
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);

    // Check if we found any JSON-like content
    if (!jsonMatch) {
      console.error(`[${provider}] No JSON found in response. First 300 chars: ${text.slice(0, 300)}`);
      return null;
    }

    const jsonText = jsonMatch[1] || jsonMatch[0];

    // Use safe JSON parser with repair capability
    const parsed = safeJSONParse<RichPromptAnalysisResponse>(jsonText);
    if (!parsed) {
      console.error(`[${provider}] Failed to parse JSON. First 300 chars of extracted JSON: ${jsonText.slice(0, 300)}`);
      return null;
    }

    // Calculate cost
    const inputTokens = usage.inputTokens ?? 0;
    const outputTokens = usage.outputTokens ?? 0;
    const inputCost = (inputTokens / 1_000_000) * 0.005;
    const outputCost = (outputTokens / 1_000_000) * 0.015;
    const cost = inputCost + outputCost;

    // DEBUG: Log what AI returned for marketCompetition
    console.log(`[DEBUG] ${provider} AI response marketCompetition:`, parsed.marketCompetition);

    // Build rich result
    const brandMentionResult: BrandMentionResult = {
      provider,
      keyword: parsed.prompt,
      queryText: parsed.prompt,
      brandMentioned: parsed.brandMentioned,
      mentionPosition: parsed.mentionPosition,
      mentionContext: parsed.mentionContext,
      fullResponse: parsed.fullResponse,
      competitorMentions: parsed.competitors.map((c) => ({
        name: c.name,
        position: c.position,
        context: c.context,
        domain: c.domain || undefined,
        shareOfVoice: c.shareOfVoice,
      })),
      sentiment: parsed.sentiment,
      sentimentScore: parsed.sentimentScore,
      richSentimentAnalysis: parsed.sentimentAnalysis,
      brandRecognition: parsed.brandRecognition,
      brandPositioning: parsed.brandPositioning,
      marketCompetition: parsed.marketCompetition,
      analysisSummary: parsed.analysisSummary,
      narrativeThemes: parsed.narrativeThemes,
      responseLength: parsed.fullResponse?.length || 0,
      executionTimeMs: Date.now() - startTime,
      tokensUsed: inputTokens + outputTokens,
      cost,
    };

    return brandMentionResult;
  } catch (error) {
    console.error(`Failed to execute rich prompt analysis for ${provider}:`, error);
    return null;
  }
}

// ============================================================
// Execute Single Provider Scan
// ============================================================

async function executeProviderScan(
  provider: ScannerLLMProvider,
  context: ProjectScanContext,
  prompts: TrackedPromptInput[],
  useRichAnalysis: boolean = false
): Promise<ProviderScanResult> {
  const startTime = Date.now();
  const config = SCANNER_PROVIDERS[provider];

  if (!config.enabled) {
    return {
      provider,
      status: 'error',
      error: 'Provider disabled',
      visibilityScore: 0,
      mentionRate: 0,
      averagePosition: null,
      mentionResults: [],
      totalCost: 0,
      totalTokens: 0,
      executionTimeMs: 0,
    };
  }

  try {
    const allResults: BrandMentionResult[] = [];
    let totalCost = 0;
    let totalTokens = 0;

    // If using rich analysis, process prompts individually
    if (useRichAnalysis) {
      for (const prompt of prompts) {
        const richResult = await executeRichPromptAnalysis(provider, context, prompt);
        if (richResult) {
          allResults.push(richResult);
          totalCost += richResult.cost;
          totalTokens += richResult.tokensUsed;
        }
      }
    } else {
      // Process prompts in batches (basic analysis)
      const batches: TrackedPromptInput[][] = [];
      for (let i = 0; i < prompts.length; i += MAX_PROMPTS_PER_BATCH) {
        batches.push(prompts.slice(i, i + MAX_PROMPTS_PER_BATCH));
      }

      // Execute batches sequentially to avoid rate limits
      for (const batch of batches) {
        const prompt = getBatchPromptAnalysisPrompt(context, batch);

      const result = await Promise.race([
        generateText({
          model: gateway(config.model),
          prompt,
          temperature: 0.3,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), LLM_TIMEOUT)
        ),
      ]);

      // Parse response
      const text = result.text;
      const usage = result.usage;

      // Extract JSON
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      const parsed = safeJSONParse<{ results: Array<{ prompt: string; brandMentioned: boolean; mentionPosition: number; mentionContext: string; topCompetitors: Array<{ name: string; position: number }>; sentiment: string; sentimentScore: number; responseSnippet: string }> }>(jsonText);

      if (!parsed) {
        console.error(`Failed to parse batch JSON from ${provider}`);
        continue;
      }

      // Calculate cost (using AI SDK v2 property names)
      const inputTokens = usage.inputTokens ?? 0;
      const outputTokens = usage.outputTokens ?? 0;
      const inputCost = (inputTokens / 1_000_000) * 0.005;
      const outputCost = (outputTokens / 1_000_000) * 0.015;
      totalCost += inputCost + outputCost;
      totalTokens += inputTokens + outputTokens;

        // Process results
        for (const promptResult of parsed.results || []) {
          allResults.push({
            provider,
            keyword: promptResult.prompt, // Using 'keyword' field to store prompt for compatibility
            queryText: promptResult.prompt,
            brandMentioned: promptResult.brandMentioned,
            mentionPosition: promptResult.mentionPosition,
            mentionContext: promptResult.mentionContext,
            competitorMentions: (promptResult.topCompetitors || []).map((c: { name: string; position: number }) => ({
              name: c.name,
              position: c.position,
              context: promptResult.responseSnippet || '',
            })),
            sentiment: (promptResult.sentiment as 'positive' | 'negative' | 'neutral') || 'neutral',
            sentimentScore: promptResult.sentimentScore || 50,
            responseLength: promptResult.responseSnippet?.length || 0,
            executionTimeMs: Date.now() - startTime,
            tokensUsed: inputTokens + outputTokens,
            cost: inputCost + outputCost,
          });
        }
      }
    }

    // Calculate aggregated metrics
    const mentionedResults = allResults.filter(r => r.brandMentioned);
    const mentionRate = allResults.length > 0
      ? (mentionedResults.length / allResults.length) * 100
      : 0;

    const positions = mentionedResults
      .map(r => r.mentionPosition)
      .filter((p): p is number => p !== null);

    const averagePosition = positions.length > 0
      ? positions.reduce((a, b) => a + b, 0) / positions.length
      : null;

    // Calculate visibility score (weighted by position)
    // Score = (mentionRate * 0.4) + (positionScore * 0.4) + (sentimentScore * 0.2)
    const avgSentiment = allResults.length > 0
      ? allResults.reduce((sum, r) => sum + r.sentimentScore, 0) / allResults.length
      : 50;

    const positionScore = averagePosition
      ? Math.max(0, 100 - (averagePosition - 1) * 15)
      : 0;

    const visibilityScore = Math.round(
      (mentionRate * 0.4) + (positionScore * 0.4) + (avgSentiment * 0.2)
    );

    return {
      provider,
      status: 'success',
      visibilityScore,
      mentionRate,
      averagePosition,
      mentionResults: allResults,
      totalCost,
      totalTokens,
      executionTimeMs: Date.now() - startTime,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return {
      provider,
      status: errorMessage.includes('Timeout') ? 'timeout' : 'error',
      error: errorMessage,
      visibilityScore: 0,
      mentionRate: 0,
      averagePosition: null,
      mentionResults: [],
      totalCost: 0,
      totalTokens: 0,
      executionTimeMs: Date.now() - startTime,
    };
  }
}

// ============================================================
// Generate Opportunities from Scan Results
// Uses RAG to fetch enriched project context from vector store
// ============================================================

async function generateOpportunities(
  context: ProjectScanContext,
  providerResults: ProviderScanResult[],
  websiteContext?: {
    icp?: string;
    valueProposition?: string;
  }
): Promise<OpportunityInsight[]> {
  // Aggregate data for opportunity generation
  const allMentions = providerResults.flatMap(p => p.mentionResults);

  // Find top prompts (where brand IS mentioned)
  const promptMentions = new Map<string, number>();
  allMentions.forEach(m => {
    if (m.brandMentioned) {
      promptMentions.set(m.queryText, (promptMentions.get(m.queryText) || 0) + 1);
    }
  });
  const topKeywords = Array.from(promptMentions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);

  // Find low visibility prompts (where brand NOT mentioned)
  const lowVisibilityKeywords = allMentions
    .filter(m => !m.brandMentioned)
    .map(m => m.queryText)
    .filter((k, i, arr) => arr.indexOf(k) === i)
    .slice(0, 5);

  // Find top competitors
  const competitorMentions = new Map<string, number>();
  allMentions.forEach(m => {
    m.competitorMentions.forEach(c => {
      competitorMentions.set(c.name, (competitorMentions.get(c.name) || 0) + 1);
    });
  });
  const topCompetitors = Array.from(competitorMentions.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, mentionCount: count }));

  // Calculate averages
  const avgVisibility = providerResults.length > 0
    ? providerResults.reduce((sum, p) => sum + p.visibilityScore, 0) / providerResults.length
    : 0;
  const avgMentionRate = providerResults.length > 0
    ? providerResults.reduce((sum, p) => sum + p.mentionRate, 0) / providerResults.length
    : 0;
  const avgSentiment = allMentions.length > 0
    ? allMentions.reduce((sum, m) => sum + m.sentimentScore, 0) / allMentions.length
    : 50;

  // ============================================================
  // PERFORMANCE OPTIMIZATION: Fetch RAG context in parallel
  // Query vector store for enriched context
  // ============================================================
  let enrichedContext: EnrichedProjectContext | undefined;

  try {
    console.log('📚 Fetching enriched context from vector store...');

    const [analysisHistoryResults, competitorInsightsResults] = await Promise.all([
      // Get recent analysis history (past strengths/opportunities)
      queryAnalysisHistory(
        context.projectId,
        'recent brand strengths opportunities insights',
        3
      ).catch(() => []),

      // Get competitor insights
      queryCompetitorInsights(
        context.projectId,
        'competitor strengths weaknesses strategies',
        3
      ).catch(() => []),
    ]);

    // Extract strengths and opportunities from current scan results
    const currentStrengths: Array<{ title: string; description: string }> = [];
    const currentOpportunities: Array<{ title: string; description: string }> = [];
    const currentNarrativeThemes: string[] = [];

    // Gather strengths, opportunities, and themes from scan results
    allMentions.forEach(m => {
      if (m.analysisSummary?.strengths) {
        currentStrengths.push(...m.analysisSummary.strengths);
      }
      if (m.analysisSummary?.opportunities) {
        currentOpportunities.push(...m.analysisSummary.opportunities);
      }
      if (m.narrativeThemes) {
        currentNarrativeThemes.push(...m.narrativeThemes);
      }
    });

    // Extract competitor insights from vector results
    const competitorStrengths: string[] = [];
    const competitorWeaknesses: string[] = [];

    // Note: The vector results have metadata that we can use
    // This is a simplified extraction - in production you might parse sourceData
    if (competitorInsightsResults.length > 0) {
      competitorInsightsResults.forEach(result => {
        // The vector data contains text about competitor insights
        // We'll use this to enrich the prompt
        if (result.data) {
          // Extract mentions of strengths/weaknesses from the text
          const text = typeof result.data === 'string' ? result.data : '';
          if (text.includes('Strength')) {
            competitorStrengths.push(result.metadata?.competitorName || 'Competitor');
          }
        }
      });
    }

    // Build enriched context
    enrichedContext = {
      brandName: context.brandName,
      websiteUrl: context.websiteUrl,
      industry: context.industry,
      targetAudience: context.targetAudience,

      // From websiteContext (if provided)
      icp: websiteContext?.icp,
      valueProposition: websiteContext?.valueProposition,

      // From current scan results
      recentStrengths: currentStrengths.slice(0, 5),
      recentOpportunities: currentOpportunities.slice(0, 5),
      narrativeThemes: [...new Set(currentNarrativeThemes)].slice(0, 5),

      // From competitor analysis
      competitorStrengths: topCompetitors.map(c => `${c.name} appears ${c.mentionCount}x in AI responses`),
      competitorWeaknesses: competitorWeaknesses.length > 0 ? competitorWeaknesses : undefined,
    };

    console.log(`✅ Enriched context loaded: ${currentStrengths.length} strengths, ${currentOpportunities.length} opportunities`);
  } catch (error) {
    console.warn('⚠️ Could not fetch enriched context from vector store:', error);
    // Continue without enriched context
  }

  // ============================================================
  // Generate opportunities via LLM with enriched context
  // ============================================================
  const prompt = getOpportunityGenerationPrompt(
    context,
    {
      visibilityScore: Math.round(avgVisibility),
      mentionRate: Math.round(avgMentionRate),
      topKeywords,
      lowVisibilityKeywords,
      topCompetitors,
      sentimentAverage: Math.round(avgSentiment),
    },
    enrichedContext
  );

  try {
    const result = await generateText({
      model: gateway('openai/gpt-5-mini'),
      prompt,
      temperature: 0.4,
      maxOutputTokens: 8000, // Increased for richer content briefs
    });

    const jsonMatch = result.text.match(/```json\s*([\s\S]*?)\s*```/) || result.text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : result.text;
    const parsed = safeJSONParse<{ opportunities: OpportunityInsight[] }>(jsonText);

    if (!parsed) {
      console.error('Failed to parse opportunities JSON');
      return [];
    }

    return (parsed.opportunities || []).map((opp: OpportunityInsight) => ({
      // Normalize type to CONTENT or ACTION
      type: (opp.type === 'CONTENT' || opp.type === 'ACTION') ? opp.type : 'CONTENT',
      title: opp.title,
      priority: opp.priority || 5,
      impact: opp.impact || 'medium',
      relatedKeywords: opp.relatedKeywords || [],
      // Instructions (markdown format)
      instructions: opp.instructions || '',
    }));

  } catch (error) {
    console.error('Failed to generate opportunities:', error);
    return [];
  }
}

// ============================================================
// Main Scan Orchestrator
// ============================================================

export async function runProjectScan(
  context: ProjectScanContext,
  options: {
    providers?: ScannerLLMProvider[];
    maxPrompts?: number;
    useRichAnalysis?: boolean; // If true, uses rich prompts for comprehensive data
    websiteContext?: {
      icp?: string;
      valueProposition?: string;
    };
  } = {}
): Promise<ProjectScanResult> {
  const startTime = Date.now();
  const providers = options.providers || ['chatgpt', 'perplexity', 'gemini'];
  const prompts = context.trackedPrompts.slice(0, options.maxPrompts || 10);
  const useRichAnalysis = options.useRichAnalysis ?? false;

  console.log(`🔍 Starting AEO scan for ${context.brandName}`);
  console.log(`   Prompts: ${prompts.length}, Providers: ${providers.length}, Rich Analysis: ${useRichAnalysis}`);

  // Execute all provider scans in parallel
  const providerResults = await Promise.all(
    providers.map(provider => executeProviderScan(provider, context, prompts, useRichAnalysis))
  );

  // Log results
  providerResults.forEach(result => {
    const emoji = result.status === 'success' ? '✅' : '❌';
    console.log(`   ${emoji} ${result.provider}: ${result.visibilityScore}% visibility`);
  });

  // Generate opportunities with enriched context from vector store
  console.log('🎯 Generating opportunities with RAG context...');
  const opportunities = await generateOpportunities(context, providerResults, options.websiteContext);
  console.log(`   Generated ${opportunities.length} opportunities`);

  // Calculate overall metrics
  const successfulResults = providerResults.filter(r => r.status === 'success');
  const overallVisibility = successfulResults.length > 0
    ? Math.round(successfulResults.reduce((sum, r) => sum + r.visibilityScore, 0) / successfulResults.length)
    : 0;

  // Aggregate top prompts and competitors
  const allMentions = providerResults.flatMap(p => p.mentionResults);

  const promptCounts = new Map<string, number>();
  allMentions.forEach(m => {
    if (m.brandMentioned) {
      promptCounts.set(m.queryText, (promptCounts.get(m.queryText) || 0) + 1);
    }
  });

  const competitorCounts = new Map<string, { count: number; positions: number[] }>();
  allMentions.forEach(m => {
    m.competitorMentions.forEach(c => {
      const existing = competitorCounts.get(c.name) || { count: 0, positions: [] };
      existing.count++;
      existing.positions.push(c.position);
      competitorCounts.set(c.name, existing);
    });
  });

  const totalCost = providerResults.reduce((sum, r) => sum + r.totalCost, 0);
  const totalTime = Date.now() - startTime;

  console.log(`✅ Scan complete in ${totalTime}ms (cost: $${totalCost.toFixed(4)})`);

  return {
    projectId: context.projectId,
    organizationId: context.organizationId,
    scanDate: new Date().toISOString(),
    overallVisibilityScore: overallVisibility,
    totalKeywordsScanned: prompts.length, // Now represents prompts scanned
    totalQueriesExecuted: prompts.length * providers.length,
    providerResults,
    topMentionedKeywords: Array.from(promptCounts.entries()) // Actually top prompts
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([keyword, count]) => ({ keyword, mentionCount: count })),
    topCompetitors: Array.from(competitorCounts.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        mentionCount: data.count,
        averagePosition: data.positions.reduce((a, b) => a + b, 0) / data.positions.length,
      })),
    opportunitiesIdentified: opportunities,
    totalCost,
    totalExecutionTimeMs: totalTime,
  };
}

