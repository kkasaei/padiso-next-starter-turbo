'use client';

import * as React from 'react';
import { useMemo } from 'react';
import { TiptapEditor } from '@/components/common/TiptapEditor';
import type { PageAuditDto } from './types';

// ============================================================
// TYPES
// ============================================================
interface AuditEditorPanelProps {
  pageAudit: PageAuditDto;
}

// ============================================================
// HELPER: Build content from metadata when no content available
// ============================================================
function buildContentFromMetadata(pageAudit: PageAuditDto): string {
  const parts: string[] = [];

  // Add title/H1
  const h1 = pageAudit.metadata?.h1 || pageAudit.title;
  if (h1) {
    parts.push(`# ${h1}`);
    parts.push('');
  }

  // Add description
  if (pageAudit.metadata?.description) {
    parts.push(pageAudit.metadata.description);
    parts.push('');
  }

  // Add H2s as section headers
  const h2s = pageAudit.metadata?.h2s || [];
  if (h2s.length > 0) {
    parts.push('## Page Sections');
    parts.push('');
    h2s.forEach((h2) => {
      parts.push(`- ${h2}`);
    });
    parts.push('');
  }

  // Add structured data info
  const structuredData = pageAudit.metadata?.structuredData || [];
  if (structuredData.length > 0) {
    parts.push('## Structured Data');
    parts.push('');
    structuredData.forEach((item) => {
      parts.push(`- **${item.type}**`);
    });
    parts.push('');
  }

  // Add page stats
  const wordCount = pageAudit.metadata?.wordCount || 0;
  const images = pageAudit.metadata?.images || [];
  const links = pageAudit.metadata?.links || [];

  if (wordCount > 0 || images.length > 0 || links.length > 0) {
    parts.push('## Page Statistics');
    parts.push('');
    if (wordCount > 0) parts.push(`- **Word Count:** ${wordCount}`);
    if (images.length > 0) parts.push(`- **Images:** ${images.length}`);
    if (links.length > 0) parts.push(`- **Links:** ${links.length}`);
    parts.push('');
  }

  // Fallback message if nothing available
  if (parts.length === 0) {
    parts.push('# Page Content');
    parts.push('');
    parts.push(
      '_No content has been extracted for this page yet. Run a scan to extract page content._'
    );
  }

  return parts.join('\n');
}

// ============================================================
// MAIN COMPONENT - Shows actual page content
// ============================================================
export function AuditEditorPanel({ pageAudit }: AuditEditorPanelProps) {
  // Build editor content from actual page content or metadata
  const editorContent = useMemo(() => {
    // Use actual content if available
    if (pageAudit.content) {
      return pageAudit.content;
    }

    // Build content from metadata as fallback
    return buildContentFromMetadata(pageAudit);
  }, [pageAudit]);

  return (
    <div className="h-full w-full overflow-y-auto">
      <TiptapEditor
        key={pageAudit.id}
        initialValue={editorContent}
        readOnly={true}
        showToolbar={false}
        className="h-full border-0 rounded-none"
        height="100%"
      />
    </div>
  );
}
