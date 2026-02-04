import { allDocs } from 'content-collections';
import fs from 'fs';
import path from 'path';

type SitemapEntry = {
  url: string;
  lastModified: Date | string;
  changeFreq?: string;
  priority?: number;
};

export default async function Sitemap(): Promise<SitemapEntry[]> {
  // Access directly to avoid triggering full env validation during build
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

  // ============================================================
  // WORKAROUND: Manually scan blog directory
  // content-collections has a bug where it only processes 12 posts
  // So we manually scan the filesystem to get all blog posts
  // ============================================================
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.mdx'));

  // ============================================================
  // STATIC MARKETING PAGES
  // Manually defined to ensure all pages are included in sitemap
  // ============================================================
  const staticPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      priority: 1.0,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      priority: 0.9,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      priority: 0.8,
      changeFreq: 'monthly'
    },
    {
      url: `${baseUrl}/story`,
      lastModified: new Date(),
      priority: 0.7,
      changeFreq: 'monthly'
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      priority: 0.8,
      changeFreq: 'daily'
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      priority: 0.8,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/report`,
      lastModified: new Date(),
      priority: 0.7,
      changeFreq: 'weekly'
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      priority: 0.3,
      changeFreq: 'yearly'
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      priority: 0.3,
      changeFreq: 'yearly'
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      priority: 0.3,
      changeFreq: 'yearly'
    }
  ];

  // ============================================================
  // DYNAMIC CONTENT PAGES
  // Blog posts: Manually scanned from filesystem (workaround for content-collections bug)
  // Docs: From content-collections
  // ============================================================
  const blogPosts: SitemapEntry[] = blogFiles.map((file) => {
    const slug = file.replace('.mdx', '');
    return {
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      priority: 0.6,
      changeFreq: 'monthly'
    };
  });

  const sitemap: SitemapEntry[] = [
    ...staticPages,
    ...allDocs.map((doc) => ({
      url: `${baseUrl}${doc.slug}`,
      lastModified: new Date(),
      priority: 0.8,
      changeFreq: 'weekly'
    })),
    ...blogPosts
  ];

  // Sort alphabetically by URL for consistency
  return sitemap.sort((a, b) => a.url.localeCompare(b.url));
}
