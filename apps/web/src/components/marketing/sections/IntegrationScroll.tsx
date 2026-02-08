'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { cn } from '@workspace/common/lib';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { Marquee } from '@workspace/ui/components/fragments/marquee';

interface IntegrationItem {
  name: string;
  icon: string;
  invertDark?: boolean;
}

const ROW_1: IntegrationItem[] = [
  { name: 'Google', icon: '/icons/google.svg' },
  { name: 'OpenAI', icon: '/icons/openai.svg', invertDark: true },
  { name: 'OpenClaw', icon: '/icons/openclaw.svg' },
  { name: 'Slack', icon: '/icons/slack.svg' },
  { name: 'WordPress', icon: '/icons/wordpress.svg', invertDark: true },
  { name: 'Shopify', icon: '/icons/shopify_glyph_black.svg', invertDark: true },
  { name: 'Notion', icon: '/icons/notion.svg', invertDark: true },
  { name: 'GitHub', icon: '/icons/github.svg', invertDark: true },
  { name: 'Zapier', icon: '/icons/zapier.svg' },
  { name: 'Linear', icon: '/icons/linear.svg', invertDark: true },
  { name: 'Perplexity', icon: '/icons/perplexity.svg', invertDark: true },
  { name: 'Webflow', icon: '/icons/webflow.svg', invertDark: true },
  { name: 'Discord', icon: '/icons/discord.svg' },
  { name: 'Amplitude', icon: '/icons/amplitude.svg', invertDark: true },
  { name: 'PostHog', icon: '/icons/posthog.svg' },
];

const ROW_2: IntegrationItem[] = [
  { name: 'Anthropic', icon: '/icons/anthropic.svg', invertDark: true },
  { name: 'Microsoft', icon: '/icons/microsoft.svg' },
  { name: 'Reddit', icon: '/icons/reddit.svg' },
  { name: 'YouTube', icon: '/icons/youtube.svg' },
  { name: 'DeepSeek', icon: '/icons/deepseek.svg' },
  { name: 'Make', icon: '/icons/make.svg' },
  { name: 'Dropbox', icon: '/icons/dropbox.svg' },
  { name: 'n8n', icon: '/icons/n8n.svg', invertDark: true },
  { name: 'LinkedIn', icon: '/icons/linkedin.svg' },
  { name: 'SEMrush', icon: '/icons/semrush.svg' },
  { name: 'Ghost', icon: '/icons/ghost.svg', invertDark: true },
  { name: 'TikTok', icon: '/icons/tiktok.svg', invertDark: true },
  { name: 'Adobe', icon: '/icons/adobe.svg' },
  { name: 'Mixpanel', icon: '/icons/mixpanel.svg' },
];

function IntegrationCard({ item }: { item: IntegrationItem }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background px-5 py-3 shadow-sm transition-shadow hover:shadow-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Image
          src={item.icon}
          alt={item.name}
          width={24}
          height={24}
          className={cn('size-5 object-contain', item.invertDark && 'dark:invert')}
        />
      </div>
      <span className="whitespace-nowrap text-sm font-medium">{item.name}</span>
    </div>
  );
}

export function IntegrationScroll(): React.JSX.Element {
  return (
    <GridSection>
      <div className="overflow-hidden py-16 md:py-20">
        <div className="container mb-12 flex flex-col items-center text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Integrations
          </p>
          <h2 className="text-3xl font-semibold md:text-5xl">
            Works with your entire stack
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Connect SearchFIT to <strong className="font-semibold text-primary">40+ tools and platforms</strong> you
            already use &mdash; from AI engines and analytics to CMS, social, and
            automation. New integrations added every month.
          </p>
        </div>

        <div className="relative">
          {/* Row 1 - scrolls right */}
          <Marquee
            className="mb-4 [--duration:60s] [--gap:1rem]"
            pauseOnHover
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            {ROW_1.map((item) => (
              <IntegrationCard key={item.name} item={item} />
            ))}
          </Marquee>

          {/* Row 2 - scrolls left (reverse) */}
          <Marquee
            reverse
            className="[--duration:60s] [--gap:1rem]"
            pauseOnHover
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            {ROW_2.map((item) => (
              <IntegrationCard key={item.name} item={item} />
            ))}
          </Marquee>
        </div>

        <div className="container mt-10 flex justify-center">
          <Link
            href="/integrations"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all integrations
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </GridSection>
  );
}
