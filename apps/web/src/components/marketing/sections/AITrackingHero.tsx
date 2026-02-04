'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Area, AreaChart, Bar, BarChart, Line, LineChart } from 'recharts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  BarChart3,
  Bell,
  Target,
  Zap,
  LineChart as LineChartIcon,
  Users,
  Search,
  Globe,
  Bot,
  CheckCircle2,
  ClockIcon,
  PuzzleIcon,
  Quote,
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

// AI Platform icons
const AI_PLATFORMS = [
  { name: 'OpenAI', src: '/icons/openai.svg' },
  { name: 'Perplexity', src: '/icons/perplexity.svg' },
  { name: 'Claude', src: '/icons/claude.svg' },
  { name: 'Gemini', src: '/icons/gemini.svg' },
  { name: 'Grok', src: '/icons/grok.svg' },
  { name: 'DeepSeek', src: '/icons/deepseek.svg' },
];

// Chart data
const VISIBILITY_DATA = [
  { month: 'Jan', chatgpt: 12, perplexity: 8, claude: 5 },
  { month: 'Feb', chatgpt: 18, perplexity: 15, claude: 12 },
  { month: 'Mar', chatgpt: 25, perplexity: 22, claude: 18 },
  { month: 'Apr', chatgpt: 32, perplexity: 28, claude: 24 },
  { month: 'May', chatgpt: 45, perplexity: 38, claude: 32 },
  { month: 'Jun', chatgpt: 58, perplexity: 48, claude: 42 },
];

const MENTION_DATA = [
  { name: 'Week 1', value: 24 },
  { name: 'Week 2', value: 38 },
  { name: 'Week 3', value: 32 },
  { name: 'Week 4', value: 56 },
  { name: 'Week 5', value: 48 },
  { name: 'Week 6', value: 72 },
];

// Stats data
const STATS = [
  { value: 6, suffix: '+', description: 'AI Platforms Tracked' },
  { value: 500, suffix: 'K+', description: 'Prompts Monitored Daily' },
  { value: 94, suffix: '%', description: 'Detection Accuracy' },
  { value: 24, suffix: '/7', description: 'Real-time Monitoring' },
];

// Problem statements
const PROBLEMS = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'AI Is Answering Before Google',
    description: 'Users are getting direct recommendations from ChatGPT and Perplexity before they even reach your website. If AI doesn\'t mention you, you\'re invisible to a growing audience.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'You Can\'t Optimize What You Can\'t See',
    description: 'Traditional analytics don\'t show AI visibility. You have no idea how often AI recommends you, your competitors, or ignores your industry entirely.'
  },
  {
    icon: <TrendingUp className="size-5 shrink-0" />,
    title: 'Competitors Are Capturing AI Traffic',
    description: 'Some brands are already optimizing for AI recommendations. Every day you wait, they\'re building authority that compounds over time.'
  }
];

// Visibility scores
const VISIBILITY_SCORES = [
  { platform: 'ChatGPT', score: 78, change: '+12%' },
  { platform: 'Perplexity', score: 65, change: '+8%' },
  { platform: 'Claude', score: 52, change: '+15%' },
  { platform: 'Gemini', score: 41, change: '+22%' },
];

