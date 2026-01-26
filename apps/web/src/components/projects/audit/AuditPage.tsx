'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Info,
  Globe,
  TrendingUp,
  Shield,
  Zap,
  Search,
  ChevronRight,
  RefreshCw,
  Loader2,
  X,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Input } from '@workspace/ui/components/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@/lib/utils';
import { useOrganization } from '@clerk/nextjs';

import type { WebsiteAuditDto, PageAuditDto } from '@/lib/shcmea/types/dtos/audit-dto';

// ============================================================
// TYPES
// ============================================================
type AuditTab = 'overview' | 'pages';

interface PageReportData {
  id: string;
  url: string;
  title: string;
  score: number;
  scannedAt: string;
  seo: {
    title: { status: 'pass' | 'warning' | 'fail'; value: string | null; suggestion?: string };
    metaDescription: { status: 'pass' | 'warning' | 'fail'; value: string | null; suggestion?: string };
    headings: { status: 'pass' | 'warning' | 'fail'; h1: string | null; h2Count: number };
    contentKeywords: { status: 'pass' | 'warning' | 'fail'; keywords: string[] };
    imageKeywords: { status: 'pass' | 'warning' | 'fail'; message: string };
    seoFriendlyUrl: { status: 'pass' | 'warning' | 'fail'; message: string };
    errorPages: { status: 'pass' | 'warning' | 'fail'; count: number; urls: string[] };
    robotsAccess: { status: 'pass' | 'warning' | 'fail'; message: string };
    inPageLinks: { status: 'pass' | 'warning' | 'fail'; internal: number; external: number };
    favicon: { status: 'pass' | 'warning' | 'fail'; message: string };
    language: { status: 'pass' | 'warning' | 'fail'; value: string | null };
    noindex: { status: 'pass' | 'warning' | 'fail'; message: string };
    metaRefresh: { status: 'pass' | 'warning' | 'fail'; message: string };
    metaKeywords: { status: 'pass' | 'warning' | 'fail'; value: string | null; suggestion?: string };
  };
  performance: {
    textCompression: { status: 'pass' | 'warning' | 'fail'; message: string };
    loadTime: { status: 'pass' | 'warning' | 'fail'; value: string };
    pageSize: { status: 'pass' | 'warning' | 'fail'; value: string };
    httpRequests: { status: 'pass' | 'warning' | 'fail'; count: number };
    imageFormat: { status: 'pass' | 'warning' | 'fail'; message: string };
    javascriptDefer: { status: 'pass' | 'warning' | 'fail'; message: string };
    domSize: { status: 'pass' | 'warning' | 'fail'; value: number };
    doctype: { status: 'pass' | 'warning' | 'fail'; message: string };
  };
  security: {
    httpsEncryption: { status: 'pass' | 'warning' | 'fail'; message: string };
    http2: { status: 'pass' | 'warning' | 'fail'; message: string };
    mixedContent: { status: 'pass' | 'warning' | 'fail'; message: string };
    serverSignature: { status: 'pass' | 'warning' | 'fail'; message: string };
    unsafeCrossOrigin: { status: 'pass' | 'warning' | 'fail'; message: string };
    hsts: { status: 'pass' | 'warning' | 'fail'; message: string };
    plaintextEmail: { status: 'pass' | 'warning' | 'fail'; message: string };
  };
  miscellaneous: {
    structuredData: { status: 'pass' | 'warning' | 'fail'; types: string[] };
    metaViewport: { status: 'pass' | 'warning' | 'fail'; value: string | null };
    characterSet: { status: 'pass' | 'warning' | 'fail'; value: string | null };
    sitemap: { status: 'pass' | 'warning' | 'fail'; message: string };
    social: { status: 'pass' | 'warning' | 'fail'; message: string };
    contentLength: { status: 'pass' | 'warning' | 'fail'; wordCount: number };
    textToHtmlRatio: { status: 'pass' | 'warning' | 'fail'; value: string };
    inlineCss: { status: 'pass' | 'warning' | 'fail'; message: string };
    deprecatedHtml: { status: 'pass' | 'warning' | 'fail'; message: string };
  };
}

