'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRightIcon,
  TrendingUpIcon,
  PenToolIcon,
  FileBarChartIcon,
  BarChart3Icon,
  MessageCircleIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@workspace/ui/components/badge';
import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area';
import { Separator } from '@workspace/ui/components/separator';
import {
  UnderlinedTabs,
  UnderlinedTabsContent,
  UnderlinedTabsList,
  UnderlinedTabsTrigger
} from '@workspace/ui/components/tabs';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';
import { AEODomainInput } from '@/components/marketing/sections/AeoDomainInput';

function HeroPill(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: -20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex w-full items-center justify-center overflow-x-hidden px-4"
    >
      <Link href="#" className="block w-full max-w-full overflow-hidden md:w-auto">
        <Badge
          variant="outline"
          className="group flex h-auto min-h-[32px] w-full max-w-full items-center justify-center overflow-hidden rounded-full px-2.5 py-1.5 text-[11px] font-medium shadow-xs duration-200 hover:bg-accent/50 sm:h-8 sm:px-3 sm:py-0 sm:text-xs md:w-auto md:text-sm"
        >
          <div className="shrink-0 whitespace-nowrap py-0.5 text-center text-[11px] text-blue-500 sm:text-xs md:text-sm">
            New!
          </div>
          <Separator
            orientation="vertical"
            className="mx-1.5 shrink-0 sm:mx-2"
          />
          <span className="min-w-0 flex-1 truncate text-left leading-tight sm:line-clamp-1 md:whitespace-nowrap">
            40% of Gen Z prefers ChatGPT to Google. Is your brand showing up?
          </span>
          <ChevronRightIcon className="ml-1 size-3 shrink-0 text-foreground transition-transform group-hover:translate-x-0.5 sm:ml-1.5" />
        </Badge>
      </Link>
    </motion.div>
  );
}

function AnimatedLogo(): React.JSX.Element {
  const aiLogos = [
    { name: 'Google', src: '/icons/google.svg' },
    { name: 'OpenAI', src: '/icons/openai.svg' },
    { name: 'Perplexity', src: '/icons/perplexity.svg' },
    { name: 'Claude', src: '/icons/claude.svg' },
    { name: 'Gemini', src: '/icons/gemini.svg' },
    { name: 'Grok', src: '/icons/xai.svg' },
    { name: 'DeepSeek', src: '/icons/deepseek.svg' },
  ];

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % aiLogos.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [aiLogos.length]);

  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20">
      {aiLogos.map((logo, index) => (
        <motion.span
          key={logo.name}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 0.8,
            y: index === currentIndex ? 0 : -10
          }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={80}
            height={80}
            className="h-full w-full brightness-0 dark:invert"
          />
        </motion.span>
      ))}
    </span>
  );
}

function HeroTitle(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="w-full overflow-x-hidden px-5 sm:px-4 md:px-2"
    >
      <h1 className="mt-8 w-full overflow-wrap-break-word text-balance text-center text-[30px] font-bold leading-[40px] tracking-[-0.6px] [font-kerning:none] sm:mt-8 sm:text-[40px] sm:leading-[50px] sm:tracking-[-0.8px] md:mt-6 md:text-[52px] md:leading-[62px] md:tracking-[-1px] lg:text-[64px] lg:leading-[76px] xl:text-[76px] xl:leading-[90px] xl:tracking-[-1.5px]">
        Your competitors are showing up in <AnimatedLogo />. Are you?
      </h1>
    </motion.div>
  );
}

function HeroDescription(): React.JSX.Element {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mx-auto mt-6 w-full max-w-[900px] overflow-x-hidden px-6 text-balance text-center text-[15px] leading-[26px] text-muted-foreground sm:mt-6 sm:text-base sm:leading-[26px] md:mt-6 md:text-lg md:leading-[28px] lg:text-xl lg:leading-[30px] xl:text-xl"
    >
      AI search engines are answering <strong className="font-semibold text-blue-600 dark:text-blue-400">buying questions right now and recommending your competitors</strong>. Most brands have <strong className="font-semibold text-blue-600 dark:text-blue-400">0% visibility</strong>. <strong className="font-semibold text-blue-600 dark:text-blue-400">Check yours in 90 seconds.</strong>
    </motion.p>
  );
}

