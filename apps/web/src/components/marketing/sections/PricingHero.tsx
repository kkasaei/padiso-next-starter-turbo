'use client';

import * as React from 'react';

import { PricingTable } from '@/lib/billing/components/pricing-table';
// import { PricingTable } from '@clerk/nextjs';
import { APP_NAME } from '@workspace/common/constants';

import { GridSection } from '@/components/shared/fragments/GridSection';
import { SiteHeading } from '@/components/shared/fragments/SiteHeading';

export type PricingHeroProps = {
  /**
   * Whether the organization is currently on a trial
   * Used on protected /plans page to show "Upgrade" instead of "Start Free Trial"
   */
  isOnTrial?: boolean;
  /**
   * Whether the trial status is being loaded
   */
  isLoading?: boolean;
  /**
   * Callback when user clicks upgrade button
   */
  onUpgrade?: (productId: string, planId: string) => void;
};

export function PricingHero({ isOnTrial, isLoading, onUpgrade }: PricingHeroProps = {}): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-12 py-20">
        <SiteHeading
          badge="Pricing"
          title="Plans for your business"
          description={`From growing businesses to corporates, ${APP_NAME} has you covered.`}
        />
        <PricingTable
          isOnTrial={isOnTrial}
          isLoading={isLoading}
          onUpgrade={onUpgrade}
        />
        {/* <PricingTable forOrganizations /> */}
      </div>
    </GridSection>
  );
}
