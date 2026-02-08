'use client';

import * as React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/common/lib';
import { PLAN_LIMITS, formatLimit } from '@workspace/billing';

// All numerical values derived from PLAN_LIMITS (limits.json) — single source of truth.
const gL = PLAN_LIMITS.growth;
const cL = PLAN_LIMITS.custom;

const FEATURE_CATEGORIES = [
  {
    name: 'Brand & Tracking',
    features: [
      { key: 'brands', label: 'Brands tracked', growth: `${formatLimit(gL.brands.max)} brands`, scale: formatLimit(cL.brands.max) },
      { key: 'prompts', label: 'Prompts monitored', growth: `${formatLimit(gL.prompts.maxGlobal)} prompts`, scale: formatLimit(cL.prompts.maxGlobal) },
      { key: 'competitors', label: 'Competitors & keywords', growth: `${formatLimit(gL.competitors.maxPerBrand)} competitors & ${formatLimit(gL.keywords.maxPerBrand)} keywords`, scale: formatLimit(cL.competitors.maxGlobal), badge: 'Coming soon' },
    ]
  },
  {
    name: 'Content & SEO',
    features: [
      { key: 'articles', label: 'AI-optimized articles/month', growth: `${formatLimit(gL.content.maxPerBrand)} articles`, scale: formatLimit(cL.content.maxGlobal) },
      { key: 'backlinks', label: 'Premium backlinks', growth: true as boolean | string, scale: true as boolean | string, badge: 'Coming soon' },
      { key: 'research', label: 'AI-driven research & expert content', growth: true as boolean | string, scale: true as boolean | string },
      { key: 'citations', label: 'Citations, internal links & infographics', growth: true as boolean | string, scale: true as boolean | string },
      { key: 'schema', label: 'JSON-LD schema markup', growth: true as boolean | string, scale: true as boolean | string },
    ]
  },
  {
    name: 'Tools & Integrations',
    features: [
      { key: 'reddit', label: 'Reddit agent', growth: true as boolean | string, scale: true as boolean | string, badge: 'Coming soon' },
      { key: 'audit', label: 'Technical SEO audit', growth: true as boolean | string, scale: true as boolean | string },
      { key: 'dashboard', label: 'Visibility dashboard', growth: `${gL.visibility.refreshRate.charAt(0).toUpperCase() + gL.visibility.refreshRate.slice(1)} refresh` as boolean | string, scale: `${cL.visibility.refreshRate.charAt(0).toUpperCase() + cL.visibility.refreshRate.slice(1)} refresh` as boolean | string },
      { key: 'integrations', label: 'Platform integrations', growth: 'WordPress, Webflow, Shopify, Wix & API' as boolean | string, scale: 'All platforms + custom' as boolean | string },
      { key: 'webhook', label: 'Webhook & email digest', growth: true as boolean | string, scale: true as boolean | string },
    ]
  },
  {
    name: 'Support & Extras',
    features: [
      { key: 'support', label: 'Support', growth: 'Email (24hr)' as boolean | string, scale: 'Priority + dedicated manager' as boolean | string },
      { key: 'languages', label: 'Article languages', growth: '20+ languages' as boolean | string, scale: '20+ languages' as boolean | string, badge: 'Add-on' },
      { key: 'custom', label: 'Custom solutions', growth: false as boolean | string, scale: true as boolean | string },
    ]
  },
];

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
                        {'badge' in feature && feature.badge && (
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
