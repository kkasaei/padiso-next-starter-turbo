import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check } from 'lucide-react';
import { Waitlist } from '@clerk/nextjs';

export default function WaitlistPage(): React.JSX.Element {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Column - Information */}
      <div className="flex flex-col justify-center bg-background px-8 py-12 lg:px-20 lg:py-16 xl:px-28">
        <div className="mx-auto w-full max-w-xl space-y-12">
          {/* Back to Homepage Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back to homepage</span>
          </Link>

          {/* Header Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">
                Coming Soon
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Join the Future of{' '}
                <span className="text-primary">
                  AI-Powered Marketing
                </span>
              </h1>
              <p className="text-xl font-semibold leading-snug text-foreground/90">
                Your competitors are showing up in ChatGPT. Are you?
              </p>

              {/* AI Platform Logos */}
              <div className="flex items-center gap-6 pt-2">
                <div className="relative size-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <Image
                    src="/icons/openai.svg"
                    alt="OpenAI"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative size-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <Image
                    src="/icons/perplexity-color.svg"
                    alt="Perplexity"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative size-8 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <Image
                    src="/icons/gemini-color.svg"
                    alt="Gemini"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground">+ more</span>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Complete AI search visibility</h3>
                <p className="mt-1 text-sm text-muted-foreground">Track your presence across ChatGPT, Perplexity, Claude, and Gemini</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Actionable intelligence</h3>
                <p className="mt-1 text-sm text-muted-foreground">See trends and get clear insights from our AI assistant</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Automated content solutions</h3>
                <p className="mt-1 text-sm text-muted-foreground">Generate AI-optimized content that closes visibility gaps</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Limited time offer for early adopters</h3>
                <p className="mt-1 text-sm text-muted-foreground">Special consideration for early adopters plus priority access to founders</p>
              </div>
            </div>
          </div>

          {/* Stat Callout */}
          <div className="border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">40% of Gen Z</span> now starts with ChatGPT, not Google
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Clerk Waitlist Component */}
      <div className="flex items-center justify-center bg-muted/30 px-8 py-12 lg:px-16 lg:py-16">
          <div className="w-full max-w-md">
            <Waitlist
              appearance={{
                elements: {
                  rootBox: 'mx-auto',
                  card: 'shadow-2xl border-border',
                  headerTitle: 'text-foreground',
                  headerSubtitle: 'text-muted-foreground',
                  formButtonPrimary:
                    'bg-primary text-primary-foreground hover:bg-primary/90',
                  formFieldInput:
                    'border-input bg-background text-foreground',
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }

