import { generateText } from 'ai';
import { gateway } from '../gateway';

// ============================================================
// Configuration
// ============================================================

const TIMEOUT = 90000; // 90 seconds timeout (increased for slower AI responses)

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are an expert AI systems architect and technical documentation specialist.

Given a domain name, optional project description, and optional context, generate comprehensive AI Guidelines in **Markdown** format.

These guidelines are similar to how Cursor uses AGENTS.md - they provide context, rules, and constraints that AI agents should follow when analyzing this specific SEO project.

Your output MUST be well-structured Markdown with the following sections:

# AI Guidelines for [Project Name/Domain]

## Target Audience
- Define the ICP (Ideal Customer Profile)
- Specify decision-maker roles (e.g., CTOs, VPs, Founders, Marketing Directors)
- Clarify market segment (enterprise, SMB, consumer, etc.)

## Content Strategy
- Define content themes and topics to prioritize
- Specify tone and voice guidelines
- List content types to focus on
- Mention topics or angles to avoid

## Geographic Priorities
- List primary target regions/countries
- List secondary markets (if applicable)
- Note any regional considerations or restrictions

## Keyword Strategy
- Define keyword focus areas (B2B vs B2C, technical vs general)
- Specify keyword intent priorities (commercial, informational, navigational)
- List keyword patterns to target or avoid
- Note any industry-specific terminology preferences

## Brand Voice & Positioning
- Define brand personality (e.g., authoritative, friendly, technical)
- Specify messaging pillars
- Clarify differentiation points
- Note what the brand is NOT

## SEO & AEO Priorities (Optional)
- Define Answer Engine Optimization goals
- Specify featured snippet strategies
- List AI search engine priorities (ChatGPT, Perplexity, etc.)

## Constraints & Rules (Optional)
- List any technical constraints
- Specify compliance requirements (e.g., GDPR, industry regulations)
- Note any restricted topics or keywords
- Define quality standards

Formatting Rules:
- Use **bold** for emphasis on key terms
- Use bullet points (- ) for lists
- Use proper markdown headings (##)
- Keep sections concise but specific
- Use 3-5 bullet points per section
- Make guidelines actionable and clear

Content Rules:
- Be specific and actionable (not generic)
- Focus on rules, constraints, and preferences
- Assume the audience is AI agents that need clear direction
- Use professional, directive language
- Provide concrete examples where helpful
- Keep total length between 200-400 words`;

// ============================================================
// Types
// ============================================================

export interface ProjectGuidelinesInput {
  domain: string;
  projectName?: string;
  description?: string;
  context?: string;
}

export interface ProjectGuidelinesResult {
  guidelines: string;
  executionTimeMs: number;
  success: true;
}

export interface ProjectGuidelinesError {
  error: string;
  success: false;
  executionTimeMs: number;
}

export type ProjectGuidelinesResponse = 
  | ProjectGuidelinesResult 
  | ProjectGuidelinesError;

// ============================================================
// Generate Project Guidelines
// ============================================================

export async function generateProjectGuidelines(
  input: ProjectGuidelinesInput
): Promise<ProjectGuidelinesResponse> {
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

    // Generate guidelines using AI Gateway
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

    // @ts-expect-error - result type from race
    const guidelines = result.text.trim();

    if (!guidelines) {
      return {
        success: false,
        error: 'Generated guidelines are empty',
        executionTimeMs
      };
    }

    return {
      success: true,
      guidelines,
      executionTimeMs
    };

  } catch (error) {
    const executionTimeMs = Date.now() - startTime;

    console.error('❌ Project guidelines generation failed:', error);

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

function buildUserPrompt(input: ProjectGuidelinesInput): string {
  const { domain, projectName, description, context } = input;

  let prompt = `Domain: ${domain}`;

  if (projectName && projectName.trim().length > 0) {
    prompt += `\nProject Name: ${projectName.trim()}`;
  }

  if (description && description.trim().length > 0) {
    prompt += `\n\nProject Description:\n${description.trim()}`;
  }

  if (context && context.trim().length > 0) {
    prompt += `\n\nAdditional Context:\n${context.trim()}`;
  }

  prompt += `\n\nGenerate comprehensive AI Guidelines in Markdown format.`;

  return prompt;
}

// ============================================================
// Example Usage
// ============================================================

/**
 * Example usage:
 * 
 * ```typescript
 * const result = await generateProjectGuidelines({
 *   domain: 'padiso.co',
 *   projectName: 'Padiso AI Studio',
 *   description: 'AI and technology solutions studio for enterprise clients',
 *   context: 'Focus on Australian market with global reach'
 * });
 * 
 * if (result.success) {
 *   console.log('Guidelines generated in:', result.executionTimeMs, 'ms');
 *   console.log(result.guidelines);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 * 
 * Expected output:
 * 
 * ```markdown
 * # AI Guidelines for Padiso.co
 * 
 * ## Target Audience
 * - Focus on **technical decision-makers** (CTOs, VPs of Engineering, Product Leads)
 * - Prioritize **enterprise clients** over SMB or consumer markets
 * - Target companies with 50-500 employees in growth phase
 * 
 * ## Content Strategy
 * - Emphasize **AI strategy, automation, and technical implementation**
 * - Use professional, technical tone with clear ROI focus
 * - Prioritize case studies, technical guides, and thought leadership
 * - Avoid hype-driven content and generic "AI will change everything" narratives
 * 
 * ## Geographic Priorities
 * - **Primary**: Australia (Sydney-focused)
 * - **Secondary**: United States, United Kingdom, Singapore
 * - Emphasize local Australian success stories while maintaining global relevance
 * 
 * ## Keyword Strategy
 * - Focus on **B2B SaaS and enterprise AI keywords**
 * - Target high-intent terms: "AI consulting", "CTO-as-a-Service", "AI implementation"
 * - Avoid consumer-focused or overly technical jargon
 * - Prioritize **Answer Engine Optimization (AEO)** for voice/AI search
 * 
 * ## Brand Voice & Positioning
 * - **Authoritative yet accessible** - technical but not academic
 * - Position as **long-term technology partner**, not a digital agency
 * - Emphasis on practical outcomes and business value
 * - NOT a generic consultancy or short-term contractor
 * 
 * ## SEO & AEO Priorities
 * - Optimize for **ChatGPT, Perplexity, and Gemini** search results
 * - Target featured snippets for "how to" AI implementation queries
 * - Build authority in agentic workflows and business automation topics
 * 
 * ## Constraints & Rules
 * - Always prioritize **enterprise security and compliance** messaging
 * - Avoid promising unrealistic AI outcomes or timelines
 * - Focus on **proven, practical AI solutions** over experimental tech
 * - Maintain professional tone - no hype, no buzzwords without substance
 * ```
 */

