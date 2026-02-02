import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@workspace/common/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';

const DATA = [
  {
    question: `What is ${APP_NAME} and why do I need it?`,
    answer: `${APP_NAME} is the first Answer Engine Optimization (AEO) platform. While your competitors are being recommended by ChatGPT, Claude, and Perplexity, most brands have 0% visibility. We track exactly how you appear in AI search results, show you the competitive gap, and help you optimize your content to get recommended. If you're not monitoring AI search, you're invisible to 40% of Gen Z who prefer ChatGPT over Google.`
  },
  {
    question: 'What is Answer Engine Optimization (AEO)?',
    answer: `AEO is the next evolution of search. Unlike traditional SEO where Google ranks pages, AI engines like ChatGPT synthesize answers and recommend brands directly. They don't link to your website—they either mention your brand or they don't. AEO is the practice of optimizing your digital presence so AI engines cite and recommend you when answering buying questions in your category.`
  },
  {
    question: 'Which AI search engines do you track?',
    answer: `We track all major AI search platforms: ChatGPT (OpenAI), Claude (Anthropic), Perplexity AI, Google Gemini, and emerging AI engines. We monitor real-time queries in your category, track brand mentions, analyze sentiment, and show you exactly how you compare to competitors across every platform that matters.`
  },
  {
    question: 'How do I know if my brand is visible in AI search?',
    answer: `Check yours in 90 seconds with our free AEO Grader. Enter your brand name and we'll show you: your Visibility Score across AI engines, how many times you're mentioned vs. competitors, sentiment analysis of your brand mentions, and the exact queries where you're missing opportunities. Most brands are shocked to see they have 0% visibility.`
  },
  {
    question: "Why can't I just use Semrush or Ahrefs?",
    answer: `Traditional SEO tools track Google rankings and backlinks—but AI engines don't work that way. ChatGPT doesn't care about your Domain Authority or keyword rankings. It synthesizes information from multiple sources to recommend brands directly. ${APP_NAME} is purpose-built for AEO: we track how AI models actually respond to buying questions and whether your brand gets recommended. It's a completely different channel requiring different optimization.`
  },
  {
    question: 'What results can I expect from using SearchFit?',
    answer: `Brands using ${APP_NAME} see measurable improvements in AI visibility within 30-60 days. Our platform shows you: competitor gaps to exploit, content opportunities AI engines prefer, citation strategies that increase mentions, and real-time tracking so you know what's working. The goal: go from 0% visibility to top-of-mind recommendation when AI engines answer buying questions in your category.`
  },
  {
    question: 'What does your platform include?',
    answer: `${APP_NAME} gives you: Real-time AEO tracking across all major AI engines, Competitor analysis showing exactly how you compare, AI content optimization tools to improve your mentions, Citation monitoring to see where AI engines source your brand, Automated reporting with actionable recommendations, and Visual workflows to scale your AEO strategy. Everything you need to dominate AI search in one platform.`
  },
  {
    question: 'How quickly will I see my visibility data?',
    answer: `Immediately. Run a free AEO audit and see your Visibility Score in under 90 seconds. You'll instantly see how you compare to competitors, where you're being mentioned (or not), and your biggest opportunities. No setup, no integration—just enter your brand name and discover whether your competitors are already winning in AI search while you're invisible.`
  },
  {
    question: 'Can I try SearchFit before committing?',
    answer: `Yes! Start with our free AEO Grader to see your current AI visibility in 90 seconds. Want more? Our Growth plan includes a 14-day free trial with full access to competitor tracking, content optimization, and automated reporting. See exactly how you stack up in AI search before spending a dollar.`
  }
];

export function FAQ(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%]">
              Haven&apos;t found what you&apos;re looking for? Try{' '}
              <Link
                href='/contact'
                className="font-normal text-inherit underline hover:text-foreground"
              >
                contacting
              </Link>{' '}
              us, we are glad to help.
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <Accordion
              type="single"
              collapsible
            >
              {DATA.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                >
                  <AccordionTrigger className="text-left text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
