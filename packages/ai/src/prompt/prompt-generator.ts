import { generateText } from 'ai';
import { gateway } from '../gateway';

// ============================================================
// Configuration
// ============================================================

const TIMEOUT = 90000; // 90 seconds timeout

// ============================================================
// System Prompt
// ============================================================

const SYSTEM_PROMPT = `You are an expert AI prompt engineer specializing in creating effective prompts for AI agents, chatbots, and language models.

Your task is to generate or enhance AI prompts that are:
- Clear and specific
- Well-structured with proper formatting
- Include variable placeholders using {{variable}} syntax
- Optimized for AI understanding and response quality
- Professional and actionable

When enhancing an existing prompt:
- Improve clarity and structure
- Add missing context or instructions
- Fix formatting issues
- Enhance variable placeholders if needed
- Maintain the original intent while making it more effective

Output format:
- Use Markdown formatting for structure
- Use **bold** for important instructions or key concepts
- Use bullet points (- ) for lists of requirements
- Use {{variable}} syntax for dynamic placeholders
- Keep the prompt clear, concise, and actionable
- Output **Markdown only**`;

// ============================================================
// Types
// ============================================================

export interface PromptGeneratorInput {
  promptName?: string;
  description?: string;
  existingPrompt?: string;
  context?: string;
}

export interface PromptGeneratorResult {
  prompt: string;
  executionTimeMs: number;
  success: true;
}

export interface PromptGeneratorError {
  error: string;
  success: false;
  executionTimeMs: number;
}

export type PromptGeneratorResponse =
  | PromptGeneratorResult
  | PromptGeneratorError;

// ============================================================
// Generate Prompt
// ============================================================

export async function generatePrompt(
  input: PromptGeneratorInput
): Promise<PromptGeneratorResponse> {
  const startTime = Date.now();

  try {
    // Build user prompt
    const userPrompt = buildUserPrompt(input);

    // Generate prompt using AI Gateway
    const result = await Promise.race([
      generateText({
        model: gateway('openai/gpt-4o-mini'),
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
    const prompt = result.text.trim();

    if (!prompt) {
      return {
        success: false,
        error: 'Generated prompt is empty',
        executionTimeMs
      };
    }

    return {
      success: true,
      prompt,
      executionTimeMs
    };

  } catch (error) {
    const executionTimeMs = Date.now() - startTime;

    console.error('❌ Prompt generation failed:', error);

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

function buildUserPrompt(input: PromptGeneratorInput): string {
  const { promptName, description, existingPrompt, context } = input;

  let prompt = '';

  if (promptName) {
    prompt += `Prompt Name: ${promptName}\n`;
  }

  if (description) {
    prompt += `Description: ${description}\n`;
  }

  if (context) {
    prompt += `Additional Context: ${context}\n`;
  }

  if (existingPrompt && existingPrompt.trim().length > 0) {
    prompt += `\nExisting Prompt (enhance this):\n${existingPrompt}\n\n`;
    prompt += `Please enhance and improve the existing prompt above. Make it clearer, more structured, and more effective while maintaining its original intent.`;
  } else {
    prompt += `\nGenerate a new AI prompt based on the information above.`;
  }

  prompt += `\n\nProduce the final Markdown output only.`;

  return prompt;
}
