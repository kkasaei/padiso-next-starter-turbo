import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@/lib/common/app';
import { routes } from '@/routes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';

import { GridSection } from '@/components/modules/fragments/grid-section';

const DATA = [
  {
    question: `What pricing plans does ${APP_NAME} offer?`,
    answer: (
      <div>
        We offer four plans designed to scale with your AI search visibility needs:
        <br />
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Starter ($49/mo):</strong> Track and learn - For solo marketers starting their AI visibility journey
          </li>
          <li>
            <strong>Growth ($199/mo):</strong> Monitor and optimize - For growing brands ready to take action
          </li>
          <li>
            <strong>Pro ($499/mo):</strong> Full platform - For serious teams and small agencies
          </li>
          <li>
            <strong>Enterprise (Custom):</strong> Unlimited scale - For agencies and large brands with custom needs
          </li>
        </ul>
        <p className="mt-2">Starter, Growth, and Pro plans include a 7-day free trial. No credit card required to start.</p>
      </div>
    )
  },
  {
    question: "What's included in the Starter plan?",
    answer: (
      <div>
        The Starter plan ($49/mo) includes everything you need to start tracking AI search visibility:
        <ul className="mt-2 list-disc pl-5">
          <li>1 brand with 25 prompts tracked</li>
          <li>3 competitors and 3 keywords monitoring (coming soon)</li>
          <li>Weekly Opportunities Report (10 opportunities)</li>
          <li>Visibility dashboard with weekly refresh</li>
          <li>Webhook support and weekly email digest</li>
          <li>Email support (48hr response time)</li>
        </ul>
      </div>
    )
  },
  {
    question: 'What features are in the Growth plan?',
    answer: (
      <div>
        The Growth plan ($199/mo) is our most popular option for scaling brands:
        <ul className="mt-2 list-disc pl-5">
          <li>5 brands with 150 prompts tracked</li>
          <li>10 competitors and 10 keywords monitoring (coming soon)</li>
          <li>Weekly Opportunities Report (30 opportunities)</li>
          <li>Site audit (25 pages/mo per brand)</li>
          <li>Visibility dashboard with weekly refresh</li>
          <li>Email support (24hr response time)</li>
        </ul>
      </div>
    )
  },
  {
    question: 'What does the Pro plan offer?',
    answer: (
      <div>
        The Pro plan ($499/mo) is our full-featured option for serious teams and agencies:
        <ul className="mt-2 list-disc pl-5">
          <li>10 brands with 300 prompts tracked</li>
          <li>100 competitors and 100 keywords monitoring (coming soon)</li>
          <li>Weekly Opportunities Report (100 opportunities)</li>
          <li>Site audit (100 pages/mo per brand)</li>
          <li>Content generation (50 pieces/mo per brand)</li>
          <li>Ask AI Assistant for insights</li>
          <li>Priority live chat support (4hr) and email support (12hr)</li>
        </ul>
      </div>
    )
  },
  {
    question: 'What about the Enterprise plan?',
    answer: (
      <div>
        The Enterprise plan is fully customizable for large organizations:
        <ul className="mt-2 list-disc pl-5">
          <li>Unlimited brands, prompts, competitors, and keywords</li>
          <li>Daily visibility refresh with real-time alerts</li>
          <li>Unlimited site audit and content generation</li>
          <li>Ask AI Assistant for insights</li>
          <li>Custom integrations and webhooks</li>
          <li>Dedicated Customer Success Manager</li>
          <li>SLA guarantee (99.9% uptime)</li>
          <li>Slack Connect support channel</li>
          <li>Custom training and onboarding</li>
        </ul>
        <p className="mt-2">Contact us to discuss your organization&apos;s specific needs.</p>
      </div>
    )
  },
  {
    question: 'Do all plans include the free AEO Grader?',
    answer: (
      <p>
        Yes! The free AEO Grader is available to everyone—no sign-up required. It gives you an instant visibility score in under 90 seconds. Paid plans unlock continuous monitoring, competitor tracking, historical data, and actionable recommendations to improve your AI search presence.
      </p>
    )
  },
  {
    question: 'Does SearchFit work with Shopify, WooCommerce, and other platforms?',
    answer: (
      <div>
        Yes! {APP_NAME} works with any website or ecommerce platform:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Shopify:</strong> Track how AI engines recommend your products vs competitors</li>
          <li><strong>WooCommerce:</strong> Monitor your WordPress store&apos;s AI visibility</li>
          <li><strong>BigCommerce:</strong> Optimize your catalog for AI search recommendations</li>
          <li><strong>Magento:</strong> Enterprise ecommerce AI visibility tracking</li>
          <li><strong>Custom stores:</strong> Any website with a public URL works</li>
        </ul>
        <p className="mt-2">
          Ecommerce brands are seeing huge shifts as shoppers ask AI assistants &quot;What&apos;s the best [product] for [use case]?&quot; instead of searching Google. {APP_NAME} helps you win these AI-powered buying decisions.
        </p>
      </div>
    )
  },
  {
    question: 'Can I change plans later?',
    answer: (
      <p>
        Absolutely! You can upgrade or downgrade anytime from your account settings. If you upgrade, you&apos;ll get immediate access to new features and be charged a prorated amount. If you downgrade, changes take effect at the end of your current billing cycle so you keep access to premium features until then.
      </p>
    )
  },
  {
    question: 'Do you offer annual billing discounts?',
    answer: (
      <div>
        Yes! Save up to 20% with annual billing:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Starter:</strong> $39/mo billed annually (save $120/year)</li>
          <li><strong>Growth:</strong> $159/mo billed annually (save $480/year)</li>
          <li><strong>Pro:</strong> $399/mo billed annually (save $1,200/year)</li>
        </ul>
      </div>
    )
  },
  {
    question: 'Is there a setup fee or long-term commitment?',
    answer: (
      <p>
        No setup fees, ever. All plans are month-to-month with no long-term contracts. Start with a 7-day free trial, and cancel anytime if {APP_NAME} isn&apos;t the right fit. Most brands see visibility improvements within 30 days.
      </p>
    )
  },
  {
    question: 'What payment methods do you accept?',
    answer: (
      <p>
        We use <strong>Stripe</strong> for secure payment processing. We accept all major credit cards (Visa, Mastercard, American Express, Discover) and offer annual billing with a discount. Enterprise customers can request invoice-based billing. Your payment details are never stored on our servers—Stripe handles everything securely with bank-level encryption.
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