// ============================================================
// MOCK DATA
// ============================================================
const createMockAudit = (projectId: string): WebsiteAuditDto => ({
  id: `audit-${Date.now()}`,
  projectId,
  sitemapUrl: null,
  maxPagesToScan: 100,
  status: 'COMPLETED',
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  completedAt: new Date(Date.now() - 3000000).toISOString(),
  overallScore: 86,
  seoScore: 82,
  performanceScore: 74,
  accessibilityScore: 85,
  contentScore: 71,
  criticalIssues: 3,
  warningIssues: 12,
  infoIssues: 8,
  totalPages: 50,
  pagesDiscovered: 50,
  pagesScanned: 47,
  pagesFailed: 3,
  pagesQueued: 0,
  totalLinks: 234,
  brokenLinks: 5,
  totalAssets: 128,
  assetsWithIssues: 12,
  totalCost: null,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 3000000).toISOString(),
});

const createMockPages = (): PageAuditDto[] => [
  {
    id: 'page-1',
    auditId: 'audit-1',
    url: 'https://apple.com/',
    path: '/',
    title: 'Apple',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 0,
    overallScore: 86,
    seoScore: 88,
    aeoScore: 72,
    contentScore: 80,
    technicalScore: 90,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'page-2',
    auditId: 'audit-1',
    url: 'https://apple.com/iphone',
    path: '/iphone',
    title: 'iPhone - Apple',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'crawl',
    depth: 1,
    overallScore: 82,
    seoScore: 85,
    aeoScore: 70,
    contentScore: 78,
    technicalScore: 88,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'page-3',
    auditId: 'audit-1',
    url: 'https://apple.com/mac',
    path: '/mac',
    title: 'Mac - Apple',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'crawl',
    depth: 1,
    overallScore: 79,
    seoScore: 75,
    aeoScore: 68,
    contentScore: 82,
    technicalScore: 85,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'page-4',
    auditId: 'audit-1',
    url: 'https://apple.com/ipad',
    path: '/ipad',
    title: 'iPad - Apple',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'crawl',
    depth: 1,
    overallScore: 91,
    seoScore: 92,
    aeoScore: 85,
    contentScore: 88,
    technicalScore: 94,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'page-5',
    auditId: 'audit-1',
    url: 'https://apple.com/watch',
    path: '/watch',
    title: 'Apple Watch',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'crawl',
    depth: 1,
    overallScore: 74,
    seoScore: 70,
    aeoScore: 65,
    contentScore: 78,
    technicalScore: 80,
    metadata: null,
    analysis: null,
    issues: [],
    content: null,
    status: 'COMPLETED',
    error: null,
    scannedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const createMockHistory = (projectId: string): WebsiteAuditDto[] => [
  createMockAudit(projectId),
  {
    ...createMockAudit(projectId),
    id: `audit-${Date.now() - 86400000}`,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86100000).toISOString(),
    updatedAt: new Date(Date.now() - 86100000).toISOString(),
    overallScore: 72,
  },
  {
    ...createMockAudit(projectId),
    id: `audit-${Date.now() - 172800000}`,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    startedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172500000).toISOString(),
    updatedAt: new Date(Date.now() - 172500000).toISOString(),
    overallScore: 68,
  },
];

