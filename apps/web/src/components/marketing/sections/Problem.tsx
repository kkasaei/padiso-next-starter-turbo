import * as React from 'react';
import { ClockIcon, PuzzleIcon, TrendingUpIcon } from 'lucide-react';

import { BlurFade } from '@/components/shared/fragments/BlurFade';
import { GridSection } from '@/components/shared/fragments/GridSection';
import { TextGenerateWithSelectBoxEffect } from '@/components/shared/fragments/TextGenerateWithSelectBoxEffect';

const DATA = [
  {
    icon: <ClockIcon className="size-5 shrink-0" />,
    title: 'AI Search Is Replacing Traditional Search',
    description:
      '40% of Gen Z now prefers ChatGPT over Google for search. AI engines are answering buying questions and recommending brands in real-time. If you\'re not visible in these AI results, you\'re losing customers to competitors who are.'
  },
  {
    icon: <PuzzleIcon className="size-5 shrink-0" />,
    title: 'Your Competitors Are Already There',
    description:
      'While you optimize for Google, your competitors are being recommended by ChatGPT, Perplexity, and Claude. Most brands have 0% visibility in AI search results—but some are capturing this untapped traffic before you even know to compete.'
  },
  {
    icon: <TrendingUpIcon className="size-5 shrink-0" />,
    title: 'Traditional SEO Won\'t Save You',
    description:
      'AI engines don\'t rank pages—they synthesize answers from multiple sources and recommend brands directly. You need Answer Engine Optimization (AEO) to be visible where modern search is actually happening.'
  }
];

export function Problem(): React.JSX.Element {
  return (
    <GridSection>
      <div className="px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          <TextGenerateWithSelectBoxEffect words="Search Has Changed. Your Strategy Hasn't." />
        </h2>
      </div>
      <div className="grid divide-y border-t border-dashed md:grid-cols-3 md:divide-x md:divide-y-0">
        {DATA.map((statement, index) => (
          <BlurFade
            key={index}
            inView
            delay={0.2 + index * 0.2}
            className="border-dashed px-8 py-12"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border bg-background shadow">
              {statement.icon}
            </div>
            <h3 className="mb-3 text-lg font-semibold">{statement.title}</h3>
            <p className="text-muted-foreground">{statement.description}</p>
          </BlurFade>
        ))}
      </div>
    </GridSection>
  );
}
