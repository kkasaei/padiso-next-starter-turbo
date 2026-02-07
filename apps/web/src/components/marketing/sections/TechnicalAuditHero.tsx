'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart } from 'recharts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bug,
  Zap,
  Search,
  Globe,
  FileText,
  ClockIcon,
  PuzzleIcon,
  Quote,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Gauge,
  Code,
  Server,
  Link2,
  Image as ImageIcon,
  FileWarning,
  Smartphone,
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

// Audit categories
const AUDIT_CATEGORIES = [
  { name: 'Core Web Vitals', icon: Gauge },
  { name: 'Crawlability', icon: Bug },
  { name: 'Mobile-First', icon: Smartphone },
  { name: 'Schema Markup', icon: Code },
  { name: 'Security (HTTPS)', icon: Shield },
];

// Health score trend data
const HEALTH_SCORE_DATA = [
  { month: 'Jan', score: 62 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 71 },
  { month: 'Apr', score: 78 },
  { month: 'May', score: 84 },
  { month: 'Jun', score: 91 },
];

// Issue distribution data
const ISSUE_DATA = [
  { name: 'Critical', count: 12, color: '#ef4444' },
  { name: 'Warning', count: 34, color: '#f59e0b' },
  { name: 'Info', count: 89, color: '#3b82f6' },
  { name: 'Passed', count: 156, color: '#10b981' },
];

// Stats data
const STATS = [
  { value: 200, suffix: '+', description: 'SEO Checks' },
  { value: 99, suffix: '%', description: 'Issue Detection' },
  { value: 5, suffix: 'min', description: 'Full Site Audit' },
  { value: 24, suffix: '/7', description: 'Continuous Monitoring' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'Hidden Issues Tank Rankings',
    description: 'Technical problems like slow pages, broken links, and crawl errors silently hurt your rankings. Most site owners don\'t know until it\'s too late.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'Manual Audits Are Overwhelming',
    description: 'Checking every page for technical issues is impossible at scale. And generic audit tools give you 1000 issues without telling you which matter.'
  },
  {
    icon: <AlertTriangle className="size-5 shrink-0" />,
    title: 'Core Web Vitals Keep Changing',
    description: 'Google\'s performance standards evolve constantly. What passed last month might fail today, and keeping up manually is a full-time job.'
  }
];

// Site health metrics
const HEALTH_METRICS = [
  { label: 'Overall Health', value: 91, status: 'good' },
  { label: 'Performance', value: 87, status: 'good' },
  { label: 'Accessibility', value: 94, status: 'good' },
  { label: 'Best Practices', value: 82, status: 'warning' },
];

// Core Web Vitals
const CORE_WEB_VITALS = [
  { metric: 'LCP', value: '1.8s', target: '< 2.5s', status: 'good' },
  { metric: 'INP', value: '120ms', target: '< 200ms', status: 'good' },
  { metric: 'CLS', value: '0.08', target: '< 0.1', status: 'good' },
];

// Issue categories
const ISSUE_CATEGORIES = [
  { category: 'Broken Links', count: 23, severity: 'critical' },
  { category: 'Missing Meta', count: 45, severity: 'warning' },
  { category: 'Slow Pages', count: 12, severity: 'critical' },
  { category: 'Missing Alt Text', count: 67, severity: 'warning' },
  { category: 'Redirect Chains', count: 8, severity: 'warning' },
];

