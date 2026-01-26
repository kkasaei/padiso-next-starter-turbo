'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon, XIcon, Users } from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import { PLANS, type PlanId, type PlanFeature } from '../plans';
import type { PriceInterval } from './price-interval-selector';

export type PricingCardProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  pending?: boolean;
  plan: typeof PLANS[PlanId];
  selectedInterval: PriceInterval;
  isCurrent?: boolean;
  onUpgrade?: (productId: string, planId: string) => void;
  /**
   * Whether the organization is currently on a trial
   * Used on protected /plans page to show "Upgrade" instead of "Start Free Trial"
   */
  isOnTrial?: boolean;
};

export function PricingCard({
  pending,
  plan,
  selectedInterval,
  isCurrent = false,
  onUpgrade,
  isOnTrial = false,
  className,
  ...other
}: PricingCardProps): React.JSX.Element {
  const price = plan.prices[selectedInterval];
  const isRecommended = 'recommended' in plan ? plan.recommended : false;
  const isEnterprise = 'isEnterprise' in plan ? plan.isEnterprise : false;
  const trialDays = 'trialDays' in plan ? plan.trialDays : undefined;
  const tagline = 'tagline' in plan ? plan.tagline : undefined;
  const limitedSpots = 'limitedSpots' in plan ? plan.limitedSpots : undefined;

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format(price.amount);

  return (
    <div
      className={cn(
        'w-full relative flex flex-1 grow flex-col items-stretch justify-between self-stretch rounded-lg border px-6 py-5',
        isRecommended ? 'border-primary' : 'border-border',
        className
      )}
      {...other}
    >
      {isRecommended && (
        <div className="absolute -top-2.5 left-0 flex w-full justify-center">
          <Badge>Recommended</Badge>
        </div>
      )}

      <div className="flex h-full flex-col gap-y-5">
        {/* Header Section - Fixed height for alignment */}
        <div className="flex min-h-[180px] flex-col gap-y-4">
          {/* Tagline Badge */}
          <Badge 
            variant="outline" 
            className="w-fit border-primary/30 bg-primary/5 text-xs font-semibold uppercase tracking-wider text-primary"
          >
            {tagline || '\u00A0'}
          </Badge>

          {/* Product Details */}
          <div className="space-y-2">
            <h3 className={cn(
              "text-xl font-semibold",
              isRecommended && "text-2xl text-primary"
            )}>{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </div>

          {/* Price */}
          <div className="space-y-1 mt-auto text-center">
            {isEnterprise ? (
              <>
                <div className="text-4xl font-bold md:text-5xl">Custom</div>
                {/* Reserve same space as pricing card */}
                <p className="text-xs h-4 text-transparent">placeholder</p>
              </>
            ) : (
              <>
                <div className="flex items-baseline justify-center gap-2">
                  {'originalAmount' in price && price.originalAmount && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${price.originalAmount}
                    </span>
                  )}
                  <span className="text-4xl font-bold md:text-5xl">{formattedPrice}</span>
                  <span className="text-lg text-muted-foreground">/{selectedInterval === 'month' ? 'mo' : 'yr'}</span>
                </div>
                {/* Always reserve space for the annual billing text */}
                <p className={cn(
                  "text-xs h-4",
                  selectedInterval === 'year' ? "text-muted-foreground" : "text-transparent"
                )}>
                  ${Math.round(price.amount / 12)}/mo billed annually
                </p>
              </>
            )}
          </div>
        </div>

        {/* Limited Spots Message */}
        {limitedSpots && (
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <Users className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-primary">Only {limitedSpots} spots left in {currentMonth}</p>
              <p className="text-xs text-muted-foreground">
                Limited monthly admissions to maintain quality.
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {isEnterprise ? (
          <Link
            href={'/contact'}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'group relative overflow-hidden border-2 font-semibold',
              'transition-all duration-300 ease-out',
              'hover:border-primary hover:bg-primary/5 hover:shadow-md',
              'active:scale-[0.98]'
            )}
          >
            <span className="relative z-10 flex items-center gap-1">
              Talk to Us
              <ChevronRightIcon className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ) : isCurrent ? (
          <Button variant="outline" size="lg" disabled className="font-semibold">
            Current Plan
          </Button>
        ) : (
          <Button
            variant="default"
            size="lg"
            disabled={pending}
            onClick={() => onUpgrade?.(plan.id, `plan-${plan.id}-${selectedInterval}`)}
            className={cn(
              'group relative overflow-hidden font-semibold',
              'bg-gradient-to-r from-primary to-primary/80',
              'shadow-lg shadow-primary/25',
              'transition-all duration-300 ease-out',
              'hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]',
              'active:scale-[0.98]'
            )}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10 flex items-center">
              {isOnTrial ? 'Upgrade Now' : `Start ${trialDays}-Day Free Trial`}
              <ChevronRightIcon className="ml-1 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        )}

        <div className="h-px w-full border border-dashed" />

        {/* Features */}
        <ul className="space-y-2">
          {(plan.features as readonly PlanFeature[]).map((feature) => {
            const featureText = typeof feature === 'string' ? feature : feature.text;
            const featureBadge = typeof feature === 'string' ? null : feature.badge;
            return (
              <li key={featureText} className="flex items-start gap-2">
                <CheckIcon className="size-4 shrink-0 mt-0.5 text-primary" />
                <span className="text-sm">{featureText}</span>
                {featureBadge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                    {featureBadge}
                  </Badge>
                )}
              </li>
            );
          })}
        </ul>

        {/* Not Included Features */}
        {'notIncluded' in plan && (plan.notIncluded as readonly string[]).length > 0 && (
          <ul className="space-y-2 pt-2 border-t border-dashed">
            {(plan.notIncluded as readonly string[]).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <XIcon className="size-4 shrink-0 mt-0.5 text-muted-foreground/50" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
