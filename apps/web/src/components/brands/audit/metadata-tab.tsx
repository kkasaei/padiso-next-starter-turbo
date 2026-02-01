'use client';

import { useState } from 'react';
import {
  Search,
  Shield,
  Code,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import type { PageMetadata } from './types';

// ============================================================
// COPY BUTTON
// ============================================================
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 w-6 p-0">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
    </Button>
  );
}

// ============================================================
// META ITEM
// ============================================================
interface MetaItemProps {
  label: string;
  value: string | null | undefined;
  maxLength?: number;
  isUrl?: boolean;
}

function MetaItem({ label, value, maxLength, isUrl }: MetaItemProps) {
  const hasValue = value !== null && value !== undefined && value !== '';
  const isOverLength = maxLength && hasValue && value.length > maxLength;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        {maxLength && hasValue && (
          <span className={cn('text-xs', isOverLength ? 'text-red-500' : 'text-muted-foreground')}>
            ({value.length}/{maxLength})
          </span>
        )}
      </div>
      {hasValue ? (
        <div className="flex items-center gap-2">
          {isUrl ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline truncate"
            >
              {value}
            </a>
          ) : (
            <p className={cn(
              'text-sm text-muted-foreground',
              isOverLength && 'text-red-600 dark:text-red-400'
            )}>
              {value}
            </p>
          )}
          <CopyButton text={value} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">Not set</p>
      )}
    </div>
  );
}

// ============================================================
// SEO META CARD
// ============================================================
interface SeoMetaCardProps {
  metadata: PageMetadata;
}

function SeoMetaCard({ metadata }: SeoMetaCardProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          <span className="text-lg font-semibold">SEO Meta Tags</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6 space-y-4">
        <MetaItem label="Title" value={metadata.title} maxLength={60} />
        <MetaItem label="Description" value={metadata.description} maxLength={160} />
        <MetaItem label="H1" value={metadata.h1} />
        <MetaItem label="Canonical URL" value={metadata.canonicalUrl} isUrl />
        <MetaItem label="Robots" value={metadata.robots} />
        <MetaItem label="Language" value={metadata.language} />
      </div>
    </div>
  );
}

// ============================================================
// OPEN GRAPH CARD
// ============================================================
interface OpenGraphCardProps {
  metadata: PageMetadata;
}

function OpenGraphCard({ metadata }: OpenGraphCardProps) {
  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-500" />
          <span className="text-lg font-semibold">Open Graph Tags</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6 space-y-4">
        <MetaItem label="OG Title" value={metadata.ogTitle} />
        <MetaItem label="OG Description" value={metadata.ogDescription} />
        <MetaItem label="OG Image" value={metadata.ogImage} isUrl />
      </div>
    </div>
  );
}

// ============================================================
// STRUCTURED DATA CARD
// ============================================================
interface StructuredDataCardProps {
  structuredData: PageMetadata['structuredData'];
}

function StructuredDataCard({ structuredData }: StructuredDataCardProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  if (!structuredData || structuredData.length === 0) return null;

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-green-500" />
          <span className="text-lg font-semibold">Structured Data ({structuredData.length})</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card divide-y divide-border">
        {structuredData.map((item, index) => (
          <div key={index} className="p-4">
            <button
              onClick={() => toggleItem(index)}
              className="flex items-center gap-2 w-full text-left"
            >
              <Badge variant="outline">{item.type}</Badge>
              <span className="text-sm text-muted-foreground">
                {expandedItems.includes(index) ? 'Click to collapse' : 'Click to expand'}
              </span>
            </button>
            {expandedItems.includes(index) && (
              <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto mt-3 font-mono">
                {JSON.stringify(item.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HEADING STRUCTURE CARD
// ============================================================
interface HeadingStructureCardProps {
  h1: string | null;
  h2s: string[];
}

function HeadingStructureCard({ h1, h2s }: HeadingStructureCardProps) {
  if (!h1 && (!h2s || h2s.length === 0)) return null;

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-semibold">Heading Structure</span>
        </div>
      </div>
      <div className="flex w-full flex-col rounded-3xl bg-card p-6 space-y-2">
        {h1 && (
          <div className="flex items-center gap-2">
            <Badge>H1</Badge>
            <span className="text-sm">{h1}</span>
          </div>
        )}
        {h2s && h2s.map((h2, index) => (
          <div key={index} className="flex items-center gap-2 ml-4">
            <Badge variant="outline">H2</Badge>
            <span className="text-sm text-muted-foreground">{h2}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// METADATA TAB CONTENT
// ============================================================
interface MetadataTabContentProps {
  metadata: PageMetadata | null;
}

export function MetadataTabContent({ metadata }: MetadataTabContentProps) {
  if (!metadata) {
    return (
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-card p-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No Metadata Available</h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
            Metadata has not been extracted for this page yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SeoMetaCard metadata={metadata} />
      <OpenGraphCard metadata={metadata} />
      <StructuredDataCard structuredData={metadata.structuredData} />
      <HeadingStructureCard h1={metadata.h1} h2s={metadata.h2s} />
    </div>
  );
}

