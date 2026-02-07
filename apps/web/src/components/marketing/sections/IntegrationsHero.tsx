'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Check,
  ArrowRight,
  Sparkles,
  Puzzle,
  Zap,
  RefreshCw,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { FlickeringGrid } from '@workspace/ui/components/fragments/FlickeringGrid';
import { BlurFade } from '@workspace/ui/components/fragments/BlurFade';
import { NumberTicker } from '@workspace/ui/components/fragments/NumberTicker';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

// Integration interface
interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  comingSoon: boolean;
}

// All integrations data
const INTEGRATIONS: Integration[] = [
  // Google Services
  { id: "google", name: "Google", description: "Search Console, Analytics, Ads, Drive, Docs", icon: "/icons/google.svg", category: "Google Services", comingSoon: false },
  
  // Search & Webmaster
  { id: "microsoft", name: "Microsoft", description: "Bing Webmaster, OneDrive, SharePoint", icon: "/icons/microsoft.svg", category: "Search & Webmaster", comingSoon: true },
  { id: "yandex", name: "Yandex", description: "Yandex Webmaster Tools", icon: "/icons/yandex.svg", category: "Search & Webmaster", comingSoon: true },
  
  // Communication
  { id: "slack", name: "Slack", description: "Real-time alerts and notifications", icon: "/icons/slack.svg", category: "Communication", comingSoon: true },
  { id: "teams", name: "Microsoft Teams", description: "Enterprise notifications", icon: "/icons/teams.svg", category: "Communication", comingSoon: true },
  
  // Project Management
  { id: "linear", name: "Linear", description: "Sync tasks and track issues", icon: "/icons/linear.svg", category: "Project Management", comingSoon: true },
  
  // Analytics
  { id: "adobe-analytics", name: "Adobe Analytics", description: "Enterprise analytics", icon: "/icons/adobe.svg", category: "Analytics", comingSoon: true },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics", icon: "/icons/mixpanel.svg", category: "Analytics", comingSoon: true },
  { id: "amplitude", name: "Amplitude", description: "User behavior analytics", icon: "/icons/amplitude.svg", category: "Analytics", comingSoon: true },
  { id: "posthog", name: "PostHog", description: "Open source product analytics", icon: "/icons/posthog.svg", category: "Analytics", comingSoon: true },
  
  // Content & CMS
  { id: "wordpress", name: "WordPress", description: "Publish and import content", icon: "/icons/wordpress.svg", category: "Content & CMS", comingSoon: false },
  { id: "webflow", name: "Webflow", description: "Publish to Webflow sites", icon: "/icons/webflow.svg", category: "Content & CMS", comingSoon: false },
  { id: "ghost", name: "Ghost", description: "Headless CMS integration", icon: "/icons/ghost.svg", category: "Content & CMS", comingSoon: true },
  { id: "notion", name: "Notion", description: "Import and sync content", icon: "/icons/notion.svg", category: "Content & CMS", comingSoon: true },
  { id: "github", name: "GitHub", description: "Markdown content from repos", icon: "/icons/github.svg", category: "Content & CMS", comingSoon: true },
  { id: "dropbox", name: "Dropbox", description: "File storage and sync", icon: "/icons/dropbox.svg", category: "Content & CMS", comingSoon: true },
  
  // Social & Communities
  { id: "x", name: "X / Twitter", description: "Monitor brand mentions", icon: "/icons/x.svg", category: "Social & Communities", comingSoon: true },
  { id: "linkedin", name: "LinkedIn", description: "Professional mentions", icon: "/icons/linkedin.svg", category: "Social & Communities", comingSoon: true },
  { id: "reddit", name: "Reddit", description: "Community monitoring", icon: "/icons/reddit.svg", category: "Social & Communities", comingSoon: true },
  { id: "youtube", name: "YouTube", description: "Video mentions and comments", icon: "/icons/youtube.svg", category: "Social & Communities", comingSoon: true },
  { id: "discord", name: "Discord", description: "Community monitoring", icon: "/icons/discord.svg", category: "Social & Communities", comingSoon: true },
  { id: "tiktok", name: "TikTok", description: "Short form video trends", icon: "/icons/tiktok.svg", category: "Social & Communities", comingSoon: true },
  
  // SEO Tools
  { id: "semrush", name: "SEMrush", description: "Competitor analysis", icon: "/icons/semrush.svg", category: "SEO Tools", comingSoon: true },
  { id: "moz", name: "Moz", description: "Domain authority and backlinks", icon: "/icons/moz.svg", category: "SEO Tools", comingSoon: true },
  
  // E-Commerce
  { id: "shopify", name: "Shopify", description: "Product SEO and store data", icon: "/icons/shopify_glyph_black.svg", category: "E-Commerce", comingSoon: false },
  { id: "bigcommerce", name: "BigCommerce", description: "E-commerce platform integration", icon: "/icons/bigcommerce.svg", category: "E-Commerce", comingSoon: true },
  
  // Advertising
  { id: "meta-ads", name: "Meta Ads", description: "Facebook/Instagram ad data", icon: "/icons/meta-ads.svg", category: "Advertising", comingSoon: true },
  
  // Automation & Developer
  { id: "searchfit-extension", name: "SearchFit Browser Extension", description: "Capture and analyze content from any webpage", icon: "/icons/searchfit.svg", category: "Automation & Developer", comingSoon: true },
  { id: "api", name: "API", description: "Generate API keys for programmatic access", icon: "/icons/api.svg", category: "Automation & Developer", comingSoon: true },
  { id: "mcp", name: "MCP", description: "Connect to Claude as a remote MCP server", icon: "/icons/mcp.svg", category: "Automation & Developer", comingSoon: true },
  { id: "webhook", name: "Webhooks", description: "Send data to custom endpoints", icon: "/icons/webhook.svg", category: "Automation & Developer", comingSoon: true },
  { id: "zapier", name: "Zapier", description: "Connect to 5000+ apps", icon: "/icons/zapier.svg", category: "Automation & Developer", comingSoon: true },
  { id: "make", name: "Make", description: "Advanced automation workflows", icon: "/icons/make.svg", category: "Automation & Developer", comingSoon: true },
  { id: "n8n", name: "n8n", description: "Open source workflow automation", icon: "/icons/n8n.svg", category: "Automation & Developer", comingSoon: true },
  
  // AI Platforms
  { id: "openai", name: "OpenAI", description: "Monitor ChatGPT mentions", icon: "/icons/openai.svg", category: "AI Platforms", comingSoon: true },
  { id: "anthropic", name: "Anthropic", description: "Monitor Claude mentions", icon: "/icons/anthropic.svg", category: "AI Platforms", comingSoon: true },
  { id: "perplexity", name: "Perplexity", description: "Monitor Perplexity citations", icon: "/icons/perplexity.svg", category: "AI Platforms", comingSoon: true },
  { id: "open-router", name: "OpenRouter", description: "Unified API for AI models", icon: "/icons/open-router.svg", category: "AI Platforms", comingSoon: true },
  { id: "vercel-ai", name: "Vercel AI Gateway", description: "AI gateway for model routing", icon: "/icons/vercel.svg", category: "AI Platforms", comingSoon: true },
  { id: "deepseek", name: "DeepSeek", description: "Monitor DeepSeek AI mentions", icon: "/icons/deepseek.svg", category: "AI Platforms", comingSoon: true },
  { id: "grok", name: "Grok", description: "Monitor xAI Grok mentions", icon: "/icons/grok.svg", category: "AI Platforms", comingSoon: true },
  { id: "aws-bedrock", name: "AWS Bedrock", description: "Amazon's AI foundation models", icon: "/icons/bedrock-color.svg", category: "AI Platforms", comingSoon: true },
];

