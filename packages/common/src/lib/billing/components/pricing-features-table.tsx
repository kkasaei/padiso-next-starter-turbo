'use client';

import * as React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/common/lib';
import { PLANS, type PlanFeature } from '../plans';

// Define feature categories for better organization
const FEATURE_CATEGORIES = [
  {
    name: 'Brand & Tracking',
    features: [
      { key: 'brands', label: 'Brands tracked', growth: '5 brands', scale: 'Unlimited' },
      { key: 'prompts', label: 'Prompts monitored', growth: '150 prompts', scale: 'Unlimited' },
      { key: 'competitors', label: 'Competitors & keywords', growth: '10 competitors & 50 keywords', scale: 'Unlimited', badge: 'Coming soon' },
    ]
  },
  {
    name: 'Content & SEO',
    features: [
      { key: 'articles', label: 'AI-optimized articles/month', growth: '30 articles', scale: 'Unlimited' },
      { key: 'backlinks', label: 'Premium backlinks', growth: true, scale: true, badge: 'Coming soon' },
      { key: 'research', label: 'AI-driven research & expert content', growth: true, scale: true },
      { key: 'citations', label: 'Citations, internal links & infographics', growth: true, scale: true },
      { key: 'schema', label: 'JSON-LD schema markup', growth: true, scale: true },
    ]
  },
  {
    name: 'Tools & Integrations',
    features: [
      { key: 'reddit', label: 'Reddit agent', growth: true, scale: true, badge: 'Coming soon' },
      { key: 'audit', label: 'Technical SEO audit', growth: true, scale: true },
      { key: 'dashboard', label: 'Visibility dashboard', growth: 'Weekly refresh', scale: 'Real-time' },
      { key: 'integrations', label: 'Platform integrations', growth: 'WordPress, Webflow, Shopify, Wix & API', scale: 'All platforms + custom' },
      { key: 'webhook', label: 'Webhook & email digest', growth: true, scale: true },
    ]
  },
  {
    name: 'Support & Extras',
    features: [
      { key: 'support', label: 'Support', growth: 'Email (24hr)', scale: 'Priority + dedicated manager' },
      { key: 'languages', label: 'Article languages', growth: '20+ languages', scale: '20+ languages', badge: 'Add-on' },
      { key: 'custom', label: 'Custom solutions', growth: false, scale: true },
    ]
  },
] as const;

export type PricingFeaturesTableProps = React.HtmlHTMLAttributes<HTMLDivElement>;

export function PricingFeaturesTable({ className, ...other }: PricingFeaturesTableProps): React.JSX.Element {
  return (
    <div className={cn('w-full', className)} {...other}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Compare Plans</h2>
        <p className="text-muted-foreground">See what's included in each plan</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-semibold text-muted-foreground w-1/2">Feature</th>
              <th className="text-center py-4 px-4 font-semibold w-1/4">
                <span className="text-primary">Growth</span>
              </th>
              <th className="text-center py-4 px-4 font-semibold w-1/4">Scale</th>
            </tr>
          </thead>
          <tbody>
            {/* Best For Row */}
            <tr className="border-b border-border/50">
              <td className="py-4 px-4 text-sm font-medium">Best for</td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm text-muted-foreground">Small Businesses</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-sm text-muted-foreground">Larger Organizations</span>
              </td>
            </tr>
            {FEATURE_CATEGORIES.map((category, categoryIndex) => (
              <React.Fragment key={category.name}>
                {/* Category Header */}
                <tr className="bg-muted/30">
                  <td colSpan={3} className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                    {category.name}
                  </td>
                </tr>
                {/* Features in category */}
                {category.features.map((feature, featureIndex) => (
                  <tr 
                    key={feature.key} 
                    className={cn(
                      "border-b border-border/50 hover:bg-muted/20 transition-colors",
                      featureIndex === category.features.length - 1 && categoryIndex < FEATURE_CATEGORIES.length - 1 && "border-b-0"
                    )}
                  >
                    <td className="py-4 px-4 text-sm">
                      <div className="flex items-center gap-2">
                        {feature.label}
                        {feature.badge && (
                          <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureValue value={feature.growth} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <FeatureValue value={feature.scale} />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FeatureValue({ value }: { value: boolean | string }): React.JSX.Element {
  if (typeof value === 'boolean') {
    return value ? (
      <CheckIcon className="size-5 text-primary mx-auto" />
    ) : (
      <XIcon className="size-5 text-muted-foreground/40 mx-auto" />
    );
  }
  return <span className="text-sm text-muted-foreground">{value}</span>;
}
