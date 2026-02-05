'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, PieChart, Pie, Cell } from 'recharts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Target,
  Zap,
  Users,
  Search,
  Globe,
  FileText,
  Download,
  Calendar,
  Filter,
  ClockIcon,
  PuzzleIcon,
  Quote,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
  MousePointerClick,
  Timer,
  Link2,
  ExternalLink,
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

// Analytics platform icons
const ANALYTICS_PLATFORMS = [
  { name: 'Google Analytics', src: '/icons/google-analytics.svg' },
  { name: 'Google Search Console', src: '/icons/google-brand-color.svg' },
  { name: 'Semrush', src: '/icons/semrush.svg' },
  { name: 'Ahrefs', src: '/icons/searchapi.svg' },
  { name: 'Microsoft', src: '/icons/microsoft.svg' },
  { name: 'Meta', src: '/icons/meta.svg' },
];

// Traffic data
const TRAFFIC_DATA = [
  { month: 'Jan', organic: 12000, paid: 4000, direct: 3000 },
  { month: 'Feb', organic: 15000, paid: 4500, direct: 3200 },
  { month: 'Mar', organic: 18000, paid: 5000, direct: 3800 },
  { month: 'Apr', organic: 22000, paid: 5500, direct: 4200 },
  { month: 'May', organic: 28000, paid: 6000, direct: 4800 },
  { month: 'Jun', organic: 35000, paid: 7000, direct: 5500 },
];

// Keyword ranking data
const KEYWORD_DATA = [
  { name: 'Week 1', position: 45 },
  { name: 'Week 2', position: 32 },
  { name: 'Week 3', position: 28 },
  { name: 'Week 4', position: 18 },
  { name: 'Week 5', position: 12 },
  { name: 'Week 6', position: 8 },
];

// Stats data
const STATS = [
  { value: 50, suffix: '+', description: 'Metrics Tracked' },
  { value: 100, suffix: '%', description: 'Real-time Data' },
  { value: 15, suffix: '+', description: 'Report Templates' },
  { value: 30, suffix: 's', description: 'Avg. Load Time' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'Data Scattered Everywhere',
    description: 'Your SEO data lives in dozens of tools. Google Analytics, Search Console, Ahrefs, Semrush—switching between them wastes hours every week.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'Reports Take Forever',
    description: 'Building comprehensive reports means exporting CSVs, copying data, and formatting spreadsheets. By the time you\'re done, the data is already old.'
  },
  {
    icon: <TrendingDown className="size-5 shrink-0" />,
    title: 'Missing the Big Picture',
    description: 'Raw data doesn\'t tell you what to do. You need insights that connect rankings, traffic, and revenue—not more charts to interpret.'
  }
];

// Key metrics
const KEY_METRICS = [
  { label: 'Organic Traffic', value: '47.2K', change: '+23%', positive: true },
  { label: 'Avg. Position', value: '12.4', change: '-3.2', positive: true },
  { label: 'Click-through Rate', value: '4.8%', change: '+0.6%', positive: true },
  { label: 'Impressions', value: '892K', change: '+45%', positive: true },
];

// Search Console metrics
const SEARCH_CONSOLE_METRICS = [
  { label: 'Total Clicks', value: '156K', change: '+32%', positive: true },
  { label: 'Impressions', value: '2.4M', change: '+18%', positive: true },
  { label: 'Avg. CTR', value: '6.5%', change: '+1.2%', positive: true },
  { label: 'Avg. Position', value: '8.3', change: '-2.1', positive: true },
];

// Backlinks data
const BACKLINKS_DATA = [
  { label: 'Total Backlinks', value: '12.4K', change: '+847', positive: true },
  { label: 'Referring Domains', value: '1,892', change: '+156', positive: true },
  { label: 'Dofollow Links', value: '9.8K', change: '+612', positive: true },
  { label: 'New Links (30d)', value: '423', change: '+89', positive: true },
];

// Traffic sources
const TRAFFIC_SOURCES = [
  { name: 'Organic Search', value: 58, color: '#10b981' },
  { name: 'Direct', value: 22, color: '#8b5cf6' },
  { name: 'Referral', value: 12, color: '#f59e0b' },
  { name: 'Social', value: 8, color: '#ec4899' },
];

