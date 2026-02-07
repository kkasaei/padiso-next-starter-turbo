import * as React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check } from 'lucide-react';
import { FEATURE_FLAGS } from '@workspace/common';
import { WaitlistForm } from './WaitlistForm';

const AI_PLATFORMS = [
  { src: '/icons/openai.svg', alt: 'OpenAI' },
  { src: '/icons/perplexity-color.svg', alt: 'Perplexity' },
  { src: '/icons/claude-color.svg', alt: 'Claude' },
  { src: '/icons/gemini-color.svg', alt: 'Gemini' },
  { src: '/icons/grok.svg', alt: 'Grok' },
  { src: '/icons/deepseek-color.svg', alt: 'DeepSeek' },
];

const BENEFITS = [
  {
    title: 'Track AI search visibility in real time',
    description:
      'Monitor how your brand appears across ChatGPT, Perplexity, Claude, and Gemini — all from one dashboard.',
  },
  {
    title: 'Outpace competitors in AI recommendations',
    description:
      'See exactly who AI engines recommend instead of you and get actionable strategies to close the gap.',
  },
  {
    title: 'Generate content that AI engines recommend',
    description:
      'Create AEO-optimized content at scale with AI-powered pipelines that close visibility gaps.',
  },
  {
    title: 'Early adopter pricing & priority access',
    description:
      'Waitlist members get special pricing, direct access to founders, and first look at new features.',
  },
];

export default function WaitlistPage(): React.JSX.Element {
  if (!FEATURE_FLAGS.IS_WAITLIST) {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Column - Information */}
      <div className="flex flex-col justify-center bg-background px-8 py-12 lg:px-20 lg:py-16 xl:px-28">
        <div className="mx-auto w-full max-w-xl space-y-10">
          {/* Back to Homepage Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back to homepage</span>
          </Link>

          {/* Header Section */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                Coming Soon
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
                The First Platform for{' '}
                <span className="text-primary">
                  Answer Engine Optimization
                </span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                AI search engines are answering buying questions and recommending your competitors right now. Most brands have{' '}
                <span className="font-semibold text-foreground">0% visibility</span>.
                SearchFit changes that.
              </p>
            </div>

            {/* AI Platform Logos */}
            <div className="flex items-center gap-5 pt-1">
              {AI_PLATFORMS.map((platform) => (
                <div
                  key={platform.alt}
                  className="relative size-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                >
                  <Image
                    src={platform.src}
                    alt={platform.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
              <span className="text-xs font-medium text-muted-foreground">
                + more
              </span>
            </div>
          </div>

          {/* Who it's for */}
          <p className="text-sm text-muted-foreground">
            Built for{' '}
            <span className="font-medium text-foreground">Agencies</span>,{' '}
            <span className="font-medium text-foreground">B2B SaaS</span>, and{' '}
            <span className="font-medium text-foreground">E-Commerce</span>{' '}
            brands ready to own AI search.
          </p>

          {/* Benefits Section */}
          <div className="space-y-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="size-3 text-primary" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stat Callout */}
          <div className="border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">
                40% of Gen Z
              </span>{' '}
              now starts with ChatGPT, not Google.{' '}
              <span className="font-medium text-foreground">
                Traditional SEO won&apos;t save you
              </span>{' '}
              — AI engines don&apos;t rank pages, they recommend brands.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Waitlist Form */}
      <div className="flex items-center justify-center bg-muted/30 px-8 py-12 lg:px-16 lg:py-16">
        <WaitlistForm />
      </div>
    </div>
  );
}
