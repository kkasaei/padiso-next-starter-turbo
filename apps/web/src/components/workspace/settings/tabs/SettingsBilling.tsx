"use client";

import { useOrganization } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { CreditCard, AlertCircle, FileText, ArrowUpRight } from "lucide-react";
import { useSubscriptionStatus, useBillingPortal } from "@/hooks/use-subscription";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getDaysRemaining(endDate: Date | string | null | undefined): number {
  if (!endDate) return 0;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function SettingsBilling() {
  const { organization } = useOrganization();
  
  // Fetch subscription status
  const { data: subscription, isLoading } = useSubscriptionStatus(
    organization?.id
  );
  
  // Billing portal mutation
  const billingPortal = useBillingPortal();

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

  const handleCancelPlan = async () => {
    // Open Stripe portal to cancel section
    await handleManagePlan();
  };

  // No subscription state OR no plan selected
  const hasNoPlan = !subscription || !subscription.planId || !subscription.stripeSubscriptionId;
  
  if (!isLoading && !subscription) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">No Active Subscription</CardTitle>
            </div>
            <CardDescription>
              You don&apos;t have an active subscription. Choose a plan to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = "/workspace-setup"}>
              Choose a Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Workspace exists but no plan/subscription set up yet
  if (!isLoading && hasNoPlan) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">No Plan Selected</CardTitle>
            </div>
            <CardDescription>
              Your workspace is set up, but you haven&apos;t selected a plan yet. Choose a plan to unlock all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Start your free trial today and get access to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI visibility tracking</li>
                <li>• Competitor monitoring</li>
                <li>• Content optimization</li>
                <li>• Weekly reports</li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = "/workspace-setup?step=plan"} className="w-full">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate billing info from subscription
  const planName = subscription?.planName || subscription?.plan?.name || "Growth";
  const interval = subscription?.billingInterval || "month";
  const price = subscription?.plan?.prices?.[interval as "month" | "year"]?.amount || 0;
  const daysRemaining = getDaysRemaining(subscription?.subscriptionPeriodEndsAt);
  const nextBillingDate = formatDate(subscription?.subscriptionPeriodEndsAt);
  const trialEndsAt = subscription?.trialEndsAt;
  const trialEndsAtFormatted = formatDate(trialEndsAt);
  const trialDaysRemaining = getDaysRemaining(trialEndsAt);
  const isTrialing = subscription?.isTrialing || (trialEndsAt && trialDaysRemaining > 0);
  const cancelAtPeriodEnd = subscription?.cancelAtPeriodEnd;

  return (
    <div className="space-y-6">
      {/* Subscription Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Billing & Subscription</CardTitle>
          </div>
          <CardDescription>Manage your subscription, credits, and payment settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Plan */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <span className="text-sm font-medium">Current Plan</span>
              <p className="text-sm text-muted-foreground">
                {planName} - ${price} USD / {interval}
                {isTrialing && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Trial
                  </span>
                )}
                {cancelAtPeriodEnd && (
                  <span className="ml-2 text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                    Canceling
                  </span>
                )}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManagePlan}
              disabled={billingPortal.isPending || !subscription?.stripeCustomerId}
            >
              Change Plan
            </Button>
          </div>

          {/* Billing Status */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <span className="text-sm font-medium">
                {isTrialing ? `Trial ends ${trialEndsAtFormatted}` : `Next billing ${nextBillingDate}`}
              </span>
              <p className="text-sm text-muted-foreground">
                {isTrialing 
                  ? `${trialDaysRemaining} ${trialDaysRemaining === 1 ? "day" : "days"} remaining — your subscription will start automatically`
                  : `${daysRemaining} days remaining in billing period`
                }
              </p>
            </div>
          </div>

          {/* Invoices */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">Invoices</span>
                <p className="text-sm text-muted-foreground">View and download past invoices</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManagePlan}
              disabled={billingPortal.isPending || !subscription?.stripeCustomerId}
            >
              View Invoices
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </div>

          {/* Cancel Subscription */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium text-muted-foreground">
              {cancelAtPeriodEnd ? "Subscription will cancel at period end" : "Cancel subscription"}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleCancelPlan}
              disabled={billingPortal.isPending || cancelAtPeriodEnd || !subscription?.stripeCustomerId}
            >
              {cancelAtPeriodEnd ? "Canceled" : "Cancel"}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
