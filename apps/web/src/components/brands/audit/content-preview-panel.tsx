'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  FileCode,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@/lib/utils';
import type { PageAuditDto, PageIssue } from './types';

// ============================================================
// TYPES
// ============================================================
interface ContentSection {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'link' | 'meta' | 'code';
  content: string;
  element?: string;
  issues?: PageIssue[];
  suggestion?: string;
}

interface ContentPreviewPanelProps {
  pageAudit: PageAuditDto;
  onSectionSelect?: (section: ContentSection | null) => void;
  selectedSectionId?: string | null;
}

// ============================================================
// SEVERITY STYLING
// ============================================================
const severityConfig = {
  critical: {
    bgClass: 'bg-red-50 dark:bg-red-950/30',
    borderClass: 'border-l-red-500 ring-red-200 dark:ring-red-900/50',
    hoverClass: 'hover:bg-red-100 dark:hover:bg-red-950/50',
    icon: AlertTriangle,
    iconClass: 'text-red-500',
    label: 'Critical Issue',
  },
  warning: {
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    borderClass: 'border-l-amber-500 ring-amber-200 dark:ring-amber-900/50',
    hoverClass: 'hover:bg-amber-100 dark:hover:bg-amber-950/50',
    icon: AlertCircle,
    iconClass: 'text-amber-500',
    label: 'Warning',
  },
  info: {
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    borderClass: 'border-l-blue-500 ring-blue-200 dark:ring-blue-900/50',
    hoverClass: 'hover:bg-blue-100 dark:hover:bg-blue-950/50',
    icon: Info,
    iconClass: 'text-blue-500',
    label: 'Info',
  },
};