const CATEGORIES = [
  "All",
  "Google Services",
  "Search & Webmaster",
  "Communication",
  "Project Management",
  "Analytics",
  "Content & CMS",
  "Social & Communities",
  "SEO Tools",
  "E-Commerce",
  "Advertising",
  "Automation & Developer",
  "AI Platforms",
];

// Stats data
const STATS = [
  { value: 40, suffix: '+', description: 'Integrations' },
  { value: 4, suffix: '', description: 'Available Now' },
  { value: 12, suffix: '', description: 'Categories' },
  { value: 5, suffix: 'min', description: 'Setup Time' },
];

// Featured integrations for orbital diagram
const ORBITAL_INTEGRATIONS = {
  inner: [
    { name: 'OpenAI', icon: '/icons/openai.svg', invert: true },
    { name: 'Claude', icon: '/icons/claude.svg', invert: false },
    { name: 'Perplexity', icon: '/icons/perplexity.svg', invert: true },
    { name: 'Gemini', icon: '/icons/gemini.svg', invert: false },
  ],
  outer: [
    { name: 'Google', icon: '/icons/google.svg', invert: false },
    { name: 'Zapier', icon: '/icons/zapier.svg', invert: false },
    { name: 'Notion', icon: '/icons/notion.svg', invert: true },
    { name: 'Slack', icon: '/icons/slack.svg', invert: false },
    { name: 'Linear', icon: '/icons/linear.svg', invert: true },
    { name: 'WordPress', icon: '/icons/wordpress.svg', invert: true },
    { name: 'Shopify', icon: '/icons/shopify_glyph_black.svg', invert: true },
    { name: 'n8n', icon: '/icons/n8n.svg', invert: true },
  ],
};

