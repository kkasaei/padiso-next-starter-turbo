'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PLANS } from '../plans';
import { PriceIntervalSelector, type PriceInterval } from './price-interval-selector';
import { PricingCard } from './pricing-card';

export type PricingTableProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  pending?: boolean;
  onUpgrade?: (productId: string, planId: string) => void;
  currentProductId?: string;
  /**
   * Whether the organization is currently on a trial
   * Used on protected /plans page to show "Upgrade" instead of "Start Free Trial"
   */
  isOnTrial?: boolean;
  /**
   * Whether the trial status is being loaded
   */
  isLoading?: boolean;
};

export function PricingTable({
  pending,
  onUpgrade,
  currentProductId,
  isOnTrial,
  isLoading,
  className,
  ...other
}: PricingTableProps): React.JSX.Element {
  const [selectedInterval, setSelectedInterval] = React.useState<PriceInterval>('month');

  const plans = Object.values(PLANS);

  return (
    <div className={cn('flex flex-col overflow-y-auto space-y-8 xl:space-y-12', className)} {...other}>
      <PriceIntervalSelector interval={selectedInterval} onIntervalChange={setSelectedInterval} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {plans.map((plan) => (
          <PricingCard
            key={plan.id}
            pending={pending || isLoading}
            plan={plan}
            selectedInterval={selectedInterval}
            isCurrent={currentProductId === plan.id}
            onUpgrade={onUpgrade}
            isOnTrial={isOnTrial}
          />
        ))}
      </div>
    </div>
  );
}
