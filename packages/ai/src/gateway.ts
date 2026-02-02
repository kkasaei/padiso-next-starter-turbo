import { createGatewayProvider } from "@ai-sdk/gateway";

// ============================================================================
// AI Gateway - Centralized LLM Provider
// https://vercel.com/keyvan-kasaeis-projects/~/ai/quick-start
// https://vercel.com/keyvan-kasaeis-projects/~/ai/gateway-docs
// https://vercel.com/keyvan-kasaeis-projects/~/ai/api-keys
// ============================================================================

export const DEFAULT_MODEL = "openai/gpt-5-mini";

export const SUPPORTED_MODELS = [
  // OpenAI - Fast & cost-effective tiers
  "openai/gpt-5-mini",           // Primary: Fast, cheap, reliable

  // Anthropic - Fast tier
  "anthropic/claude-sonnet-4-5", // Higher quality when needed

  // DeepSeek - Most cost-effective
  "deepseek/deepseek-v3.2",      // Very cheap with good reasoning

  // Google - Fast tiers
  "google/gemini-2.5-flash",     // Fast & cheap from Google

  // Perplexity - Specialized for search
  "perplexity/sonar",            // Built for search/research tasks

  // xAI - Grok models
  "xai/grok-3",                  // Grok model
] as const;

// ============================================================================
// Provider Types
// ============================================================================

export type LLMProvider =
  | 'openai'
  | 'google'
  | 'anthropic'
  | 'xai'
  | 'deepseek'
  | 'perplexity';




// ============================================================================
// Gateway Configuration
// ============================================================================

export const gateway = createGatewayProvider({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  ...(process.env.AI_GATEWAY_BASE_URL && {
    baseURL: process.env.AI_GATEWAY_BASE_URL,
  }),
});

// ============================================================================
// Create Model
// ============================================================================

export const createModel = (index: number) => {
  return gateway(SUPPORTED_MODELS[index]);
};
