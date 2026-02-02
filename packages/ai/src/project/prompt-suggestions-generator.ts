/**
 * AI Prompt Suggestions Generator
 *
 * Generates relevant prompt suggestions based on project context.
 * Used to help users discover what queries to track for AI visibility.
 */

import { generateText } from 'ai';
import { gateway } from '../gateway';

// ============================================================
// Types
// ============================================================

export interface PromptSuggestionInput {
  projectName: string;
  domain: string;
  description?: string;
  industry?: string;
  icp?: string; // Ideal Customer Profile
  valueProposition?: string;
  keywords?: string[];
  competitors?: string[];
  locations?: string[];
  aiGuidelines?: string; // User-provided guidelines about the business/product
  count?: number; // Number of suggestions to generate (default: 10)
}

export interface GeneratedSuggestion {
  title: string;
  prompt: string;
  category: 'competitor' | 'feature' | 'how-to' | 'local' | 'buying-intent' | 'comparison' | 'problem-solution';
}

export interface PromptSuggestionsResult {
  success: true;
  suggestions: GeneratedSuggestion[];
  executionTimeMs: number;
}

export interface PromptSuggestionsError {
  success: false;
  error: string;
  executionTimeMs: number;
}

export type PromptSuggestionsResponse = PromptSuggestionsResult | PromptSuggestionsError;

// ============================================================
// Constants
// ============================================================

const TIMEOUT = 120000; // 120 seconds - increased for reliability
const MAX_RETRIES = 2;

const SYSTEM_PROMPT = `You are an expert in AI-powered SEO and Answer Engine Optimization (AEO).
Your task is to generate realistic search prompts that users might ask AI assistants (ChatGPT, Perplexity, Gemini, Claude) about a company's products, services, or industry.

CRITICAL: If no business context/guidelines are provided, you MUST first research the domain/website to understand:
- What the company does
- What products/services they offer
- Who their target audience is
- What industry they're in
- Their key differentiators

Then generate prompts based on that research.

Generate prompts that:
1. Are natural questions users would ask AI assistants
2. Cover different search intents (informational, commercial, navigational)
3. Include competitor comparison queries
4. Include feature/benefit-focused queries
5. Include problem-solution queries
6. Include local search queries when relevant
7. Are specific enough to trigger meaningful AI responses
8. Are HIGHLY SPECIFIC to this company - NOT generic industry questions

IMPORTANT: Replace the company name placeholder with the actual company/brand name in relevant prompts.
For competitor queries, use actual competitor names if provided, or use "[competitor]" as placeholder.

Return ONLY a valid JSON array with no additional text or markdown.`;

// ============================================================
// Build User Prompt
// ============================================================

function buildUserPrompt(input: PromptSuggestionInput): string {
  const {
    projectName,
    domain,
    description,
    industry,
    icp,
    valueProposition,
    keywords,
    competitors,
    locations,
    aiGuidelines,
    count = 10,
  } = input;

  const parts = [
    `Generate ${count} AI search prompt suggestions for:`,
    ``,
    `Company/Brand: ${projectName}`,
  ];

  if (domain) {
    parts.push(`Website/Domain: ${domain}`);
  }

  if (description) {
    parts.push(`Description: ${description}`);
  }

  // Check if we have meaningful context
  const hasContext = aiGuidelines || description || (keywords && keywords.length > 0);

  // AI Guidelines are CRITICAL - they contain user-defined context about the business
  if (aiGuidelines) {
    parts.push('');
    parts.push('=== IMPORTANT BUSINESS CONTEXT (Follow these guidelines carefully) ===');
    parts.push(aiGuidelines);
    parts.push('=== END BUSINESS CONTEXT ===');
    parts.push('');
  } else if (!hasContext && domain) {
    // No guidelines or context provided - instruct AI to research the domain first
    parts.push('');
    parts.push('=== REQUIRED: RESEARCH THE WEBSITE FIRST ===');
    parts.push(`No business context was provided. You MUST first visit and analyze ${domain} to understand:`);
    parts.push('- What products or services the company offers');
    parts.push('- Who their target customers are');
    parts.push('- What problems they solve');
    parts.push('- What industry/niche they operate in');
    parts.push('- Their unique value proposition');
    parts.push('- Any competitors mentioned or implied');
    parts.push('');
    parts.push('Use this research to generate highly relevant and specific prompt suggestions.');
    parts.push('=== END RESEARCH INSTRUCTIONS ===');
    parts.push('');
  }

  if (industry) {
    parts.push(`Industry: ${industry}`);
  }

  if (icp) {
    parts.push(`Target Audience/ICP: ${icp}`);
  }

  if (valueProposition) {
    parts.push(`Value Proposition: ${valueProposition}`);
  }

  if (keywords && keywords.length > 0) {
    parts.push(`Focus Keywords: ${keywords.slice(0, 15).join(', ')}`);
  }

  if (competitors && competitors.length > 0) {
    parts.push(`Key Competitors: ${competitors.slice(0, 10).join(', ')}`);
  }

  if (locations && locations.length > 0) {
    parts.push(`Target Locations: ${locations.slice(0, 5).join(', ')}`);
  }

  parts.push('');
  parts.push('IMPORTANT: Generate prompts that are SPECIFIC to this business and its context above.');
  parts.push('Do NOT generate generic prompts. Use the company name, industry, and context provided.');
  parts.push('');
  parts.push('Generate a diverse mix of prompt categories:');
  parts.push('- competitor: Compare with or ask about alternatives to this specific company');
  parts.push('- feature: Questions about this company\'s specific features/capabilities');
  parts.push('- how-to: How to solve problems this company addresses');
  parts.push('- local: Location-specific queries (if locations provided)');
  parts.push('- buying-intent: Ready-to-purchase queries for this company\'s offerings');
  parts.push('- comparison: Compare this company with competitors');
  parts.push('- problem-solution: Problems this company solves');
  parts.push('');
  parts.push('Return JSON array format:');
  parts.push('[{"title": "Short descriptive title", "prompt": "The actual search query", "category": "category-name"}]');

  return parts.join('\n');
}

