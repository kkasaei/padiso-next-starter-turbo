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
  MessageSquare,
  Heart,
  Share2,
  Bell,
  Target,
  Zap,
  Users,
  Search,
  Globe,
  ClockIcon,
  PuzzleIcon,
  Quote,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Smile,
  Frown,
  Meh,
  Hash,
  AtSign,
  Radio,
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

// Social platform icons
const SOCIAL_PLATFORMS = [
  { name: 'Reddit', src: '/icons/rsshub-color.svg' },
  { name: 'Twitter/X', src: '/icons/github.svg' },
  { name: 'LinkedIn', src: '/icons/meta.svg' },
  { name: 'YouTube', src: '/icons/bilibili-color.svg' },
  { name: 'Hacker News', src: '/icons/coze.svg' },
  { name: 'Product Hunt', src: '/icons/craft.svg' },
];

// Mentions trend data
const MENTIONS_DATA = [
  { day: 'Mon', mentions: 45, sentiment: 72 },
  { day: 'Tue', mentions: 52, sentiment: 78 },
  { day: 'Wed', mentions: 38, sentiment: 65 },
  { day: 'Thu', mentions: 67, sentiment: 82 },
  { day: 'Fri', mentions: 89, sentiment: 85 },
  { day: 'Sat', mentions: 72, sentiment: 79 },
  { day: 'Sun', mentions: 58, sentiment: 76 },
];

// Platform distribution data
const PLATFORM_DATA = [
  { name: 'Reddit', mentions: 234 },
  { name: 'Twitter', mentions: 189 },
  { name: 'LinkedIn', mentions: 145 },
  { name: 'YouTube', mentions: 98 },
];

// Stats data
const STATS = [
  { value: 50, suffix: '+', description: 'Platforms Monitored' },
  { value: 1, suffix: 'M+', description: 'Daily Mentions Tracked' },
  { value: 95, suffix: '%', description: 'Sentiment Accuracy' },
  { value: 5, suffix: 'min', description: 'Alert Response Time' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'You\'re Missing Conversations',
    description: 'People are talking about your brand on Reddit, Twitter, and forums right now. Without monitoring, you\'re missing opportunities to engage and convert.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'Competitors Move Faster',
    description: 'When someone asks for recommendations in your niche, competitors respond first. By the time you see it, the opportunity is gone.'
  },
  {
    icon: <TrendingDown className="size-5 shrink-0" />,
    title: 'Reputation Issues Spread Fast',
    description: 'Negative mentions can go viral before you even know they exist. Early detection is the difference between a small issue and a PR crisis.'
  }
];

// Mention metrics
const MENTION_METRICS = [
  { label: 'Total Mentions', value: '2,847', change: '+23%', positive: true },
  { label: 'Positive Sentiment', value: '78%', change: '+5%', positive: true },
  { label: 'Engagement Rate', value: '12.4%', change: '+2.1%', positive: true },
  { label: 'Share of Voice', value: '34%', change: '+8%', positive: true },
];

// Sentiment breakdown
const SENTIMENT_DATA = [
  { type: 'Positive', percentage: 62, color: 'hsl(var(--chart-1))' },
  { type: 'Neutral', percentage: 28, color: 'hsl(var(--chart-2))' },
  { type: 'Negative', percentage: 10, color: 'hsl(var(--chart-4))' },
];

