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
  Link2,
  Image,
  ExternalLink,
  FileImage,
  FileCode,
  File,
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

import { cn } from '@workspace/common/lib';
import { useOrganization } from '@clerk/nextjs';

import type { WebsiteAuditDto, PageAuditDto } from '@workspace/common/lib/shcmea/types/dtos/audit-dto';

// ============================================================
// TYPES
// ============================================================
type AuditTab = 'overview' | 'pages' | 'links' | 'assets';

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

interface LinkData {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  type: 'internal' | 'external';
  status: 'ok' | 'broken' | 'redirect';
  statusCode: number;
  nofollow: boolean;
  foundOn: string;
}

interface AssetData {
  id: string;
  url: string;
  type: 'image' | 'script' | 'stylesheet' | 'font' | 'other';
  size: number;
  status: 'ok' | 'warning' | 'error';
  issues: string[];
  loadTime: number;
  foundOn: string;
}

// ============================================================
// MOCK DATA
// ============================================================
const createMockAudit = (projectId: string): WebsiteAuditDto => ({
  id: `audit-${Date.now()}`,
  projectId,
  sitemapUrl: 'https://www.padiso.co/sitemap.xml',
  maxPagesToScan: 500,
  status: 'COMPLETED',
  startedAt: new Date(Date.now() - 3600000).toISOString(),
  completedAt: new Date(Date.now() - 3000000).toISOString(),
  overallScore: 84,
  seoScore: 86,
  performanceScore: 82,
  accessibilityScore: 88,
  contentScore: 79,
  criticalIssues: 2,
  warningIssues: 18,
  infoIssues: 24,
  totalPages: 358,
  pagesDiscovered: 358,
  pagesScanned: 352,
  pagesFailed: 6,
  pagesQueued: 0,
  totalLinks: 4820,
  brokenLinks: 8,
  totalAssets: 892,
  assetsWithIssues: 23,
  totalCost: null,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 3000000).toISOString(),
});

