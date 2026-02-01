import type { Prompt as DBPrompt } from "@workspace/db/schema";

/**
 * UI-friendly prompt type that extends the DB schema
 * Maps database fields to UI expectations
 */
export type UIPrompt = Omit<DBPrompt, 'description' | 'config'> & {
  // Map 'prompt' field to 'content' for UI compatibility
  content: string;
  // Make description optional (undefined instead of null for UI)
  description?: string;
  // Make config optional (undefined instead of null for UI)
  config?: Record<string, unknown>;
  // Optional category derived from tags or config
  category?: "general" | "content" | "code" | "analysis" | "creative" | "custom";
  // Optional AI provider from config
  aiProvider?: string;
  // Project/Brand info
  projectId?: string;
  projectName?: string;
  isGlobal?: boolean;
  isFromProject?: boolean;
};

/**
 * Convert database prompt to UI prompt
 */
export function dbPromptToUI(dbPrompt: any): UIPrompt {
  return {
    ...dbPrompt,
    // Handle dates - tRPC serializes them as strings
    createdAt: typeof dbPrompt.createdAt === 'string' ? new Date(dbPrompt.createdAt) : dbPrompt.createdAt,
    updatedAt: typeof dbPrompt.updatedAt === 'string' ? new Date(dbPrompt.updatedAt) : dbPrompt.updatedAt,
    lastUsedAt: dbPrompt.lastUsedAt ? (typeof dbPrompt.lastUsedAt === 'string' ? new Date(dbPrompt.lastUsedAt) : dbPrompt.lastUsedAt) : null,
    content: dbPrompt.prompt, // Map DB 'prompt' to UI 'content'
    description: dbPrompt.description ?? undefined, // Convert null to undefined
    config: dbPrompt.config ?? undefined, // Convert null to undefined
    category: getPromptCategory(dbPrompt),
    aiProvider: getAIProvider(dbPrompt),
    projectId: dbPrompt.brandId,
    projectName: undefined, // Would need to join with brands table
    isGlobal: false, // Could be determined by brandId or config
    isFromProject: true,
  };
}

/**
 * Convert UI prompt data to database format
 */
export function uiPromptToDB(uiPrompt: Partial<UIPrompt>): Partial<DBPrompt> {
  const { content, category, aiProvider, projectId, projectName, isGlobal, isFromProject, ...rest } = uiPrompt;
  
  return {
    ...rest,
    prompt: content || rest.prompt, // Map UI 'content' to DB 'prompt'
    tags: uiPrompt.tags || [],
    config: {
      ...(typeof uiPrompt.config === 'object' ? uiPrompt.config : {}),
      category,
      aiProvider,
    },
  };
}

/**
 * Extract category from prompt tags or config
 */
function getPromptCategory(prompt: DBPrompt): UIPrompt["category"] {
  // Check config first
  if (prompt.config && typeof prompt.config === 'object' && 'category' in prompt.config) {
    return prompt.config.category as UIPrompt["category"];
  }
  
  // Infer from tags
  const tags = prompt.tags || [];
  if (tags.some(t => ['seo', 'marketing', 'copywriting'].includes(t.toLowerCase()))) return 'content';
  if (tags.some(t => ['development', 'code', 'api'].includes(t.toLowerCase()))) return 'code';
  if (tags.some(t => ['data', 'analytics', 'reporting'].includes(t.toLowerCase()))) return 'analysis';
  if (tags.some(t => ['brainstorm', 'creative', 'design'].includes(t.toLowerCase()))) return 'creative';
  
  return 'general';
}

/**
 * Extract AI provider from prompt config
 */
function getAIProvider(prompt: DBPrompt): string | undefined {
  if (prompt.config && typeof prompt.config === 'object' && 'aiProvider' in prompt.config) {
    return prompt.config.aiProvider as string;
  }
  return undefined;
}
