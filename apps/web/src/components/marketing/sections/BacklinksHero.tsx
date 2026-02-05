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
  TrendingDown,
  Link2,
  ExternalLink,
  Shield,
  AlertTriangle,
  Target,
  Zap,
  Users,
  Search,
  Globe,
  FileText,
  ClockIcon,
  PuzzleIcon,
  Quote,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Eye,
  BarChart3,
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

// Tool icons for backlink analysis
const BACKLINK_TOOLS = [
  { name: 'Ahrefs', src: '/icons/searchapi.svg' },
  { name: 'Semrush', src: '/icons/semrush.svg' },
  { name: 'Moz', src: '/icons/google-analytics.svg' },
  { name: 'Majestic', src: '/icons/google-brand-color.svg' },
  { name: 'Google Search Console', src: '/icons/google.svg' },
];

// Backlink growth data
const BACKLINK_GROWTH_DATA = [
  { month: 'Jan', backlinks: 2400, domains: 320 },
  { month: 'Feb', backlinks: 2800, domains: 380 },
  { month: 'Mar', backlinks: 3200, domains: 420 },
  { month: 'Apr', backlinks: 3800, domains: 490 },
  { month: 'May', backlinks: 4500, domains: 580 },
  { month: 'Jun', backlinks: 5200, domains: 680 },
];

// Link velocity data
const LINK_VELOCITY_DATA = [
  { name: 'Week 1', gained: 45, lost: 12 },
  { name: 'Week 2', gained: 52, lost: 8 },
  { name: 'Week 3', gained: 38, lost: 15 },
  { name: 'Week 4', gained: 67, lost: 10 },
];

// Stats data
const STATS = [
  { value: 10, suffix: 'M+', description: 'Links Monitored' },
  { value: 500, suffix: 'K+', description: 'Domains Tracked' },
  { value: 99, suffix: '%', description: 'Data Accuracy' },
  { value: 1, suffix: 'hr', description: 'Update Frequency' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'Links Disappear Without Warning',
    description: 'You lose valuable backlinks every day without knowing. By the time you notice, the damage to your rankings is already done.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'Competitors Outpace You',
    description: 'Your competitors are building links faster than you. Without visibility into their strategies, you\'re always playing catch-up.'
  },
  {
    icon: <AlertTriangle className="size-5 shrink-0" />,
    title: 'Toxic Links Hurt Rankings',
    description: 'Spammy backlinks can trigger Google penalties. Manual monitoring is impossible at scale, leaving your site vulnerable.'
  }
];

// Backlink metrics
const BACKLINK_METRICS = [
  { label: 'Total Backlinks', value: '24.8K', change: '+1,247', positive: true },
  { label: 'Referring Domains', value: '3,892', change: '+312', positive: true },
  { label: 'Dofollow Links', value: '19.2K', change: '+982', positive: true },
  { label: 'Avg. Domain Rating', value: '58', change: '+4', positive: true },
];

// Link quality distribution
const LINK_QUALITY = [
  { type: 'High Quality (DR 70+)', count: 892, percentage: 23, color: '#10b981' },
  { type: 'Medium Quality (DR 40-69)', count: 1847, percentage: 47, color: '#3b82f6' },
  { type: 'Low Quality (DR 20-39)', count: 784, percentage: 20, color: '#f59e0b' },
  { type: 'Toxic/Spam (DR <20)', count: 369, percentage: 10, color: '#ef4444' },
];

