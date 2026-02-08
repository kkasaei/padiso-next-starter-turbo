import { APP_NAME, APP_DESCRIPTION, APP_TAGLINE } from '@workspace/common/constants';
import { baseURL } from '@workspace/common';

// ─── Helper ────────────────────────────────────────────────────────
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Organization ──────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: baseURL,
    logo: `${baseURL}/logo.png`,
    description: APP_DESCRIPTION,
    sameAs: [
      'https://x.com/searchfitai',
      'https://www.linkedin.com/company/searchfitai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hi@searchfit.ai',
      contactType: 'customer service',
    },
  };
  return <JsonLdScript data={data} />;
}

// ─── WebSite + SearchAction ────────────────────────────────────────
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: baseURL,
    description: `${APP_NAME} - ${APP_TAGLINE}`,
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      url: baseURL,
    },
  };
  return <JsonLdScript data={data} />;
}

// ─── SoftwareApplication (Pricing / Product page) ──────────────────
export function SoftwareApplicationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: APP_DESCRIPTION,
    url: baseURL,
    offers: [
      {
        '@type': 'Offer',
        name: 'Growth Engine',
        price: '99',
        priceCurrency: 'USD',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        url: `${baseURL}/pricing`,
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1',
    },
  };
  return <JsonLdScript data={data} />;
}

// ─── FAQPage ───────────────────────────────────────────────────────
interface FaqItem {
  question: string;
  answer: string;
}

export function FAQPageJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return <JsonLdScript data={data} />;
}

// ─── Article (Blog Post) ──────────────────────────────────────────
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  authorAvatar?: string;
  category?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  authorAvatar,
  category,
}: ArticleJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUrl && { url: authorUrl }),
      ...(authorAvatar && {
        image: {
          '@type': 'ImageObject',
          url: authorAvatar,
        },
      }),
    },
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      url: baseURL,
      logo: {
        '@type': 'ImageObject',
        url: `${baseURL}/logo.png`,
      },
    },
    ...(category && { articleSection: category }),
  };
  return <JsonLdScript data={data} />;
}

// ─── BreadcrumbList ────────────────────────────────────────────────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLdScript data={data} />;
}

// ─── Blog Listing (CollectionPage) ─────────────────────────────────
export function BlogListingJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${APP_NAME} Blog`,
    description: `The latest insights on AI SEO, ecommerce optimization, and answer engine optimization from ${APP_NAME}.`,
    url: `${baseURL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      url: baseURL,
    },
  };
  return <JsonLdScript data={data} />;
}
