import * as React from 'react';
import type { Metadata } from 'next';

import { APP_NAME } from '@workspace/common/constants';
import { PricingFAQ } from '@/components/marketing/sections/PricingFaq';
import { PricingHero } from '@/components/marketing/sections/PricingHero';
import { createTitle } from '@workspace/common/lib';
import { SoftwareApplicationJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from '@/components/marketing/JsonLd';
import { baseURL } from '@workspace/common';

export const metadata: Metadata = {
  title: createTitle('Pricing')
};

const PRICING_FAQS = [
  {
    question: `What pricing plans does ${APP_NAME} offer?`,
    answer: `We offer two plans: Growth Engine ($99/mo) with everything you need for AI visibility tracking, content generation, premium backlinks, and site audits; and Scale Partner (Custom) for agencies, enterprises, and teams. Growth Engine includes a 7-day free trial.`,
  },
  {
    question: "What's included in Growth Engine?",
    answer: `Growth Engine ($99/mo) includes: brands with prompts tracked, competitor and keyword monitoring, SEO and AI-optimized articles published monthly, premium backlinks, Reddit agent, JSON-LD schema markup, technical SEO audit, visibility dashboard, integrations with WordPress, Webflow, Shopify, Wix and API, webhook support, and email support.`,
  },
  {
    question: 'What is Scale Partner?',
    answer: 'Scale Partner is designed for agencies, enterprises, and teams with custom needs. It includes a tailormade solution, dedicated Customer Success Manager, and priority support. Contact us for a custom quote.',
  },
  {
    question: `Does ${APP_NAME} work with my platform?`,
    answer: `Yes! ${APP_NAME} integrates with WordPress, Webflow, Shopify, Wix, and any custom site via API.`,
  },
  {
    question: 'How do the backlinks work?',
    answer: 'Our backlink network provides access to a growing network of vetted partner sites with premium backlinks valued at $800+ per month. Natural link building that grows your domain authority over time.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: "Yes! No long-term contracts. Cancel anytime from your account settings. You'll keep access until the end of your current billing cycle.",
  },
  {
    question: 'Do you offer annual billing?',
    answer: 'Yes! Growth Engine annual billing is $83/mo billed annually ($990/year — save $198/year). Contact us for annual pricing on Scale Partner.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We use Stripe for secure payment processing. We accept all major credit cards (Visa, Mastercard, American Express, Discover). Scale Partner customers can request invoice-based billing.',
  },
];

export default function PricingPage(): React.JSX.Element {
  return (
    <>
      <SoftwareApplicationJsonLd />
      <FAQPageJsonLd faqs={PRICING_FAQS} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseURL },
          { name: 'Pricing', url: `${baseURL}/pricing` },
        ]}
      />
      <PricingHero />
      <PricingFAQ />
    </>
  );
}
