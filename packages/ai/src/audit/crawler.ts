/**
 * Website Crawler
 *
 * Handles sitemap discovery, page fetching, and HTML extraction
 */

import type {
  SitemapResult,
  RobotsTxtResult,
  PageFetchResult,
  ExtractedPageData,
  PageMetadata,
} from './types';
import {
  AUDIT_USER_AGENT,
  PAGE_FETCH_TIMEOUT_MS,
  SITEMAP_LOCATIONS,
} from './types';
import type { ImageInfo, LinkInfo, StructuredDataItem } from '../types/audit-dto';

// ============================================================
// Robots.txt Parser
// ============================================================

export async function parseRobotsTxt(baseUrl: string): Promise<RobotsTxtResult> {
  const robotsUrl = new URL('/robots.txt', baseUrl).href;

  try {
    const response = await fetch(robotsUrl, {
      headers: { 'User-Agent': AUDIT_USER_AGENT },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return {
        success: false,
        sitemapUrls: [],
        disallowedPaths: [],
        crawlDelay: null,
      };
    }

    const text = await response.text();
    const lines = text.split('\n');

    const sitemapUrls: string[] = [];
    const disallowedPaths: string[] = [];
    let crawlDelay: number | null = null;
    let isRelevantUserAgent = true; // Start with true for * user-agent

    for (const line of lines) {
      const trimmedLine = line.trim().toLowerCase();

      if (trimmedLine.startsWith('user-agent:')) {
        const agent = line.split(':')[1]?.trim() || '';
        isRelevantUserAgent = agent === '*' || agent.toLowerCase().includes('bot');
      }

      if (trimmedLine.startsWith('sitemap:')) {
        const sitemapUrl = line.split(/sitemap:/i)[1]?.trim();
        if (sitemapUrl) {
          sitemapUrls.push(sitemapUrl);
        }
      }

      if (isRelevantUserAgent && trimmedLine.startsWith('disallow:')) {
        const path = line.split(':')[1]?.trim();
        if (path) {
          disallowedPaths.push(path);
        }
      }

      if (isRelevantUserAgent && trimmedLine.startsWith('crawl-delay:')) {
        const delay = parseInt(line.split(':')[1]?.trim() || '0', 10);
        if (!isNaN(delay)) {
          crawlDelay = delay * 1000; // Convert to milliseconds
        }
      }
    }

    return {
      success: true,
      sitemapUrls,
      disallowedPaths,
      crawlDelay,
    };
  } catch (error) {
    return {
      success: false,
      sitemapUrls: [],
      disallowedPaths: [],
      crawlDelay: null,
    };
  }
}

// ============================================================
// Sitemap Fetcher
// ============================================================

export async function fetchSitemap(sitemapUrl: string): Promise<SitemapResult> {
  const urls: string[] = [];
  const errors: string[] = [];

  try {
    const response = await fetch(sitemapUrl, {
      headers: { 'User-Agent': AUDIT_USER_AGENT },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return {
        success: false,
        sitemapUrl,
        urls: [],
        errors: [`Failed to fetch sitemap: HTTP ${response.status}`],
      };
    }

    const text = await response.text();

    // Check if this is a sitemap index
    if (text.includes('<sitemapindex') || text.includes('sitemap>')) {
      // Parse sitemap index
      const sitemapMatches = text.match(/<loc>(.*?)<\/loc>/g) || [];
      const childSitemaps = sitemapMatches.map((match) =>
        match.replace(/<\/?loc>/g, '').trim()
      );

      // Recursively fetch child sitemaps (limit to first 5 to avoid too many requests)
      for (const childUrl of childSitemaps.slice(0, 5)) {
        try {
          const childResult = await fetchSitemap(childUrl);
          urls.push(...childResult.urls);
          errors.push(...childResult.errors);
        } catch (error) {
          errors.push(`Failed to fetch child sitemap ${childUrl}: ${error}`);
        }
      }
    } else {
      // Parse regular sitemap
      const locMatches = text.match(/<loc>(.*?)<\/loc>/g) || [];
      for (const match of locMatches) {
        const url = match.replace(/<\/?loc>/g, '').trim();
        // Only include HTML pages, not images/videos
        if (url && !url.match(/\.(jpg|jpeg|png|gif|webp|svg|pdf|mp4|mp3|zip)$/i)) {
          urls.push(url);
        }
      }
    }

    return {
      success: true,
      sitemapUrl,
      urls: [...new Set(urls)], // Deduplicate
      errors,
    };
  } catch (error) {
    return {
      success: false,
      sitemapUrl,
      urls: [],
      errors: [`Error fetching sitemap: ${error}`],
    };
  }
}

// ============================================================
// Page Discovery
// ============================================================

export async function discoverPages(
  baseUrl: string,
  options: {
    sitemapUrl?: string;
    maxPages?: number;
    respectRobotsTxt?: boolean;
  } = {}
): Promise<SitemapResult> {
  const { sitemapUrl, maxPages = 100, respectRobotsTxt = true } = options;

  let foundSitemapUrl: string | null = sitemapUrl || null;
  const allUrls: string[] = [];
  const errors: string[] = [];

  // Try to get sitemap from robots.txt first
  if (!foundSitemapUrl && respectRobotsTxt) {
    const robotsResult = await parseRobotsTxt(baseUrl);
    if (robotsResult.sitemapUrls.length > 0) {
      foundSitemapUrl = robotsResult.sitemapUrls[0];
    }
  }

  // Try provided sitemap URL or discovered from robots.txt
  if (foundSitemapUrl) {
    const sitemapResult = await fetchSitemap(foundSitemapUrl);
    if (sitemapResult.success) {
      allUrls.push(...sitemapResult.urls);
      errors.push(...sitemapResult.errors);
    } else {
      errors.push(...sitemapResult.errors);
    }
  }

  // If no sitemap found or empty, try common locations
  if (allUrls.length === 0 && !foundSitemapUrl) {
    for (const location of SITEMAP_LOCATIONS) {
      const tryUrl = new URL(location, baseUrl).href;
      const result = await fetchSitemap(tryUrl);
      if (result.success && result.urls.length > 0) {
        foundSitemapUrl = tryUrl;
        allUrls.push(...result.urls);
        break;
      }
    }
  }

  // If still no URLs found, at least include the homepage
  if (allUrls.length === 0) {
    allUrls.push(baseUrl);
    errors.push('No sitemap found. Only auditing homepage.');
  }

  // Limit to maxPages
  const limitedUrls = allUrls.slice(0, maxPages);

  return {
    success: allUrls.length > 0,
    sitemapUrl: foundSitemapUrl,
    urls: limitedUrls,
    errors,
  };
}

// ============================================================
// Page Fetcher
// ============================================================

export async function fetchPage(url: string): Promise<PageFetchResult> {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': AUDIT_USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(PAGE_FETCH_TIMEOUT_MS),
    });

    const fetchTimeMs = Date.now() - startTime;
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      return {
        success: false,
        url,
        html: null,
        statusCode: response.status,
        contentType,
        error: `HTTP ${response.status}`,
        fetchTimeMs,
        redirectedTo: response.url !== url ? response.url : null,
      };
    }

    // Only process HTML content
    if (!contentType?.includes('text/html')) {
      return {
        success: false,
        url,
        html: null,
        statusCode: response.status,
        contentType,
        error: `Not an HTML page: ${contentType}`,
        fetchTimeMs,
        redirectedTo: null,
      };
    }

    const html = await response.text();

    return {
      success: true,
      url,
      html,
      statusCode: response.status,
      contentType,
      error: null,
      fetchTimeMs,
      redirectedTo: response.url !== url ? response.url : null,
    };
  } catch (error) {
    const fetchTimeMs = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      url,
      html: null,
      statusCode: 0,
      contentType: null,
      error: errorMessage,
      fetchTimeMs,
      redirectedTo: null,
    };
  }
}