// Features
const FEATURES = [
  {
    icon: Zap,
    title: 'One-Click Setup',
    description: 'Connect your tools in minutes with OAuth or API keys. No complex configuration needed.',
  },
  {
    icon: RefreshCw,
    title: 'Real-time Sync',
    description: 'Data flows automatically between platforms. Always up-to-date, always in sync.',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Enterprise-grade security with encrypted connections and granular permissions.',
  },
  {
    icon: Layers,
    title: 'Flexible Workflows',
    description: 'Build custom automation with webhooks, API, or connect via Zapier and Make.',
  },
];

// Dashed grid lines component
function DashedGridLines() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line x1="0.5" y1="0" x2="0.5" y2="100%" strokeLinecap="round" strokeDasharray="5 5" stroke="var(--border)" />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line x1="0.5" y1="0" x2="0.5" y2="100%" strokeLinecap="round" strokeDasharray="5 5" stroke="var(--border)" />
      </svg>
    </motion.div>
  );
}

// Hero Section with Orbital Diagram
function HeroSection() {
  const availableCount = INTEGRATIONS.filter(i => !i.comingSoon).length;
  const totalCount = INTEGRATIONS.length;

  return (
    <GridSection className="relative overflow-hidden">
      <DashedGridLines />
      <div className="container py-20 md:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          {/* Badge */}
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: -20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="#directory">
              <Badge
                variant="outline"
                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-xs hover:bg-accent/50"
              >
                <Puzzle className="size-4 text-primary" />
                <span>Integrations</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">{totalCount}+ tools, {availableCount} available now</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </Badge>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-balance text-center text-[32px] font-bold leading-[42px] tracking-[-0.6px] sm:text-[44px] sm:leading-[54px] md:text-[56px] md:leading-[66px] lg:text-[68px] lg:leading-[78px]">
              Connect everything to
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                your SEO command center
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="max-w-2xl text-balance text-center text-lg text-muted-foreground md:text-xl"
          >
            Integrate SearchFIT with your <strong className="font-semibold text-foreground">favorite tools and AI platforms</strong>. 
            Automate workflows, sync data, and supercharge your SEO.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
              <Link href="/pricing">
                <Sparkles className="mr-2 size-4" />
                Start 7-Day Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="#directory">
                Browse Integrations
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </GridSection>
  );
}

// Stats Section
function StatsSection() {
  return (
    <GridSection>
      <div className="grid grid-cols-2 divide-x divide-y border-y lg:grid-cols-4 lg:divide-y-0">
        {STATS.map((stat, index) => (
          <BlurFade
            key={index}
            inView
            delay={0.1 + index * 0.1}
            className={cn(
              'flex flex-col items-center justify-center p-6 text-center lg:p-8',
              (index === 2 || index === 3) && 'border-t lg:border-t-0'
            )}
          >
            <p className="whitespace-nowrap text-3xl font-bold md:text-4xl">
              <NumberTicker value={stat.value} />
              {stat.suffix}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.description}</p>
          </BlurFade>
        ))}
      </div>
    </GridSection>
  );
}

