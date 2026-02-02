"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Check, ArrowRight, LogOut } from "lucide-react";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { routes } from "@workspace/common";
import { cn } from "@workspace/ui/lib/utils";

type SetupStep = 1 | 2 | 3 | 4;

const STEPS = [
  { number: 1, title: "Create Workspace" },
  { number: 2, title: "Setup" },
  { number: 3, title: "Select Plan" },
  { number: 4, title: "Complete" },
];

const GROWTH_FEATURES = [
  "5 brands with 150 prompts tracked",
  "10 competitors & 50 keywords monitoring",
  "30 SEO & AI-optimized articles published monthly",
  "Real-time AI-driven research & expert-backed content",
  "Articles with citations, internal links & branded infographics",
  "JSON-LD schema markup for featured snippets",
  "Technical SEO audit (Google & AI crawlability)",
  "Visibility dashboard with weekly refresh",
  "Integrates with WordPress, Webflow, Shopify, Wix & API",
  "Webhook support & weekly email digest",
  "Email support (24hr response)",
];

const AGENCY_FEATURES = [
  "Tailormade solution for your needs",
  "Unlimited brands & prompts",
  "Customer Success Manager",
  "Priority support",
  "Custom integrations",
  "White-label options",
];

export function WorkspaceSetup() {
  const router = useRouter();
  const [step, setStep] = useState<SetupStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"growth" | "agency" | null>(null);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");
  
  const initialOrgIdRef = useRef<string | null | undefined>(undefined);
  const isSettingUpRef = useRef(false);

  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();
  const { signOut } = useClerk();
  const createWorkspace = useCreateWorkspace();

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
      await createWorkspace.mutateAsync({
        clerkOrgId: orgId,
        status: "active",
      });

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

  const handleSelectPlan = (plan: "growth" | "agency") => {
    setSelectedPlan(plan);
  };

  const handleStartTrial = () => {
    // TODO: Integrate with Stripe for subscription
    setStep(4);
  };

  const handleGoToDashboard = () => {
    router.push(routes.dashboard.Home);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Calculate savings
  const growthMonthlyCost = 99;
  const growthYearlyCost = 79;
  const growthYearlySavings = (growthMonthlyCost - growthYearlyCost) * 12;
  
  const agencyMonthlyCost = 2000;
  const agencyYearlyCost = 20000;
  const agencyYearlySavings = (agencyMonthlyCost * 12) - agencyYearlyCost;

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
                    Select your plan
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start with a 7-day free trial. Cancel anytime.
                  </p>

                  {/* Billing Toggle */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center p-1 bg-muted rounded-lg">
                      <button
                        onClick={() => setBillingInterval("monthly")}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                          billingInterval === "monthly"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingInterval("yearly")}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                          billingInterval === "yearly"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Yearly
                      </button>
                    </div>
                    {billingInterval === "yearly" && (
                      <span className="text-xs text-muted-foreground">
                        Save up to ${growthYearlySavings}/year
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Growth Plan */}
                    <button
                      onClick={() => handleSelectPlan("growth")}
                      className={cn(
                        "w-full p-5 rounded-xl border text-left transition-colors",
                        selectedPlan === "growth"
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-wide">
                          For Smart Entrepreneurs
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                          Recommended
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-lg font-semibold text-foreground">Growth Engine</span>
                        <div className="text-right">
                          {billingInterval === "yearly" && (
                            <span className="text-sm text-muted-foreground line-through mr-2">
                              ${growthMonthlyCost}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-foreground">
                            ${billingInterval === "monthly" ? growthMonthlyCost : growthYearlyCost}
                          </span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                      </div>

                      {billingInterval === "yearly" && (
                        <p className="text-xs text-primary mb-3">
                          Save ${growthYearlySavings}/year
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground mb-4">
                        Everything you need to build lasting organic visibility.
                      </p>

                      <ul className="space-y-2">
                        {GROWTH_FEATURES.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {selectedPlan === "growth" && GROWTH_FEATURES.slice(5).map((feature, i) => (
                          <li key={i + 5} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      {selectedPlan !== "growth" && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{GROWTH_FEATURES.length - 5} more features
                        </p>
                      )}
                    </button>

                    {/* Agency Plan */}
                    <button
                      onClick={() => handleSelectPlan("agency")}
                      className={cn(
                        "w-full p-5 rounded-xl border text-left transition-colors",
                        selectedPlan === "agency"
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground uppercase tracking-wide">
                          For Agencies & Teams
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-lg font-semibold text-foreground">Scale Partner</span>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">starts at </span>
                          <span className="text-2xl font-bold text-foreground">
                            ${billingInterval === "monthly" ? "2,000" : "20,000"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /{billingInterval === "monthly" ? "mo" : "yr"}
                          </span>
                        </div>
                      </div>

                      {billingInterval === "yearly" && (
                        <p className="text-xs text-primary mb-3">
                          Save ${agencyYearlySavings.toLocaleString()}/year
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground mb-4">
                        Custom solutions for agencies and enterprises.
                      </p>

                      <ul className="space-y-2">
                        {AGENCY_FEATURES.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </button>
                  </div>

                  <Button
                    onClick={handleStartTrial}
                    disabled={!selectedPlan}
                    className="w-full"
                  >
                    Start your 7-day free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
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
                    Your 7-day free trial has started. Let&apos;s get started.
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
                          {selectedPlan === "growth" ? "Growth Engine" : "Scale Partner"}
                        </p>
                        <p className="text-sm text-muted-foreground">7-day free trial active</p>
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
