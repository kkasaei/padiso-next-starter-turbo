import * as React from 'react';
import { CircleCheckBigIcon } from 'lucide-react';

import { AiAdvisorCard } from '@/components/modules/marketing/cards/ai-advisor-card';
import { BentoAnalyticsCard } from '@/components/modules/marketing/cards/bento-analytics-card';
import { BentoCampaignsCard } from '@/components/modules/marketing/cards/bento-campaigns-card';
import { BentoCustomersCard } from '@/components/modules/marketing/cards/bento-customers-card';
import { BentoMagicInboxCard } from '@/components/modules/marketing/cards/bento-magic-inbox-card';
import { BentoPipelinesCard } from '@/components/modules/marketing/cards/bento-pipelines-card';
import { GridSection } from '@/components/modules/fragments/grid-section';

export function Solution(): React.JSX.Element {
  return (
    <GridSection>
      <div className="bg-diagonal-lines">
        <div className="flex flex-col gap-24 bg-background py-20 lg:mx-12 lg:border-x">
          <div className="container relative space-y-10">
            <div>
              <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
                Own AI Search. Before Your Competitors Do.
              </h2>
              <p className="mt-1 max-w-2xl text-muted-foreground md:mt-6">
                SearchFit is the first platform built for Answer Engine Optimization (AEO). Track your visibility across ChatGPT, Perplexity, Claude, and emerging AI engines. Generate content that gets recommended by AI. Monitor competitors. Scale your AI search presence—all in one platform.
              </p>
            </div>
            <div className="mx-auto xl:container xl:rounded-xl xl:bg-neutral-50 xl:p-6 dark:xl:bg-neutral-900">
              <div className="grid auto-rows-[minmax(200px,auto)] grid-cols-12 gap-6">
                <BentoCustomersCard
                  className="col-span-12 md:col-span-6 xl:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
                <BentoPipelinesCard
                  className="col-span-12 md:col-span-6 xl:col-span-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <BentoAnalyticsCard
                  className="col-span-12 md:col-span-6 xl:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
                <BentoCampaignsCard
                  className="col-span-12 md:col-span-6 xl:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                />
                <BentoMagicInboxCard
                  className="col-span-12 md:col-span-6 xl:col-span-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                />
              </div>
            </div>
            <div className="-ml-8 w-[calc(100%+64px)] border-t border-dashed sm:-ml-20 sm:w-[calc(100%+160px)]" />
            <div className="grid gap-10 sm:container lg:grid-cols-2">
              <div className="order-1 lg:order-2">
                <h2 className="mb-2.5 mt-8 text-3xl font-semibold md:text-5xl">
                  Everything you need to dominate AI search
                </h2>
                <p className="mt-1 text-muted-foreground md:mt-6">
                  From zero visibility to top-of-mind recommendation in AI engines. SearchFit gives you the tools to track, optimize, and scale your presence across ChatGPT, Perplexity, Claude, Gemini, and every AI platform that matters.
                </p>
                <ul className="mt-6 list-none flex-wrap items-center gap-6 space-y-3 md:flex md:space-y-0">
                  {[
                    'Real-time AEO visibility tracking',
                    'AI search competitor analysis',
                    'Content optimized for AI recommendations',
                    'Multi-platform AI engine monitoring',
                    'Answer citation optimization',
                    'Automated AI search reporting'
                  ].map((feature) => (
                    <li
                      key={feature}
                      className="flex flex-row items-center gap-2"
                    >
                      <CircleCheckBigIcon className="size-4 shrink-0 text-primary" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-2 md:order-1">
                <AiAdvisorCard className="w-full max-w-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
