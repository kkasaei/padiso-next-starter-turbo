/**
 * Prompt Constants
 * 
 * Centralized constants conforming to database schema
 */

import type { AIProvider, AIProviderConfig, PromptCategory, CategoryConfig } from "./PromptTypes";

// ============================================================
// AI PROVIDERS - Matches database enum exactly
// ============================================================

export const AI_PROVIDERS: AIProviderConfig[] = [
  { 
    value: "claude", 
    label: "Claude", 
    color: "bg-orange-50 text-orange-700 border-orange-200", 
    icon: "/icons/claude.svg" 
  },
  { 
    value: "openai", 
    label: "OpenAI", 
    color: "bg-emerald-50 text-emerald-700 border-emerald-200", 
    icon: "/icons/openai.svg" 
  },
  { 
    value: "perplexity", 
    label: "Perplexity", 
    color: "bg-blue-50 text-blue-700 border-blue-200", 
    icon: "/icons/perplexity.svg" 
  },
  { 
    value: "gemini", 
    label: "Gemini", 
    color: "bg-indigo-50 text-indigo-700 border-indigo-200", 
    icon: "/icons/gemini.svg" 
  },
  { 
    value: "grok", 
    label: "Grok", 
    color: "bg-zinc-100 text-zinc-700 border-zinc-200", 
    icon: "/icons/grok.svg" 
  },
  { 
    value: "mistral", 
    label: "Mistral", 
    color: "bg-amber-50 text-amber-700 border-amber-200", 
    icon: "/icons/mistral.svg" 
  },
  { 
    value: "llama", 
    label: "Llama", 
    color: "bg-violet-50 text-violet-700 border-violet-200", 
    icon: "/icons/meta-brand.svg" 
  },
];

// ============================================================
// CATEGORIES - For UI organization only
// ============================================================

export const PROMPT_CATEGORIES: CategoryConfig[] = [
  { value: "general", label: "General", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { value: "content", label: "Content", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "code", label: "Code", color: "bg-green-50 text-green-700 border-green-200" },
  { value: "analysis", label: "Analysis", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "creative", label: "Creative", color: "bg-pink-50 text-pink-700 border-pink-200" },
  { value: "custom", label: "Custom", color: "bg-orange-50 text-orange-700 border-orange-200" },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get AI provider configuration by value
 */
export function getAIProviderConfig(provider?: AIProvider): AIProviderConfig {
  if (!provider) {
    return { 
      value: "claude", 
      label: "Unknown", 
      color: "bg-zinc-100 text-zinc-700 border-zinc-200",
      icon: "/icons/default.svg" 
    };
  }
  
  const config = AI_PROVIDERS.find((p) => p.value === provider);
  return config || { 
    value: provider, 
    label: provider, 
    color: "bg-zinc-100 text-zinc-700 border-zinc-200",
    icon: `/icons/${provider}.svg`
  };
}

/**
 * Get category configuration by value
 */
export function getCategoryConfig(category?: PromptCategory): CategoryConfig {
  if (!category) {
    return PROMPT_CATEGORIES[0]!;
  }
  
  const config = PROMPT_CATEGORIES.find((c) => c.value === category);
  return config || PROMPT_CATEGORIES[0]!;
}

/**
 * Get provider icon path from provider type
 */
export function getProviderIcon(provider?: AIProvider): string {
  if (!provider) return '/icons/default.svg';
  
  const iconMap: Record<AIProvider, string> = {
    'claude': '/icons/claude.svg',
    'openai': '/icons/openai.svg',
    'perplexity': '/icons/perplexity.svg',
    'gemini': '/icons/gemini.svg',
    'grok': '/icons/grok.svg',
    'mistral': '/icons/mistral.svg',
    'llama': '/icons/meta-brand.svg',
  };
  
  return iconMap[provider] || `/icons/${provider}.svg`;
}
