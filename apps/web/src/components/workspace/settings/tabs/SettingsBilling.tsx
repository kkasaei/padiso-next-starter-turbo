"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { Check, ChevronRight, Zap, HelpCircle, CreditCard, FileText, ArrowUpRight, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { APP_NAME } from "@workspace/common/constants";
import { routes } from "@workspace/common";

import { useSubscriptionStatus, useSubscriptionUsage, useBillingPortal, useCancelSubscription, useReactivateSubscription } from "@/hooks/use-subscription";
import { getFeatureComparison } from "@workspace/billing";
import { CancelSubscriptionDialog } from "./CancelSubscriptionDialog";

// Plan data
const PLANS = [
  {
    id: "growth-monthly",
    name: "Growth",
    tagline: "Monthly",
    price: "$99",
    interval: "month",
    trialDays: 7,
  },
  {
    id: "growth-yearly",
    name: "Growth",
    tagline: "Annual · Save $198/yr",
    price: "$83",
    interval: "month",
    billingNote: "Billed annually ($990/year)",
    recommended: true,
    trialDays: 7,
  },
  {
    id: "custom",
    name: "Custom",
    tagline: "For Agencies & Enterprises",
    price: "Custom",
    isEnterprise: true,
    href: "/sales",
  },
];

// Features for the detailed comparison — derived from limits.json via @workspace/billing
const PLAN_FEATURES = getFeatureComparison().map((category) => ({
  category: category.category,
  features: category.features.map((f) => ({
    name: f.name,
    growth: f.growth,
    scale: f.custom, // "custom" in billing maps to "Custom" plan here
  })),
}));

