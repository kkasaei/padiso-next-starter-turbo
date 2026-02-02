import { generateText } from 'ai';
import { gateway } from '../gateway';

// ============================================================
// Configuration
// ============================================================

const TIMEOUT = 90000; // 90 seconds timeout (increased for slower AI responses)

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are an expert SEO strategist and keyword research specialist.

Given a domain name, optional project description, and optional context, generate comprehensive targeting and tracking data for an SEO project.

Your output MUST be valid JSON with this exact structure:

{
  "keywords": ["keyword1", "keyword2", ...],
  "competitors": ["competitor1.com", "competitor2.com", ...],
  "locations": ["Location1", "Location2", ...]
}

Requirements:

**Keywords** (10-20 keywords):
- Mix of short-tail (2-3 words) and long-tail (4-6 words) keywords
- Focus on high-intent commercial and informational keywords
- Include branded terms if the domain is well-known
- Include industry-specific terms
- Include AEO (Answer Engine Optimisation) query patterns
- Examples: "best crm software", "how to automate sales", "saas marketing strategy"

**Competitors** (5-10 competitor domains):
- Direct competitors in the same space
- Include both established players and emerging competitors
- Only return domain names (e.g., "salesforce.com", not "https://salesforce.com")
- No subdomains or paths, just the main domain
- Real, actual competitors (don't make up fake domains)

**Locations** (3-8 geographic regions):
- Countries or major regions relevant to the business
- Consider: United States, United Kingdom, Canada, Australia, Germany, France, etc.
- Prioritize English-speaking markets if not specified
- Include specific cities only if the business is hyper-local
- Use full country/region names (e.g., "United States" not "US")

Analysis Guidelines:
- Analyze the domain name and description to understand the business
- Infer the target market from the domain TLD (.com = global, .co.uk = UK, .au = Australia, etc.)
- Consider the business model (B2B vs B2C) when selecting keywords
- Match keyword intent to the business goals
- Ensure competitors are actually in the same industry/niche
- Be specific and actionable - no generic terms

Output Rules:
- Return ONLY valid JSON (no markdown, no code blocks, no explanations)
- Use proper JSON syntax with double quotes
- Ensure all arrays have at least the minimum number of items
- Keywords should be lowercase
- Competitor domains should be lowercase
- Location names should use proper capitalization`;

// ============================================================
// Types
// ============================================================

export interface ProjectTargetingInput {
  domain: string;
  description?: string;
  context?: string;
}

export interface ProjectTargetingData {
  keywords: string[];
  competitors: string[];
  locations: string[];
}

export interface ProjectTargetingResult {
  data: ProjectTargetingData;
  executionTimeMs: number;
  success: true;
}

export interface ProjectTargetingError {
  error: string;
  success: false;
  executionTimeMs: number;
}

export type ProjectTargetingResponse =
  | ProjectTargetingResult
  | ProjectTargetingError;

// ============================================================
// Generate Project Targeting
// ============================================================

export async function generateProjectTargeting(
  input: ProjectTargetingInput
): Promise<ProjectTargetingResponse> {
  const startTime = Date.now();

  console.log('[generateProjectTargeting] Input:', input);

  try {
    // Validate input
    if (!input.domain || input.domain.trim().length === 0) {
      return {
        success: false,
        error: 'Domain is required',
        executionTimeMs: Date.now() - startTime
      };
    }

    // Build user prompt
    const userPrompt = buildUserPrompt(input);

    // Generate targeting data using AI Gateway
    const result = await Promise.race([
      generateText({
        model: gateway('openai/gpt-5-nano'),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.7
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
      )
    ]);

    const executionTimeMs = Date.now() - startTime;



    console.log('[generateProjectTargeting] Result:', result);
    // @ts-expect-error - result type from race
    const text = result.text.trim();

    if (!text) {
      return {
        success: false,
        error: 'Generated targeting data is empty',
        executionTimeMs
      };
    }

    // Parse JSON response
    let data: ProjectTargetingData;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', text);
      return {
        success: false,
        error: 'Invalid JSON response from AI',
        executionTimeMs
      };
    }

    // Validate response structure
    if (!Array.isArray(data.keywords) || !Array.isArray(data.competitors) || !Array.isArray(data.locations)) {
      return {
        success: false,
        error: 'Invalid response structure',
        executionTimeMs
      };
    }

    // Ensure minimum requirements
    if (data.keywords.length === 0 || data.competitors.length === 0 || data.locations.length === 0) {
      return {
        success: false,
        error: 'Insufficient data generated',
        executionTimeMs
      };
    }

    return {
      success: true,
      data,
      executionTimeMs
    };

  } catch (error) {
    const executionTimeMs = Date.now() - startTime;

    console.error('❌ Project targeting generation failed:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      executionTimeMs
    };
  }
}

// ============================================================
// Helper: Build User Prompt
// ============================================================

function buildUserPrompt(input: ProjectTargetingInput): string {
  const { domain, description, context } = input;

  let prompt = `Domain: ${domain}`;

  if (description && description.trim().length > 0) {
    prompt += `\n\nProject Description:\n${description.trim()}`;
  }

  if (context && context.trim().length > 0) {
    prompt += `\n\nAdditional Context:\n${context.trim()}`;
  }

  prompt += `\n\nGenerate comprehensive targeting and tracking data as JSON only.`;

  return prompt;
}

// ============================================================
// Example Usage
// ============================================================

/**
 * Example usage:
 *
 * ```typescript
 * const result = await generateProjectTargeting({
 *   domain: 'padiso.co',
 *   description: 'AI and technology solutions studio for businesses',
 *   context: 'Focus on enterprise clients'
 * });
 *
 * if (result.success) {
 *   console.log('Keywords:', result.data.keywords);
 *   console.log('Competitors:', result.data.competitors);
 *   console.log('Locations:', result.data.locations);
 *   console.log('Generated in:', result.executionTimeMs, 'ms');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 *
 * Expected output:
 *
 * ```json
 * {
 *   "keywords": [
 *     "ai consulting services",
 *     "business automation solutions",
 *     "ai strategy consulting",
 *     "agentic workflows",
 *     "ai implementation services",
 *     "cto as a service",
 *     "ai advisory",
 *     "enterprise ai solutions",
 *     "ai system development",
 *     "business process automation"
 *   ],
 *   "competitors": [
 *     "thoughtspot.com",
 *     "datarobot.com",
 *     "databricks.com",
 *     "alteryx.com",
 *     "cognizant.com"
 *   ],
 *   "locations": [
 *     "Australia",
 *     "United States",
 *     "United Kingdom",
 *     "Canada",
 *     "Singapore"
 *   ]
 * }
 * ```
 */

