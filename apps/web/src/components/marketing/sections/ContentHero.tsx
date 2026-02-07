'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart } from 'recharts';
import {
  Sparkles,
  ArrowRight,
  PenTool,
  FileText,
  Wand2,
  Languages,
  Target,
  BarChart3,
  ClockIcon,
  PuzzleIcon,
  TrendingUp,
  Quote,
  Layers,
  Send,
  Palette,
  Bot,
  Calendar,
  Repeat,
  Link2,
  Users,
  RefreshCw,
  MessagesSquare,
  Mail,
  Video,
  Eye,
} from 'lucide-react';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { FlickeringGrid } from '@workspace/ui/components/fragments/FlickeringGrid';
import { BlurFade } from '@workspace/ui/components/fragments/BlurFade';
import { NumberTicker } from '@workspace/ui/components/fragments/NumberTicker';
import { TextGenerateWithSelectBoxEffect } from '@workspace/ui/components/fragments/TextGenerateWithSelectBoxEffect';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Progress } from '@workspace/ui/components/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

// CMS Platform icons
const CMS_PLATFORMS = [
  { name: 'WordPress', src: '/icons/wordpress.svg' },
  { name: 'Webflow', src: '/icons/webflow.svg' },
  { name: 'Shopify', src: '/icons/shopify_glyph_black.svg' },
  { name: 'BigCommerce', src: '/icons/bigcommerce.svg' },
  { name: 'WooCommerce', src: '/icons/woocommerce.svg' },
  { name: 'Wix', src: '/icons/wix.svg' },
  { name: 'Squarespace', src: '/icons/squarespace.svg' },
  { name: 'Drupal', src: '/icons/drupal.svg' },
  { name: 'Ghost', src: '/icons/ghost.svg' },
  { name: 'Next.js', src: '/icons/vercel.svg' },
  { name: 'Google Drive', src: '/icons/google-drive.svg' },
  { name: 'Netlify', src: '/icons/netlify.svg' },
  { name: 'Webhook', src: '/icons/webhook.svg' },
];

// Chart data
const CONTENT_PERFORMANCE_DATA = [
  { month: 'Jan', articles: 12, ranking: 45 },
  { month: 'Feb', articles: 18, ranking: 52 },
  { month: 'Mar', articles: 24, ranking: 61 },
  { month: 'Apr', articles: 32, ranking: 68 },
  { month: 'May', articles: 45, ranking: 75 },
  { month: 'Jun', articles: 58, ranking: 82 },
];

const SEO_SCORE_DATA = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 78 },
  { name: 'Week 4', score: 85 },
  { name: 'Week 5', score: 88 },
  { name: 'Week 6', score: 92 },
];

// Stats data
const STATS = [
  { value: 50, suffix: '+', description: 'Content Templates' },
  { value: 10, suffix: 'x', description: 'Faster Than Manual Writing' },
  { value: 95, suffix: '%', description: 'SEO Score Average' },
  { value: 30, suffix: '+', description: 'Languages Supported' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'Content Creation Takes Forever',
    description: 'Writing quality, SEO-optimized content manually takes hours. By the time you publish, competitors have already captured the traffic.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'SEO Is a Moving Target',
    description: 'Search algorithms change constantly. Content that ranked last month may not rank today. Keeping up requires constant optimization.'
  },
  {
    icon: <TrendingUp className="size-5 shrink-0" />,
    title: 'AI Search Needs Different Content',
    description: 'Traditional SEO content isn\'t optimized for AI engines. You need content structured for both Google AND ChatGPT to maximize visibility.'
  }
];

// Content types
const CONTENT_TYPES = [
  { type: 'Blog Posts', count: 156, growth: '+23%' },
  { type: 'Product Descriptions', count: 89, growth: '+18%' },
  { type: 'Landing Pages', count: 34, growth: '+45%' },
  { type: 'Meta Descriptions', count: 245, growth: '+12%' },
];