// Features
const FEATURES = [
  {
    icon: PieChartIcon,
    title: 'Unified Dashboard',
    description: 'All your SEO metrics in one place. Google Analytics, Search Console, and rank trackers unified.',
  },
  {
    icon: LineChartIcon,
    title: 'Trend Analysis',
    description: 'Spot patterns and predict performance with AI-powered trend detection and forecasting.',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description: 'Set and monitor KPIs with automated alerts when you\'re off track or hitting milestones.',
  },
  {
    icon: FileText,
    title: 'Custom Reports',
    description: 'Generate beautiful, branded reports in seconds. Schedule automated delivery to stakeholders.',
  },
  {
    icon: Filter,
    title: 'Advanced Segmentation',
    description: 'Slice data by device, location, page type, or custom dimensions to find hidden opportunities.',
  },
  {
    icon: Zap,
    title: 'AI Insights',
    description: 'Get actionable recommendations based on your data patterns and industry benchmarks.',
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
                <BarChart3 className="size-4 text-primary" />
                <span>Analytics</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">50+ metrics unified</span>
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
              Turn data into
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                decisions that grow revenue
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
            Unify all your SEO data in one powerful dashboard. Get <strong className="font-semibold text-foreground">AI-powered insights</strong>, 
            automated reports, and real-time alerts that tell you exactly what to do next.
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
              <Link href="/contact">
                Get in Touch
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
              Integrates with your existing tools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {ANALYTICS_PLATFORMS.map((platform, index) => (
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
              src="/assets/hero/screen3-light.png"
              alt="Analytics Dashboard"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen3-dark.png"
              alt="Analytics Dashboard"
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
          <TextGenerateWithSelectBoxEffect words="Analytics Shouldn't Feel Like a Second Job." />
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
              All your metrics, one dashboard
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Stop switching between tools. Get a complete picture of your SEO performance with real-time data from all your sources.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* Key Metrics Card */}
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
                      <Activity className="size-5 text-primary" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Real-time performance at a glance
                    </p>
                    {KEY_METRICS.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{metric.value}</span>
                          <span className={cn('flex items-center text-xs', metric.positive ? 'text-green-600' : 'text-red-600')}>
                            {metric.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {metric.change}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Traffic Trend Card */}
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
                      Traffic Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Organic, paid, and direct traffic trends over time
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={TRAFFIC_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="organic" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="50%" stopColor="#34d399" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="paid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="direct" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                            <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.2} />
                            <stop offset="100%" stopColor="#fcd34d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="organic" stroke="#10b981" fill="url(#organic)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="paid" stroke="#8b5cf6" fill="url(#paid)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="direct" stroke="#f59e0b" fill="url(#direct)" strokeWidth={2.5} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Traffic Sources Card */}
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
                      <PieChartIcon className="size-5 text-primary" />
                      Traffic Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Where your visitors come from
                    </p>
                    <div className="space-y-4">
                      {TRAFFIC_SOURCES.map((source, i) => (
                        <div key={source.name} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="size-3 rounded-full shrink-0" 
                                style={{ backgroundColor: source.color }}
                              />
                              <span className="text-sm font-medium">{source.name}</span>
                            </div>
                            <span className="text-sm font-semibold">{source.value}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${source.value}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                              className="h-2 rounded-full"
                              style={{ backgroundColor: source.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Keyword Rankings Card */}
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
                      <Search className="size-5 text-primary" />
                      Keyword Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Average position improvement over time
                    </p>
                    <ChartContainer config={{}} className="h-[150px] w-full">
                      <AreaChart data={KEYWORD_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <defs>
                          <linearGradient id="positionGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
                            <stop offset="30%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="60%" stopColor="#eab308" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.4} />
                          </linearGradient>
                          <linearGradient id="positionStroke" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="30%" stopColor="#f97316" />
                            <stop offset="60%" stopColor="#eab308" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="position" 
                          stroke="url(#positionStroke)" 
                          fill="url(#positionGradient)"
                          strokeWidth={3}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                    <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Start:</span>
                        <span className="font-semibold text-red-500">#45</span>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Now:</span>
                        <span className="font-semibold text-green-500">#8</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Insights Card */}
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
                      <Zap className="size-5 text-primary" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Actionable recommendations
                    </p>
                    {[
                      { text: 'Mobile traffic up 34%—optimize mobile UX', icon: <Eye className="size-4" /> },
                      { text: '12 keywords close to page 1—prioritize these', icon: <Target className="size-4" /> },
                      { text: 'Bounce rate high on /pricing—review CTA', icon: <MousePointerClick className="size-4" /> },
                    ].map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className="mt-0.5 text-primary">{insight.icon}</div>
                        <p className="text-sm">{insight.text}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Search Console Card */}
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
                      <Globe className="size-5 text-primary" />
                      Search Console
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Google Search Console performance data
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {SEARCH_CONSOLE_METRICS.map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                          className="rounded-lg border p-3 text-center"
                        >
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <span className={cn('mt-1 inline-flex items-center text-xs', metric.positive ? 'text-green-600' : 'text-red-600')}>
                            {metric.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {metric.change}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Backlinks Card */}
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
                      <Link2 className="size-5 text-primary" />
                      Backlinks & Referring Sites
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Track your link building progress
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {BACKLINKS_DATA.map((metric, index) => (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                          className="rounded-lg border p-3 text-center"
                        >
                          <p className="text-2xl font-bold">{metric.value}</p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                          <span className={cn('mt-1 inline-flex items-center text-xs', metric.positive ? 'text-green-600' : 'text-red-600')}>
                            {metric.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {metric.change}
                          </span>
                        </motion.div>
                      ))}
                    </div>
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
              Analytics that actually help you grow
            </h2>
            <p className="mb-8 text-muted-foreground">
              Stop drowning in data. Get clear insights that show you exactly what's working, what's not, and what to do about it.
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
                src="/assets/hero/screen3-light.png"
                alt="Analytics Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen3-dark.png"
                alt="Analytics Features"
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

// Testimonial Quote
function TestimonialSection() {
  return (
    <GridSection className="border-y">
      <div className="container py-20">
        <BlurFade inView className="mx-auto max-w-4xl text-center">
          <Quote className="mx-auto mb-6 size-10 text-primary/30" />
          <blockquote className="text-2xl font-medium leading-relaxed md:text-3xl">
            "We used to spend 8 hours a week building reports. Now it takes 
            <span className="text-primary"> 10 minutes</span>. SearchFIT's analytics dashboard saved us 400+ hours last year."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Michael Torres</p>
            <p className="text-sm text-muted-foreground">SEO Director, GrowthPath Digital</p>
          </div>
        </BlurFade>
      </div>
    </GridSection>
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
              Start making data-driven decisions
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of marketers who trust SearchFIT to unify their analytics and surface actionable insights.
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
                <Link href="/contact">
                  Get in Touch
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
export function AnalyticsHero() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ProductShowcase />
      <ProblemSection />
      <BentoSection />
      <FeatureListSection />
      <TestimonialSection />
      <BottomCTA />
    </>
  );
}