const createMockPages = (): PageAuditDto[] => [
  {
    id: 'page-1',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/',
    path: '/',
    title: 'Padiso - AI Automation & Digital Transformation Agency Sydney',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 0,
    overallScore: 89,
    seoScore: 91,
    aeoScore: 85,
    contentScore: 88,
    technicalScore: 92,
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
    url: 'https://www.padiso.co/blog',
    path: '/blog',
    title: 'Blog - AI & Automation Insights | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 1,
    overallScore: 84,
    seoScore: 86,
    aeoScore: 78,
    contentScore: 82,
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
    url: 'https://www.padiso.co/services/product-strategy',
    path: '/services/product-strategy',
    title: 'Product Strategy Services | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 1,
    overallScore: 82,
    seoScore: 80,
    aeoScore: 75,
    contentScore: 85,
    technicalScore: 86,
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
    url: 'https://www.padiso.co/blog/ai-consulting-sydney',
    path: '/blog/ai-consulting-sydney',
    title: 'AI Consulting Sydney - Expert AI Implementation Services | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 2,
    overallScore: 91,
    seoScore: 93,
    aeoScore: 88,
    contentScore: 90,
    technicalScore: 92,
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
    url: 'https://www.padiso.co/blog/ai-automation-agency-services',
    path: '/blog/ai-automation-agency-services',
    title: 'AI Automation Agency Services - Transform Your Business | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 2,
    overallScore: 87,
    seoScore: 89,
    aeoScore: 82,
    contentScore: 86,
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
    id: 'page-6',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/blog/digital-transformation-roi-measuring-success-and-value-creation',
    path: '/blog/digital-transformation-roi-measuring-success-and-value-creation',
    title: 'Digital Transformation ROI: Measuring Success and Value Creation | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 2,
    overallScore: 78,
    seoScore: 76,
    aeoScore: 72,
    contentScore: 82,
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
  {
    id: 'page-7',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/blog/ai-strategy-for-startups-building-ai-first-products-and-services',
    path: '/blog/ai-strategy-for-startups-building-ai-first-products-and-services',
    title: 'AI Strategy for Startups: Building AI-First Products | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 2,
    overallScore: 85,
    seoScore: 87,
    aeoScore: 80,
    contentScore: 84,
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
    id: 'page-8',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/privacy',
    path: '/privacy',
    title: 'Privacy Policy | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 1,
    overallScore: 72,
    seoScore: 68,
    aeoScore: 60,
    contentScore: 75,
    technicalScore: 82,
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
    id: 'page-9',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/terms',
    path: '/terms',
    title: 'Terms of Service | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 1,
    overallScore: 70,
    seoScore: 65,
    aeoScore: 58,
    contentScore: 72,
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
  {
    id: 'page-10',
    auditId: 'audit-1',
    url: 'https://www.padiso.co/blog/ai-agency-roi-sydney-2026',
    path: '/blog/ai-agency-roi-sydney-2026',
    title: 'AI Agency ROI Sydney 2026: Maximizing Your Investment | Padiso',
    discoveredAt: new Date().toISOString(),
    discoveredFrom: 'sitemap',
    depth: 2,
    overallScore: 93,
    seoScore: 95,
    aeoScore: 90,
    contentScore: 92,
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
    overallScore: 81,
    pagesScanned: 348,
    criticalIssues: 4,
    warningIssues: 22,
  },
  {
    ...createMockAudit(projectId),
    id: `audit-${Date.now() - 172800000}`,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    startedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 172500000).toISOString(),
    updatedAt: new Date(Date.now() - 172500000).toISOString(),
    overallScore: 78,
    pagesScanned: 340,
    criticalIssues: 5,
    warningIssues: 28,
  },
  {
    ...createMockAudit(projectId),
    id: `audit-${Date.now() - 604800000}`, // 7 days ago
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    startedAt: new Date(Date.now() - 604800000).toISOString(),
    completedAt: new Date(Date.now() - 604500000).toISOString(),
    updatedAt: new Date(Date.now() - 604500000).toISOString(),
    overallScore: 74,
    pagesScanned: 325,
    criticalIssues: 7,
    warningIssues: 35,
  },
];

const createMockLinks = (): LinkData[] => [
  {
    id: 'link-1',
    sourceUrl: 'https://www.padiso.co/',
    targetUrl: 'https://www.padiso.co/blog',
    anchorText: 'Blog',
    type: 'internal',
    status: 'ok',
    statusCode: 200,
    nofollow: false,
    foundOn: '/',
  },
  {
    id: 'link-2',
    sourceUrl: 'https://www.padiso.co/',
    targetUrl: 'https://www.padiso.co/services/product-strategy',
    anchorText: 'Product Strategy',
    type: 'internal',
    status: 'ok',
    statusCode: 200,
    nofollow: false,
    foundOn: '/',
  },
  {
    id: 'link-3',
    sourceUrl: 'https://www.padiso.co/blog',
    targetUrl: 'https://www.padiso.co/blog/ai-consulting-sydney',
    anchorText: 'AI Consulting Sydney',
    type: 'internal',
    status: 'ok',
    statusCode: 200,
    nofollow: false,
    foundOn: '/blog',
  },
  {
    id: 'link-4',
    sourceUrl: 'https://www.padiso.co/blog/ai-consulting-sydney',
    targetUrl: 'https://www.linkedin.com/company/padiso',
    anchorText: 'LinkedIn',
    type: 'external',
    status: 'ok',
    statusCode: 200,
    nofollow: true,
    foundOn: '/blog/ai-consulting-sydney',
  },
  {
    id: 'link-5',
    sourceUrl: 'https://www.padiso.co/blog/ai-automation-agency-services',
    targetUrl: 'https://www.padiso.co/blog/old-article-removed',
    anchorText: 'Related Article',
    type: 'internal',
    status: 'broken',
    statusCode: 404,
    nofollow: false,
    foundOn: '/blog/ai-automation-agency-services',
  },
  {
    id: 'link-6',
    sourceUrl: 'https://www.padiso.co/',
    targetUrl: 'https://twitter.com/padisoco',
    anchorText: 'Twitter',
    type: 'external',
    status: 'ok',
    statusCode: 200,
    nofollow: true,
    foundOn: '/',
  },
  {
    id: 'link-7',
    sourceUrl: 'https://www.padiso.co/blog/digital-transformation-roi-measuring-success-and-value-creation',
    targetUrl: 'https://www.padiso.co/case-studies',
    anchorText: 'View Case Studies',
    type: 'internal',
    status: 'redirect',
    statusCode: 301,
    nofollow: false,
    foundOn: '/blog/digital-transformation-roi-measuring-success-and-value-creation',
  },
  {
    id: 'link-8',
    sourceUrl: 'https://www.padiso.co/blog/ai-strategy-for-startups-building-ai-first-products-and-services',
    targetUrl: 'https://aws.amazon.com/ai/',
    anchorText: 'AWS AI Services',
    type: 'external',
    status: 'ok',
    statusCode: 200,
    nofollow: true,
    foundOn: '/blog/ai-strategy-for-startups-building-ai-first-products-and-services',
  },
  {
    id: 'link-9',
    sourceUrl: 'https://www.padiso.co/privacy',
    targetUrl: 'mailto:privacy@padiso.co',
    anchorText: 'privacy@padiso.co',
    type: 'external',
    status: 'ok',
    statusCode: 200,
    nofollow: false,
    foundOn: '/privacy',
  },
  {
    id: 'link-10',
    sourceUrl: 'https://www.padiso.co/blog/venture-studio-for-ai-startups-building-the-next-generation-of-ai-companies',
    targetUrl: 'https://www.padiso.co/contact-old',
    anchorText: 'Contact Us',
    type: 'internal',
    status: 'broken',
    statusCode: 404,
    nofollow: false,
    foundOn: '/blog/venture-studio-for-ai-startups-building-the-next-generation-of-ai-companies',
  },
  {
    id: 'link-11',
    sourceUrl: 'https://www.padiso.co/',
    targetUrl: 'https://www.google.com/partners/agency?id=padiso',
    anchorText: 'Google Partner',
    type: 'external',
    status: 'ok',
    statusCode: 200,
    nofollow: true,
    foundOn: '/',
  },
  {
    id: 'link-12',
    sourceUrl: 'https://www.padiso.co/blog',
    targetUrl: 'https://www.padiso.co/blog/ai-agency-roi-sydney-2026',
    anchorText: 'AI Agency ROI Sydney 2026',
    type: 'internal',
    status: 'ok',
    statusCode: 200,
    nofollow: false,
    foundOn: '/blog',
  },
];

const createMockAssets = (): AssetData[] => [
  {
    id: 'asset-1',
    url: 'https://www.padiso.co/images/hero-ai-automation.webp',
    type: 'image',
    size: 245000,
    status: 'ok',
    issues: [],
    loadTime: 120,
    foundOn: '/',
  },
  {
    id: 'asset-2',
    url: 'https://www.padiso.co/images/team-sydney.jpg',
    type: 'image',
    size: 1850000,
    status: 'warning',
    issues: ['Image is too large (1.8MB). Consider compressing or using WebP format.'],
    loadTime: 890,
    foundOn: '/',
  },
  {
    id: 'asset-3',
    url: 'https://www.padiso.co/js/main.bundle.js',
    type: 'script',
    size: 156000,
    status: 'ok',
    issues: [],
    loadTime: 45,
    foundOn: '/',
  },
  {
    id: 'asset-4',
    url: 'https://www.padiso.co/css/styles.css',
    type: 'stylesheet',
    size: 42000,
    status: 'ok',
    issues: [],
    loadTime: 28,
    foundOn: '/',
  },
  {
    id: 'asset-5',
    url: 'https://www.padiso.co/images/blog/ai-consulting-hero.png',
    type: 'image',
    size: 2400000,
    status: 'error',
    issues: ['Image exceeds 2MB limit. Convert to WebP and compress.', 'Missing alt attribute.'],
    loadTime: 1240,
    foundOn: '/blog/ai-consulting-sydney',
  },
  {
    id: 'asset-6',
    url: 'https://www.padiso.co/fonts/inter-var.woff2',
    type: 'font',
    size: 98000,
    status: 'ok',
    issues: [],
    loadTime: 35,
    foundOn: '/',
  },
  {
    id: 'asset-7',
    url: 'https://www.padiso.co/images/logo-padiso.svg',
    type: 'image',
    size: 4200,
    status: 'ok',
    issues: [],
    loadTime: 12,
    foundOn: '/',
  },
  {
    id: 'asset-8',
    url: 'https://www.padiso.co/js/analytics.js',
    type: 'script',
    size: 28000,
    status: 'warning',
    issues: ['Script is render-blocking. Consider using defer or async attribute.'],
    loadTime: 180,
    foundOn: '/',
  },
  {
    id: 'asset-9',
    url: 'https://www.padiso.co/images/blog/digital-transformation-infographic.png',
    type: 'image',
    size: 520000,
    status: 'warning',
    issues: ['Consider using WebP format for better compression.'],
    loadTime: 340,
    foundOn: '/blog/digital-transformation-roi-measuring-success-and-value-creation',
  },
  {
    id: 'asset-10',
    url: 'https://www.padiso.co/images/testimonials/client-1.webp',
    type: 'image',
    size: 45000,
    status: 'ok',
    issues: [],
    loadTime: 28,
    foundOn: '/',
  },
  {
    id: 'asset-11',
    url: 'https://www.padiso.co/js/chatbot.min.js',
    type: 'script',
    size: 89000,
    status: 'ok',
    issues: [],
    loadTime: 65,
    foundOn: '/',
  },
  {
    id: 'asset-12',
    url: 'https://www.padiso.co/images/services/product-strategy-icon.svg',
    type: 'image',
    size: 3800,
    status: 'ok',
    issues: [],
    loadTime: 8,
    foundOn: '/services/product-strategy',
  },
];

const createMockPageReport = (page: PageAuditDto): PageReportData => {
  // Generate contextual meta description based on page type
  const getMetaDescription = (url: string): string => {
    if (url.includes('/blog/ai-consulting')) {
      return 'Expert AI consulting services in Sydney. Padiso helps businesses implement AI automation, machine learning solutions, and digital transformation strategies for sustainable growth.';
    }
    if (url.includes('/blog/ai-automation')) {
      return 'Transform your business with AI automation agency services. Discover how Padiso helps Sydney businesses streamline operations, reduce costs, and drive innovation through intelligent automation.';
    }
    if (url.includes('/blog/digital-transformation')) {
      return 'Learn how to measure digital transformation ROI and create lasting value. Comprehensive guide to tracking success metrics and maximizing your technology investments.';
    }
    if (url.includes('/blog/ai-strategy')) {
      return 'Build AI-first products and services with proven strategies for startups. Expert guidance on implementing AI solutions that scale with your business.';
    }
    if (url.includes('/blog/ai-agency-roi')) {
      return 'Maximize your AI investment in 2026. Learn how Sydney businesses are achieving significant ROI through strategic AI implementation with Padiso.';
    }
    if (url.includes('/blog')) {
      return 'Explore insights on AI automation, digital transformation, and technology strategy. Expert articles from Padiso to help your business thrive in the digital age.';
    }
    if (url.includes('/services')) {
      return 'Strategic product development and digital transformation services. Padiso helps businesses define, build, and scale innovative technology solutions.';
    }
    if (url.includes('/privacy')) {
      return 'Padiso privacy policy. Learn how we collect, use, and protect your personal information when you use our AI automation and consulting services.';
    }
    if (url.includes('/terms')) {
      return 'Terms of service for Padiso AI automation and consulting services. Read our terms and conditions for using our platform and services.';
    }
    return 'Padiso is a leading AI automation and digital transformation agency in Sydney. We help businesses leverage AI, machine learning, and intelligent automation to drive growth and innovation.';
  };

  // Generate contextual keywords based on page type
  const getKeywords = (url: string): string[] => {
    if (url.includes('/blog/ai-consulting')) {
      return ['ai consulting', 'sydney ai agency', 'machine learning', 'ai implementation', 'business automation', 'digital strategy'];
    }
    if (url.includes('/blog/ai-automation')) {
      return ['ai automation', 'business automation', 'intelligent automation', 'workflow automation', 'process automation', 'rpa'];
    }
    if (url.includes('/blog/digital-transformation')) {
      return ['digital transformation', 'roi measurement', 'value creation', 'technology investment', 'business metrics', 'kpis'];
    }
    if (url.includes('/blog/ai-strategy')) {
      return ['ai strategy', 'startups', 'ai products', 'machine learning', 'product development', 'innovation'];
    }
    if (url.includes('/blog')) {
      return ['ai insights', 'automation blog', 'digital transformation', 'technology trends', 'business innovation'];
    }
    if (url.includes('/services')) {
      return ['product strategy', 'digital services', 'consulting', 'technology advisory', 'business transformation'];
    }
    return ['ai automation', 'digital transformation', 'sydney', 'machine learning', 'business consulting', 'padiso', 'technology'];
  };

  const isHomepage = page.path === '/';
  const isBlogPost = page.path.includes('/blog/') && page.path !== '/blog';
  const isLegalPage = page.path.includes('/privacy') || page.path.includes('/terms');

  return {
    id: page.id,
    url: page.url,
    title: page.title || 'Untitled',
    score: page.overallScore || 0,
    scannedAt: page.scannedAt || new Date().toISOString(),
    seo: {
      title: { status: 'pass', value: page.title },
      metaDescription: {
        status: 'pass',
        value: getMetaDescription(page.url),
        suggestion: undefined,
      },
      headings: { 
        status: isBlogPost ? 'pass' : 'warning', 
        h1: page.title, 
        h2Count: isBlogPost ? 8 : isHomepage ? 6 : 4 
      },
      contentKeywords: { status: 'pass', keywords: getKeywords(page.url) },
      imageKeywords: { 
        status: isLegalPage ? 'warning' : 'pass', 
        message: isLegalPage ? 'Legal pages have minimal images - consider adding relevant visuals.' : 'All images have alt attributes set with relevant keywords.' 
      },
      seoFriendlyUrl: { status: 'pass', message: 'The URL is SEO friendly and follows best practices.' },
      errorPages: { status: 'pass', count: 0, urls: [] },
      robotsAccess: { status: 'pass', message: 'The webpage can be accessed by search engines.' },
      inPageLinks: { 
        status: 'pass', 
        internal: isHomepage ? 45 : isBlogPost ? 28 : 18, 
        external: isBlogPost ? 12 : 5 
      },
      favicon: { status: 'pass', message: 'The webpage has a properly configured favicon.' },
      language: { status: 'pass', value: 'en-AU' },
      noindex: { 
        status: isLegalPage ? 'warning' : 'pass', 
        message: isLegalPage ? 'Consider adding noindex to legal pages to focus crawl budget.' : 'The webpage does not have a noindex tag set.' 
      },
      metaRefresh: { status: 'pass', message: 'The webpage does not have a meta refresh tag set.' },
      metaKeywords: {
        status: 'warning',
        value: null,
        suggestion: 'ai automation sydney, digital transformation agency, ai consulting australia, machine learning services, business automation, intelligent automation, padiso',
      },
    },
    performance: {
      textCompression: { status: 'pass', message: 'The HTML file is compressed using gzip/brotli.' },
      loadTime: { status: 'pass', value: '0.892 seconds' },
      pageSize: { status: 'pass', value: '156.4 KB' },
      httpRequests: { status: 'pass', count: 38 },
      imageFormat: { status: 'pass', message: 'Images are served in modern WebP format with fallbacks.' },
      javascriptDefer: { status: 'pass', message: 'JavaScript resources use defer/async attributes correctly.' },
      domSize: { status: 'pass', value: 1240 },
      doctype: { status: 'pass', message: 'The webpage has the HTML5 DOCTYPE declaration set.' },
    },
    security: {
      httpsEncryption: { status: 'pass', message: 'The webpage uses HTTPS encryption with a valid SSL certificate.' },
      http2: { status: 'pass', message: 'The webpage is using the HTTP/2 protocol for faster loading.' },
      mixedContent: { status: 'pass', message: 'No mixed content resources detected on the webpage.' },
      serverSignature: { status: 'pass', message: 'Server signature is hidden for security.' },
      unsafeCrossOrigin: { status: 'pass', message: 'All cross-origin links have proper rel attributes.' },
      hsts: { status: 'pass', message: 'HTTP Strict Transport Security header is properly configured.' },
      plaintextEmail: { status: 'pass', message: 'No plaintext emails exposed on the webpage.' },
    },
    miscellaneous: {
      structuredData: { 
        status: 'pass', 
        types: isHomepage 
          ? ['Organization', 'WebPage', 'LocalBusiness'] 
          : isBlogPost 
            ? ['Article', 'BlogPosting', 'Organization'] 
            : ['WebPage', 'Organization'] 
      },
      metaViewport: { status: 'pass', value: 'width=device-width, initial-scale=1' },
      characterSet: { status: 'pass', value: 'UTF-8' },
      sitemap: { status: 'pass', message: 'XML sitemap found at /sitemap.xml with 350+ URLs indexed.' },
      social: { 
        status: isHomepage ? 'pass' : 'warning', 
        message: isHomepage 
          ? 'Open Graph and Twitter Card meta tags are properly configured.' 
          : 'Consider adding social sharing meta tags for better social media visibility.' 
      },
      contentLength: { 
        status: isBlogPost ? 'pass' : isLegalPage ? 'pass' : 'warning', 
        wordCount: isBlogPost ? 2450 : isHomepage ? 1200 : isLegalPage ? 3200 : 850 
      },
      textToHtmlRatio: { status: 'pass', value: isBlogPost ? '68%' : '52%' },
      inlineCss: { status: 'pass', message: 'Critical CSS is inlined, non-critical CSS is deferred.' },
      deprecatedHtml: { status: 'pass', message: 'No deprecated HTML tags found on the webpage.' },
    },
  };
};

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
          <ReportItem label="Headings" status={report.seo.headings.status} value={`The H1 tag is properly set. ${report.seo.headings.h2Count} H2 subheadings found.`} suggestion={report.seo.headings.status === 'warning' ? `Consider adding more descriptive H2s like: "AI Automation Services", "Digital Transformation Solutions", "Sydney AI Consulting"` : undefined} />
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
  const initialTab: AuditTab = tabFromUrl && ['overview', 'pages', 'links', 'assets'].includes(tabFromUrl) ? tabFromUrl : 'overview';

  const [activeTab, setActiveTab] = useState<AuditTab>(initialTab);
  const [audit, setAudit] = useState<WebsiteAuditDto | null>(null);
  const [pages, setPages] = useState<PageAuditDto[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [auditHistory, setAuditHistory] = useState<WebsiteAuditDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageAuditDto | null>(null);

  // Pages tab state
  const [pageSearchQuery, setPageSearchQuery] = useState('');
  const [pageCurrentPage, setPageCurrentPage] = useState(1);
  const [pagePageSize, setPagePageSize] = useState<number>(10);

  // Links tab state
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [linkCurrentPage, setLinkCurrentPage] = useState(1);
  const [linkPageSize, setLinkPageSize] = useState<number>(10);
  const [linkTypeFilter, setLinkTypeFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [linkStatusFilter, setLinkStatusFilter] = useState<'all' | 'ok' | 'broken' | 'redirect'>('all');

  // Assets tab state
  const [assetSearchQuery, setAssetSearchQuery] = useState('');
  const [assetCurrentPage, setAssetCurrentPage] = useState(1);
  const [assetPageSize, setAssetPageSize] = useState<number>(10);
  const [assetTypeFilter, setAssetTypeFilter] = useState<'all' | 'image' | 'script' | 'stylesheet' | 'font' | 'other'>('all');
  const [assetStatusFilter, setAssetStatusFilter] = useState<'all' | 'ok' | 'warning' | 'error'>('all');

  const loadAuditData = useCallback(() => {
    setTimeout(() => {
      setAudit(createMockAudit(projectId));
      setPages(createMockPages());
      setLinks(createMockLinks());
      setAssets(createMockAssets());
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
            Run your first technical audit to analyze SEO, performance, security, and more.
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
              <TabsTrigger
                value="links"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Links ({links.length})
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="dark:data-[state=active]:bg-polar-700 dark:hover:text-polar-50 dark:text-polar-500 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Assets ({assets.length})
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
                  <p className="text-sm text-muted-foreground">Track the progress of your most recent technical audit.</p>
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

          {/* Links Tab */}
          <TabsContent value="links" className="mt-0">
            {(() => {
              // Filter links
              const filteredLinks = links.filter((link) => {
                if (linkTypeFilter !== 'all' && link.type !== linkTypeFilter) return false;
                if (linkStatusFilter !== 'all' && link.status !== linkStatusFilter) return false;
                if (!linkSearchQuery.trim()) return true;
                const query = linkSearchQuery.toLowerCase();
                return (
                  link.targetUrl.toLowerCase().includes(query) ||
                  link.anchorText.toLowerCase().includes(query) ||
                  link.foundOn.toLowerCase().includes(query)
                );
              });

              const linkTotalItems = filteredLinks.length;
              const linkTotalPages = Math.ceil(linkTotalItems / linkPageSize);
              const linkValidCurrentPage = Math.max(1, Math.min(linkCurrentPage, linkTotalPages || 1));
              const linkStartIndex = (linkValidCurrentPage - 1) * linkPageSize;
              const linkEndIndex = Math.min(linkStartIndex + linkPageSize, linkTotalItems);
              const paginatedLinks = filteredLinks.slice(linkStartIndex, linkEndIndex);

              const brokenLinksCount = links.filter(l => l.status === 'broken').length;
              const redirectLinksCount = links.filter(l => l.status === 'redirect').length;
              const internalLinksCount = links.filter(l => l.type === 'internal').length;
              const externalLinksCount = links.filter(l => l.type === 'external').length;

              return (
                <div className="space-y-6">
                  {/* Links Summary */}
                  <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
                    <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-polar-800">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Links</span>
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-3xl font-bold">{links.length}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Broken Links</span>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          </div>
                          <span className="text-3xl font-bold text-red-600">{brokenLinksCount}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Internal</span>
                            <Link2 className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-3xl font-bold">{internalLinksCount}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">External</span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-3xl font-bold">{externalLinksCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Links Table */}
                  <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex w-full flex-col gap-y-2">
                        <span className="text-lg font-semibold">Link Analysis</span>
                        <p className="text-sm text-muted-foreground">All links discovered during the audit with their status.</p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                      {/* Filters */}
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search links..."
                            value={linkSearchQuery}
                            onChange={(e) => { setLinkSearchQuery(e.target.value); setLinkCurrentPage(1); }}
                            className="pl-9 h-9"
                          />
                        </div>
                        <Select value={linkTypeFilter} onValueChange={(v) => { setLinkTypeFilter(v as typeof linkTypeFilter); setLinkCurrentPage(1); }}>
                          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="internal">Internal</SelectItem>
                            <SelectItem value="external">External</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={linkStatusFilter} onValueChange={(v) => { setLinkStatusFilter(v as typeof linkStatusFilter); setLinkCurrentPage(1); }}>
                          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ok">OK</SelectItem>
                            <SelectItem value="broken">Broken</SelectItem>
                            <SelectItem value="redirect">Redirect</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-polar-800">
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Target URL</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Anchor Text</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Found On</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                            {paginatedLinks.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-12 text-center">
                                  <p className="text-sm text-muted-foreground">No links match your filters</p>
                                </td>
                              </tr>
                            ) : (
                              paginatedLinks.map((link) => (
                                <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      {link.type === 'external' && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                                      <span className="text-sm truncate max-w-[300px]" title={link.targetUrl}>{link.targetUrl}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm">{link.anchorText}</td>
                                  <td className="px-6 py-4">
                                    <Badge variant="outline" className={cn(
                                      link.type === 'internal' ? 'text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30' : 'text-gray-600 border-gray-300 bg-gray-50 dark:bg-gray-800'
                                    )}>
                                      {link.type}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge variant="outline" className={cn(
                                      link.status === 'ok' && 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30',
                                      link.status === 'broken' && 'text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30',
                                      link.status === 'redirect' && 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30'
                                    )}>
                                      {link.status === 'ok' ? `${link.statusCode} OK` : link.status === 'broken' ? `${link.statusCode} Broken` : `${link.statusCode} Redirect`}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-muted-foreground">{link.foundOn}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {linkTotalItems > 0 && (
                        <PaginationFooter
                          label="links"
                          startIndex={linkStartIndex}
                          endIndex={linkEndIndex}
                          totalItems={linkTotalItems}
                          totalPages={linkTotalPages}
                          currentPage={linkValidCurrentPage}
                          pageSize={linkPageSize}
                          onPageChange={setLinkCurrentPage}
                          onPageSizeChange={(v) => { setLinkPageSize(v); setLinkCurrentPage(1); }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent value="assets" className="mt-0">
            {(() => {
              // Filter assets
              const filteredAssets = assets.filter((asset) => {
                if (assetTypeFilter !== 'all' && asset.type !== assetTypeFilter) return false;
                if (assetStatusFilter !== 'all' && asset.status !== assetStatusFilter) return false;
                if (!assetSearchQuery.trim()) return true;
                const query = assetSearchQuery.toLowerCase();
                return (
                  asset.url.toLowerCase().includes(query) ||
                  asset.foundOn.toLowerCase().includes(query)
                );
              });

              const assetTotalItems = filteredAssets.length;
              const assetTotalPages = Math.ceil(assetTotalItems / assetPageSize);
              const assetValidCurrentPage = Math.max(1, Math.min(assetCurrentPage, assetTotalPages || 1));
              const assetStartIndex = (assetValidCurrentPage - 1) * assetPageSize;
              const assetEndIndex = Math.min(assetStartIndex + assetPageSize, assetTotalItems);
              const paginatedAssets = filteredAssets.slice(assetStartIndex, assetEndIndex);

              const totalSize = assets.reduce((acc, a) => acc + a.size, 0);
              const assetsWithIssues = assets.filter(a => a.status !== 'ok').length;
              const imageCount = assets.filter(a => a.type === 'image').length;
              const scriptCount = assets.filter(a => a.type === 'script').length;

              const formatSize = (bytes: number) => {
                if (bytes < 1024) return `${bytes} B`;
                if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
                return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
              };

              const getAssetIcon = (type: AssetData['type']) => {
                switch (type) {
                  case 'image': return <FileImage className="h-4 w-4 text-purple-500" />;
                  case 'script': return <FileCode className="h-4 w-4 text-amber-500" />;
                  case 'stylesheet': return <FileText className="h-4 w-4 text-blue-500" />;
                  case 'font': return <File className="h-4 w-4 text-gray-500" />;
                  default: return <File className="h-4 w-4 text-gray-400" />;
                }
              };

              return (
                <div className="space-y-6">
                  {/* Assets Summary */}
                  <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
                    <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-polar-800">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Assets</span>
                            <File className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-3xl font-bold">{assets.length}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Total Size</span>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="text-3xl font-bold">{formatSize(totalSize)}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">With Issues</span>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="text-3xl font-bold text-amber-600">{assetsWithIssues}</span>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">Images</span>
                            <FileImage className="h-4 w-4 text-purple-500" />
                          </div>
                          <span className="text-3xl font-bold">{imageCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Assets Table */}
                  <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
                    <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
                      <div className="flex w-full flex-col gap-y-2">
                        <span className="text-lg font-semibold">Asset Analysis</span>
                        <p className="text-sm text-muted-foreground">All assets discovered during the audit with optimization opportunities.</p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col rounded-3xl bg-card overflow-hidden">
                      {/* Filters */}
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-polar-800 flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search assets..."
                            value={assetSearchQuery}
                            onChange={(e) => { setAssetSearchQuery(e.target.value); setAssetCurrentPage(1); }}
                            className="pl-9 h-9"
                          />
                        </div>
                        <Select value={assetTypeFilter} onValueChange={(v) => { setAssetTypeFilter(v as typeof assetTypeFilter); setAssetCurrentPage(1); }}>
                          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="script">Scripts</SelectItem>
                            <SelectItem value="stylesheet">Stylesheets</SelectItem>
                            <SelectItem value="font">Fonts</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={assetStatusFilter} onValueChange={(v) => { setAssetStatusFilter(v as typeof assetStatusFilter); setAssetCurrentPage(1); }}>
                          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ok">OK</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-polar-800">
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Asset</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Size</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Load Time</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Issues</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-polar-800">
                            {paginatedAssets.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                  <p className="text-sm text-muted-foreground">No assets match your filters</p>
                                </td>
                              </tr>
                            ) : (
                              paginatedAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-polar-800/50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                      {getAssetIcon(asset.type)}
                                      <span className="text-sm truncate max-w-[250px]" title={asset.url}>
                                        {asset.url.split('/').pop()}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[250px]" title={asset.foundOn}>
                                      Found on: {asset.foundOn}
                                    </p>
                                  </td>
                                  <td className="px-6 py-4">
                                    <Badge variant="outline" className="capitalize">{asset.type}</Badge>
                                  </td>
                                  <td className="px-6 py-4 text-sm font-medium">{formatSize(asset.size)}</td>
                                  <td className="px-6 py-4 text-sm">{asset.loadTime}ms</td>
                                  <td className="px-6 py-4">
                                    <Badge variant="outline" className={cn(
                                      asset.status === 'ok' && 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30',
                                      asset.status === 'warning' && 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30',
                                      asset.status === 'error' && 'text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30'
                                    )}>
                                      {asset.status === 'ok' ? 'OK' : asset.status === 'warning' ? 'Warning' : 'Error'}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-4">
                                    {asset.issues.length > 0 ? (
                                      <div className="space-y-1">
                                        {asset.issues.map((issue, i) => (
                                          <p key={i} className="text-xs text-muted-foreground">{issue}</p>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">None</span>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {assetTotalItems > 0 && (
                        <PaginationFooter
                          label="assets"
                          startIndex={assetStartIndex}
                          endIndex={assetEndIndex}
                          totalItems={assetTotalItems}
                          totalPages={assetTotalPages}
                          currentPage={assetValidCurrentPage}
                          pageSize={assetPageSize}
                          onPageChange={setAssetCurrentPage}
                          onPageSizeChange={(v) => { setAssetPageSize(v); setAssetCurrentPage(1); }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
