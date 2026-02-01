'use client';

import {
  FileText,
  Zap,
  ImageIcon,
  Link2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import type { PageMetadata, PageAnalysis } from './types';

// ============================================================
// CONTENT STATS CARD
// ============================================================
interface ContentStatsCardProps {
  wordCount: number;
  imageCount: number;
  linkCount: number;
}

function ContentStatsCard({ wordCount, imageCount, linkCount }: ContentStatsCardProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <span className="text-lg font-semibold">Content Stats</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Word Count</span>
          <span className="font-medium">{wordCount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Images</span>
          <span className="font-medium">{imageCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Links</span>
          <span className="font-medium">{linkCount}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTENT QUALITY CARD
// ============================================================
interface ContentQualityCardProps {
  contentQuality: PageAnalysis['contentQuality'];
}

function ContentQualityCard({ contentQuality }: ContentQualityCardProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-semibold">Content Quality</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Readability</span>
          <span className="font-medium">{contentQuality.readabilityScore}/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Uniqueness</span>
          <Badge variant="outline" className="capitalize">{contentQuality.uniquenessIndicator}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Topic Relevance</span>
          <span className="font-medium">{contentQuality.topicRelevance}/100</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Keyword Optimization</span>
          <span className="font-medium">{contentQuality.keywordOptimization}/100</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// IMAGES CARD
// ============================================================
interface ImagesCardProps {
  images: PageMetadata['images'];
}

function ImagesCard({ images }: ImagesCardProps) {
  if (!images || images.length === 0) return null;

  const maxDisplay = 20;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-semibold">Images ({images.length})</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-4 max-h-80 overflow-y-auto">
        <div className="space-y-2">
          {images.slice(0, maxDisplay).map((img, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {img.alt ? (
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{img.src}</p>
                <p className="text-xs text-muted-foreground">
                  {img.alt ? `Alt: "${img.alt}"` : 'Missing alt text'}
                  {img.width && img.height && ` • ${img.width}×${img.height}`}
                </p>
              </div>
            </div>
          ))}
          {images.length > maxDisplay && (
            <p className="text-sm text-muted-foreground text-center py-2">
              + {images.length - maxDisplay} more images
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LINKS CARD
// ============================================================
interface LinksCardProps {
  links: PageMetadata['links'];
}

function LinksCard({ links }: LinksCardProps) {
  if (!links || links.length === 0) return null;

  const maxDisplay = 20;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-teal-500" />
          <span className="text-lg font-semibold">Links ({links.length})</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-4 max-h-80 overflow-y-auto">
        <div className="space-y-2">
          {links.slice(0, maxDisplay).map((link, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {link.isBroken ? (
                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
              ) : link.isInternal ? (
                <Link2 className="h-4 w-4 text-blue-500 shrink-0" />
              ) : (
                <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm truncate">{link.text || '(no text)'}</p>
                <p className="text-xs text-muted-foreground truncate">{link.href}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {link.isNofollow && (
                  <Badge variant="outline" className="text-xs">nofollow</Badge>
                )}
                {link.isBroken && (
                  <Badge variant="destructive" className="text-xs">broken</Badge>
                )}
              </div>
            </div>
          ))}
          {links.length > maxDisplay && (
            <p className="text-sm text-muted-foreground text-center py-2">
              + {links.length - maxDisplay} more links
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CONTENT TAB CONTENT
// ============================================================
interface ContentTabContentProps {
  metadata: PageMetadata | null;
  contentQuality: PageAnalysis['contentQuality'] | null;
}

export function ContentTabContent({ metadata, contentQuality }: ContentTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ContentStatsCard
          wordCount={metadata?.wordCount ?? 0}
          imageCount={metadata?.images?.length ?? 0}
          linkCount={metadata?.links?.length ?? 0}
        />
        {contentQuality && <ContentQualityCard contentQuality={contentQuality} />}
      </div>
      {metadata?.images && metadata.images.length > 0 && (
        <ImagesCard images={metadata.images} />
      )}
      {metadata?.links && metadata.links.length > 0 && (
        <LinksCard links={metadata.links} />
      )}
    </div>
  );
}

