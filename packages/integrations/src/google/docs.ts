/**
 * Google Docs Service
 *
 * Handles Google Docs API interactions for:
 * - Exporting documents to different formats
 * - Converting Google Docs to Markdown
 */

import { downloadFile, getFile } from './drive'
import { EXPORT_MIME_TYPES } from './drive'
import type { AuthenticatedClientOptions } from './oauth'

// ============================================================
// TYPES
// ============================================================

export interface ExportedDocument {
  id: string
  name: string
  content: string
  mimeType: string
}

// ============================================================
// EXPORT GOOGLE DOC AS HTML
// ============================================================

/**
 * Export a Google Doc as HTML
 */
export async function exportDocAsHtml(
  authOptions: AuthenticatedClientOptions,
  documentId: string
): Promise<string> {
  return await downloadFile(authOptions, documentId, EXPORT_MIME_TYPES.document.html)
}

// ============================================================
// EXPORT GOOGLE DOC AS PLAIN TEXT
// ============================================================

/**
 * Export a Google Doc as plain text
 */
export async function exportDocAsPlainText(
  authOptions: AuthenticatedClientOptions,
  documentId: string
): Promise<string> {
  return await downloadFile(authOptions, documentId, EXPORT_MIME_TYPES.document.txt)
}

// ============================================================
// CONVERT HTML TO MARKDOWN
// ============================================================

/**
 * Convert HTML content to Markdown
 * Simple conversion handling common HTML elements
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return ''

  let markdown = html

  // Remove Google Docs specific styles and scripts
  markdown = markdown.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  markdown = markdown.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

  // Convert headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

  // Convert paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

  // Convert bold
  markdown = markdown.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')

  // Convert italic
  markdown = markdown.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*')

  // Convert underline (not standard markdown, use emphasis)
  markdown = markdown.replace(/<u[^>]*>(.*?)<\/u>/gi, '_$1_')

  // Convert strikethrough
  markdown = markdown.replace(/<(s|strike|del)[^>]*>(.*?)<\/(s|strike|del)>/gi, '~~$2~~')

  // Convert links
  markdown = markdown.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

  // Convert images
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
  markdown = markdown.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')

  // Convert unordered lists
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n'
  })

  // Convert ordered lists
  let olCounter = 0
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
    olCounter = 0
    return (
      content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => {
        olCounter++
        return `${olCounter}. $1\n`
      }) + '\n'
    )
  })

  // Convert blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')

  // Convert code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')

  // Convert inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

  // Convert horizontal rules
  markdown = markdown.replace(/<hr[^>]*>/gi, '\n---\n\n')

  // Convert line breaks
  markdown = markdown.replace(/<br[^>]*>/gi, '\n')

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '')

  // Decode HTML entities
  markdown = decodeHtmlEntities(markdown)

  // Clean up whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n') // Max 2 newlines
  markdown = markdown.replace(/[ \t]+$/gm, '') // Trailing whitespace
  markdown = markdown.trim()

  return markdown
}

/**
 * Decode common HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&rsquo;': '\u2019', // '
    '&lsquo;': '\u2018', // '
    '&rdquo;': '\u201D', // "
    '&ldquo;': '\u201C', // "
    '&bull;': '•',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  }

  let result = text
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'g'), char)
  }

  // Handle numeric entities
  result = result.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
  result = result.replace(/&#x([a-fA-F0-9]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))

  return result
}

// ============================================================
// EXPORT GOOGLE DOC AS MARKDOWN
// ============================================================

/**
 * Export a Google Doc and convert to Markdown
 */
export async function exportDocAsMarkdown(
  authOptions: AuthenticatedClientOptions,
  documentId: string
): Promise<ExportedDocument> {
  // Get file metadata for the name
  const file = await getFile(authOptions, documentId)
  if (!file) {
    throw new Error(`Document not found: ${documentId}`)
  }

  // Export as HTML first (preserves more formatting than plain text)
  const html = await exportDocAsHtml(authOptions, documentId)

  // Convert HTML to Markdown
  const markdown = htmlToMarkdown(html)

  return {
    id: documentId,
    name: file.name,
    content: markdown,
    mimeType: 'text/markdown',
  }
}

// ============================================================
// BATCH EXPORT GOOGLE DOCS
// ============================================================

/**
 * Export multiple Google Docs as Markdown
 * Returns array of exported documents (with errors as null)
 */
export async function batchExportDocsAsMarkdown(
  authOptions: AuthenticatedClientOptions,
  documentIds: string[]
): Promise<(ExportedDocument | null)[]> {
  const results = await Promise.allSettled(
    documentIds.map((id) => exportDocAsMarkdown(authOptions, id))
  )

  return results.map((result) => (result.status === 'fulfilled' ? result.value : null))
}