// Features
const FEATURES = [
  {
    icon: Bug,
    title: '200+ Technical Checks',
    description: 'Comprehensive crawl covering indexability, performance, security, and structured data.',
  },
  {
    icon: Gauge,
    title: 'Core Web Vitals Monitoring',
    description: 'Real-time LCP, INP, and CLS tracking with actionable optimization tips.',
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Analysis',
    description: 'Test how Google sees your mobile site with detailed mobile rendering reports.',
  },
  {
    icon: Code,
    title: 'Schema Validation',
    description: 'Validate structured data markup and get suggestions for rich snippet opportunities.',
  },
  {
    icon: Link2,
    title: 'Internal Link Analysis',
    description: 'Optimize your site architecture with link flow visualization and orphan page detection.',
  },
  {
    icon: Zap,
    title: 'Automated Fixes',
    description: 'One-click fixes for common issues. Export technical specs for your dev team.',
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
                <Bug className="size-4 text-primary" />
                <span>Technical Audit</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">200+ SEO checks</span>
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
              Fix technical issues
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                before they hurt rankings
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
            Comprehensive technical SEO audits that find <strong className="font-semibold text-foreground">every issue affecting your site</strong>. 
            Get prioritized fixes and track your site health score over time.
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

          {/* Audit Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Comprehensive audit coverage
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {AUDIT_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium shadow-sm"
                >
                  <category.icon className="size-4 text-primary" />
                  {category.name}
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
              src="/assets/hero/screen4-light.png"
              alt="Technical Audit Dashboard"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen4-dark.png"
              alt="Technical Audit Dashboard"
              width={1328}
              height={727}
              className="hidden w-full dark:block"
              priority
            />
          </div>
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
          <TextGenerateWithSelectBoxEffect words="Technical Debt Is Killing Your Rankings. Silently." />
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
              Your complete site health dashboard
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Monitor every technical aspect of your site. Get prioritized fixes that make the biggest impact on rankings.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* Health Score Card */}
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
                      Site Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Overall technical health scores
                    </p>
                    {HEALTH_METRICS.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{metric.label}</span>
                          <span className={cn(
                            'text-sm font-semibold',
                            metric.status === 'good' ? 'text-green-600' : 'text-amber-600'
                          )}>
                            {metric.value}%
                          </span>
                        </div>
                        <Progress 
                          value={metric.value} 
                          className={cn(
                            'h-2',
                            metric.status === 'good' ? '[&>div]:bg-green-500' : '[&>div]:bg-amber-500'
                          )} 
                        />
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Health Trend Chart */}
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
                      Health Score Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Site health improvement over time
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={HEALTH_SCORE_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="healthScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                            <stop offset="50%" stopColor="#34d399" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="score" stroke="#10b981" fill="url(#healthScore)" strokeWidth={2.5} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                    <div className="mt-3 flex items-center justify-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Started:</span>
                        <span className="font-semibold text-red-500">62</span>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Current:</span>
                        <span className="font-semibold text-green-500">91</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Core Web Vitals Card */}
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
                      <Gauge className="size-5 text-primary" />
                      Core Web Vitals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Google's key performance metrics
                    </p>
                    <div className="space-y-4">
                      {CORE_WEB_VITALS.map((vital, i) => (
                        <motion.div
                          key={vital.metric}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-semibold">{vital.metric}</p>
                            <p className="text-xs text-muted-foreground">Target: {vital.target}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{vital.value}</span>
                            <CheckCircle2 className="size-5 text-green-500" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Issue Distribution Card */}
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
                      <FileWarning className="size-5 text-primary" />
                      Issue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Issues by severity level
                    </p>
                    <div className="space-y-4">
                      {ISSUE_DATA.map((item, i) => (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="size-3 rounded-full" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold">{item.count}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(item.count / 291) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                              className="h-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Top Issues Card */}
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
                      <AlertTriangle className="size-5 text-primary" />
                      Top Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Priority fixes needed
                    </p>
                    {ISSUE_CATEGORIES.map((issue, i) => (
                      <motion.div
                        key={issue.category}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-2">
                          {issue.severity === 'critical' ? (
                            <XCircle className="size-4 text-red-500" />
                          ) : (
                            <AlertTriangle className="size-4 text-amber-500" />
                          )}
                          <span className="text-sm">{issue.category}</span>
                        </div>
                        <Badge variant={issue.severity === 'critical' ? 'destructive' : 'secondary'}>
                          {issue.count}
                        </Badge>
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
              Everything you need for technical SEO excellence
            </h2>
            <p className="mb-8 text-muted-foreground">
              From crawl analysis to Core Web Vitals, get comprehensive technical audits that prioritize what actually matters for rankings.
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
                src="/assets/hero/screen4-light.png"
                alt="Technical Audit Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen4-dark.png"
                alt="Technical Audit Features"
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
            "SearchFIT found 47 critical issues our previous audit tool missed. After fixing them, our 
            <span className="text-primary"> Core Web Vitals went from red to green</span> and organic traffic increased 28%."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Jennifer Walsh</p>
            <p className="text-sm text-muted-foreground">Technical SEO Manager, EcomScale</p>
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
              Start your free technical audit today
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of sites using SearchFIT to find and fix technical issues before they impact rankings.
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
export function TechnicalAuditHero() {
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