// Features
const FEATURES = [
  {
    icon: Globe,
    title: 'Multi-Platform Monitoring',
    description: 'Track mentions across ChatGPT, Perplexity, Claude, Gemini, and emerging AI platforms in real-time.',
  },
  {
    icon: Users,
    title: 'Competitor Intelligence',
    description: 'See exactly when and how competitors are recommended. Identify gaps and opportunities.',
  },
  {
    icon: Target,
    title: 'Prompt Analysis',
    description: 'Understand which prompts and questions trigger recommendations of your brand.',
  },
  {
    icon: LineChartIcon,
    title: 'Trend Tracking',
    description: 'Historical data and trend analysis to measure optimization impact over time.',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Instant notifications when visibility changes, competitors move, or opportunities arise.',
  },
  {
    icon: Zap,
    title: 'Actionable Insights',
    description: 'AI-powered recommendations on how to improve your visibility scores.',
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
                <TrendingUp className="size-4 text-primary" />
                <span>AI Tracking</span>
                <Separator orientation="vertical" className="mx-1 h-4" />
                <span className="text-muted-foreground">Track 6+ AI platforms</span>
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
              Know when AI
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                recommends your business
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
            Track your visibility across <strong className="font-semibold text-foreground">ChatGPT, Perplexity, Claude, and Gemini</strong>. 
            Understand how AI platforms perceive and recommend your brand to potential customers.
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
              Track across all major AI platforms
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {AI_PLATFORMS.map((platform, index) => (
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
                    width={100}
                    height={32}
                    className="h-7 w-auto brightness-0 dark:invert md:h-9"
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

// Product Screenshot with tabs
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
              alt="AI Tracking Dashboard"
              width={1328}
              height={727}
              className="block w-full dark:hidden"
              priority
            />
            <Image
              src="/assets/hero/screen1-dark.png"
              alt="AI Tracking Dashboard"
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
          <TextGenerateWithSelectBoxEffect words="You're Invisible to AI Search. Here's Why It Matters." />
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
              Real-time AI visibility intelligence
            </h2>
            <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
              Get instant insights into how AI platforms perceive and recommend your brand. Track trends, monitor competitors, and optimize for AI search.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
            <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
              
              {/* Visibility Score Card */}
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
                      <Eye className="size-5 text-primary" />
                      Visibility Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Real-time visibility scores across all AI platforms
                    </p>
                    {VISIBILITY_SCORES.map((item, index) => (
                      <motion.div
                        key={item.platform}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.platform}</span>
                          <span className="text-xs text-green-600">{item.change}</span>
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

              {/* Trend Chart Card */}
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
                      Visibility Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Track your AI visibility growth across platforms over time
                    </p>
                    <ChartContainer config={{}} className="h-[200px] w-full">
                      <AreaChart data={VISIBILITY_DATA} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="chatgpt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="perplexity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="chatgpt" stroke="hsl(var(--primary))" fill="url(#chatgpt)" strokeWidth={2} />
                        <Area type="monotone" dataKey="perplexity" stroke="hsl(var(--chart-2))" fill="url(#perplexity)" strokeWidth={2} />
                        <Area type="monotone" dataKey="claude" stroke="hsl(var(--chart-3))" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Mentions Card */}
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
                      <BarChart3 className="size-5 text-primary" />
                      Weekly Mentions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Brand mentions detected across AI responses
                    </p>
                    <ChartContainer config={{}} className="h-[150px] w-full">
                      <BarChart data={MENTION_DATA} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Competitor Card */}
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
                      <Users className="size-5 text-primary" />
                      Competitor Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Monitor competitor visibility vs yours
                    </p>
                    <div className="space-y-3">
                      {[
                        { name: 'You', value: 72, color: 'bg-primary' },
                        { name: 'Competitor A', value: 58, color: 'bg-chart-2' },
                        { name: 'Competitor B', value: 45, color: 'bg-chart-3' },
                        { name: 'Competitor C', value: 31, color: 'bg-chart-4' },
                      ].map((item, i) => (
                        <div key={item.name} className="flex items-center gap-3">
                          <span className="w-24 text-sm">{item.name}</span>
                          <div className="flex-1 rounded-full bg-muted h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.value}%` }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                              className={cn('h-2 rounded-full', item.color)}
                            />
                          </div>
                          <span className="w-8 text-right text-sm font-medium">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Alerts Card */}
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
                      <Bell className="size-5 text-primary" />
                      Smart Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Recent AI visibility changes
                    </p>
                    {[
                      { text: 'Visibility increased +15% on ChatGPT', time: '2 hours ago', positive: true },
                      { text: 'New competitor detected in AI results', time: '5 hours ago', positive: false },
                      { text: 'Mentioned in 23 new prompts today', time: '8 hours ago', positive: true },
                    ].map((alert, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                        className="flex items-start gap-3 rounded-lg border p-3"
                      >
                        <div className={cn('mt-0.5 size-2 rounded-full', alert.positive ? 'bg-green-500' : 'bg-amber-500')} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.text}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
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
              Everything you need to dominate AI search
            </h2>
            <p className="mb-8 text-muted-foreground">
              From zero visibility to top-of-mind recommendation in AI engines. Get the tools to track, optimize, and scale your presence.
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
                alt="AI Tracking Features"
                width={600}
                height={400}
                className="block w-full dark:hidden"
              />
              <Image
                src="/assets/hero/screen4-dark.png"
                alt="AI Tracking Features"
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
            "SearchFIT showed us we had 0% visibility in ChatGPT. Within 3 months of optimizing, we're now recommended in 
            <span className="text-primary"> 45% of relevant queries</span>. That's traffic we were completely missing."
          </blockquote>
          <div className="mt-8">
            <p className="font-semibold">Sarah Chen</p>
            <p className="text-sm text-muted-foreground">VP of Marketing, TechFlow Solutions</p>
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
              Start tracking your AI visibility today
            </h2>
          </BlurFade>
          <BlurFade inView delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Join brands already using SearchFIT to monitor and improve their presence in AI search results.
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
export function AITrackingHero() {
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
