'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon, XIcon } from 'lucide-react';

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

      <div className="flex flex-col gap-y-5">
        {/* Product Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{plan.name}</h3>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
          {trialDays && (
            <p className="text-xs text-muted-foreground">{trialDays}-day free trial</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-1">
          {isEnterprise ? (
            <div className="text-3xl font-bold">Custom</div>
          ) : (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{formattedPrice}</span>
                <span className="text-muted-foreground">/{selectedInterval === 'month' ? 'mo' : 'yr'}</span>
              </div>
              {selectedInterval === 'year' && (
                <p className="text-xs text-muted-foreground">
                  ${Math.round(price.amount / 12)}/mo billed annually
                </p>
              )}
            </>
          )}
        </div>

        {/* CTA Button */}
        {isEnterprise ? (
          <Link
            href={'/sales'}
            className={cn(
              buttonVariants({ variant: 'default' }),
              'group flex items-center justify-center gap-1'
            )}
          >
            Contact Sales
            <ChevronRightIcon className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : isCurrent ? (
          <Button variant="outline" disabled>
            Current Plan
          </Button>
        ) : (
          <Button
            variant="default"
            disabled={pending}
            onClick={() => onUpgrade?.(plan.id, `plan-${plan.id}-${selectedInterval}`)}
          >
            {isOnTrial ? 'Upgrade' : 'Start Free Trial'}
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