// FAQ data
const FAQ_DATA = [
  {
    question: `What pricing plans does ${APP_NAME} offer?`,
    answer: `We offer two plans: Growth ($99/mo) for growing businesses with all essential features, and Custom (custom pricing) for agencies and enterprises with unlimited resources and dedicated support.`
  },
  {
    question: "What's included in the free trial?",
    answer: "The 7-day free trial gives you full access to all Growth plan features. No credit card required to start. Your subscription begins automatically after the trial unless you cancel."
  },
  {
    question: "Can I upgrade or downgrade at any time?",
    answer: "Yes! You can upgrade to a Custom plan anytime. Changes take effect immediately, and we'll prorate your billing accordingly."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe. Custom plan customers can request invoice-based billing."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes! No long-term contracts. Cancel anytime from your account settings. You'll keep access until the end of your current billing cycle."
  },
  {
    question: "Do you offer annual billing?",
    answer: "Yes! Save with annual billing on the Growth plan ($83/mo billed annually, $990/year). Contact us for annual pricing on Custom plans."
  },
];

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getDaysRemaining(endDate: Date | string | null | undefined): number {
  if (!endDate) return 0;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

// Simple usage row
function UsageRow({ 
  label, 
  used, 
  limit, 
}: { 
  label: string; 
  used: number; 
  limit: number; 
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        {!isUnlimited && (
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                isAtLimit ? "bg-destructive" : isNearLimit ? "bg-amber-500" : "bg-primary"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        <span className={cn(
          "text-sm font-medium tabular-nums",
          isAtLimit && "text-destructive",
          isNearLimit && !isAtLimit && "text-amber-500"
        )}>
          {isUnlimited ? `${used}` : `${used}/${limit}`}
        </span>
      </div>
    </div>
  );
}

export function SettingsBilling() {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { organization } = useOrganization();
  const { data: subscription, isLoading, refetch } = useSubscriptionStatus(organization?.id);
  const { data: usage } = useSubscriptionUsage(subscription?.id);
  const billingPortal = useBillingPortal();
  const cancelSubscription = useCancelSubscription();
  const reactivateSubscription = useReactivateSubscription();

  const handleManagePlan = async () => {
    if (!subscription?.id) return;
    try {
      const { url } = await billingPortal.mutateAsync({
        workspaceId: subscription.id,
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch (error) {
      console.error("Failed to open billing portal:", error);
    }
  };

  const handleCancelConfirm = async (reason: string, feedback: string) => {
    if (!subscription?.id) return;
    try {
      await cancelSubscription.mutateAsync({
        workspaceId: subscription.id,
        reason,
        feedback,
      });
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
    }
  };

  const handleReactivate = async () => {
    if (!subscription?.id) return;
    try {
      await reactivateSubscription.mutateAsync({
        workspaceId: subscription.id,
      });
      refetch();
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
    }
  };

  const planName = subscription?.planName || subscription?.plan?.name || "Growth";
  const isTrialing = subscription?.isTrialing;
  const trialEndsAt = subscription?.trialEndsAt;
  const trialDaysRemaining = getDaysRemaining(trialEndsAt);
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd;
  const hasActiveSubscription = subscription?.stripeSubscriptionId && !subscription?.isCanceled;
  
  // Check if user is on Custom plan
  const isCustomPlan = subscription?.planId?.includes('custom') || planName.toLowerCase() === 'custom';

  // If on Custom plan, show simplified view
  if (isCustomPlan) {
    return (
      <div className="space-y-6">
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Current Subscription</h2>
            <p className="text-sm text-muted-foreground">Your plan and billing details</p>
          </div>
          
          {isLoading ? (
            <Card className="rounded-2xl">
              <CardContent className="py-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl">
              <CardContent className="py-6">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{planName}</p>
                      <p className="text-sm text-muted-foreground">
                        Custom enterprise plan with dedicated support
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                      For billing inquiries, plan changes, or support, please contact your dedicated{" "}
                      <span className="font-medium text-foreground">Account Manager</span>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* Section 1: Current Subscription Status */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Current Subscription</h2>
          <p className="text-sm text-muted-foreground">Manage your plan and billing details</p>
        </div>
        
        {isLoading ? (
          <Card className="rounded-2xl">
            <CardContent className="py-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl">
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-lg">{planName}</p>
                      {isTrialing && (
                        <Badge variant="secondary" className="text-xs">
                          Trial · {trialDaysRemaining} days left
                        </Badge>
                      )}
                      {cancelAtPeriodEnd && (
                        <Badge variant="outline" className="text-xs border-destructive text-destructive">
                          Canceling
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isTrialing 
                        ? `Trial ends ${formatDate(trialEndsAt)}`
                        : cancelAtPeriodEnd
                        ? `Access until ${formatDate(subscription?.subscriptionPeriodEndsAt)}`
                        : `Renews ${formatDate(subscription?.subscriptionPeriodEndsAt)}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleManagePlan}
                    disabled={billingPortal.isPending || !subscription?.stripeCustomerId}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Invoices
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleManagePlan}
                    disabled={billingPortal.isPending || !subscription?.stripeCustomerId}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Usage Section - Accordion */}
              <div className="mt-6 pt-5 border-t border-border">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="usage" className="border-b-0">
                    <AccordionTrigger className="py-0 hover:no-underline">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Current Usage
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-4">
                      <div className="space-y-3">
                        <UsageRow 
                          label="Brands" 
                          used={usage?.usage.brands ?? 0} 
                          limit={usage?.limits.brands ?? 2} 
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Cancel / Reactivate Section */}
              {hasActiveSubscription && (
                <div className="mt-5 pt-5 border-t border-border">
                  {cancelAtPeriodEnd ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Your subscription is set to cancel on{" "}
                          <span className="font-medium text-foreground">
                            {formatDate(subscription?.subscriptionPeriodEndsAt)}
                          </span>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReactivate}
                        disabled={reactivateSubscription.isPending}
                        className="shrink-0"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        {reactivateSubscription.isPending ? "Reactivating..." : "Reactivate Subscription"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCancelDialogOpen(true)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Cancel Subscription Dialog */}
      <CancelSubscriptionDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onConfirm={handleCancelConfirm}
        isPending={cancelSubscription.isPending}
        periodEndDate={subscription?.subscriptionPeriodEndsAt as string | null | undefined}
      />

      {/* Section 2: Simple Plan Cards */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Available Plans</h2>
          <p className="text-sm text-muted-foreground">Choose the plan that fits your needs</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isOnGrowthMonthly = subscription?.planId?.includes("growth") && !subscription?.planId?.includes("yearly");
            const isOnGrowthYearly = subscription?.planId?.includes("growth") && subscription?.planId?.includes("yearly");
            const isCurrent = (plan.id === "growth-monthly" && isOnGrowthMonthly) || 
                            (plan.id === "growth-yearly" && isOnGrowthYearly);
            // Recommend yearly if on monthly, Scale if already on yearly
            const isRecommended = plan.recommended || (isOnGrowthMonthly && plan.id === "growth-yearly") || (isOnGrowthYearly && plan.id === "custom");
            
            return (
              <Card 
                key={plan.id} 
                className={cn(
                  "relative rounded-2xl",
                  isRecommended && "border-primary"
                )}
              >
                {isRecommended && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    Recommended
                  </Badge>
                )}
                <CardContent className="pt-6 pb-6 h-full flex flex-col">
                  <div className="flex flex-col flex-1">
                    {/* Plan Header - fixed height */}
                    <div className="text-center space-y-2 h-[72px]">
                      <Badge variant="outline" className="text-xs font-medium uppercase tracking-wider">
                        {plan.tagline}
                      </Badge>
                      <h3 className={cn(
                        "text-xl font-semibold",
                        isRecommended && "text-primary"
                      )}>
                        {plan.name}
                      </h3>
                    </div>
                    
                    {/* Price - fixed height */}
                    <div className="text-center py-4 h-[88px] flex flex-col justify-center">
                      <div>
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.interval && (
                          <span className="text-muted-foreground">/{plan.interval}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 h-4">
                        {plan.billingNote || "\u00A0"}
                      </p>
                    </div>
                    
                    {/* CTA - fixed at bottom */}
                    <div className="mt-auto pt-2">
                      {plan.isEnterprise ? (
                        <Button asChild variant="outline" className="w-full rounded-xl">
                          <Link href={plan.href || "#"} target="_blank" rel="noopener noreferrer">
                            Talk to Us
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : isCurrent ? (
                        <Button variant="outline" className="w-full rounded-xl" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button 
                          className={cn("w-full rounded-xl", isRecommended && "bg-primary")}
                          variant={isRecommended ? "default" : "outline"}
                          onClick={handleManagePlan}
                          disabled={billingPortal.isPending}
                        >
                          {isCurrent ? "Current Plan" : isOnGrowthMonthly && plan.id === "growth-yearly" ? "Upgrade to Annual" : isTrialing ? "Upgrade Now" : `Start ${plan.trialDays}-Day Trial`}
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section 3: Plan Details Comparison */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Plan Details</h2>
          <p className="text-sm text-muted-foreground">Compare features across plans</p>
        </div>
        
        <Card className="rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="grid grid-cols-3 gap-4 px-4 py-3 border-b border-border bg-muted/30">
              <div className="text-sm font-medium">Feature</div>
              <div className="text-sm font-medium text-center">Growth</div>
              <div className="text-sm font-medium text-center">Custom</div>
            </div>
            
            {/* Feature Groups */}
            {PLAN_FEATURES.map((group) => (
              <div key={group.category}>
                {/* Category Header */}
                <div className="px-4 py-2 bg-muted/50 border-b border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.category}
                  </span>
                </div>
                
                {/* Features */}
                {group.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.name}
                    className={cn(
                      "grid grid-cols-3 gap-4 px-4 py-2.5 text-sm",
                      featureIndex !== group.features.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <div className="text-muted-foreground">{feature.name}</div>
                    <div className="text-center font-medium">{feature.growth}</div>
                    <div className="text-center font-medium text-primary">{feature.scale}</div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Section 4: FAQ */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Have more questions?{" "}
            <Link href={routes.marketing.Contact} className="underline hover:text-foreground">
              Contact us
            </Link>
          </p>
        </div>
        
        <Card className="rounded-2xl">
          <CardContent className="py-2">
            <Accordion type="single" collapsible className="w-full">
              {FAQ_DATA.map((faq, index) => (
                <AccordionItem key={index} value={index.toString()}>
                  <AccordionTrigger className="text-left text-sm hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