// Orbital Diagram Section (like ContentHero)
function OrbitalSection() {
  const innerRadius = 100;
  const outerRadius = 180;

  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <BlurFade inView>
              <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
                SearchFIT at the center of your stack
              </h2>
            </BlurFade>
            <BlurFade inView delay={0.1}>
              <p className="mb-8 text-muted-foreground">
                Connect AI platforms, automation tools, and content systems. 
                SearchFIT orchestrates your entire SEO workflow from one central hub.
              </p>
            </BlurFade>
            <ul className="space-y-4">
              {FEATURES.map((feature, index) => (
                <BlurFade key={feature.title} inView delay={0.1 + index * 0.1}>
                  <li className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm">
                      <feature.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                </BlurFade>
              ))}
            </ul>
          </div>

          {/* Orbital Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative flex h-[400px] w-full items-center justify-center">
              {/* Center - SearchFIT */}
              <div className="absolute z-10">
                <Image
                  src="/icons/searchfit.svg"
                  alt="SearchFIT"
                  width={56}
                  height={56}
                  className="size-14"
                />
              </div>

              {/* Inner Ring - AI Platforms */}
              <motion.div 
                className="absolute size-[220px] rounded-full border-2 border-dashed border-primary/30"
                style={{ animation: 'spin 40s linear infinite reverse' }}
              >
                {ORBITAL_INTEGRATIONS.inner.map((item, index) => {
                  const angle = (index * 360) / ORBITAL_INTEGRATIONS.inner.length;
                  const x = innerRadius * Math.cos((angle * Math.PI) / 180);
                  const y = innerRadius * Math.sin((angle * Math.PI) / 180);
                  return (
                    <div
                      key={item.name}
                      className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-background shadow-sm"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={22}
                        height={22}
                        className={cn('size-5', item.invert && 'dark:invert')}
                        style={{ animation: 'spin 40s linear infinite' }}
                      />
                    </div>
                  );
                })}
              </motion.div>

              {/* Outer Ring - Integrations */}
              <motion.div 
                className="absolute size-[380px] rounded-full border-2 border-dashed border-muted-foreground/20"
                style={{ animation: 'spin 90s linear infinite' }}
              >
                {ORBITAL_INTEGRATIONS.outer.map((item, index) => {
                  const angle = (index * 360) / ORBITAL_INTEGRATIONS.outer.length;
                  const x = outerRadius * Math.cos((angle * Math.PI) / 180);
                  const y = outerRadius * Math.sin((angle * Math.PI) / 180);
                  return (
                    <div
                      key={item.name}
                      className="absolute left-1/2 top-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border bg-background shadow-sm"
                      style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={18}
                        height={18}
                        className={cn('size-4', item.invert && 'dark:invert')}
                        style={{ animation: 'spin 90s linear infinite reverse' }}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </GridSection>
  );
}

// Directory Section
function DirectorySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = useMemo(() => {
    return INTEGRATIONS.filter((integration) => {
      const matchesSearch = 
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = 
        selectedCategory === "All" || integration.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedIntegrations = useMemo(() => {
    return filteredIntegrations.reduce((acc, integration) => {
      if (!acc[integration.category]) {
        acc[integration.category] = [];
      }
      acc[integration.category].push(integration);
      return acc;
    }, {} as Record<string, Integration[]>);
  }, [filteredIntegrations]);

  return (
    <GridSection className="bg-diagonal-lines" id="directory">
      <div className="bg-background py-20 lg:mx-12 lg:border-x">
        <div className="container">
          <div className="mb-10">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Integration Directory
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Browse all available integrations. Connect your favorite tools and automate your workflow.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex justify-start mb-8">
            <div className="inline-flex items-center gap-3 p-1.5 rounded-full border border-border bg-background shadow-sm">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search integrations..."
                  className="h-11 w-[240px] sm:w-[320px] pl-11 pr-4 rounded-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0"
                />
              </div>
              <div className="h-7 w-px bg-border" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-11 px-5 pr-10 rounded-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0 appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-all font-medium",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Integrations Grid */}
          <div className="space-y-12">
            {Object.entries(groupedIntegrations).map(([category, integrations]) => (
              <BlurFade key={category} inView>
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    {category}
                    <Badge variant="secondary" className="text-xs font-normal">
                      {integrations.length}
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {integrations.map((integration) => (
                      <IntegrationCard key={integration.id} integration={integration} />
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>

          {/* No Results */}
          {filteredIntegrations.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No integrations found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </GridSection>
  );
}

// Integration Card Component
function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <img 
            src={integration.icon} 
            alt={integration.name}
            className="size-7 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              {integration.name}
            </h4>
            {integration.comingSoon ? (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Soon
              </Badge>
            ) : (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-0">
                Available
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {integration.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Bottom CTA
function BottomCTA() {
  return (
    <GridSection>
      <div className="container relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <BlurFade inView>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to connect your tools?
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Start your 7-day free trial and integrate your favorite platforms in minutes.
            </p>
          </BlurFade>
          <BlurFade inView delay={0.4}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
                <Link href="/pricing">
                  <Sparkles className="mr-2 size-4" />
                  Start 7-Day Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/sales">
                  Need a Custom Solution?
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </BlurFade>
        </div>
        <FlickeringGrid
          className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(600px_circle_at_center,var(--background),transparent)]"
          squareSize={4}
          gridGap={6}
          color="gray"
          maxOpacity={0.1}
          height={600}
          width={1400}
        />
      </div>
    </GridSection>
  );
}

// Main Export
export function IntegrationsHero() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <OrbitalSection />
      <DirectorySection />
      <BottomCTA />
    </>
  );
}
