import { type Metadata } from 'next';
import { APP_NAME } from '@workspace/common/constants';
import { baseURL } from '@workspace/common';

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
  const formattedDomain = decodeURIComponent(domain);

  // TODO: Replace with actual data fetching when database is set up
  // This should fetch from publicReport table to get:
  // - report data (llmProviders scores)
  // - ogImageUrl (CDN URL for social sharing)
  // - createdAt timestamp
  // 
  // Example implementation:
  // const report = await db.publicReport.findUnique({ where: { domain } });
  // const averageScore = report ? calculateAverageScore(report.data.llmProviders) : null;
  // const ogImageUrl = report?.ogImageUrl ?? null;

  const reportUrl = `${baseURL}/report/${domain}`;
  const title = `${formattedDomain} - AEO Performance Report | ${APP_NAME}`;
  const description = `Comprehensive AI Answer Engine Optimization (AEO) report for ${formattedDomain}. Analyze performance across ChatGPT, Perplexity, Claude, and Gemini. Get actionable insights to improve your visibility in AI-powered search.`;
  const ogImageUrl = `${baseURL}/og-image`;

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
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${formattedDomain} AEO Performance Report`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl]
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
