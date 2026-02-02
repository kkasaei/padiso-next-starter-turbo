import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@workspace/common/constants';
import { routes } from '@workspace/common';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';

import { GridSection } from '@workspace/ui/components/fragments/GridSection';

const DATA = [
  {
    question: `What pricing plans does ${APP_NAME} offer?`,
    answer: (
      <div>
        We offer two plans designed for different needs:
        <br />
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Growth Engine ($99/mo):</strong> Everything you need for AI visibility tracking, content generation, premium backlinks, and site audits.
          </li>
          <li>
            <strong>Scale Partner (Custom):</strong> Tailormade solutions for agencies, enterprises, and teams.
          </li>
        </ul>
        <p className="mt-2">Growth Engine includes a 7-day free trial. No credit card required to start.</p>
      </div>
    )
  },
  {
    question: "What's included in Growth Engine?",
    answer: (
      <div>
        Growth Engine ($99/mo) includes everything for sustainable organic growth:
        <ul className="mt-2 list-disc pl-5">
          <li>5 brands with 150 prompts tracked</li>
          <li>10 competitors & 50 keywords monitoring (coming soon)</li>
          <li>30 SEO & AI-optimized articles published monthly</li>
          <li>Premium backlinks from 2,500+ vetted partner sites - worth $800+/mo (coming soon)</li>
          <li>Real-time AI-driven research & expert-backed content</li>
          <li>Articles with citations, internal links & branded infographics</li>
          <li>Reddit agent that builds your brand visibility & authority (coming soon)</li>
          <li>JSON-LD schema markup for featured snippets</li>
          <li>Technical SEO audit (Google & AI crawlability)</li>
          <li>Visibility dashboard with weekly refresh</li>
          <li>Integrates with WordPress, Webflow, Shopify, Wix & API</li>
          <li>Webhook support & weekly email digest</li>
          <li>Email support (24hr response)</li>
          <li>Articles available in 20+ languages (add-on)</li>
        </ul>
      </div>
    )
  },
  {
    question: 'What is Scale Partner?',
    answer: (
      <div>
        Scale Partner is designed for agencies, enterprises, and teams with custom needs:
        <ul className="mt-2 list-disc pl-5">
          <li>Tailormade solution for your needs</li>
          <li>Dedicated Customer Success Manager</li>
          <li>Priority support</li>
        </ul>
        <p className="mt-2">Contact us to discuss your specific requirements and get a custom quote.</p>
      </div>
    )
  },
  {
    question: `Does ${APP_NAME} work with my platform?`,
    answer: (
      <div>
        Yes! {APP_NAME} integrates with all major platforms:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>WordPress:</strong> Direct integration for seamless publishing</li>
          <li><strong>Webflow:</strong> Automatic publishing to your Webflow CMS</li>
          <li><strong>Shopify:</strong> Optimize your store for search visibility</li>
          <li><strong>Wix:</strong> Easy integration via our API</li>
          <li><strong>Custom sites:</strong> API integration for any platform</li>
        </ul>
      </div>
    )
  },
  {
    question: 'How do the backlinks work?',
    answer: (
      <div>
        Our backlink network is one of the most valuable parts of Growth Engine (coming soon):
        <ul className="mt-2 list-disc pl-5">
          <li>Access to 2,500+ vetted partner sites</li>
          <li>Premium backlinks valued at $800+ per month</li>
          <li>Natural link building that grows your domain authority</li>
        </ul>
        <p className="mt-2">
          This is why we position our service as an investment in long-term growth - the SEO benefits compound over time.
        </p>
      </div>
    )
  },
  {
    question: 'What is AI visibility tracking?',
    answer: (
      <div>
        {APP_NAME} tracks how your brand appears in AI search results (ChatGPT, Perplexity, etc.):
        <ul className="mt-2 list-disc pl-5">
          <li>Monitor 150 prompts to see when AI recommends your brand</li>
          <li>Track competitors to understand your market position</li>
          <li>Visibility dashboard gives you a clear picture of your AI presence</li>
        </ul>
      </div>
    )
  },
  {
    question: 'Can I cancel anytime?',
    answer: (
      <p>
        Yes! No long-term contracts. Cancel anytime from your account settings. You&apos;ll keep access until the end of your current billing cycle.
      </p>
    )
  },
  {
    question: 'Do you offer annual billing?',
    answer: (
      <div>
        Yes! Save 20% with annual billing:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Growth Engine:</strong> $79/mo billed annually (save $240/year)</li>
        </ul>
        <p className="mt-2">Contact us for annual pricing on Scale Partner.</p>
      </div>
    )
  },
  {
    question: 'What payment methods do you accept?',
    answer: (
      <p>
        We use <strong>Stripe</strong> for secure payment processing. We accept all major credit cards (Visa, Mastercard, American Express, Discover). Scale Partner customers can request invoice-based billing.
      </p>
    )
  }
];

export function PricingFAQ(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%]">
              Have questions about our pricing or plans?{' '}
              <Link
                href={routes.marketing.Contact}
                className="font-normal text-inherit underline hover:text-foreground"
              >
                Contact us
              </Link>{' '}
              - we&apos;re here to help you find the perfect fit for your needs.
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
