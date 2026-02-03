"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import Link from "next/link";

export interface BillingLimitBannerProps {
  /** The type of resource that has reached its limit */
  resourceType: "brand" | "apiCalls" | "aiCredits" | "prompts" | "competitors" | "keywords";
  /** Current usage count */
  current: number;
  /** Maximum limit */
  limit: number;
  /** Custom title (optional) */
  title?: string;
  /** Custom description (optional) */
  description?: string;
  /** Whether to show the upgrade button */
  showUpgradeButton?: boolean;
  /** Custom class name */
  className?: string;
}

const resourceLabels: Record<BillingLimitBannerProps["resourceType"], { singular: string; plural: string }> = {
  brand: { singular: "brand", plural: "brands" },
  apiCalls: { singular: "API call", plural: "API calls" },
  aiCredits: { singular: "AI credit", plural: "AI credits" },
  prompts: { singular: "prompt", plural: "prompts" },
  competitors: { singular: "competitor", plural: "competitors" },
  keywords: { singular: "keyword", plural: "keywords" },
};

export function BillingLimitBanner({
  resourceType,
  current,
  limit,
  title,
  description,
  showUpgradeButton = true,
  className,
}: BillingLimitBannerProps) {
  const labels = resourceLabels[resourceType];
  const defaultTitle = `${labels.singular.charAt(0).toUpperCase() + labels.singular.slice(1)} limit reached`;
  const defaultDescription = `You've used ${current} of ${limit} ${current === 1 ? labels.singular : labels.plural} included in your plan. Upgrade to add more.`;

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{title || defaultTitle}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{description || defaultDescription}</span>
        {showUpgradeButton && (
          <Button asChild size="sm" variant="outline" className="shrink-0">
            <Link href="/dashboard/settings?tab=billing">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Plan
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * Inline version for use in buttons or smaller spaces
 */
export function BillingLimitTooltip({
  resourceType,
  current,
  limit,
}: Pick<BillingLimitBannerProps, "resourceType" | "current" | "limit">) {
  const labels = resourceLabels[resourceType];
  
  return (
    <div className="text-sm">
      <p className="font-medium text-destructive">Limit reached</p>
      <p className="text-muted-foreground">
        {current}/{limit} {labels.plural} used
      </p>
      <Link 
        href="/dashboard/settings/billing" 
        className="text-primary hover:underline text-xs"
      >
        Upgrade to add more
      </Link>
    </div>
  );
}