// Features
const FEATURES = [
  {
    icon: Radio,
    title: 'Real-time Monitoring',
    description: 'Track brand mentions across 50+ platforms including Reddit, Twitter, LinkedIn, and niche forums.',
  },
  {
    icon: Smile,
    title: 'Sentiment Analysis',
    description: 'AI-powered sentiment detection tells you if mentions are positive, negative, or neutral.',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Get notified immediately when important conversations happen or sentiment shifts.',
  },
  {
    icon: Users,
    title: 'Competitor Tracking',
    description: 'Monitor competitor mentions to understand their share of voice and customer sentiment.',
  },
  {
    icon: Hash,
    title: 'Trend Detection',
    description: 'Identify emerging topics and hashtags relevant to your brand before they peak.',
  },
  {
    icon: Target,
    title: 'Engagement Opportunities',
    description: 'AI highlights high-value conversations where your response could drive conversions.',
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
                <Radio className="size-4 text-primary" />
                <span>Social Listening</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">50+ platforms</span>
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
              Never miss a
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                conversation about your brand
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
            Monitor brand mentions across <strong className="font-semibold text-foreground">Reddit, Twitter, LinkedIn, and 50+ platforms</strong>. 
            Get instant alerts and engage at the right moment.
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
              Monitor conversations across
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {SOCIAL_PLATFORMS.map((platform, index) => (
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
              src="/assets/hero/screen1-light.png"
              alt="Social Listening Dashboard"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen1-dark.png"
              alt="Social Listening Dashboard"
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
          <TextGenerateWithSelectBoxEffect words="People Are Talking About You Right Now. Are You Listening?" />
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
              Your brand's pulse across the internet
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Track every mention, understand sentiment, and engage with your audience at the perfect moment.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* Mention Metrics Card */}
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
                      Mention Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This week's brand performance
                    </p>
                    {MENTION_METRICS.map((metric, index) => (
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

              {/* Mentions Trend Chart */}
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
                      Mentions & Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Daily mentions and sentiment score trend
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={MENTIONS_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="mentions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="sentiment" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="mentions" stroke="hsl(var(--primary))" fill="url(#mentions)" strokeWidth={2} />
                        <Area type="monotone" dataKey="sentiment" stroke="hsl(var(--chart-1))" fill="url(#sentiment)" strokeWidth={2} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                    <div className="mt-3 flex items-center justify-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-primary" />
                        <span>Mentions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-chart-1" />
                        <span>Sentiment Score</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sentiment Breakdown Card */}
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
                      <Smile className="size-5 text-primary" />
                      Sentiment Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      How people feel about your brand
                    </p>
                    <div className="space-y-4">
                      {SENTIMENT_DATA.map((item, i) => (
                        <div key={item.type} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {item.type === 'Positive' && <Smile className="size-4 text-green-500" />}
                              {item.type === 'Neutral' && <Meh className="size-4 text-amber-500" />}
                              {item.type === 'Negative' && <Frown className="size-4 text-red-500" />}
                              <span className="text-sm font-medium">{item.type}</span>
                            </div>
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

              {/* Platform Distribution Card */}
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
                      <Globe className="size-5 text-primary" />
                      Top Platforms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Where mentions are happening
                    </p>
                    <div className="space-y-4">
                      {PLATFORM_DATA.map((platform, i) => (
                        <div key={platform.name} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{platform.name}</span>
                            <span className="text-sm font-semibold">{platform.mentions}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(platform.mentions / 234) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                              className="h-2 rounded-full bg-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Mentions Card */}
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
                      <MessageSquare className="size-5 text-primary" />
                      Recent Mentions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Latest brand conversations
                    </p>
                    {[
                      { platform: 'Reddit', text: '"Just switched to SearchFIT, amazing tool!"', sentiment: 'positive', time: '5 min ago' },
                      { platform: 'Twitter', text: '"Anyone tried SearchFIT for SEO tracking?"', sentiment: 'neutral', time: '23 min ago' },
                      { platform: 'LinkedIn', text: '"Our team loves the analytics dashboard"', sentiment: 'positive', time: '1 hour ago' },
                    ].map((mention, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="rounded-lg border p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">{mention.platform}</Badge>
                          {mention.sentiment === 'positive' ? (
                            <Smile className="size-4 text-green-500" />
                          ) : (
                            <Meh className="size-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm">{mention.text}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{mention.time}</p>
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
              Everything you need to own your brand narrative
            </h2>
            <p className="mb-8 text-muted-foreground">
              From monitoring to engagement, get the tools you need to track, understand, and respond to every conversation about your brand.
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
                alt="Social Listening Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen4-dark.png"
                alt="Social Listening Features"
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
            "We caught a viral Reddit thread about our product 
            <span className="text-primary"> within 5 minutes</span>. Our response turned a potential complaint into our most upvoted testimonial ever."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Alex Rivera</p>
            <p className="text-sm text-muted-foreground">Community Manager, SaaS Startup</p>
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
              Start listening to what people say about you
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join brands using SearchFIT to monitor conversations and engage with their audience across 50+ platforms.
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
export function SocialListeningHero() {
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
