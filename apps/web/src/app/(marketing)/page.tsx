import * as React from 'react';

import { APP_NAME } from '@workspace/common/constants';

import { BottomCTA } from '@/components/marketing/sections/ContentHero';
import { FAQ } from '@/components/marketing/sections/Faq';
import { Hero } from '@/components/marketing/sections/Hero';
import { Logos } from '@/components/marketing/sections/Logos';
import { Problem } from '@/components/marketing/sections/Problem';
import { Solution } from '@/components/marketing/sections/Solution';
import { Stats } from '@/components/marketing/sections/Stats';
import { Testimonials } from '@/components/marketing/sections/Testimonials';
import { IntegrationScroll } from '@/components/marketing/sections/IntegrationScroll';
import { FAQPageJsonLd } from '@/components/marketing/JsonLd';

const HOME_FAQS = [
  {
    question: `What is ${APP_NAME} and why do I need it?`,
    answer: `${APP_NAME} is the first Answer Engine Optimization (AEO) platform. While your competitors are being recommended by ChatGPT, Claude, and Perplexity, most brands have 0% visibility. We track exactly how you appear in AI search results, show you the competitive gap, and help you optimize your content to get recommended.`,
  },
  {
    question: 'What is Answer Engine Optimization (AEO)?',
    answer: `AEO is the next evolution of search. Unlike traditional SEO where Google ranks pages, AI engines like ChatGPT synthesize answers and recommend brands directly. They don't link to your website—they either mention your brand or they don't. AEO is the practice of optimizing your digital presence so AI engines cite and recommend you when answering buying questions in your category.`,
  },
  {
    question: 'Which AI search engines do you track?',
    answer: `We track all major AI search platforms: ChatGPT (OpenAI), Claude (Anthropic), Perplexity AI, Google Gemini, and emerging AI engines. We monitor real-time queries in your category, track brand mentions, analyze sentiment, and show you exactly how you compare to competitors across every platform that matters.`,
  },
  {
    question: 'How do I know if my brand is visible in AI search?',
    answer: `Check yours in 90 seconds with our free AEO Grader. Enter your brand name and we'll show you: your Visibility Score across AI engines, how many times you're mentioned vs. competitors, sentiment analysis of your brand mentions, and the exact queries where you're missing opportunities. Most brands are shocked to see they have 0% visibility.`,
  },
  {
    question: "Why can't I just use Semrush or Ahrefs?",
    answer: `Traditional SEO tools track Google rankings and backlinks—but AI engines don't work that way. ChatGPT doesn't care about your Domain Authority or keyword rankings. It synthesizes information from multiple sources to recommend brands directly. ${APP_NAME} is purpose-built for AEO: we track how AI models actually respond to buying questions and whether your brand gets recommended.`,
  },
  {
    question: `What results can I expect from using ${APP_NAME}?`,
    answer: `Brands using ${APP_NAME} see measurable improvements in AI visibility within 30-60 days. Our platform shows you: competitor gaps to exploit, content opportunities AI engines prefer, citation strategies that increase mentions, and real-time tracking so you know what's working.`,
  },
  {
    question: 'What does your platform include?',
    answer: `${APP_NAME} gives you: Real-time AEO tracking across all major AI engines, Competitor analysis showing exactly how you compare, AI content optimization tools to improve your mentions, Citation monitoring to see where AI engines source your brand, Automated reporting with actionable recommendations, and Visual workflows to scale your AEO strategy.`,
  },
  {
    question: 'How quickly will I see my visibility data?',
    answer: `Immediately. Run a free AEO audit and see your Visibility Score in under 90 seconds. You'll instantly see how you compare to competitors, where you're being mentioned (or not), and your biggest opportunities.`,
  },
  {
    question: `Can I try ${APP_NAME} before committing?`,
    answer: `Yes! Start with our free AEO Grader to see your current AI visibility in 90 seconds. Our Growth plan includes a 7-day free trial with full access to competitor tracking, content optimization, and automated reporting.`,
  },
];

export default function IndexPage(): React.JSX.Element {
  return (
    <>
      <FAQPageJsonLd faqs={HOME_FAQS} />
      <Hero />
      <Logos />
      <Problem />
      <Solution />
      <Stats />
      <Testimonials />
      <FAQ />
      <IntegrationScroll />
      <BottomCTA />
    </>
  );
}
