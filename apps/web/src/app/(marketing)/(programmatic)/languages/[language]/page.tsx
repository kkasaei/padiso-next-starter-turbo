import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ComingSoon } from '@/components/marketing/ComingSoon';

const languages: Record<string, { title: string; nativeName: string; description: string }> = {
  german: {
    title: 'German Content Generator',
    nativeName: 'Deutsch',
    description: 'Generate SEO-optimized content in German.',
  },
  french: {
    title: 'French Content Generator',
    nativeName: 'Français',
    description: 'Generate SEO-optimized content in French.',
  },
  spanish: {
    title: 'Spanish Content Generator',
    nativeName: 'Español',
    description: 'Generate SEO-optimized content in Spanish.',
  },
  italian: {
    title: 'Italian Content Generator',
    nativeName: 'Italiano',
    description: 'Generate SEO-optimized content in Italian.',
  },
  portuguese: {
    title: 'Portuguese Content Generator',
    nativeName: 'Português',
    description: 'Generate SEO-optimized content in Portuguese.',
  },
  japanese: {
    title: 'Japanese Content Generator',
    nativeName: '日本語',
    description: 'Generate SEO-optimized content in Japanese.',
  },
  korean: {
    title: 'Korean Content Generator',
    nativeName: '한국어',
    description: 'Generate SEO-optimized content in Korean.',
  },
  chinese: {
    title: 'Chinese Content Generator',
    nativeName: '中文',
    description: 'Generate SEO-optimized content in Chinese.',
  },
  arabic: {
    title: 'Arabic Content Generator',
    nativeName: 'العربية',
    description: 'Generate SEO-optimized content in Arabic.',
  },
  dutch: {
    title: 'Dutch Content Generator',
    nativeName: 'Nederlands',
    description: 'Generate SEO-optimized content in Dutch.',
  },
};

interface PageProps {
  params: Promise<{ language: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { language } = await params;
  const data = languages[language];

  if (!data) {
    return { title: 'Language Not Found | SearchFIT' };
  }

  return {
    title: `${data.title} | SearchFIT`,
    description: `${data.description} Create AI-powered content that ranks in ${data.nativeName} search results.`,
  };
}

export function generateStaticParams() {
  return Object.keys(languages).map((language) => ({ language }));
}

export default async function LanguagePage({ params }: PageProps) {
  const { language } = await params;
  const data = languages[language];

  if (!data) {
    notFound();
  }

  return <ComingSoon title={data.title} description={data.description} />;
}