function HeroIcon({ icon }: { icon: { name: string; src: string; color: string } }): React.JSX.Element {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      className="relative flex cursor-pointer items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ scale: isHovered ? 1.1 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Black/grayscale version (default) */}
      <Image
        src={icon.src}
        alt={icon.name}
        width={160}
        height={48}
        className="h-9 w-auto max-w-[85px] brightness-0 transition-opacity duration-200 dark:invert sm:h-10 sm:max-w-[110px] md:h-11 md:max-w-[130px] lg:h-14 lg:max-w-[160px]"
        style={{ opacity: isHovered ? 0 : 1 }}
      />
      {/* Colored version (on hover) */}
      <Image
        src={icon.src}
        alt={icon.name}
        width={160}
        height={48}
        className="absolute h-9 w-auto max-w-[85px] transition-opacity duration-200 sm:h-10 sm:max-w-[110px] md:h-11 md:max-w-[130px] lg:h-14 lg:max-w-[160px]"
        style={{ opacity: isHovered ? 1 : 0 }}
      />
    </motion.div>
  );
}

function HeroAIIcons(): React.JSX.Element {
  const icons = [
    { name: 'Google', src: '/icons/google.svg', color: '#4285f4' },
    { name: 'Bing', src: '/icons/bing.svg', color: '#00809d' },
    { name: 'OpenAI', src: '/icons/openai.svg', color: '#10a37f' },
    { name: 'Perplexity', src: '/icons/perplexity.svg', color: '#20808d' },
    { name: 'Gemini', src: '/icons/gemini.svg', color: '#4285f4' },
    { name: 'Claude', src: '/icons/claude.svg', color: '#d97706' },
    { name: 'Grok', src: '/icons/grok.svg', color: '#1d9bf0' },
    { name: 'DeepSeek', src: '/icons/deepseek.svg', color: '#0066ff' },
    { name: 'Shopify', src: '/icons/shopify_glyph_black.svg', color: '#95bf47' },
    { name: 'Reddit', src: '/icons/reddit.svg', color: '#ff4500' },
    { name: 'TikTok', src: '/icons/tiktok.svg', color: '#00f2ea' },
    { name: 'Meta', src: '/icons/meta.svg', color: '#0082fb' },
    { name: 'Amazon', src: '/icons/amazon.svg', color: '#ff9900' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="mx-auto flex w-full flex-col items-center justify-center gap-6 overflow-x-hidden px-5 sm:gap-6 sm:px-6 md:gap-4 lg:gap-4"
    >
      <span className="w-full max-w-[95%] overflow-x-hidden text-balance text-center text-[11px] font-medium uppercase leading-relaxed tracking-wide text-muted-foreground sm:max-w-[900px] sm:text-xs sm:tracking-wider md:text-xs lg:text-sm">
        <strong className="text-blue-600 dark:text-blue-400">SearchFit</strong> helps <strong className="text-blue-600 dark:text-blue-400">Agencies, B2B SaaS, and E-Commerce</strong> Brands <strong className="text-blue-600 dark:text-blue-400">be more visible</strong> where search is happening and{' '}
        <strong className="text-blue-600 dark:text-blue-400">generate content</strong> that ranks in AI search results—<strong className="text-blue-600 dark:text-blue-400">at scale!</strong>
      </span>
      <div className="flex w-full flex-wrap items-center justify-center gap-5 overflow-x-hidden py-2 sm:gap-6 md:gap-6 lg:gap-8">
        {icons.map((icon) => (
          <HeroIcon key={icon.name} icon={icon} />
        ))}
      </div>
    </motion.div>
  );
}

export function MainDashedGridLines(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px mask-[linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100%"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute bottom-[52px] left-[calc(50%-50vw)] hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
    </motion.div>
  );
}

export function SupportiveDashedGridLines(): React.JSX.Element {
  return (
    <>
      <svg className="absolute left-[calc(50%-50vw)] top-[-25px] z-10 hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute left-[calc(50%-50vw)] top-0 z-10 hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
      <svg className="absolute left-[calc(50%-50vw)] top-[52px] z-10 hidden h-px w-screen mask-[linear-gradient(to_right,#0000,#000_100px,#000_calc(100%-100px),#0000)] lg:block">
        <line
          x1="0"
          y1="0.5"
          x2="100%"
          y2="0.5"
          strokeLinecap="round"
          strokeDasharray="5 5"
          stroke="var(--border)"
        />
      </svg>
    </>
  );
}

export function HeroIllustration(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="relative px-2 sm:px-0"
    >
      <UnderlinedTabs defaultValue="ai-tracking">
        <ScrollArea className="max-w-screen lg:max-w-none">
          <UnderlinedTabsList className="relative z-20 mb-4 flex h-fit flex-row flex-wrap justify-center gap-1 sm:mb-6 sm:gap-0 md:flex-nowrap">
            <UnderlinedTabsTrigger
              value="ai-tracking"
              className="mx-0.5 px-2 text-xs sm:mx-1 sm:px-2.5 sm:text-sm md:mx-2 md:px-3"
            >
              <TrendingUpIcon className="mr-1.5 size-3.5 shrink-0 sm:mr-2 sm:size-4" />
              <span className="whitespace-nowrap">AI Tracking</span>
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger
              value="content"
              className="mx-0.5 px-2 text-xs sm:mx-1 sm:px-2.5 sm:text-sm md:mx-2 md:px-3"
            >
              <PenToolIcon className="mr-1.5 size-3.5 shrink-0 sm:mr-2 sm:size-4" />
              <span className="whitespace-nowrap">Content</span>
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger
              value="analytics"
              className="mx-0.5 px-2 text-xs sm:mx-1 sm:px-2.5 sm:text-sm md:mx-2 md:px-3"
            >
              <BarChart3Icon className="mr-1.5 size-3.5 shrink-0 sm:mr-2 sm:size-4" />
              <span className="whitespace-nowrap">Analytics</span>
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger
              value="technical-audit"
              className="mx-0.5 px-2 text-xs sm:mx-1 sm:px-2.5 sm:text-sm md:mx-2 md:px-3"
            >
              <FileBarChartIcon className="mr-1.5 size-3.5 shrink-0 sm:mr-2 sm:size-4" />
              <span className="whitespace-nowrap">Technical Audit</span>
            </UnderlinedTabsTrigger>
            <UnderlinedTabsTrigger
              value="social-listening"
              className="mx-0.5 px-2 text-xs sm:mx-1 sm:px-2.5 sm:text-sm md:mx-2 md:px-3"
            >
              <MessageCircleIcon className="mr-1.5 size-3.5 shrink-0 sm:mr-2 sm:size-4" />
              <span className="whitespace-nowrap">Social Listening</span>
            </UnderlinedTabsTrigger>
          </UnderlinedTabsList>
          <ScrollBar
            orientation="horizontal"
            className="invisible"
          />
        </ScrollArea>
        <div className="relative mb-1 w-full overflow-hidden rounded-lg dark:border-none dark:bg-background sm:rounded-xl">
          <SupportiveDashedGridLines />
          <div className="relative z-20 bg-background">
            <UnderlinedTabsContent value="ai-tracking">
              <Image
                priority
                quality={100}
                src="/assets/hero/screen1-light.png"
                width="1328"
                height="727"
                alt="AI Tracking screenshot"
                className="block h-auto w-full rounded-lg border shadow dark:hidden sm:rounded-xl"
              />
              <Image
                priority
                quality={100}
                src="/assets/hero/screen1-dark.png"
                width="1328"
                height="727"
                alt="AI Tracking screenshot"
                className="hidden h-auto w-full rounded-lg border shadow dark:block sm:rounded-xl"
              />
            </UnderlinedTabsContent>
            <UnderlinedTabsContent value="content">
              <Image
                quality={100}
                src="/assets/hero/screen2-light.png"
                width="1328"
                height="727"
                alt="Content screenshot"
                className="block h-auto w-full rounded-lg border shadow dark:hidden sm:rounded-xl"
              />
              <Image
                quality={100}
                src="/assets/hero/screen2-dark.png"
                width="1328"
                height="727"
                alt="Content screenshot"
                className="hidden h-auto w-full rounded-lg border shadow dark:block sm:rounded-xl"
              />
            </UnderlinedTabsContent>
            <UnderlinedTabsContent value="analytics">
              <Image
                quality={100}
                src="/assets/hero/screen3-light.png"
                width="1328"
                height="727"
                alt="Analytics screenshot"
                className="block h-auto w-full rounded-lg border shadow dark:hidden sm:rounded-xl"
              />
              <Image
                quality={100}
                src="/assets/hero/screen3-dark.png"
                width="1328"
                height="727"
                alt="Analytics screenshot"
                className="hidden h-auto w-full rounded-lg border shadow dark:block sm:rounded-xl"
              />
            </UnderlinedTabsContent>
            <UnderlinedTabsContent value="technical-audit">
              <Image
                quality={100}
                src="/assets/hero/screen4-light.png"
                width="1328"
                height="727"
                alt="Technical Audit screenshot"
                className="block h-auto w-full rounded-lg border shadow dark:hidden sm:rounded-xl"
              />
              <Image
                quality={100}
                src="/assets/hero/screen4-dark.png"
                width="1328"
                height="727"
                alt="Technical Audit screenshot"
                className="hidden h-auto w-full rounded-lg border shadow dark:block sm:rounded-xl"
              />
            </UnderlinedTabsContent>
            <UnderlinedTabsContent value="social-listening">
              <Image
                quality={100}
                src="/assets/hero/screen5-light.png"
                width="1328"
                height="727"
                alt="Social Listening screenshot"
                className="block h-auto w-full rounded-lg border shadow dark:hidden sm:rounded-xl"
              />
              <Image
                quality={100}
                src="/assets/hero/screen5-dark.png"
                width="1328"
                height="727"
                alt="Social Listening screenshot"
                className="hidden h-auto w-full rounded-lg border shadow dark:block sm:rounded-xl"
              />
            </UnderlinedTabsContent>
          </div>
        </div>
      </UnderlinedTabs>
    </motion.div>
  );
}

export function Hero(): React.JSX.Element {
  return (
    <GridSection className="w-full overflow-x-hidden">
      <MainDashedGridLines />
      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col overflow-x-hidden sm:mt-12 md:mt-14 lg:mt-16 xl:mt-20">
        <div className="flex w-full flex-col overflow-x-hidden">
          <HeroPill />
          <HeroTitle />
          <HeroDescription />
        </div>
        <div className="mt-10 w-full overflow-x-hidden px-3 sm:mt-12 sm:px-4 md:mt-12 md:px-6 lg:mt-12 lg:px-4">
          <AEODomainInput />
        </div>
        <div className="mt-16 w-full overflow-x-hidden sm:mt-18 md:mt-16 lg:mt-20">
          <HeroAIIcons />
        </div>
        <div className="mt-20 w-full overflow-x-hidden px-2 sm:mt-24 sm:px-4 md:mt-32 md:px-6 lg:mt-40 lg:px-4">
          <HeroIllustration />
        </div>
      </div>
    </GridSection>
  );
}