// Features
const FEATURES = [
  {
    icon: Link2,
    title: 'Complete Link Profile',
    description: 'Monitor every backlink pointing to your site with detailed metrics like DR, anchor text, and link type.',
  },
  {
    icon: TrendingUp,
    title: 'Link Velocity Tracking',
    description: 'See links gained and lost over time. Get alerts when you lose high-value links.',
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    description: 'Discover where competitors get their best links. Find link building opportunities they\'re using.',
  },
  {
    icon: Shield,
    title: 'Toxic Link Detection',
    description: 'Automatically identify spammy or harmful links. Generate disavow files with one click.',
  },
  {
    icon: Target,
    title: 'Link Opportunities',
    description: 'AI-powered suggestions for high-quality link targets based on your niche and competitors.',
  },
  {
    icon: Zap,
    title: 'Automated Outreach',
    description: 'Built-in outreach tools to contact webmasters and track your link building campaigns.',
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
                <Link2 className="size-4 text-primary" />
                <span>Backlinks</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">10M+ links monitored</span>
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
              Build links that
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                actually move rankings
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
            Monitor your complete backlink profile, track competitor links, and discover <strong className="font-semibold text-foreground">high-quality opportunities</strong>. 
            Never lose a valuable link without knowing.
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

          {/* Tool Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 flex flex-col items-center gap-4"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Import data from your favorite tools
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {BACKLINK_TOOLS.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                  className="flex items-center justify-center transition-opacity hover:opacity-80"
                >
                  <Image
                    src={tool.src}
                    alt={tool.name}
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
              src="/assets/hero/screen9-light.png"
              alt="Backlinks Dashboard"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen9-dark.png"
              alt="Backlinks Dashboard"
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
          <TextGenerateWithSelectBoxEffect words="Your Link Profile Is Leaking Authority. Every Day." />
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
              Complete backlink intelligence
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Monitor every link, track competitors, and discover opportunities to build authority faster.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* Backlink Metrics Card */}
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
                      <Link2 className="size-5 text-primary" />
                      Link Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Your complete backlink overview
                    </p>
                    {BACKLINK_METRICS.map((metric, index) => (
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

              {/* Backlink Growth Chart */}
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
                      Backlink Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Total backlinks and referring domains over time
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={BACKLINK_GROWTH_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="backlinks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                            <stop offset="50%" stopColor="#34d399" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="domains" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.5} />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="backlinks" stroke="#10b981" fill="url(#backlinks)" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="domains" stroke="#8b5cf6" fill="url(#domains)" strokeWidth={2.5} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Link Quality Distribution */}
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
                      <Shield className="size-5 text-primary" />
                      Link Quality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Distribution by domain rating
                    </p>
                    <div className="space-y-4">
                      {LINK_QUALITY.map((item, i) => (
                        <div key={item.type} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{item.type}</span>
                            <span className="text-sm font-semibold">{item.percentage}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.percentage}%` }}
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

              {/* Link Velocity Card */}
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
                      Link Velocity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Links gained vs lost weekly
                    </p>
                    <ChartContainer config={{}} className="h-[150px] w-full">
                      <BarChart data={LINK_VELOCITY_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <Bar dataKey="gained" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="lost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                    <div className="mt-3 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
                        <span>Gained</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                        <span>Lost</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Link Activity */}
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
                      <Eye className="size-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Latest link changes
                    </p>
                    {[
                      { text: 'New link from techcrunch.com (DR 92)', type: 'new', time: '2 hours ago' },
                      { text: 'Lost link from medium.com (DR 74)', type: 'lost', time: '5 hours ago' },
                      { text: 'New link from forbes.com (DR 95)', type: 'new', time: '1 day ago' },
                    ].map((activity, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        {activity.type === 'new' ? (
                          <CheckCircle2 className="mt-0.5 size-4 text-green-500" />
                        ) : (
                          <XCircle className="mt-0.5 size-4 text-red-500" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{activity.text}</p>
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
              Everything you need for link building success
            </h2>
            <p className="mb-8 text-muted-foreground">
              From monitoring to outreach, get all the tools you need to build a powerful backlink profile that drives rankings.
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
                src="/assets/hero/screen9-light.png"
                alt="Backlink Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen9-dark.png"
                alt="Backlink Features"
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
            "We discovered we'd lost 400+ backlinks over 6 months without knowing. SearchFIT helped us recover 
            <span className="text-primary"> 60% of them</span> and our rankings bounced back within weeks."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">David Park</p>
            <p className="text-sm text-muted-foreground">Head of SEO, ScaleUp Agency</p>
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
              Start building a stronger link profile
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join thousands of SEO professionals using SearchFIT to monitor, analyze, and grow their backlink profiles.
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
export function BacklinksHero() {
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
