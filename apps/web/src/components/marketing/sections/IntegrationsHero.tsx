'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Search, Check, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { FlickeringGrid } from '@workspace/ui/components/fragments/FlickeringGrid';
import { Input } from '@workspace/ui/components/input';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  comingSoon: boolean;
}

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

export function IntegrationsHero(): React.JSX.Element {
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

  const availableCount = INTEGRATIONS.filter(i => !i.comingSoon).length;
  const totalCount = INTEGRATIONS.length;

  return (<>
    <GridSection>
      <div className="container py-20">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mb-4">Integrations</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Connect your favorite tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrate SearchFIT with {totalCount}+ tools you already use. 
            Automate your workflow and supercharge your SEO.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="size-4 text-primary" />
              <span><strong>{availableCount}</strong> available now</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span><strong>{totalCount - availableCount}</strong> coming soon</span>
            </div>
          </div>
        </div>

        {/* Search and Filter - Grouped with rounded-full */}
        <div className="flex justify-center mb-8">
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
        <div className="flex flex-wrap gap-2 justify-center mb-12">
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
            <div key={category}>
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                {category}
                <Badge variant="secondary" className="text-xs font-normal">
                  {integrations.length}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {integrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={integration} />
                ))}
              </div>
            </div>
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
    </GridSection>

    {/* CTA - Full Width Like Story Page */}
    <GridSection>
      <div className="container relative max-w-4xl overflow-hidden py-24 md:py-32">
        <div className="relative z-10 text-center">
          <h3 className="text-2xl font-bold sm:text-3xl md:text-4xl mb-4">
            Ready to connect your tools?
          </h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Start your 7-day free trial and integrate your favorite platforms in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25">
              <Link href="/pricing">
                <Sparkles className="mr-2 size-4" />
                Start 7-Day Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
        <FlickeringGrid
          className="pointer-events-none absolute inset-0 z-0 mask-[radial-gradient(450px_circle_at_center,var(--background),transparent)]"
          squareSize={4}
          gridGap={6}
          color="gray"
          maxOpacity={0.12}
          height={400}
          width={1000}
        />
      </div>
    </GridSection>
  </>);
}

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <div className="group relative rounded-xl border border-border bg-background p-5 hover:shadow-md hover:border-primary/20 transition-all">
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
            <h3 className="text-sm font-semibold text-foreground">
              {integration.name}
            </h3>
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
    </div>
  );
}
