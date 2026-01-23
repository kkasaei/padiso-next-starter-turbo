// ============================================================
// CONTENT TYPES & DTOs
// ============================================================

// Content status enum (mirrors database enum)
export type ContentStatus =
  | 'IDEA'
  | 'OUTLINE'
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'

// ContentDraft type (mirrors database model)
export interface ContentDraft {
  id: string
  projectId: string
  status: ContentStatus
  title: string
  outline: unknown | null
  content: string | null
  editorState: unknown | null
  generatedFrom: unknown | null
  generationCost: number | null
  comments: unknown | null
  reviewedAt: Date | null
  reviewedBy: string | null
  publishedAt: Date | null
  publishedTo: string | null
  createdAt: Date
  updatedAt: Date
}

// ============================================================
// CONTENT DTOs (Data Transfer Objects)
// ============================================================

export interface ContentDraftDto {
  id: string
  projectId: string
  status: ContentStatus
  title: string
  outline: ContentOutline | null
  content: string | null // Markdown content for export/display
  editorState: unknown | null // Raw Plate.js editor JSON (preserves comment marks)
  generatedFrom: ContentGeneratedFrom | null
  generationCost: number | null
  // Collaboration - Comments/Discussions
  comments: unknown | null // Array of discussion threads with nested comments
  reviewedAt: Date | null
  reviewedBy: string | null
  publishedAt: Date | null
  publishedTo: string | null
  createdAt: Date
  updatedAt: Date
  // Computed fields
  wordCount: number
  excerpt: string
}

export interface ContentOutline {
  sections: ContentOutlineSection[]
}

export interface ContentOutlineSection {
  title: string
  points: string[]
}

export interface ContentGeneratedFrom {
  opportunityId?: string
  keywords?: string[]
  theme?: string
  sourceInsights?: string[]
  agentRunId?: string
}

// ============================================================
// UI-SPECIFIC TYPES
// ============================================================

// Status filter for UI (includes 'all' option)
export type ContentStatusFilter = ContentStatus | 'all'

// View mode for the content page
export type ContentViewMode = 'table' | 'editor'

// Sort keys for the content table
export type ContentSortKey = 'title' | 'status' | 'wordCount' | 'updatedAt' | 'createdAt'

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Calculate word count from content string
 */
export function calculateWordCount(content: string | null | undefined): number {
  if (!content) return 0
  // Strip markdown formatting and HTML tags
  const strippedContent = content
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/#+\s/g, '') // Remove headers
    .replace(/[*_~`]/g, '') // Remove formatting characters
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
  return strippedContent.split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Generate excerpt from content
 * Skips the first H1 heading since it's used as the title
 */
export function generateExcerpt(content: string | null | undefined, maxLength: number = 150, title?: string): string {
  if (!content) return ''

  // Remove the first H1 heading (since it's used as the title)
  // Handle optional leading whitespace and different line endings
  const contentWithoutH1 = content.replace(/^\s*#\s+[^\n\r]+[\n\r]*/, '')

  // Strip markdown and get plain text
  let plainText = contentWithoutH1
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '$1') // Convert links to text
    .replace(/#+\s/g, '') // Remove other headers
    .replace(/[*_~`]/g, '') // Remove formatting characters
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  // If the excerpt starts with the title text, remove it
  if (title && plainText.toLowerCase().startsWith(title.toLowerCase())) {
    plainText = plainText.slice(title.length).trim()
    // Remove leading punctuation if any
    plainText = plainText.replace(/^[:\-–—,.\s]+/, '').trim()
  }

  if (!plainText) return ''
  if (plainText.length <= maxLength) return plainText
  return plainText.substring(0, maxLength).trim() + '...'
}

/**
 * Map database ContentDraft to DTO
 */
export function mapContentDraftToDto(draft: ContentDraft): ContentDraftDto {
  return {
    id: draft.id,
    projectId: draft.projectId,
    status: draft.status,
    title: draft.title,
    outline: draft.outline as ContentOutline | null,
    content: draft.content,
    editorState: draft.editorState,
    generatedFrom: draft.generatedFrom as ContentGeneratedFrom | null,
    generationCost: draft.generationCost,
    comments: draft.comments,
    reviewedAt: draft.reviewedAt,
    reviewedBy: draft.reviewedBy,
    publishedAt: draft.publishedAt,
    publishedTo: draft.publishedTo,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    wordCount: calculateWordCount(draft.content),
    excerpt: generateExcerpt(draft.content, 150, draft.title),
  }
}

/**
 * Status display configuration
 */
export const CONTENT_STATUS_CONFIG: Record<ContentStatus, {
  label: string
  description: string
  color: string
  bgColor: string
  order: number
}> = {
  IDEA: {
    label: 'Idea',
    description: 'Content idea captured',
    color: 'text-gray-400 dark:text-polar-500',
    bgColor: 'bg-gray-100 dark:bg-polar-800',
    order: 1,
  },
  OUTLINE: {
    label: 'Outline',
    description: 'Structure being planned',
    color: 'text-blue-500 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    order: 2,
  },
  DRAFT: {
    label: 'Draft',
    description: 'Content is being written',
    color: 'text-gray-400 dark:text-polar-500',
    bgColor: 'bg-gray-100 dark:bg-polar-800',
    order: 3,
  },
  REVIEW: {
    label: 'Review',
    description: 'Pending approval',
    color: 'text-yellow-500 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    order: 4,
  },
  APPROVED: {
    label: 'Approved',
    description: 'Ready to publish',
    color: 'text-green-500 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    order: 5,
  },
  PUBLISHED: {
    label: 'Published',
    description: 'Live on website',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    order: 6,
  },
  ARCHIVED: {
    label: 'Archived',
    description: 'No longer active',
    color: 'text-gray-400 dark:text-polar-500',
    bgColor: 'bg-gray-100 dark:bg-polar-800',
    order: 7,
  },
}