// ============================================================
// HTML Parser / Data Extractor
// ============================================================

function extractMetaContent(html: string, name: string): string | null {
  // Try name attribute
  const nameRegex = new RegExp(
    `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["']`,
    'i'
  );
  const nameMatch = html.match(nameRegex);
  if (nameMatch) return nameMatch[1];

  // Try content first, then name
  const reverseRegex = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["']`,
    'i'
  );
  const reverseMatch = html.match(reverseRegex);
  if (reverseMatch) return reverseMatch[1];

  return null;
}

function extractOgContent(html: string, property: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`,
    'i'
  );
  const match = html.match(regex);
  if (match) return match[1];

  // Try content first
  const reverseRegex = new RegExp(
    `<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`,
    'i'
  );
  const reverseMatch = html.match(reverseRegex);
  if (reverseMatch) return reverseMatch[1];

  return null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractHeadings(html: string, level: string): string[] {
  const regex = new RegExp(`<${level}[^>]*>([^<]+)<\/${level}>`, 'gi');
  const matches = html.matchAll(regex);
  return Array.from(matches, (m) => m[1].trim());
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (match) return match[1];

  const reverseMatch = html.match(/<link[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  return reverseMatch ? reverseMatch[1] : null;
}

function extractStructuredData(html: string): StructuredDataItem[] {
  const items: StructuredDataItem[] = [];
  const scriptRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = html.matchAll(scriptRegex);

  for (const match of matches) {
    try {
      const data = JSON.parse(match[1]);
      const type = data['@type'] || 'Unknown';
      items.push({ type, data });
    } catch {
      // Invalid JSON, skip
    }
  }

  return items;
}

function extractImages(html: string): ImageInfo[] {
  const images: ImageInfo[] = [];
  const imgRegex = /<img[^>]*>/gi;
  const matches = html.matchAll(imgRegex);

  for (const match of matches) {
    const tag = match[0];
    const src = tag.match(/src=["']([^"']+)["']/i)?.[1] || '';
    const alt = tag.match(/alt=["']([^"']+)["']/i)?.[1] || null;
    const width = parseInt(tag.match(/width=["']?(\d+)/i)?.[1] || '0', 10) || null;
    const height = parseInt(tag.match(/height=["']?(\d+)/i)?.[1] || '0', 10) || null;
    const loading = tag.match(/loading=["']([^"']+)["']/i)?.[1] || null;

    if (src) {
      images.push({ src, alt, width, height, loading });
    }
  }

  return images;
}

function extractLinks(html: string, baseUrl: string): LinkInfo[] {
  const links: LinkInfo[] = [];
  const aRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const matches = html.matchAll(aRegex);
  const baseDomain = new URL(baseUrl).hostname;

  for (const match of matches) {
    const href = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim(); // Strip HTML tags from text
    const tag = match[0];

    // Skip javascript: and mailto: links
    if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }

    let isInternal = false;
    try {
      const linkUrl = new URL(href, baseUrl);
      isInternal = linkUrl.hostname === baseDomain || linkUrl.hostname.endsWith(`.${baseDomain}`);
    } catch {
      // Relative URL, treat as internal
      isInternal = true;
    }

    const isNofollow = tag.toLowerCase().includes('nofollow');

    links.push({
      href,
      text: text.substring(0, 100), // Limit text length
      isInternal,
      isNofollow,
    });
  }

  return links;
}

function extractTextContent(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Extract content from HTML and convert to Markdown format
 * Preserves headings, paragraphs, lists, links, and basic formatting
 */
function extractMarkdownContent(html: string): string {
  // Get the main content area (try common selectors)
  let contentHtml = html;

  // Try to extract main content from article, main, or content containers
  const mainContentMatch =
    html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
    html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<div[^>]*id="content"[^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
    html.match(/<div[^>]*class="[^"]*entry[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

  if (mainContentMatch) {
    contentHtml = mainContentMatch[1];
  } else {
    // Fallback: try to get body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      contentHtml = bodyMatch[1];
    }
  }

  // Remove unwanted elements
  contentHtml = contentHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  contentHtml = contentHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  contentHtml = contentHtml.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  contentHtml = contentHtml.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  contentHtml = contentHtml.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  contentHtml = contentHtml.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '');
  contentHtml = contentHtml.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '');
  contentHtml = contentHtml.replace(/<!--[\s\S]*?-->/g, '');

  const parts: string[] = [];

  // Convert headings
  const h1Matches = contentHtml.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  for (const match of h1Matches) {
    const text = stripTags(match[1]).trim();
    if (text) {
      contentHtml = contentHtml.replace(match[0], `\n\n# ${text}\n\n`);
    }
  }

  const h2Matches = contentHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi);
  for (const match of h2Matches) {
    const text = stripTags(match[1]).trim();
    if (text) {
      contentHtml = contentHtml.replace(match[0], `\n\n## ${text}\n\n`);
    }
  }

  const h3Matches = contentHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi);
  for (const match of h3Matches) {
    const text = stripTags(match[1]).trim();
    if (text) {
      contentHtml = contentHtml.replace(match[0], `\n\n### ${text}\n\n`);
    }
  }

  const h4Matches = contentHtml.matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi);
  for (const match of h4Matches) {
    const text = stripTags(match[1]).trim();
    if (text) {
      contentHtml = contentHtml.replace(match[0], `\n\n#### ${text}\n\n`);
    }
  }

  // Convert unordered lists
  contentHtml = contentHtml.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, list) => {
    const items = list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    const listItems: string[] = [];
    for (const item of items) {
      const text = stripTags(item[1]).trim();
      if (text) {
        listItems.push(`- ${text}`);
      }
    }
    return '\n\n' + listItems.join('\n') + '\n\n';
  });

  // Convert ordered lists
  contentHtml = contentHtml.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, list) => {
    const items = list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    const listItems: string[] = [];
    let index = 1;
    for (const item of items) {
      const text = stripTags(item[1]).trim();
      if (text) {
        listItems.push(`${index}. ${text}`);
        index++;
      }
    }
    return '\n\n' + listItems.join('\n') + '\n\n';
  });

  // Convert bold text
  contentHtml = contentHtml.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, '**$2**');

  // Convert italic text
  contentHtml = contentHtml.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, '*$2*');

  // Convert links
  contentHtml = contentHtml.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const linkText = stripTags(text).trim();
      if (linkText && href && !href.startsWith('javascript:')) {
        return `[${linkText}](${href})`;
      }
      return linkText;
    }
  );

  // Convert blockquotes
  contentHtml = contentHtml.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, quote) => {
    const text = stripTags(quote).trim();
    const lines = text.split('\n').map(line => `> ${line.trim()}`);
    return '\n\n' + lines.join('\n') + '\n\n';
  });

  // Convert paragraphs
  contentHtml = contentHtml.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, content) => {
    const text = stripTags(content).trim();
    if (text) {
      return '\n\n' + text + '\n\n';
    }
    return '';
  });

  // Convert line breaks
  contentHtml = contentHtml.replace(/<br\s*\/?>/gi, '\n');

  // Convert divs to paragraphs (for content that uses divs instead of p tags)
  contentHtml = contentHtml.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, content) => {
    // Only add paragraph breaks if the content is significant
    const text = stripTags(content).trim();
    if (text && text.length > 20) {
      return '\n\n' + text + '\n\n';
    }
    return text ? text + ' ' : '';
  });

  // Remove remaining HTML tags
  contentHtml = stripTags(contentHtml);

  // Clean up whitespace
  contentHtml = contentHtml
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
    .replace(/[ \t]+/g, ' ') // Multiple spaces to single
    .replace(/\n +/g, '\n') // Leading spaces on lines
    .replace(/ +\n/g, '\n') // Trailing spaces on lines
    .trim();

  return contentHtml;
}