const createMockPageReport = (page: PageAuditDto): PageReportData => ({
  id: page.id,
  url: page.url,
  title: page.title || 'Untitled',
  score: page.overallScore || 0,
  scannedAt: page.scannedAt || new Date().toISOString(),
  seo: {
    title: { status: 'pass', value: page.title },
    metaDescription: {
      status: 'pass',
      value: 'Discover the innovative world of Apple and shop everything iPhone, iPad, Apple Watch, Mac, and Apple TV, plus explore accessories, entertainment, and expert device support.',
      suggestion: undefined,
    },
    headings: { status: 'warning', h1: page.title, h2Count: 12 },
    contentKeywords: { status: 'pass', keywords: ['apple', 'iphone', 'mac', 'ipad', 'watch', 'airpods', 'vision pro'] },
    imageKeywords: { status: 'pass', message: 'All images have alt attributes set.' },
    seoFriendlyUrl: { status: 'pass', message: 'The URL is SEO friendly.' },
    errorPages: { status: 'pass', count: 0, urls: [] },
    robotsAccess: { status: 'pass', message: 'The webpage can be accessed by search engines.' },
    inPageLinks: { status: 'pass', internal: 186, external: 49 },
    favicon: { status: 'warning', message: 'The webpage does not have a favicon.' },
    language: { status: 'pass', value: 'en-US' },
    noindex: { status: 'pass', message: 'The webpage does not have a noindex tag set.' },
    metaRefresh: { status: 'pass', message: 'The webpage does not have a meta refresh tag set.' },
    metaKeywords: {
      status: 'warning',
      value: null,
      suggestion: 'apple store, macbook, iphone, airpods, vision pro, tv & home, ipad, apple watch, airpods, gift cards, apple card, trade in, apple store online, shop apple',
    },
  },
  performance: {
    textCompression: { status: 'pass', message: 'The HTML file is compressed.' },
    loadTime: { status: 'pass', value: '0.536 seconds' },
    pageSize: { status: 'pass', value: '28.02 KB' },
    httpRequests: { status: 'pass', count: 42 },
    imageFormat: { status: 'pass', message: 'The images are served in the AVIF WebP format.' },
    javascriptDefer: { status: 'pass', message: 'JavaScript resources use defer attribute.' },
    domSize: { status: 'pass', value: 1500 },
    doctype: { status: 'pass', message: 'The webpage has the DOCTYPE declaration tag set.' },
  },
  security: {
    httpsEncryption: { status: 'pass', message: 'The webpage uses HTTPS encryption.' },
    http2: { status: 'pass', message: 'The webpage is using the HTTP/2 protocol.' },
    mixedContent: { status: 'pass', message: 'There are no mixed content resources on the webpage.' },
    serverSignature: { status: 'warning', message: 'The webpage has a public server signature.' },
    unsafeCrossOrigin: { status: 'pass', message: 'The webpage has 1 unsafe cross-origin links.' },
    hsts: { status: 'pass', message: 'The webpage has the HTTP Strict Transport Security header set.' },
    plaintextEmail: { status: 'pass', message: 'The webpage does not contain any plaintext emails.' },
  },
  miscellaneous: {
    structuredData: { status: 'pass', types: ['Organization', 'WebPage'] },
    metaViewport: { status: 'pass', value: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    characterSet: { status: 'pass', value: 'UTF-8' },
    sitemap: { status: 'pass', message: 'The website has sitemaps.' },
    social: { status: 'warning', message: 'The webpage does not contain any social links.' },
    contentLength: { status: 'pass', wordCount: 8794 },
    textToHtmlRatio: { status: 'pass', value: '78%' },
    inlineCss: { status: 'warning', message: 'The webpage contains inline CSS styles.' },
    deprecatedHtml: { status: 'pass', message: 'There are no deprecated HTML tags on the webpage.' },
  },
});

// ============================================================
// CONSTANTS
// ============================================================
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

// ============================================================
// HELPER COMPONENTS
// ============================================================
function ScoreCircle({ score, size = 'lg' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const getColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/30';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/30';
    return 'bg-red-50 dark:bg-red-950/30';
  };

  const sizes = {
    sm: 'h-12 w-12 text-lg',
    md: 'h-16 w-16 text-xl',
    lg: 'h-24 w-24 text-3xl',
  };

  return (
    <div className={cn(
      'rounded-full flex items-center justify-center font-bold',
      sizes[size],
      getBgColor(score),
      getColor(score)
    )}>
      {score}
    </div>
  );
}

function StatusIcon({ status }: { status: 'pass' | 'warning' | 'fail' }) {
  if (status === 'pass') return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
  if (status === 'warning') return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />;
  return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />;
}

function ReportSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-polar-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-polar-800/50 hover:bg-gray-100 dark:hover:bg-polar-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">{title}</span>
        </div>
        <ChevronRight className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-90')} />
      </button>
      {isOpen && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function ReportItem({
  label,
  status,
  value,
  suggestion,
  expandable = false,
}: {
  label: string;
  status: 'pass' | 'warning' | 'fail';
  value?: React.ReactNode;
  suggestion?: string;
  expandable?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 dark:border-polar-800 last:border-0 pb-3 last:pb-0">
      <div className="flex items-start gap-3">
        <StatusIcon status={status} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{label}</span>
            {expandable && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:underline"
              >
                {isExpanded ? 'Hide' : 'Learn more'}
              </button>
            )}
          </div>
          {value && (
            <p className="text-sm text-muted-foreground mt-0.5">{value}</p>
          )}
          {suggestion && (
            <div className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">AI suggestion: </span>
                  {suggestion}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE REPORT PANEL
// ============================================================
function PageReportPanel({
  page,
  onClose,
}: {
  page: PageAuditDto;
  onClose: () => void;
}) {
  const report = createMockPageReport(page);
  const passCount = 81;
  const warningCount = 8;
  const failCount = 0;

  return (
    <div className="h-full flex flex-col bg-card border-l border-gray-200 dark:border-polar-800">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 dark:border-polar-800 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>Report</span>
              <span>·</span>
              <span>{new Date(report.scannedAt).toLocaleDateString()}</span>
            </div>
            <h2 className="font-semibold truncate">{report.url}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Overview Card */}
        <div className="rounded-xl border border-gray-200 dark:border-polar-700 p-5">
          <div className="flex items-center gap-6">
            <ScoreCircle score={report.score} />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{report.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 truncate">{report.url}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="outline" className="gap-1 text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30">
                  <CheckCircle2 className="h-3 w-3" />
                  {passCount} tests passed
                </Badge>
                {warningCount > 0 && (
                  <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
                    <AlertCircle className="h-3 w-3" />
                    {warningCount}
                  </Badge>
                )}
                {failCount > 0 && (
                  <Badge variant="outline" className="gap-1 text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30">
                    <AlertTriangle className="h-3 w-3" />
                    {failCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <ReportSection title="SEO" icon={Search}>
          <ReportItem label="Title" status={report.seo.title.status} value={report.seo.title.value ? `The title tag is perfect: "${report.seo.title.value}"` : 'Missing title tag'} />
          <ReportItem label="Meta description" status={report.seo.metaDescription.status} value={report.seo.metaDescription.value ? `The meta description tag is good: "${report.seo.metaDescription.value}"` : 'Missing meta description'} />
          <ReportItem label="Headings" status={report.seo.headings.status} value={`The H1 tag is the same with the title tag.`} suggestion={report.seo.headings.h1 ? `#1 (Official): iphone, Mac, iPad, Watch, AirPods, Vision Pro...` : undefined} />
          <ReportItem label="Content keywords" status={report.seo.contentKeywords.status} value={`The content has relevant keywords: ${report.seo.contentKeywords.keywords.join(', ')}`} />
          <ReportItem label="Image keywords" status={report.seo.imageKeywords.status} value={report.seo.imageKeywords.message} />
          <ReportItem label="SEO friendly URL" status={report.seo.seoFriendlyUrl.status} value={report.seo.seoFriendlyUrl.message} />
          <ReportItem label="404 page" status={report.seo.errorPages.status} value={report.seo.errorPages.count === 0 ? 'The website has 404 error pages.' : `${report.seo.errorPages.count} error pages found`} />
          <ReportItem label="Robots.txt" status={report.seo.robotsAccess.status} value={report.seo.robotsAccess.message} />
          <ReportItem label="In-page links" status={report.seo.inPageLinks.status} value={`The number of links on the webpage is okay. Internal: ${report.seo.inPageLinks.internal}, External: ${report.seo.inPageLinks.external}`} />
          <ReportItem label="Favicon" status={report.seo.favicon.status} value={report.seo.favicon.message} expandable />
          <ReportItem label="Language" status={report.seo.language.status} value={`The webpage has the language declared: ${report.seo.language.value}`} />
          <ReportItem label="Noindex" status={report.seo.noindex.status} value={report.seo.noindex.message} />
          <ReportItem label="Meta refresh" status={report.seo.metaRefresh.status} value={report.seo.metaRefresh.message} />
          <ReportItem label="Meta keywords" status={report.seo.metaKeywords.status} value="The meta keywords tag is missing or empty." suggestion={report.seo.metaKeywords.suggestion} />
        </ReportSection>

        {/* Performance Section */}
        <ReportSection title="Performance" icon={Zap}>
          <ReportItem label="Text compression" status={report.performance.textCompression.status} value={report.performance.textCompression.message} />
          <ReportItem label="Load time" status={report.performance.loadTime.status} value={`The webpage loaded in ${report.performance.loadTime.value}`} />
          <ReportItem label="Page size" status={report.performance.pageSize.status} value={`The size of the HTML webpage is ${report.performance.pageSize.value}`} />
          <ReportItem label="HTTP requests" status={report.performance.httpRequests.status} value={`The webpage does not make more than 50 HTTP requests: ${report.performance.httpRequests.count}`} />
          <ReportItem label="Image format" status={report.performance.imageFormat.status} value={report.performance.imageFormat.message} />
          <ReportItem label="JavaScript defer" status={report.performance.javascriptDefer.status} value={report.performance.javascriptDefer.message} />
          <ReportItem label="DOM size" status={report.performance.domSize.status} value={`The DOM size is optimal: ~${report.performance.domSize.value} nodes`} />
          <ReportItem label="DOCTYPE" status={report.performance.doctype.status} value={report.performance.doctype.message} />
        </ReportSection>

        {/* Security Section */}
        <ReportSection title="Security" icon={Shield}>
          <ReportItem label="HTTPS encryption" status={report.security.httpsEncryption.status} value={report.security.httpsEncryption.message} />
          <ReportItem label="HTTP/2" status={report.security.http2.status} value={report.security.http2.message} />
          <ReportItem label="Mixed content" status={report.security.mixedContent.status} value={report.security.mixedContent.message} />
          <ReportItem label="Server signature" status={report.security.serverSignature.status} value={report.security.serverSignature.message} expandable />
          <ReportItem label="Unsafe cross-origin links" status={report.security.unsafeCrossOrigin.status} value={report.security.unsafeCrossOrigin.message} expandable />
          <ReportItem label="HSTS" status={report.security.hsts.status} value={report.security.hsts.message} />
          <ReportItem label="Plaintext email" status={report.security.plaintextEmail.status} value={report.security.plaintextEmail.message} />
        </ReportSection>

        {/* Miscellaneous Section */}
        <ReportSection title="Miscellaneous" icon={Info}>
          <ReportItem label="Structured data" status={report.miscellaneous.structuredData.status} value={`The webpage has structured data: ${report.miscellaneous.structuredData.types.join(', ')}`} />
          <ReportItem label="Meta viewport" status={report.miscellaneous.metaViewport.status} value={`The webpage has a meta viewport tag set: ${report.miscellaneous.metaViewport.value}`} />
          <ReportItem label="Character set" status={report.miscellaneous.characterSet.status} value={`The webpage has a charset value set: ${report.miscellaneous.characterSet.value}`} />
          <ReportItem label="Sitemap" status={report.miscellaneous.sitemap.status} value={report.miscellaneous.sitemap.message} />
          <ReportItem label="Social" status={report.miscellaneous.social.status} value={report.miscellaneous.social.message} expandable />
          <ReportItem label="Content length" status={report.miscellaneous.contentLength.status} value={`The webpage has ${report.miscellaneous.contentLength.wordCount.toLocaleString()} words.`} />
          <ReportItem label="Text to HTML ratio" status={report.miscellaneous.textToHtmlRatio.status} value={`The text to HTML ratio is ${report.miscellaneous.textToHtmlRatio.value}`} />
          <ReportItem label="Inline CSS" status={report.miscellaneous.inlineCss.status} value={report.miscellaneous.inlineCss.message} expandable />
          <ReportItem label="Deprecated HTML" status={report.miscellaneous.deprecatedHtml.status} value={report.miscellaneous.deprecatedHtml.message} />
        </ReportSection>
      </div>
    </div>
  );
}

// ============================================================
// PAGINATION FOOTER
// ============================================================
interface PaginationFooterProps {
  label: string;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function PaginationFooter({ label, startIndex, endIndex, totalItems, totalPages, currentPage, pageSize, onPageChange, onPageSizeChange }: PaginationFooterProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 border-t border-gray-200 dark:border-polar-800 bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">Showing {startIndex + 1}–{endIndex} of {totalItems} {label}</div>
      <div className="flex items-center gap-4">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{PAGE_SIZE_OPTIONS.map((size) => <SelectItem key={size} value={size.toString()}>{size}</SelectItem>)}</SelectContent>
        </Select>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-2"><ArrowLeft className="h-4 w-4" /></Button>
            <span className="px-2 text-sm text-muted-foreground">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-2"><ArrowLeft className="h-4 w-4 rotate-180" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AuditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const { organization } = useOrganization();

  // Get tab from URL query param
  const tabFromUrl = searchParams.get('tab') as AuditTab | null;
  const initialTab: AuditTab = tabFromUrl && ['overview', 'pages'].includes(tabFromUrl) ? tabFromUrl : 'overview';

  const [activeTab, setActiveTab] = useState<AuditTab>(initialTab);
  const [audit, setAudit] = useState<WebsiteAuditDto | null>(null);
  const [pages, setPages] = useState<PageAuditDto[]>([]);
  const [auditHistory, setAuditHistory] = useState<WebsiteAuditDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageAuditDto | null>(null);

  // Pages tab state
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const [pageCurrentPage, setPageCurrentPage] = useState(1);
  const [pagePageSize, setPagePageSize] = useState<number>(10);

  const loadAuditData = useCallback(() => {
    setTimeout(() => {
      setAudit(createMockAudit(projectId));
      setPages(createMockPages());
      setAuditHistory(createMockHistory(projectId));
      setIsLoading(false);
    }, 500);
  }, [projectId]);

  useEffect(() => {
    setIsLoading(true);
    loadAuditData();
  }, [projectId, organization?.id, loadAuditData]);

  const handleRunAudit = useCallback(() => {
    setIsStarting(true);
    toast.info('Starting audit...');
    setTimeout(() => {
      const newAudit: WebsiteAuditDto = {
        ...createMockAudit(projectId),
        status: 'SCANNING',
      };
      setAudit(newAudit);
      setIsStarting(false);
      toast.success('Audit started!');
    }, 1000);
  }, [projectId]);

  // Filter and paginate pages
  const filteredPages = pages.filter((page) => {
    if (!pageSearchQuery.trim()) return true;
    const query = pageSearchQuery.toLowerCase();
    return (
      page.url.toLowerCase().includes(query) ||
      (page.title?.toLowerCase().includes(query) ?? false) ||
      page.path.toLowerCase().includes(query)
    );
  });

  const pageTotalItems = filteredPages.length;
  const pageTotalPages = Math.ceil(pageTotalItems / pagePageSize);
  const pageValidCurrentPage = Math.max(1, Math.min(pageCurrentPage, pageTotalPages || 1));
  const pageStartIndex = (pageValidCurrentPage - 1) * pagePageSize;
  const pageEndIndex = Math.min(pageStartIndex + pagePageSize, pageTotalItems);
  const paginatedPages = filteredPages.slice(pageStartIndex, pageEndIndex);

  if (isLoading) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col items-center p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-4 gap-4 w-full">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="relative flex min-w-0 flex-2 flex-col items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Globe className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">No audits yet</h2>
          <p className="text-muted-foreground max-w-md">
            Run your first website audit to analyze SEO, performance, security, and more.
          </p>
          <Button onClick={handleRunAudit} disabled={isStarting}>
            {isStarting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Audit
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-w-0 flex-2 flex-col items-center">
      <div className="mx-auto flex w-full flex-col">
        {/* Tabs - matching TrackingPage style */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AuditTab)} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="overview"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="pages"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Pages ({pages.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* Latest Audit Card - Following same card pattern */}
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-2">
                  <span className="text-lg font-semibold">Latest Audit</span>
                  <p className="text-sm text-muted-foreground">Track the progress of your most recent website audit.</p>
                </div>
                <div className="flex shrink-0 flex-row items-center gap-2">
                  <Button size="sm" onClick={handleRunAudit} disabled={isStarting} className="gap-2">
                    {isStarting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        New Audit
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Audit Complete</span>
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Completed {audit.completedAt ? new Date(audit.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'} at {audit.completedAt ? new Date(audit.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        <span className="text-emerald-600">{audit.pagesScanned}</span>
                        <span className="text-muted-foreground font-normal"> / {audit.totalPages}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">pages scanned</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="h-2 w-full bg-gray-100 dark:bg-polar-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.round((audit.pagesScanned / audit.totalPages) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-sm font-medium">{Math.round((audit.pagesScanned / audit.totalPages) * 100)}%</p>
                  </div>

                  {/* Failed badge if any */}
                  {audit.pagesFailed > 0 && (
                    <div className="mt-3">
                      <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30 gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {audit.pagesFailed} failed
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Audit Details Row */}
                <div className="border-t border-gray-100 dark:border-polar-800 grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Started</p>
                    <p className="font-medium text-sm">{new Date(audit.startedAt!).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="font-medium text-sm">{audit.completedAt ? new Date(audit.completedAt).toLocaleString() : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pages</p>
                    <p className="font-medium text-sm">{audit.pagesScanned} / {audit.totalPages}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Links</p>
                    <p className="font-medium text-sm">{audit.totalLinks} ({audit.brokenLinks} broken)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assets</p>
                    <p className="font-medium text-sm">{audit.totalAssets} ({audit.assetsWithIssues} with issues)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-2">
                  <span className="text-lg font-semibold">Audit Summary</span>
                  <p className="text-sm text-muted-foreground">Overview of SEO, performance, security, and accessibility metrics.</p>
                </div>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                {/* Stats Grid - 4 cards without charts */}
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-polar-800">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Pages Scanned</span>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{audit.pagesScanned}</span>
                      <span className="text-sm font-medium text-emerald-600">+12</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Critical Issues</span>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{audit.criticalIssues}</span>
                      <span className="text-sm font-medium text-red-600">-2</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Warnings</span>
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{audit.warningIssues}</span>
                      <span className="text-sm font-medium text-red-600">-5</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{audit.overallScore}%</span>
                      <span className="text-sm font-medium text-emerald-600">+8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit History Card */}
            <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                <div className="flex w-full flex-col gap-y-2">
                  <span className="text-lg font-semibold">Audit History</span>
                  <p className="text-sm text-muted-foreground">Previous audit runs and their results.</p>
                </div>
              </div>

              <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                <div>
                  <div className="px-6 py-4">
                    <h3 className="font-semibold">Audit History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-y border-gray-200 dark:border-polar-800">
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Pages</th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Issues</th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                        {auditHistory.map((historyAudit) => (
                          <tr key={historyAudit.id} className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors">
                            <td className="px-6 py-4 text-sm">
                              {new Date(historyAudit.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30">
                                Completed
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm">{historyAudit.pagesScanned}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className="text-red-600">{historyAudit.criticalIssues}</span>
                              <span className="text-muted-foreground"> / </span>
                              <span className="text-amber-600">{historyAudit.warningIssues}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                'font-medium',
                                historyAudit.overallScore! >= 80 && 'text-emerald-600',
                                historyAudit.overallScore! >= 60 && historyAudit.overallScore! < 80 && 'text-amber-600',
                                historyAudit.overallScore! < 60 && 'text-red-600'
                              )}>
                                {historyAudit.overallScore}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="mt-0">
            <div className="flex h-[calc(100vh-200px)]">
              {/* Pages List */}
              <div className={cn(
                'flex flex-col rounded-xl bg-muted/30 p-2 lg:rounded-3xl',
                selectedPage ? 'w-1/3 min-w-[400px]' : 'w-full'
              )}>
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                  <div className="flex w-full flex-col gap-y-2">
                    <span className="text-lg font-semibold">Page Analysis</span>
                    <p className="text-sm text-muted-foreground">Click on a page to view its detailed SEO report.</p>
                  </div>
                </div>

                <div className="flex w-full flex-col flex-1 rounded-3xl bg-card overflow-hidden">
                  {/* Search */}
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search pages..."
                        value={pageSearchQuery}
                        onChange={(e) => { setPageSearchQuery(e.target.value); setPageCurrentPage(1); }}
                        className="pl-9 h-9"
                      />
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-card">
                        <tr className="border-b border-gray-200 dark:border-polar-800">
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Page</th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                          {!selectedPage && (
                            <>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">SEO</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Content</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                        {paginatedPages.length === 0 ? (
                          <tr>
                            <td colSpan={selectedPage ? 2 : 4} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                  {pageSearchQuery ? 'No pages match your search' : 'No pages scanned'}
                                </p>
                                {pageSearchQuery && (
                                  <Button variant="ghost" size="sm" onClick={() => setPageSearchQuery('')}>
                                    Clear search
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ) : (
                          paginatedPages.map((page) => (
                            <tr
                              key={page.id}
                              onClick={() => setSelectedPage(page)}
                              className={cn(
                                'cursor-pointer transition-colors',
                                selectedPage?.id === page.id
                                  ? 'bg-muted/50'
                                  : 'hover:bg-gray-50 dark:hover:bg-polar-800/50'
                              )}
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium">{page.title || page.path}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[250px]">{page.url}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn(
                                  'text-sm font-medium',
                                  (page.overallScore ?? 0) >= 80 && 'text-emerald-600',
                                  (page.overallScore ?? 0) >= 60 && (page.overallScore ?? 0) < 80 && 'text-amber-600',
                                  (page.overallScore ?? 0) < 60 && 'text-red-600'
                                )}>
                                  {page.overallScore ?? 0}%
                                </span>
                              </td>
                              {!selectedPage && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm">{page.seoScore ?? '-'}%</span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm">{page.contentScore ?? '-'}%</span>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pageTotalItems > 0 && (
                    <PaginationFooter
                      label="pages"
                      startIndex={pageStartIndex}
                      endIndex={pageEndIndex}
                      totalItems={pageTotalItems}
                      totalPages={pageTotalPages}
                      currentPage={pageValidCurrentPage}
                      pageSize={pagePageSize}
                      onPageChange={setPageCurrentPage}
                      onPageSizeChange={(v) => { setPagePageSize(v); setPageCurrentPage(1); }}
                    />
                  )}
                </div>
              </div>

              {/* Page Report Panel */}
              {selectedPage && (
                <div className="flex-1 ml-2">
                  <PageReportPanel page={selectedPage} onClose={() => setSelectedPage(null)} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
