"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  CreateOrganization,
  useOrganization,
  useOrganizationList,
  useClerk,
} from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Logo } from "@workspace/ui/components/logo";
import { Loader2, Check, ArrowRight, LogOut, ChevronDown } from "lucide-react";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { useSyncSubscription } from "@/hooks/use-subscription";
import { routes } from "@workspace/common";
import { cn } from "@workspace/ui/lib/utils";
import { PLANS } from "@workspace/billing";

type SetupStep = 1 | 2 | 3 | 4;

const STEPS = [
  { number: 1, title: "Create Workspace" },
  { number: 2, title: "Setup" },
  { number: 3, title: "Select Plan" },
  { number: 4, title: "Complete" },
];

// Get features from actual PLANS configuration
const GROWTH_FEATURES = PLANS.growth.features.slice(0, 11) as readonly string[];

export function WorkspaceSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<SetupStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<"month" | "year">("year");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);
  
  const initialOrgIdRef = useRef<string | null | undefined>(undefined);
  const isSettingUpRef = useRef(false);

  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();
  const { signOut } = useClerk();
  const createWorkspace = useCreateWorkspace();
  const syncSubscription = useSyncSubscription();

  // Check for return from Stripe checkout on mount
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const workspaceIdParam = searchParams.get("workspace_id");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && workspaceIdParam) {
      // User returned from successful Stripe checkout
      setWorkspaceId(workspaceIdParam);
      setStep(4);
      
      // Sync subscription from Stripe (only once per session)
      const syncKey = `synced_${sessionId || workspaceIdParam}`;
      if (!sessionStorage.getItem(syncKey)) {
        sessionStorage.setItem(syncKey, "true");
        syncSubscription.mutate({ workspaceId: workspaceIdParam });
      }
    } else if (canceled === "true" && workspaceIdParam) {
      // User canceled Stripe checkout - return to plan selection
      setWorkspaceId(workspaceIdParam);
      setStep(3);
      setError("Checkout was canceled. Please select a plan to continue.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialOrgIdRef.current === undefined) {
      initialOrgIdRef.current = organization?.id ?? null;
    }
  }, [organization]);

  // Step 2: Create workspace in DB after Clerk org is created
  const handleCreateWorkspaceInDB = useCallback(async (orgId: string) => {
    if (isSettingUpRef.current) return;
    isSettingUpRef.current = true;
    
    setStep(2);
    setError(null);

    try {
      const workspace = await createWorkspace.mutateAsync({
        clerkOrgId: orgId,
        status: "active",
      });

      // Store workspace ID for later use
      if (!workspace?.id) {
        throw new Error("Workspace creation failed - no ID returned");
      }
      setWorkspaceId(workspace.id);

      await setActive?.({ organization: orgId });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Move to plan selection
      setStep(3);
      isSettingUpRef.current = false;
    } catch (err) {
      console.error("Failed to setup workspace:", err);
      setError("Failed to setup workspace. Please try again.");
      setStep(1);
      isSettingUpRef.current = false;
    }
  }, [createWorkspace, setActive]);

  // When Clerk org is created, move to step 2 (create workspace in DB)
  useEffect(() => {
    if (
      initialOrgIdRef.current !== undefined &&
      organization?.id &&
      organization.id !== initialOrgIdRef.current &&
      step === 1 &&
      !isSettingUpRef.current
    ) {
      handleCreateWorkspaceInDB(organization.id);
    }
  }, [organization?.id, step, handleCreateWorkspaceInDB]);

  const handleSelectBilling = (interval: "month" | "year") => {
    setSelectedBilling(interval);
  };

  const handleStartTrial = async () => {
    if (!selectedBilling || !workspaceId) {
      setError("Please select a billing option to continue.");
      return;
    }

    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          planId: "growth",
          interval: selectedBilling,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setIsCheckingOut(false);
    }
  };

  const handleGoToDashboard = () => {
    router.push(routes.dashboard.Home);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Get pricing from actual PLANS configuration
  const growthPlan = PLANS.growth;
  
  const growthMonthlyCost = growthPlan.prices.month.amount;
  const growthYearlyCost = Math.round(growthPlan.prices.year.amount / 12);
  const growthYearlySavings = (growthMonthlyCost - growthYearlyCost) * 12;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Fixed at top */}
        <div className="flex items-center justify-between p-6 lg:p-10">
          <Link href="/">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>

        {/* Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-10 pb-6 lg:pb-10">
          <div className={cn("w-full", step === 3 ? "max-w-xl" : "max-w-md")}>
            {/* Step Indicator */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {step}
              </span>
              <span className="text-sm text-muted-foreground">
                of {STEPS.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Create Organization in Clerk */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Create your workspace
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Set up your organization to get started
                  </p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
                      {error}
                    </div>
                  )}

                  <CreateOrganization
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 w-full",
                        headerTitle: "text-foreground text-base font-medium",
                        headerSubtitle: "text-muted-foreground text-sm",
                        formButtonPrimary:
                          "bg-primary text-primary-foreground hover:bg-primary/90",
                        formFieldInput:
                          "border-input bg-background text-foreground",
                        footerActionLink: "text-primary hover:text-primary/90",
                      },
                    }}
                    skipInvitationScreen={false}
                  />
                </motion.div>
              )}

              {/* Step 2: Setting Up Workspace in DB */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Setting up your workspace
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    This will only take a moment
                  </p>

                  <div className="rounded-2xl border border-border bg-card p-8 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Select Plan */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Select your billing
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start with a {growthPlan.trialDays}-day free trial. Cancel anytime.
                  </p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-foreground">{growthPlan.name}</span>
                      {'recommended' in growthPlan && growthPlan.recommended && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {growthPlan.description}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Monthly Option */}
                    <button
                      onClick={() => handleSelectBilling("month")}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-colors",
                        selectedBilling === "month"
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            selectedBilling === "month" ? "border-foreground" : "border-muted-foreground/50"
                          )}>
                            {selectedBilling === "month" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Monthly</span>
                            <p className="text-sm text-muted-foreground">Billed monthly</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">${growthMonthlyCost}</span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                      </div>
                    </button>

                    {/* Yearly Option */}
                    <button
                      onClick={() => handleSelectBilling("year")}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-colors relative",
                        selectedBilling === "year"
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="absolute -top-2.5 right-4">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Save ${growthYearlySavings}/year
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            selectedBilling === "year" ? "border-foreground" : "border-muted-foreground/50"
                          )}>
                            {selectedBilling === "year" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Yearly</span>
                            <p className="text-sm text-muted-foreground">${growthPlan.prices.year.amount} billed annually</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ${growthMonthlyCost}
                          </span>
                          <span className="text-2xl font-bold text-foreground">${growthYearlyCost}</span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Features - Collapsible */}
                  <div className="mb-6 rounded-xl border border-border bg-card overflow-hidden">
                    <button
                      onClick={() => setFeaturesExpanded(!featuresExpanded)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-foreground">What&apos;s included</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        featuresExpanded && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence initial={false}>
                      {featuresExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="space-y-2 px-4 pb-4">
                            {GROWTH_FEATURES.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={handleStartTrial}
                    disabled={!selectedBilling || isCheckingOut}
                    className="w-full"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Redirecting to checkout...
                      </>
                    ) : (
                      <>
                        Start your {growthPlan.trialDays}-day free trial
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    Need a custom plan?{" "}
                    <a
                      href="mailto:support@searchfit.com?subject=Custom%20Plan%20Inquiry"
                      className="text-foreground hover:underline"
                    >
                      Get in touch
                    </a>
                  </p>
                </motion.div>
              )}

              {/* Step 4: Complete */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Workspace setup complete
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your {growthPlan.trialDays}-day free trial has started. Let&apos;s get started.
                  </p>

                  <div className="rounded-2xl border border-border bg-card p-6 mb-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted">
                        <Check className="w-5 h-5 text-foreground" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{organization?.name}</p>
                        <p className="text-sm text-muted-foreground">Workspace created</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted">
                        <Check className="w-5 h-5 text-foreground" strokeWidth={2} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {growthPlan.name} Plan
                        </p>
                        <p className="text-sm text-muted-foreground">{growthPlan.trialDays}-day free trial active</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleGoToDashboard} className="w-full">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-10">
        <div className="max-w-md">
          {/* Simple decorative element */}
        </div>
      </div>
    </div>
  );
}
