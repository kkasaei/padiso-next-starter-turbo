// ============================================================
// PROMPT TEMPLATE TYPES & DTOs
// ============================================================

// PromptTemplate type (mirrors database model)
export interface PromptTemplate {
  id: string
  projectId: string
  name: string
  description: string | null
  prompt: string
  tags: string[]
  config: unknown | null
  usageCount: number
  lastUsedAt: Date | null
  createdByUserId: string | null
  createdAt: Date
  updatedAt: Date
}

// PromptTag type (mirrors database model)
export interface PromptTag {
  id: string
  projectId: string
  name: string
  color: string | null
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// PROMPT TEMPLATE DTOs (Data Transfer Objects)
// ============================================================

// Config type for prompt templates
export interface PromptTemplateConfig {
  [key: string]: unknown
}

export interface PromptTemplateDto {
  id: string
  projectId: string
  name: string
  description: string | null
  prompt: string
  tags: string[]
  config: PromptTemplateConfig | null
  usageCount: number
  lastUsedAt: Date | null
  createdByUserId: string | null
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// UI-SPECIFIC TYPES
// ============================================================

// Sort keys for the prompt table
export type PromptSortKey = 'name' | 'usageCount' | 'updatedAt' | 'createdAt'

// ============================================================
// PROMPT TAG DTOs
// ============================================================

export interface PromptTagDto {
  id: string
  projectId: string
  name: string
  color: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Map database PromptTag to DTO
 */
export function mapPromptTagToDto(tag: PromptTag): PromptTagDto {
  return {
    id: tag.id,
    projectId: tag.projectId,
    name: tag.name,
    color: tag.color,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Map database PromptTemplate to DTO
 */
export function mapPromptTemplateToDto(template: PromptTemplate): PromptTemplateDto {
  return {
    id: template.id,
    projectId: template.projectId,
    name: template.name,
    description: template.description,
    prompt: template.prompt,
    tags: template.tags,
    config: template.config as PromptTemplateConfig | null,
    usageCount: template.usageCount,
    lastUsedAt: template.lastUsedAt,
    createdByUserId: template.createdByUserId,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  }
}