// ============================================================
// HIGHLIGHTABLE SECTION COMPONENT
// ============================================================
function HighlightableSection({
  section,
  isSelected,
  onSelect,
  onAIRewrite,
}: {
  section: ContentSection;
  isSelected: boolean;
  onSelect: () => void;
  onAIRewrite: () => void;
}) {
  const hasIssues = section.issues && section.issues.length > 0;
  const highestSeverity = section.issues?.reduce<'critical' | 'warning' | 'info' | null>((acc, issue) => {
    if (issue.severity === 'critical') return 'critical';
    if (issue.severity === 'warning' && acc !== 'critical') return 'warning';
    if (issue.severity === 'info' && acc !== 'critical' && acc !== 'warning') return 'info';
    return acc;
  }, null);
  
  const config = highestSeverity ? severityConfig[highestSeverity] : null;
  const SeverityIcon = config?.icon || Info;

  // Render different content based on type
  const renderContent = () => {
    switch (section.type) {
      case 'heading':
        return (
          <div className="flex items-start gap-3">
            <Badge variant="outline" className="shrink-0 text-xs font-mono">
              {section.element || 'H1'}
            </Badge>
            <span className="font-semibold text-lg">{section.content}</span>
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-polar-800">
              <ImageIcon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{section.content}</p>
              {section.suggestion && (
                <p className="text-xs text-muted-foreground">alt: {section.suggestion || 'Missing'}</p>
              )}
            </div>
          </div>
        );
      case 'link':
        return (
          <div className="flex items-center gap-3">
            <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-sm">{section.content}</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        );
      case 'meta':
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="w-fit text-xs font-mono">
              {section.element}
            </Badge>
            <p className="text-sm">{section.content || <span className="text-muted-foreground italic">Missing</span>}</p>
          </div>
        );
      case 'code':
        return (
          <div className="flex items-start gap-3">
            <FileCode className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
            <code className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">{section.content}</code>
          </div>
        );
      default:
        return <p className="text-sm leading-relaxed">{section.content}</p>;
    }
  };

  return (
    <div
      className={cn(
        'group relative rounded-xl border-l-4 transition-all duration-200',
        hasIssues ? config?.bgClass : 'bg-transparent',
        hasIssues ? config?.borderClass : 'border-l-transparent',
        isSelected && hasIssues && 'ring-2',
        isSelected && hasIssues && config?.borderClass,
        hasIssues && config?.hoverClass,
        !hasIssues && 'hover:bg-muted/50',
        'cursor-pointer'
      )}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Issue Indicator */}
        {hasIssues && (
          <div className="flex items-center gap-2 mb-2">
            <SeverityIcon className={cn('h-4 w-4', config?.iconClass)} />
            <span className="text-xs font-medium text-muted-foreground">{config?.label}</span>
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAIRewrite();
              }}
              className="h-7 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              AI Fix
            </Button>
          </div>
        )}
        
        {/* Content */}
        {renderContent()}

        {/* Issue Details (when selected) */}
        {isSelected && hasIssues && (
          <div className="mt-3 pt-3 border-t border-dashed space-y-2">
            {section.issues?.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <span className={cn('shrink-0 mt-0.5', severityConfig[issue.severity as keyof typeof severityConfig]?.iconClass)}>•</span>
                <span className="text-muted-foreground">{issue.message}</span>
              </div>
            ))}
            {section.suggestion && (
              <div className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400">
                <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
                <span>Suggestion: {section.suggestion}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// HELPER: Build Content Sections from Page Audit
// ============================================================
function buildContentSections(pageAudit: PageAuditDto): ContentSection[] {
  const sections: ContentSection[] = [];
  const { metadata, issues } = pageAudit;

  if (!metadata) return sections;

  // Meta Title
  sections.push({
    id: 'meta-title',
    type: 'meta',
    element: 'title',
    content: metadata.title || '',
    issues: issues?.filter(i => i.type.includes('title')) || [],
  });

  // Meta Description
  sections.push({
    id: 'meta-description',
    type: 'meta',
    element: 'meta description',
    content: metadata.description || '',
    issues: issues?.filter(i => i.type.includes('description')) || [],
  });

  // H1
  if (metadata.h1) {
    sections.push({
      id: 'h1',
      type: 'heading',
      element: 'H1',
      content: metadata.h1,
      issues: issues?.filter(i => i.type.includes('h1')) || [],
    });
  }

  // H2s
  metadata.h2s?.forEach((h2, idx) => {
    sections.push({
      id: `h2-${idx}`,
      type: 'heading',
      element: 'H2',
      content: h2,
    });
  });

  // Content Paragraphs (simulated from word count)
  if (metadata.wordCount && metadata.wordCount < 500) {
    sections.push({
      id: 'thin-content',
      type: 'paragraph',
      content: `This page has thin content (${metadata.wordCount} words). Consider expanding the content to at least 500-1000 words for better SEO performance.`,
      issues: issues?.filter(i => i.type.includes('thin_content')) || [],
      suggestion: 'Add more valuable, comprehensive content that addresses user intent.',
    });
  }

  // Images
  metadata.images?.forEach((img, idx) => {
    const imgIssues = issues?.filter(i => 
      i.type.includes('alt') && i.message.toLowerCase().includes(img.src.toLowerCase())
    ) || [];
    sections.push({
      id: `img-${idx}`,
      type: 'image',
      content: img.src,
      suggestion: img.alt || undefined,
      issues: imgIssues.length > 0 ? imgIssues : undefined,
    });
  });

  // Canonical URL
  sections.push({
    id: 'canonical',
    type: 'meta',
    element: 'canonical',
    content: metadata.canonicalUrl || '',
    issues: issues?.filter(i => i.type.includes('canonical')) || [],
  });

  // Open Graph
  if (!metadata.ogImage) {
    sections.push({
      id: 'og-image',
      type: 'meta',
      element: 'og:image',
      content: metadata.ogImage || '',
      issues: issues?.filter(i => i.type.includes('og')) || [],
    });
  }

  // Structured Data
  if (!metadata.structuredData || metadata.structuredData.length === 0) {
    sections.push({
      id: 'structured-data',
      type: 'code',
      content: 'No structured data found',
      issues: issues?.filter(i => i.type.includes('structured_data')) || [],
      suggestion: 'Add appropriate schema markup (Organization, WebSite, FAQ, etc.)',
    });
  } else {
    metadata.structuredData.forEach((sd, idx) => {
      sections.push({
        id: `schema-${idx}`,
        type: 'code',
        element: sd.type,
        content: `@type: ${sd.type}`,
      });
    });
  }

  // Links with issues
  metadata.links?.forEach((link, idx) => {
    const linkIssues = issues?.filter(i => 
      i.type.includes('link') && i.message.toLowerCase().includes(link.href.toLowerCase())
    ) || [];
    if (linkIssues.length > 0) {
      sections.push({
        id: `link-${idx}`,
        type: 'link',
        content: `${link.text} → ${link.href}`,
        issues: linkIssues,
      });
    }
  });

  return sections;
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function ContentPreviewPanel({
  pageAudit,
  onSectionSelect,
  selectedSectionId,
}: ContentPreviewPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['seo', 'content', 'structure']));
  const sections = buildContentSections(pageAudit);

  // Group sections
  const seoSections = sections.filter(s => ['meta-title', 'meta-description', 'canonical', 'og-image'].includes(s.id));
  const contentSections = sections.filter(s => s.type === 'heading' || s.type === 'paragraph');
  const mediaSections = sections.filter(s => s.type === 'image');
  const structureSections = sections.filter(s => s.type === 'code');
  const linkSections = sections.filter(s => s.type === 'link');

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  const renderGroup = (
    title: string,
    groupId: string,
    groupSections: ContentSection[],
    icon: React.ReactNode
  ) => {
    if (groupSections.length === 0) return null;
    const issueCount = groupSections.reduce((acc, s) => acc + (s.issues?.length || 0), 0);
    const isExpanded = expandedGroups.has(groupId);

    return (
      <div className="border border-gray-200 dark:border-polar-700 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleGroup(groupId)}
          className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-polar-800/50 hover:bg-gray-100 dark:hover:bg-polar-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <span className="font-medium text-sm">{title}</span>
            {issueCount > 0 && (
              <Badge variant="destructive" className="h-5 text-xs">
                {issueCount} issue{issueCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {isExpanded && (
          <div className="divide-y divide-gray-100 dark:divide-polar-800">
            {groupSections.map((section) => (
              <HighlightableSection
                key={section.id}
                section={section}
                isSelected={selectedSectionId === section.id}
                onSelect={() => onSectionSelect?.(section)}
                onAIRewrite={() => onSectionSelect?.(section)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4 space-y-4">
      {renderGroup('SEO Meta Tags', 'seo', seoSections, <FileCode className="h-4 w-4 text-blue-500" />)}
      {renderGroup('Content Structure', 'content', contentSections, <FileCode className="h-4 w-4 text-green-500" />)}
      {renderGroup('Images & Media', 'media', mediaSections, <ImageIcon className="h-4 w-4 text-purple-500" />)}
      {renderGroup('Structured Data', 'structure', structureSections, <FileCode className="h-4 w-4 text-orange-500" />)}
      {renderGroup('Links', 'links', linkSections, <Link2 className="h-4 w-4 text-cyan-500" />)}
    </div>
  );
}

