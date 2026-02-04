import * as React from 'react';
import {
  BookIcon,
  BookOpenIcon,
  CodeIcon,
  CuboidIcon,
  FileBarChartIcon,
  LayoutIcon,
  SendHorizonalIcon,
  TrendingUpIcon,
  PenToolIcon,
  PlugIcon,
  BarChart3Icon,
  Link2Icon,
  SearchIcon,
  MessageCircleIcon
} from 'lucide-react';

import { baseURL } from '@workspace/common';
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
        title: 'AI Tracking',
        description: 'Track your visibility across ChatGPT, Perplexity, Claude, and Gemini',
        icon: <TrendingUpIcon className="size-5 shrink-0" />,
        href: '/ai-tracking',
        external: false
      },
      {
        title: 'Content',
        description: 'Generate SEO-optimized content with AI assistance',
        icon: <PenToolIcon className="size-5 shrink-0" />,
        href: '/content',
        external: false
      },
      {
        title: 'Analytics',
        description: 'AI-powered insights and performance metrics',
        icon: <BarChart3Icon className="size-5 shrink-0" />,
        href: '/analytics',
        external: false
      },
      {
        title: 'Backlinks',
        description: 'Monitor and analyze your backlink profile',
        icon: <Link2Icon className="size-5 shrink-0" />,
        href: '/backlinks',
        external: false
      },
      {
        title: 'Technical Audit',
        description: 'Comprehensive SEO analysis and optimization recommendations',
        icon: <SearchIcon className="size-5 shrink-0" />,
        href: '/technical-audit',
        external: false
      },
      {
        title: 'Social Listening',
        description: 'Monitor brand mentions across social platforms',
        icon: <MessageCircleIcon className="size-5 shrink-0" />,
        href: '/social-listening',
        external: false
      },
      {
        title: 'Integrations',
        description: 'Connect with 40+ analytics, CMS, and marketing tools',
        icon: <PlugIcon className="size-5 shrink-0" />,
        href: '/integrations',
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
      { name: 'AI Tracking', href: '/ai-tracking', external: false },
      { name: 'Content', href: '/content', external: false },
      { name: 'Analytics', href: '/analytics', external: false },
      { name: 'Backlinks', href: '/backlinks', external: false },
      { name: 'Technical Audit', href: '/technical-audit', external: false },
      { name: 'Social Listening', href: '/social-listening', external: false },
      { name: 'Integrations', href: '/integrations', external: false }
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
