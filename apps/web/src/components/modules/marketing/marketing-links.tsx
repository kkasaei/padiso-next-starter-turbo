import * as React from 'react';
import {
  BookIcon,
  BookOpenIcon,
  CircuitBoardIcon,
  CodeIcon,
  CuboidIcon,
  FileBarChartIcon,
  LayoutIcon,
  SendHorizonalIcon,
  TrendingUpIcon,
  PenToolIcon,
  PlugIcon,
  Bot
} from 'lucide-react';

import { baseURL } from '@/routes';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon
} from '@workspace/ui/components/brand-icons';

export const MENU_LINKS = [
  {
    title: 'Product',
    items: [
      {
        title: 'AEO Tracking',
        description: 'Optimize your website for Answer Engines like ChatGPT, Perplexity, and Gemini',
        icon: <TrendingUpIcon className="size-5 shrink-0" />,
        href: '#',
        external: false
      },
      {
        title: 'AI Content',
        description: 'Generate SEO-optimized content with AI assistance',
        icon: <PenToolIcon className="size-5 shrink-0" />,
        href: '#',
        external: false
      },
      {
        title: 'Technical Audit',
        description: 'Comprehensive SEO analysis and optimization recommendations',
        icon: <FileBarChartIcon className="size-5 shrink-0" />,
        href: '#',
        external: false
      },
      {
        title: 'Insight Engine',
        description: 'AI-powered analytics and insights for your SEO performance',
        icon: <CircuitBoardIcon className="size-5 shrink-0" />,
        href: '#',
        external: false
      },
      {
        title: 'Visual Workflow',
        description: 'Automate your entire SEO and Content workflow',
        icon: <Bot className="size-5 shrink-0" />,
        href: '#',
        external: false
      },
      {
        title: 'Integrations',
        description: 'Connect with analytics, CMS, and marketing tools',
        icon: <PlugIcon className="size-5 shrink-0" />,
        href: '#',
        external: false
      }
    ]
  },
  {
    title: 'Resources',
    items: [
      {
        title: 'Contact',
        description: 'Reach out for assistance',
        icon: <SendHorizonalIcon className="size-5 shrink-0" />,
        href: '/contact',
        external: false
      },
      {
        title: 'Roadmap',
        description: 'See what is coming next',
        icon: <LayoutIcon className="size-5 shrink-0" />,
        href: 'https://canny.io/product/searchfit/roadmap',
        external: true
      },
      {
        title: 'Docs',
        description: 'Learn how to use our platform',
        icon: <BookOpenIcon className="size-5 shrink-0" />,
        href: '/docs',
        external: false
      },
      {
        title: 'API Reference',
        description: 'Build integrations with our API',
        icon: <CodeIcon className="size-5 shrink-0" />,
        href: baseURL,
        external: true
      }
    ]
  },
  {
    title: 'Pricing',
    href: '/pricing',
    external: false
  },
  {
    title: 'Blog',
    href: '/blog',
    external: false
  },
  {
    title: 'Story',
    href: '/story',
    external: false
  }
];

export const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { name: 'AEO Tracking', href: '#', external: false },
      { name: 'AI Content', href: '#', external: false },
      { name: 'Technical Audit', href: '#', external: false },
      { name: 'Insight Engine', href: '#', external: false },
      { name: 'Visual Workflow', href: '#', external: false },
      { name: 'Integrations', href: '#', external: false },
      { name: 'Analytics', href: '#', external: false }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Contact', href: '/contact', external: false },
      { name: 'Roadmap', href: 'https://canny.io/product/searchfit/roadmap', external: true },
      { name: 'Docs', href: '/docs', external: false },
      { name: 'API Reference', href: baseURL, external: true }
    ]
  },
  {
    title: 'About',
    links: [
      { name: 'Story', href: '/story', external: false },
      { name: 'Blog', href: '/blog', external: false }
    ]
  },
  {
    title: 'Legal',
    links: [
      {
        name: 'Terms of Use',
        href: '/terms-of-use',
        external: false
      },
      {
        name: 'Privacy Policy',
        href: '/privacy-policy',
        external: false
      },
      {
        name: 'Cookie Policy',
        href: '/cookie-policy',
        external: false
      }
    ]
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'X (formerly Twitter)',
    href: '~/',
    icon: <XIcon className="size-4 shrink-0" />
  },
  {
    name: 'LinkedIn',
    href: '~/',
    icon: <LinkedInIcon className="size-4 shrink-0" />
  },
  {
    name: 'Facebook',
    href: '~/',
    icon: <FacebookIcon className="size-4 shrink-0" />
  },
  {
    name: 'Instagram',
    href: '~/',
    icon: <InstagramIcon className="size-4 shrink-0" />
  },
  {
    name: 'TikTok',
    href: '~/',
    icon: <TikTokIcon className="size-4 shrink-0" />
  }
];

export const DOCS_LINKS = [
  {
    title: 'Getting Started',
    icon: <CuboidIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        items: []
      },
      {
        title: 'Dependencies',
        href: '/docs/dependencies',
        items: []
      }
    ]
  },
  {
    title: 'Guides',
    icon: <BookIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Using MDX',
        href: '/docs/using-mdx',
        items: []
      }
    ]
  }
];
