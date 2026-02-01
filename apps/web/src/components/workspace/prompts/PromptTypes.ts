/**
 * Prompt Types
 * 
 * All types conform to database schema from @workspace/db
 */

import type { Prompt as DBPrompt, PromptTag as DBPromptTag } from "@workspace/db/schema";

// ============================================================
// CORE TYPES - Direct from Database
// ============================================================

/**
 * Prompt type from database
 */
export type Prompt = DBPrompt;

/**
 * Prompt Tag type from database
 */
export type PromptTag = DBPromptTag;

/**
 * AI Provider type (matches database enum)
 */
export type AIProvider = "claude" | "openai" | "perplexity" | "gemini" | "grok" | "mistral" | "llama";

/**
 * Prompt Category (for UI organization)
 */
export type PromptCategory = "general" | "content" | "code" | "analysis" | "creative" | "custom";

// ============================================================
// UI-SPECIFIC TYPES
// ============================================================

/**
 * Filter chip for filtering prompts
 */
export type FilterChip = {
  key: string;
  value: string;
};

/**
 * Prompt filters state
 */
export interface PromptFilters {
  filterChips: FilterChip[];
}

/**
 * Provider configuration for UI display
 */
export interface AIProviderConfig {
  value: AIProvider;
  label: string;
  color: string;
  icon: string;
}

/**
 * Category configuration for UI display
 */
export interface CategoryConfig {
  value: PromptCategory;
  label: string;
  color: string;
}

// ============================================================
// COMPONENT PROPS
// ============================================================

export interface CreatePromptData {
  brandId: string;
  name: string;
  prompt: string;
  aiProvider?: AIProvider;
  tagId?: string;
  config?: Record<string, unknown>;
}

export interface UpdatePromptData {
  id: string;
  name?: string;
  prompt?: string;
  aiProvider?: AIProvider;
  tagId?: string | null;
  config?: Record<string, unknown>;
}
