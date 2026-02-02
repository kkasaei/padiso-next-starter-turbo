import { generateText } from 'ai';
import { gateway } from '../gateway';

// ============================================================
// Configuration
// ============================================================

const TIMEOUT = 90000; // 90 seconds timeout (increased for slower AI responses)

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are an expert SEO strategist, product marketer, and startup operator.

Given a domain name and optional short context, generate a concise SEO project description in **Markdown** suitable for a "Create Project" or SEO tool description field.

Your output MUST follow this exact structure:

1. A single, clear paragraph explaining:
   - What the domain represents
   - The business or product focus
   - Who it is for (ICP)
   - How it creates value (outcomes, not features)

2. A section titled "Project highlights & SEO goals:" (with a colon) followed by 6–8 bullet points that cover:
   - SEO and/or AEO (Answer Engine Optimisation) intent
   - ICP-driven keyword targeting
   - Regional focus (if implied by the domain or context)
   - Authority-building themes
   - Long-term organic growth positioning
   - Clear differentiation (what it is / what it is not)

Markdown Formatting Rules:
- Use **bold** for key phrases and important terms in bullet points
- Bold examples: **high-intent keywords**, **ICP-driven content**, **Answer Engine Optimisation (AEO)**, **B2B SaaS**, **regional focus**, **authority-building**
- Use bullet points (- ) for the list items
- Keep paragraph text clean and readable (no excessive bolding in the main paragraph)
- Use proper spacing between sections

Content Rules:
- Write in a clear, professional, non-hype tone
- Avoid buzzwords unless they add meaning
- Focus on outcomes and positioning, not tools
- Assume the audience is founders, operators, or growth teams
- Keep the total length suitable for an SEO tool text area
- Output **Markdown only**
- Do NOT include headings other than "Project highlights & SEO goals:"
- Start bullet points with action verbs (Target, Build, Optimise, Focus, Strengthen, Capture, Position)`;


// ============================================================
// Types
// ============================================================

export interface ProjectDescriptionInput {
  domain: string;
  context?: string;
}

export interface ProjectDescriptionResult {
  description: string;
  executionTimeMs: number;
  success: true;
}

export interface ProjectDescriptionError {
  error: string;
  success: false;
  executionTimeMs: number;
}

export type ProjectDescriptionResponse =
  | ProjectDescriptionResult
  | ProjectDescriptionError;

// ============================================================
// Generate Project Description
// ============================================================

export async function generateProjectDescription(
  input: ProjectDescriptionInput
): Promise<ProjectDescriptionResponse> {
  const startTime = Date.now();

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

    // Generate description using AI Gateway
    const result = await Promise.race([
      generateText({
        model: gateway('openai/gpt-5-nano'),
        system: SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 0.7 // Slightly higher for more creative descriptions
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
      )
    ]);

    const executionTimeMs = Date.now() - startTime;

    // @ts-expect-error - result type from race
    const description = result.text.trim();

    if (!description) {
      return {
        success: false,
        error: 'Generated description is empty',
        executionTimeMs
      };
    }

    return {
      success: true,
      description,
      executionTimeMs
    };

  } catch (error) {
    const executionTimeMs = Date.now() - startTime;

    console.error('❌ Project description generation failed:', error);

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

function buildUserPrompt(input: ProjectDescriptionInput): string {
  const { domain, context } = input;

  let prompt = `Domain: ${domain}`;

  if (context && context.trim().length > 0) {
    prompt += `\nOptional context: ${context.trim()}`;
  } else {
    prompt += `\nOptional context: (none provided)`;
  }

  prompt += `\n\nProduce the final Markdown output only.`;

  return prompt;
}

// ============================================================
// Example Usage
// ============================================================

/**
 * Example usage:
 *
 * ```typescript
 * const result = await generateProjectDescription({
 *   domain: 'padiso.co',
 *   context: 'AI and technology solutions studio'
 * });
 *
 * if (result.success) {
 *   console.log('Description:', result.description);
 *   console.log('Generated in:', result.executionTimeMs, 'ms');
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 *
 * Expected output format:
 *
 * ```markdown
 * Padiso.co is an AI and technology solutions studio focused on helping
 * businesses adopt, build, and scale practical AI systems. The project
 * targets founders and leadership teams who need clarity, automation, and
 * senior technical guidance to improve operations, reduce costs, and unlock
 * new growth through AI-driven solutions. Padiso positions itself as a
 * long-term technology partner, covering AI strategy, automation, and custom
 * system development rather than one-off implementations.
 *
 * Project highlights & SEO goals:
 *
 * - Target high-intent AI consulting and automation keywords
 * - Build authority around AI strategy, agentic workflows, and business automation
 * - Optimise for Answer Engine Optimisation (AEO) to appear in AI-generated responses
 * - Focus on ICP-driven content (founders, CEOs, COOs, Heads of Ops / Product)
 * - Strengthen Australia-first (Sydney) search visibility with global relevance
 * - Capture demand for CTO-as-a-Service and AI advisory searches
 * - Position Padiso as a trusted AI partner, not a generic digital agency
 * ```
 */