// ============================================================
// Helper: Execute AI Call with Timeout
// ============================================================

async function executeAICall(
  userPrompt: string,
  useWebSearch: boolean = false,
  attempt: number = 1
): Promise<{ text: string } | null> {
  // Use Perplexity Sonar for web search (has built-in search capabilities)
  // Use OpenAI GPT for regular generation when we already have context
  const model = useWebSearch ? 'perplexity/sonar' : 'openai/gpt-5-mini';
  
  console.log(`[generatePromptSuggestions] Attempt ${attempt}/${MAX_RETRIES + 1} using ${model}${useWebSearch ? ' (with web search)' : ''}...`);
  
  try {
    const result = await Promise.race([
      generateText({
        model: gateway(model),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.8, // Higher for more creative/diverse suggestions
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
      ),
    ]);
    
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`[generatePromptSuggestions] Attempt ${attempt} failed: ${errorMessage}`);
    
    if (attempt <= MAX_RETRIES) {
      // Wait before retry (exponential backoff: 2s, 4s)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`[generatePromptSuggestions] Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return executeAICall(userPrompt, useWebSearch, attempt + 1);
    }
    
    throw error;
  }
}

// ============================================================
// Generate Prompt Suggestions
// ============================================================

export async function generatePromptSuggestions(
  input: PromptSuggestionInput
): Promise<PromptSuggestionsResponse> {
  const startTime = Date.now();

  try {
    // Validate input
    if (!input.domain || input.domain.trim().length === 0) {
      return {
        success: false,
        error: 'Domain is required',
        executionTimeMs: Date.now() - startTime,
      };
    }

    if (!input.projectName || input.projectName.trim().length === 0) {
      return {
        success: false,
        error: 'Project name is required',
        executionTimeMs: Date.now() - startTime,
      };
    }

    // Check if we have meaningful context or need to research the domain
    const hasContext = !!(
      input.aiGuidelines || 
      input.description || 
      (input.keywords && input.keywords.length > 0) ||
      input.industry ||
      input.valueProposition
    );
    
    // Use Perplexity (web search) when no context is provided
    const needsWebSearch = !hasContext && !!input.domain;

    // Build user prompt
    const userPrompt = buildUserPrompt(input);

    console.log('[generatePromptSuggestions] Generating suggestions:', {
      projectName: input.projectName,
      domain: input.domain,
      hasContext,
      needsWebSearch,
      hasDescription: !!input.description,
      hasAiGuidelines: !!input.aiGuidelines,
      aiGuidelinesPreview: input.aiGuidelines?.slice(0, 100) + (input.aiGuidelines && input.aiGuidelines.length > 100 ? '...' : ''),
      keywordsCount: input.keywords?.length || 0,
      competitorsCount: input.competitors?.length || 0,
      locationsCount: input.locations?.length || 0,
      count: input.count || 10,
    });
    
    // Log the full user prompt for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[generatePromptSuggestions] Full user prompt:', userPrompt);
    }

    // Generate suggestions using AI Gateway with retry logic
    // Uses Perplexity Sonar (with web search) when no context is provided
    const result = await executeAICall(userPrompt, needsWebSearch);

    if (!result) {
      return {
        success: false,
        error: 'Failed to generate suggestions after retries',
        executionTimeMs: Date.now() - startTime,
      };
    }

    const executionTimeMs = Date.now() - startTime;
    const text = result.text.trim();

    if (!text) {
      return {
        success: false,
        error: 'Generated suggestions are empty',
        executionTimeMs,
      };
    }

    // Parse JSON response
    let suggestions: GeneratedSuggestion[];
    try {
      // Extract JSON from response (remove markdown code blocks if present)
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\[[\s\S]*\]/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
      suggestions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', text);
      return {
        success: false,
        error: 'Invalid JSON response from AI',
        executionTimeMs,
      };
    }

    // Validate response structure
    if (!Array.isArray(suggestions)) {
      return {
        success: false,
        error: 'Invalid response structure - expected array',
        executionTimeMs,
      };
    }

    // Filter and validate each suggestion
    const validSuggestions = suggestions.filter(
      (s) =>
        s &&
        typeof s.title === 'string' &&
        typeof s.prompt === 'string' &&
        s.title.trim().length > 0 &&
        s.prompt.trim().length > 0
    );

    console.log(`[generatePromptSuggestions] ✅ Generated ${validSuggestions.length} suggestions in ${executionTimeMs}ms`);

    return {
      success: true,
      suggestions: validSuggestions,
      executionTimeMs,
    };
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;

    console.error('❌ Prompt suggestions generation failed:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTimeMs,
    };
  }
}