/**
 * Strip HTML tags from a string
 */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}

function extractLanguage(html: string): string | null {
  const htmlLang = html.match(/<html[^>]*lang=["']([^"']+)["']/i);
  if (htmlLang) return htmlLang[1];

  const metaLang = extractMetaContent(html, 'language');
  return metaLang;
}

export function extractPageData(url: string, html: string): ExtractedPageData {
  const path = new URL(url).pathname;
  const textContent = extractTextContent(html);
  const markdownContent = extractMarkdownContent(html);

  const metadata: PageMetadata = {
    title: extractTitle(html),
    description: extractMetaContent(html, 'description'),
    h1: extractHeadings(html, 'h1')[0] || null,
    h2s: extractHeadings(html, 'h2'),
    canonicalUrl: extractCanonical(html),
    ogImage: extractOgContent(html, 'og:image'),
    ogTitle: extractOgContent(html, 'og:title'),
    ogDescription: extractOgContent(html, 'og:description'),
    robots: extractMetaContent(html, 'robots'),
    viewport: extractMetaContent(html, 'viewport'),
    charset: html.match(/charset=["']?([^"'\s>]+)/i)?.[1] || null,
    language: extractLanguage(html),
    structuredData: extractStructuredData(html),
    wordCount: countWords(textContent),
    images: extractImages(html),
    links: extractLinks(html, url),
  };

  return {
    url,
    path,
    metadata,
    rawHtml: html,
    textContent,
    markdownContent,
  };
}