// Features
const FEATURES = [
  {
    icon: Wand2,
    title: 'AI-Powered Writing',
    description: 'Generate high-quality, original content in minutes with advanced AI that understands your brand and industry.',
  },
  {
    icon: Layers,
    title: '50+ Content Templates',
    description: 'Blog posts, product descriptions, landing pages, emails, and more—all optimized for conversions.',
  },
  {
    icon: Target,
    title: 'Real-time SEO Scoring',
    description: 'Get instant feedback on keyword usage, readability, and structure as you write or generate content.',
  },
  {
    icon: Palette,
    title: 'Brand Voice Training',
    description: 'Train the AI to write in your unique style and tone for consistent brand messaging across all content.',
  },
  {
    icon: Languages,
    title: 'Multi-Language Support',
    description: 'Create and translate content in 30+ languages to reach global audiences without losing quality.',
  },
  {
    icon: Send,
    title: 'One-Click Publishing',
    description: 'Publish directly to WordPress, Webflow, Shopify, and other platforms without copy-pasting.',
  },
];

// SEO optimization items
const SEO_OPTIMIZATIONS = [
  { label: 'Keyword Density', score: 92, status: 'excellent' },
  { label: 'Readability', score: 88, status: 'good' },
  { label: 'Meta Description', score: 95, status: 'excellent' },
  { label: 'Internal Links', score: 78, status: 'good' },
  { label: 'Image Alt Text', score: 85, status: 'good' },
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

// Hero Section
function HeroSection() {
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
            <Link href="#features">
              <Badge
                variant="outline"
                className="group flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-xs hover:bg-accent/50"
              >
                <PenTool className="size-4 text-primary" />
                <span>AI Content</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">50+ templates</span>
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
              Create content that
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI and humans love
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
            Generate <strong className="font-semibold text-foreground">SEO-optimized content</strong> that ranks on Google AND gets recommended by AI engines. 
            Write <strong className="font-semibold text-foreground">10x faster</strong> without sacrificing quality.
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
              <Link href="/sales">
                Need a Custom Solution?
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Platform Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Publish directly to your favorite platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {CMS_PLATFORMS.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-center transition-opacity hover:opacity-80"
                >
                  <Image
                    src={platform.src}
                    alt={platform.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all md:h-10"
                  />
                </motion.div>
              ))}
            </div>
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
      <div className="grid grid-cols-2 divide-x divide-border border-y lg:grid-cols-4">
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

// Product Screenshot
function ProductShowcase() {
  return (
    <GridSection>
      <div className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <Image
              src="/assets/hero/screen2-light.png"
              alt="AI Content Editor"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen2-dark.png"
              alt="AI Content Editor"
              width={1328}
              height={727}
              className="hidden w-full dark:block"
              priority
            />
          </div>
          {/* Decorative elements */}
          <div className="absolute -left-4 -top-4 size-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-4 -right-4 size-32 rounded-full bg-primary/10 blur-3xl" />
        </motion.div>
      </div>
    </GridSection>
  );
}

// Problem Section
function ProblemSection() {
  return (
    <GridSection>
      <div className="px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          <TextGenerateWithSelectBoxEffect words="Content Creation Shouldn't Be This Hard." />
        </h2>
      </div>
      <div className="grid divide-y border-t border-dashed md:grid-cols-3 md:divide-x md:divide-y-0">
        {PROBLEMS.map((problem, index) => (
          <BlurFade
            key={index}
            inView
            delay={0.2 + index * 0.2}
            className="border-dashed px-8 py-12"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border bg-background shadow">
              {problem.icon}
            </div>
            <h3 className="mb-3 text-lg font-semibold">{problem.title}</h3>
            <p className="text-muted-foreground">{problem.description}</p>
          </BlurFade>
        ))}
      </div>
    </GridSection>
  );
}

// Bento Grid Section
function BentoSection() {
  return (
    <GridSection className="bg-diagonal-lines">
      <div className="bg-background py-20 lg:mx-12 lg:border-x">
        <div className="container space-y-10">
          <div>
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              AI-powered content that performs
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Generate, optimize, and publish content that ranks on search engines and gets recommended by AI platforms—all from one dashboard.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* SEO Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Target className="size-5 text-primary" />
                      SEO Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Real-time SEO scoring as you write
                    </p>
                    {SEO_OPTIMIZATIONS.map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className={cn(
                            'text-xs',
                            item.status === 'excellent' ? 'text-green-600' : 'text-amber-600'
                          )}>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={item.score} className="flex-1" />
                          <span className="w-8 text-right text-sm font-semibold">{item.score}</span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-12 md:col-span-6 xl:col-span-8"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <TrendingUp className="size-5 text-primary" />
                      Content Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Articles published vs. search ranking improvement
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={CONTENT_PERFORMANCE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="articlesGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="rankingGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="articles" stroke="#8b5cf6" fill="url(#articlesGradient)" strokeWidth={2} />
                        <Area type="monotone" dataKey="ranking" stroke="#f97316" fill="url(#rankingGradient)" strokeWidth={2} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Types Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Layers className="size-5 text-primary" />
                      Content Created
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Content generated this month
                    </p>
                    {CONTENT_TYPES.map((item, i) => (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{item.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.count}</span>
                          <span className="text-xs text-green-600">{item.growth}</span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* SEO Score Trend Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <BarChart3 className="size-5 text-primary" />
                      Average SEO Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Weekly SEO score improvement
                    </p>
                    <ChartContainer config={{}} className="h-[150px] w-full">
                      <BarChart data={SEO_SCORE_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="seoScoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <Bar dataKey="score" fill="url(#seoScoreGradient)" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI Writing Assistant Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Bot className="size-5 text-primary" />
                      AI Writing Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Recent AI-powered suggestions
                    </p>
                    {[
                      { text: 'Added 3 internal links to improve SEO', time: 'Just now', icon: '🔗' },
                      { text: 'Optimized headline for better CTR', time: '2 min ago', icon: '✨' },
                      { text: 'Improved readability score by 15%', time: '5 min ago', icon: '📖' },
                    ].map((suggestion, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{suggestion.text}</p>
                          <p className="text-xs text-muted-foreground">{suggestion.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Calendar Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="col-span-12 md:col-span-6 xl:col-span-6"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Calendar className="size-5 text-primary" />
                      Content Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Upcoming scheduled content
                    </p>
                    {[
                      { title: 'SEO Best Practices 2024', date: 'Tomorrow', status: 'Ready' },
                      { title: 'AI Content Guide', date: 'Wed, Feb 12', status: 'Draft' },
                      { title: 'Link Building Tips', date: 'Fri, Feb 14', status: 'Review' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <Badge variant={item.status === 'Ready' ? 'default' : 'secondary'} className="text-xs">
                          {item.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Headline Analyzer Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="col-span-12 md:col-span-6 xl:col-span-6"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <BarChart3 className="size-5 text-primary" />
                      Headline Analyzer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Test headlines for maximum CTR
                    </p>
                    {[
                      { headline: '10 Ways to Boost SEO', score: 72, color: 'text-amber-600' },
                      { headline: 'The Ultimate AI Guide', score: 89, color: 'text-green-600' },
                      { headline: 'How We 10x\'d Traffic', score: 94, color: 'text-green-600' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium truncate">{item.headline}</span>
                          <span className={cn('font-semibold', item.color)}>{item.score}</span>
                        </div>
                        <Progress value={item.score} className="h-1.5" />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Repurposing Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="col-span-12 md:col-span-6 xl:col-span-6"
              >
                <Card className="h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Repeat className="size-5 text-primary" />
                      Content Repurposing
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      One article becomes 10+ pieces of content
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Visual Flow */}
                    <div className="relative rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4">
                      <div className="flex items-center justify-between">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9 }}
                          className="flex flex-col items-center"
                        >
                          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-white">
                            <FileText className="size-6" />
                          </div>
                          <span className="mt-2 text-xs font-medium">Blog Post</span>
                        </motion.div>
                        <div className="flex-1 px-4">
                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.0, duration: 0.5 }}
                            className="h-0.5 w-full origin-left bg-gradient-to-r from-primary to-primary/30"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { icon: MessagesSquare, label: 'Twitter', bg: 'bg-primary/10', text: 'text-primary' },
                            { icon: Mail, label: 'Email', bg: 'bg-orange-500/10', text: 'text-orange-600' },
                            { icon: Video, label: 'Video', bg: 'bg-purple-500/10', text: 'text-purple-600' },
                            { icon: FileText, label: 'LinkedIn', bg: 'bg-blue-500/10', text: 'text-blue-600' },
                          ].map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.5 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 1.1 + i * 0.1 }}
                              className="flex flex-col items-center"
                            >
                              <div className={cn('flex size-8 items-center justify-center rounded-lg', item.bg, item.text)}>
                                <item.icon className="size-4" />
                              </div>
                              <span className="mt-1 text-[10px] text-muted-foreground">{item.label}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">847</p>
                        <p className="text-[10px] text-muted-foreground">Pieces Created</p>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">12x</p>
                        <p className="text-[10px] text-muted-foreground">Output Multiplier</p>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">3min</p>
                        <p className="text-[10px] text-muted-foreground">Avg. Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Internal Linking Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="col-span-12 md:col-span-6 xl:col-span-6"
              >
                <Card className="h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Link2 className="size-5 text-primary" />
                      Internal Linking
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      AI builds your site structure automatically
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Link Suggestions */}
                    <div className="space-y-2">
                      {[
                        { from: 'SEO Guide', to: 'Keyword Research', relevance: 94, status: 'Add link' },
                        { from: 'Content Tips', to: 'Writing Best Practices', relevance: 87, status: 'Add link' },
                        { from: 'AI Tools', to: 'Automation Guide', relevance: 82, status: 'Review' },
                      ].map((link, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.0 + i * 0.1, duration: 0.3 }}
                          className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2.5"
                        >
                          <div className="flex flex-1 items-center gap-2 text-sm">
                            <span className="font-medium">{link.from}</span>
                            <ArrowRight className="size-3 text-muted-foreground" />
                            <span className="text-primary">{link.to}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs font-medium text-primary">{link.relevance}%</Badge>
                        </motion.div>
                      ))}
                    </div>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">+47%</p>
                        <p className="text-[10px] text-muted-foreground">More Links</p>
                      </div>
                      <div className="rounded-lg bg-primary/5 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">156</p>
                        <p className="text-[10px] text-muted-foreground">Suggestions</p>
                      </div>
                      <div className="rounded-lg bg-orange-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-orange-600">8</p>
                        <p className="text-[10px] text-muted-foreground">Orphan Pages</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Competitor Analysis Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Eye className="size-5 text-primary" />
                      Competitor Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Content gaps to exploit
                    </p>
                    {[
                      { topic: 'AI Writing Tools Comparison', difficulty: 'Easy', potential: 'High' },
                      { topic: 'SEO Automation Guide', difficulty: 'Medium', potential: 'High' },
                      { topic: 'Content ROI Calculator', difficulty: 'Easy', potential: 'Medium' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.1 + i * 0.1, duration: 0.3 }}
                        className="rounded-lg border p-3"
                      >
                        <p className="text-sm font-medium">{item.topic}</p>
                        <div className="mt-1.5 flex gap-2">
                          <Badge variant="outline" className="text-xs">{item.difficulty}</Badge>
                          <Badge variant="outline" className={cn('text-xs', item.potential === 'High' ? 'text-green-600' : 'text-amber-600')}>
                            {item.potential} potential
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Content Refresh Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <RefreshCw className="size-5 text-primary" />
                      Content Refresh
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Articles needing updates
                    </p>
                    {[
                      { title: 'SEO Trends 2023', age: '14 months old', priority: 'High' },
                      { title: 'Google Algorithm Updates', age: '8 months old', priority: 'Medium' },
                      { title: 'Link Building Strategies', age: '6 months old', priority: 'Low' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.age}</p>
                        </div>
                        <Badge variant={item.priority === 'High' ? 'default' : 'secondary'} className={cn('text-xs', item.priority === 'High' && 'bg-red-500 text-white')}>
                          {item.priority}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Team Collaboration Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="col-span-12 md:col-span-6 xl:col-span-4"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                      <Users className="size-5 text-primary" />
                      Team Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Recent team updates
                    </p>
                    {[
                      { user: 'Sarah', action: 'published', item: 'SEO Guide', time: '2h ago' },
                      { user: 'Mike', action: 'commented on', item: 'AI Article', time: '4h ago' },
                      { user: 'Emma', action: 'approved', item: 'Blog Post', time: '6h ago' },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.3 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {activity.user[0]}
                        </div>
                        <div>
                          <p><span className="font-medium">{activity.user}</span> {activity.action} <span className="text-primary">{activity.item}</span></p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </GridSection>
  );
}

// Feature List Section
function FeatureListSection() {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 text-3xl font-semibold md:text-5xl">
              Everything you need to create content at scale
            </h2>
            <p className="mb-8 text-muted-foreground">
              From ideation to publication, get AI-powered tools that help you create better content faster without sacrificing quality or SEO performance.
            </p>
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
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl border bg-card shadow-xl">
              <Image
                src="/assets/hero/screen8-light.png"
                alt="Content Creation Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen8-dark.png"
                alt="Content Creation Features"
                width={600}
                height={400}
                className="hidden w-full dark:block"
              />
            </div>
            <div className="absolute -right-4 -top-4 size-20 rounded-full bg-primary/10 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </GridSection>
  );
}

// AI Agentic Workflow Section
function AgenticWorkflowSection() {
  return (
    <GridSection className="bg-background">
      <div className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Visual Workflow Diagram - Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative flex h-[400px] w-full items-center justify-center">
              {/* Outer Integration Ring - Rotating */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute size-[380px] rounded-full border border-dashed border-muted-foreground/20"
              />
              
              {/* Outer Ring - Integrations (Slow rotation) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute size-[380px] animate-[spin_90s_linear_infinite]"
              >
                {[
                  { icon: "/icons/linear.svg", name: "Linear", invert: true },
                  { icon: "/icons/notion.svg", name: "Notion", invert: true },
                  { icon: "/icons/n8n.svg", name: "n8n", invert: true },
                  { icon: "/icons/zapier.svg", name: "Zapier", invert: true },
                  { icon: "/icons/shopify.svg", name: "Shopify", invert: true },
                  { icon: "/icons/wordpress.svg", name: "WordPress", invert: true },
                  { icon: "/icons/webflow.svg", name: "Webflow", invert: true },
                  { icon: "/icons/google-drive.svg", name: "Drive", invert: false },
                  { icon: "/icons/webhook.svg", name: "Webhook", invert: true },
                  { icon: "/icons/api.svg", name: "API", invert: true },
                ].map((item, index, arr) => {
                  const radius = 190;
                  const angle = (360 / arr.length) * index;
                  const angleRad = (angle - 90) * (Math.PI / 180);
                  const x = Math.cos(angleRad) * radius;
                  const y = Math.sin(angleRad) * radius;
                  
                  return (
                    <div
                      key={item.name}
                      className="absolute left-1/2 top-1/2 flex flex-col items-center gap-1"
                      style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg border bg-background">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={18}
                          height={18}
                          className={cn("size-[18px] animate-[spin_90s_linear_infinite_reverse]", item.invert && "dark:invert")}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Inner Ring - Agentic Layer */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute size-[220px] rounded-full border border-dashed border-primary/30"
              />

              {/* Inner Ring - AI Agents (Faster rotation, opposite direction) */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute size-[220px] animate-[spin_40s_linear_infinite_reverse]"
              >
                {[
                  { icon: "/icons/claude.svg", name: "Claude", invert: false },
                  { icon: "/icons/openai.svg", name: "OpenAI", invert: true },
                  { icon: "/icons/gemini.svg", name: "Gemini", invert: false },
                  { icon: "/icons/mistral.svg", name: "Mistral", invert: true },
                  { icon: "/icons/perplexity.svg", name: "Perplexity", invert: true },
                ].map((item, index, arr) => {
                  const radius = 110;
                  const angle = (360 / arr.length) * index;
                  const angleRad = (angle - 90) * (Math.PI / 180);
                  const x = Math.cos(angleRad) * radius;
                  const y = Math.sin(angleRad) * radius;
                  
                  return (
                    <div
                      key={item.name}
                      className="absolute left-1/2 top-1/2 flex flex-col items-center"
                      style={{ transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` }}
                    >
                      <div className="flex size-10 items-center justify-center rounded-xl border bg-background">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={22}
                          height={22}
                          className={cn("size-[22px] animate-[spin_40s_linear_infinite]", item.invert && "dark:invert")}
                        />
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Center - SearchFIT */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring" }}
                className="relative z-10 flex flex-col items-center"
              >
                <Image src="/icons/searchfit.svg" alt="SearchFIT" width={56} height={56} className="size-14" />
                <span className="mt-2 text-xs font-semibold">SearchFIT</span>
              </motion.div>
            </div>
            <div className="absolute -left-4 -top-4 size-20 rounded-full bg-primary/5 blur-2xl" />
          </motion.div>

          {/* Content - Right */}
          <div>
            <Badge variant="secondary" className="mb-4 rounded-full">
              <Bot className="mr-1.5 size-3" />
              AI Agentic Workflow
            </Badge>
            <h2 className="mb-6 text-3xl font-semibold md:text-5xl">
              Designed for the future of autonomous content
            </h2>
            <p className="mb-8 text-muted-foreground">
              SearchFIT integrates seamlessly with AI agents powered by Claude and OpenAI. 
              Connect your project management tools and let AI handle content creation autonomously.
            </p>
            <ul className="space-y-4">
              {[
                {
                  icon: Bot,
                  title: 'MCP Protocol Support',
                  description: 'Native integration with Claude MCP and OpenAI agents for autonomous workflows.',
                },
                {
                  icon: Layers,
                  title: 'Bi-directional Sync',
                  description: 'Tasks from Jira or Linear automatically trigger content creation and updates.',
                },
                {
                  icon: Wand2,
                  title: 'Zero Manual Intervention',
                  description: 'AI agents research, write, optimize, and publish—all without human input.',
                },
                {
                  icon: Send,
                  title: 'Smart Notifications',
                  description: 'Get notified only when review is needed. AI handles the rest.',
                },
              ].map((feature, index) => (
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
        </div>
      </div>
    </GridSection>
  );
}

// Testimonial Quote
function TestimonialSection() {
  return (
    <GridSection className="border-y">
      <div className="container py-20">
        <BlurFade inView className="mx-auto max-w-4xl text-center">
          <Quote className="mx-auto mb-6 size-10 text-primary/30" />
          <blockquote className="text-2xl font-medium leading-relaxed md:text-3xl">
            "We went from publishing 4 blog posts a month to 20—with better SEO scores. SearchFIT's content tools have 
            <span className="text-primary"> 5x'd our organic traffic</span> in just 6 months."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Marcus Johnson</p>
            <p className="text-sm text-muted-foreground">Content Strategy Lead, Media Pulse</p>
          </div>
        </BlurFade>
      </div>
    </GridSection>
  );
}

// Bottom CTA
export function BottomCTA() {
  return (
    <GridSection>
      <div className="container relative overflow-hidden py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <BlurFade inView>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Start creating content that ranks
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join growing number of savvy marketers using SearchFIT to create SEO-optimized content 10x faster.
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
export function ContentHero() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductShowcase />
      <ProblemSection />
      <BentoSection />
      <FeatureListSection />
      <AgenticWorkflowSection />
      <TestimonialSection />
      <BottomCTA />
    </>
  );
}
