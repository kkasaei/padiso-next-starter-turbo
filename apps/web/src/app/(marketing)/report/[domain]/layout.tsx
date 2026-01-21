import { type Metadata } from 'next';
import { prisma } from '@/lib/db';
import { calculateAverageScore, formatDomain } from '@/lib/report-utils';
import { APP_NAME } from '@/lib/common/app';
import { baseURL } from '@/routes';
import type { AEOReport } from '@/schemas/aeo-report';

interface ReportLayoutProps {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}

/**
 * Generate dynamic metadata for report pages
 * This ensures proper Open Graph tags for social sharing
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ domain: string }>;
}): Promise<Metadata> {
  const { domain } = await params;
  const formattedDomain = formatDomain(domain);

  // Fetch report data to get the score and OG image
  let averageScore: number | null = null;
  let reportExists = false;
  let ogImageUrl: string | null = null;
  let providerScores: { chatgpt?: number; perplexity?: number; gemini?: number } = {};

  try {
    const report = await prisma.publicReport.findUnique({
      where: { domain },
      select: {
        data: true,
        ogImageUrl: true,
        createdAt: true
      }
    });

    if (report && report.data) {
      const reportData = report.data as AEOReport;
      averageScore = calculateAverageScore(reportData.llmProviders);
      reportExists = true;
      ogImageUrl = report.ogImageUrl;

      // Extract individual provider scores
      providerScores = {
        chatgpt: reportData.llmProviders.find(p =>
          p.name?.toLowerCase().includes('chatgpt') ||
          p.name?.toLowerCase().includes('openai')
        )?.score,
        perplexity: reportData.llmProviders.find(p =>
          p.name?.toLowerCase().includes('perplexity')
        )?.score,
        gemini: reportData.llmProviders.find(p =>
          p.name?.toLowerCase().includes('gemini')
        )?.score
      };
    }
  } catch (error) {
    console.error('Error fetching report for metadata:', error);
  }

  // Build metadata
  const title = reportExists
    ? `${formattedDomain} - AEO Performance Report (Score: ${averageScore}/100) | ${APP_NAME}`
    : `${formattedDomain} - AEO Performance Report | ${APP_NAME}`;

  const description = reportExists
    ? `${formattedDomain} scored ${averageScore}/100 in AI Answer Engine Optimization. See how this site performs across ChatGPT, Perplexity, and other AI search engines. Get your free AEO report now!`
    : `Comprehensive AI Answer Engine Optimization (AEO) report for ${formattedDomain}. Analyze performance across ChatGPT, Perplexity, Claude, and Gemini. Get actionable insights to improve your visibility in AI-powered search.`;

  const reportUrl = `${baseURL}/report/${domain}`;

  // Use CDN OG image if available, otherwise fall back to dynamic API route
  const finalOgImageUrl = ogImageUrl // Use CDN URL if available
    ? ogImageUrl
    : reportExists && averageScore !== null
    ? (() => {
        const params = new URLSearchParams({
          domain: formattedDomain,
          score: averageScore.toString()
        });

        // Add provider scores if available
        if (providerScores.chatgpt) params.set('chatgpt', providerScores.chatgpt.toString());
        if (providerScores.perplexity) params.set('perplexity', providerScores.perplexity.toString());
        if (providerScores.gemini) params.set('gemini', providerScores.gemini.toString());

        return `${baseURL}/api/og/report?${params.toString()}`;
      })()
    : `${baseURL}/og-image`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: reportUrl,
      siteName: APP_NAME,
      title,
      description,
      images: [
        {
          url: finalOgImageUrl,
          width: 1200,
          height: 630,
          alt: `${formattedDomain} AEO Performance Report - Score: ${averageScore}/100`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [finalOgImageUrl]
    },
    alternates: {
      canonical: reportUrl
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function ReportLayout({ children }: ReportLayoutProps) {
  return <>{children}</>;
}

