"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  useOrganization,
  useOrganizationList,
  useClerk,
} from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Logo } from "@workspace/ui/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import {
  Loader2,
  Check,
  ArrowRight,
  LogOut,
  ChevronDown,
  Upload,
  X,
  AlertCircle,
  CircleDashed,
} from "lucide-react";
import { useCreateWorkspace, useCheckSlugAvailability, useSaveOnboardingSurvey } from "@/hooks/use-workspace";
import { useProvisionAfterCheckout } from "@/hooks/use-subscription";
import { routes } from "@workspace/common";
import { cn } from "@workspace/ui/lib/utils";
import { PLANS } from "@workspace/billing";

// ─── Types & Constants ───────────────────────────────────────

type SetupStep = 1 | 2 | 3 | 4;

type ProvisionStatus = "idle" | "creating_org" | "creating_workspace" | "linking_stripe" | "done" | "failed";

const STEPS = [
  { number: 1, title: "Workspace Details" },
  { number: 2, title: "Select Plan" },
  { number: 3, title: "Setting Up" },
  { number: 4, title: "Survey" },
];

const GROWTH_FEATURES = PLANS.growth.features.slice(0, 11) as readonly string[];

const REFERRAL_SOURCES = [
  { id: "google", label: "Google", icon: "/icons/google-color.svg" },
  { id: "linkedin", label: "LinkedIn", icon: "/icons/linkedin.svg" },
  { id: "twitter", label: "Twitter / X", icon: "/icons/twitter.svg" },
  { id: "youtube", label: "YouTube", icon: "/icons/youtube.svg" },
  { id: "ai-search", label: "ChatGPT / Perplexity", icon: "/icons/chatgpt.svg" },
  { id: "friend", label: "Friend or colleague", icon: null as string | null },
  { id: "other", label: "Other", icon: null as string | null },
];

const CMS_OPTIONS = [
  { id: "wordpress", label: "WordPress", icon: "/icons/wordpress.svg" },
  { id: "shopify", label: "Shopify", icon: "/icons/shopify.svg" },
  { id: "webflow", label: "Webflow", icon: "/icons/webflow.svg" },
  { id: "wix", label: "Wix", icon: "/icons/wix.svg" },
  { id: "squarespace", label: "Squarespace", icon: "/icons/squarespace.svg" },
  { id: "drupal", label: "Drupal", icon: "/icons/drupal.svg" },
  { id: "ghost", label: "Ghost", icon: "/icons/ghost.svg" },
  { id: "bigcommerce", label: "BigCommerce", icon: "/icons/bigcommerce.svg" },
  { id: "framer", label: "Framer", icon: "/icons/framer.svg" },
  { id: "contentful", label: "Contentful", icon: "/icons/contentful.svg" },
  { id: "sanity", label: "Sanity", icon: "/icons/sanity.svg" },
  { id: "strapi", label: "Strapi", icon: "/icons/strapi.svg" },
  { id: "nextjs", label: "Next.js", icon: "/icons/vercel.svg" },
  { id: "custom", label: "Custom / Headless", icon: null as string | null },
  { id: "other", label: "Other", icon: null as string | null },
];

// Role options
const ROLE_OPTIONS = [
  { id: "founder", label: "Founder / CEO" },
  { id: "marketing-lead", label: "Head of Marketing" },
  { id: "seo-manager", label: "SEO Manager" },
  { id: "content-manager", label: "Content Manager" },
  { id: "developer", label: "Developer" },
  { id: "agency", label: "Agency / Consultant" },
  { id: "other", label: "Other" },
];

// Team size options
const TEAM_SIZE_OPTIONS = [
  { id: "solo", label: "Just me" },
  { id: "2-5", label: "2–5" },
  { id: "6-20", label: "6–20" },
  { id: "21-50", label: "21–50" },
  { id: "51-200", label: "51–200" },
  { id: "200+", label: "200+" },
];

// Step illustrations — add more images to /public/workspace-setup/ as needed
const STEP_ILLUSTRATIONS: Record<number, { src: string; alt: string }> = {
  1: { src: "/workspace-setup/step-01.png", alt: "Create your workspace" },
  2: { src: "/workspace-setup/step-01.png", alt: "Select your plan" },
  3: { src: "/workspace-setup/step-02.png", alt: "Setting up your workspace" },
  4: { src: "/workspace-setup/step-02.png", alt: "Quick questions" },
};

// LocalStorage key for persisting pending workspace data across Stripe redirect
const PENDING_SETUP_KEY = "pendingWorkspaceSetup";

type PendingSetupData = {
  workspaceName: string;
  workspaceSlug: string;
  logoDataUrl: string | null;
  planId: string;
  interval: "month" | "year";
  stripeSessionId: string;
  timestamp: number;
};

function savePendingSetup(data: PendingSetupData) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PENDING_SETUP_KEY, JSON.stringify(data));
  }
}

function loadPendingSetup(): PendingSetupData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_SETUP_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingSetupData;
    // Expire after 1 hour
    if (Date.now() - data.timestamp > 3600000) {
      localStorage.removeItem(PENDING_SETUP_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function clearPendingSetup() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PENDING_SETUP_KEY);
  }
}

/** Convert a data URL to a File object for Clerk logo upload */
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header?.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

// ─── Component ───────────────────────────────────────────────

export function WorkspaceSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<SetupStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  // Plan selection from pricing page (stored in localStorage)
  const [planFromPricing, setPlanFromPricing] = useState<{ plan: string; interval: "month" | "year" } | null>(null);
  const [selectedBilling, setSelectedBilling] = useState<"month" | "year">("year");

  // Read plan selection from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedPlan");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.timestamp && Date.now() - parsed.timestamp < 3600000) {
            setPlanFromPricing({ plan: parsed.plan, interval: parsed.interval });
            setSelectedBilling(parsed.interval === "month" || parsed.interval === "year" ? parsed.interval : "year");
          }
          localStorage.removeItem("selectedPlan");
        } catch (e) {
          console.error("Failed to parse stored plan:", e);
        }
      }
    }
  }, []);

  // ─── Step 1: Workspace details (no creation) ───
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");
  const [workspaceLogo, setWorkspaceLogo] = useState<File | null>(null);
  const [workspaceLogoPreview, setWorkspaceLogoPreview] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounced slug check
  const [debouncedSlug, setDebouncedSlug] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSlug(workspaceSlug);
    }, 500);
    return () => clearTimeout(timer);
  }, [workspaceSlug]);

  const slugCheck = useCheckSlugAvailability(debouncedSlug);

  // ─── Step 3: Provisioning state ───
  const [provisionStatus, setProvisionStatus] = useState<ProvisionStatus>("idle");
  const [provisionError, setProvisionError] = useState<string | null>(null);
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(null);
  const provisionAttemptedRef = useRef(false);

  // ─── Step 4: Survey state ───
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedCms, setSelectedCms] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isSubmittingSurvey, setIsSubmittingSurvey] = useState(false);

  // ─── Clerk & tRPC ───
  const { organization } = useOrganization();
  const { setActive, createOrganization } = useOrganizationList();
  const { signOut } = useClerk();
  const createWorkspace = useCreateWorkspace();
  const provisionAfterCheckout = useProvisionAfterCheckout();
  const saveOnboardingSurvey = useSaveOnboardingSurvey();

  // ─── Provisioning logic (Step 3) ───
  const runProvisioning = useCallback(async () => {
    if (provisionAttemptedRef.current) return;
    provisionAttemptedRef.current = true;

    const sessionId = searchParams.get("session_id");
    const pending = loadPendingSetup();

    if (!sessionId || !pending) {
      setProvisionStatus("failed");
      setProvisionError("Missing checkout session data. Please try again.");
      return;
    }

    try {
      // Step 3a: Create Clerk organization
      setProvisionStatus("creating_org");
      const org = await createOrganization?.({
        name: pending.workspaceName,
        slug: pending.workspaceSlug || undefined,
      });

      if (!org) {
        throw new Error("Failed to create organization");
      }

      // Upload logo if stored
      if (pending.logoDataUrl) {
        try {
          const logoFile = dataUrlToFile(pending.logoDataUrl, "logo.png");
          await org.setLogo({ file: logoFile });
        } catch (logoError) {
          console.error("Failed to set logo:", logoError);
          // Continue even if logo upload fails
        }
      }

      // Step 3b: Create workspace in DB
      setProvisionStatus("creating_workspace");
      const workspace = await createWorkspace.mutateAsync({
        clerkOrgId: org.id,
        status: "active",
      });

      if (!workspace?.id) {
        throw new Error("Workspace creation failed - no ID returned");
      }

      // Set active organization in Clerk
      await setActive?.({ organization: org.id });

      // Step 3c: Link Stripe checkout session to workspace
      setProvisionStatus("linking_stripe");
      await provisionAfterCheckout.mutateAsync({
        stripeSessionId: sessionId,
        workspaceId: workspace.id,
      });

      // Done! Clean up and store workspace ID for survey
      clearPendingSetup();
      setCreatedWorkspaceId(workspace.id);
      setProvisionStatus("done");
    } catch (err) {
      console.error("Provisioning failed:", err);
      setProvisionStatus("failed");
      setProvisionError(
        err instanceof Error ? err.message : "Setup failed. Please try again."
      );
    }
  }, [searchParams, createOrganization, createWorkspace, setActive, provisionAfterCheckout]);

  // Check for return from Stripe checkout on mount
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    if (success === "true") {
      // Returned from successful Stripe checkout → run provisioning
      setStep(3);
      runProvisioning();
    } else if (canceled === "true") {
      // Canceled checkout → return to plan selection, restore form from pending data
      const pending = loadPendingSetup();
      if (pending) {
        setWorkspaceName(pending.workspaceName);
        setWorkspaceSlug(pending.workspaceSlug);
        setWorkspaceLogoPreview(pending.logoDataUrl);
        setSelectedBilling(pending.interval);
      }
      setStep(2);
      setError("Checkout was canceled. Please select a plan to continue.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Helpers ───

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 48);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setWorkspaceName(name);
    if (!slugManuallyEdited) {
      setWorkspaceSlug(generateSlug(name));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setWorkspaceSlug(slug);
    setSlugManuallyEdited(true);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWorkspaceLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkspaceLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setWorkspaceLogo(null);
    setWorkspaceLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Step 1 → Step 2: Validate and continue (NO creation)
  const handleContinueToPlan = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!workspaceName.trim()) {
      setError("Please enter a workspace name");
      return;
    }

    if (!workspaceSlug || workspaceSlug.length < 3) {
      setError("Slug must be at least 3 characters");
      return;
    }

    if (slugCheck.data && !slugCheck.data.available) {
      setError("This slug is already taken. Please choose a different one.");
      return;
    }

    setStep(2);
  };

  // Step 2 → Stripe: Start checkout (no workspace needed)
  const handleStartTrial = async () => {
    if (!selectedBilling) {
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
          // No workspaceId - new setup flow
          planId: "growth",
          interval: selectedBilling,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Save pending workspace data to survive the Stripe redirect
      savePendingSetup({
        workspaceName,
        workspaceSlug,
        logoDataUrl: workspaceLogoPreview,
        planId: "growth",
        interval: selectedBilling,
        stripeSessionId: data.sessionId,
        timestamp: Date.now(),
      });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setIsCheckingOut(false);
    }
  };

  const handleContinueToSurvey = () => {
    setStep(4);
  };

  const handleRetryProvisioning = () => {
    provisionAttemptedRef.current = false;
    setProvisionStatus("idle");
    setProvisionError(null);
    runProvisioning();
  };

  const handleSubmitSurvey = async () => {
    setIsSubmittingSurvey(true);

    // Save survey responses to DB
    if (createdWorkspaceId && (selectedSource || selectedCms || selectedRole || selectedTeamSize || websiteUrl)) {
      try {
        await saveOnboardingSurvey.mutateAsync({
          workspaceId: createdWorkspaceId,
          survey: {
            websiteUrl: websiteUrl || undefined,
            role: selectedRole || undefined,
            teamSize: selectedTeamSize || undefined,
            cms: selectedCms || undefined,
            referralSource: selectedSource || undefined,
          },
        });
      } catch (err) {
        console.error("Failed to save survey:", err);
        // Don't block navigation if survey save fails
      }
    }

    // Clean up
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedPlan");
    }

    router.push(routes.dashboard.Home);
  };

  const handleSkipSurvey = async () => {
    // Mark onboarding as completed even if they skip the survey
    if (createdWorkspaceId) {
      try {
        await saveOnboardingSurvey.mutateAsync({
          workspaceId: createdWorkspaceId,
          survey: {},
        });
      } catch {
        // Don't block navigation
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedPlan");
    }
    router.push(routes.dashboard.Home);
  };

  const handleSignOut = async () => {
    clearPendingSetup();
    await signOut();
    router.push("/");
  };

  // ─── Pricing ───
  const growthPlan = PLANS.growth;
  const growthMonthlyCost = growthPlan.prices.month.amount;
  const growthYearlyCost = Math.round(growthPlan.prices.year.amount / 12);
  const growthYearlySavings = (growthMonthlyCost - growthYearlyCost) * 12;

  // ─── Slug availability state ───
  const slugIsChecking = slugCheck.isFetching;
  const slugAvailable = slugCheck.data?.available === true && debouncedSlug === workspaceSlug;
  const slugTaken = slugCheck.data?.available === false && debouncedSlug === workspaceSlug;
  const canContinue = workspaceName.trim().length > 0 && workspaceSlug.length >= 3 && !slugTaken && !slugIsChecking;

  // ─── Provision step messages ───
  const provisionMessages: Record<ProvisionStatus, string> = {
    idle: "Preparing your workspace...",
    creating_org: "Creating your organization...",
    creating_workspace: "Setting up your workspace...",
    linking_stripe: "Activating your subscription...",
    done: "You're all set!",
    failed: "Something went wrong",
  };

  // ─── Render ───
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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
          <div className={cn("w-full", step === 2 ? "max-w-xl" : "max-w-md")}>
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
              {/* ═══════════════════════════════════════════════════
                  Step 1: Workspace Details (validate only, NO creation)
                  ═══════════════════════════════════════════════════ */}
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
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleContinueToPlan} className="space-y-5">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 rounded-xl">
                            {workspaceLogoPreview ? (
                              <AvatarImage
                                src={workspaceLogoPreview}
                                alt="Logo preview"
                                className="rounded-xl object-cover"
                              />
                            ) : (
                              <AvatarFallback className="rounded-xl bg-muted text-muted-foreground">
                                <Upload className="h-5 w-5" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {workspaceLogoPreview && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Upload
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">
                            Recommended: 1:1, up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="workspace-name" className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        id="workspace-name"
                        value={workspaceName}
                        onChange={handleNameChange}
                        placeholder="My Workspace"
                        className="h-10"
                        autoFocus
                      />
                    </div>

                    {/* Slug with availability check */}
                    <div className="space-y-2">
                      <Label htmlFor="workspace-slug" className="text-sm font-medium">
                        Slug
                      </Label>
                      <div className="relative">
                        <Input
                          id="workspace-slug"
                          value={workspaceSlug}
                          onChange={handleSlugChange}
                          placeholder="my-workspace"
                          className={cn(
                            "h-10 pr-10",
                            slugTaken && "border-destructive focus-visible:ring-destructive",
                            slugAvailable && "border-green-500 focus-visible:ring-green-500"
                          )}
                        />
                        {/* Slug status indicator */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {slugIsChecking && workspaceSlug.length >= 3 && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                          {slugAvailable && !slugIsChecking && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {slugTaken && !slugIsChecking && (
                            <X className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      {slugTaken && (
                        <p className="text-xs text-destructive">
                          This slug is already taken
                        </p>
                      )}
                      {slugAvailable && (
                        <p className="text-xs text-green-600">
                          This slug is available
                        </p>
                      )}
                      {!slugTaken && !slugAvailable && (
                        <p className="text-xs text-muted-foreground">
                          Used in URLs and mentions
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!canContinue}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════
                  Step 2: Select Plan & Billing
                  ═══════════════════════════════════════════════════ */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    {planFromPricing ? "Confirm your plan" : "Select your billing"}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    {planFromPricing
                      ? `You selected ${selectedBilling === "year" ? "yearly" : "monthly"} billing. Start your ${growthPlan.trialDays}-day free trial.`
                      : `Start with a ${growthPlan.trialDays}-day free trial. Cancel anytime.`}
                  </p>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-semibold text-foreground">
                        {growthPlan.name}
                      </span>
                      {"recommended" in growthPlan && growthPlan.recommended && (
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
                      onClick={() => setSelectedBilling("month")}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-colors",
                        selectedBilling === "month"
                          ? "border-foreground bg-muted/50"
                          : "border-border hover:border-muted-foreground/50"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              selectedBilling === "month"
                                ? "border-foreground"
                                : "border-muted-foreground/50"
                            )}
                          >
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
                          <span className="text-2xl font-bold text-foreground">
                            ${growthMonthlyCost}
                          </span>
                          <span className="text-sm text-muted-foreground">/mo</span>
                        </div>
                      </div>
                    </button>

                    {/* Yearly Option */}
                    <button
                      onClick={() => setSelectedBilling("year")}
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
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              selectedBilling === "year"
                                ? "border-foreground"
                                : "border-muted-foreground/50"
                            )}
                          >
                            {selectedBilling === "year" && (
                              <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-foreground">Yearly</span>
                            <p className="text-sm text-muted-foreground">
                              ${growthPlan.prices.year.amount} billed annually
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground line-through mr-2">
                            ${growthMonthlyCost}
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            ${growthYearlyCost}
                          </span>
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
                      <span className="text-sm font-medium text-foreground">
                        What&apos;s included
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          featuresExpanded && "rotate-180"
                        )}
                      />
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
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
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

              {/* ═══════════════════════════════════════════════════
                  Step 3: Status / Provisioning
                  Creates Clerk org + DB workspace + links Stripe
                  ═══════════════════════════════════════════════════ */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {provisionStatus === "failed" ? (
                    // ─── Failed state ───
                    <>
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      </div>
                      <h1 className="text-2xl font-semibold text-foreground mb-1">
                        Setup failed
                      </h1>
                      <p className="text-sm text-muted-foreground mb-6">
                        {provisionError || "Something went wrong during setup."}
                      </p>

                      <div className="space-y-3">
                        <Button onClick={handleRetryProvisioning} className="w-full">
                          Try again
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setStep(1);
                            setProvisionStatus("idle");
                            provisionAttemptedRef.current = false;
                          }}
                          className="w-full text-muted-foreground"
                        >
                          Start over
                        </Button>
                      </div>
                    </>
                  ) : provisionStatus === "done" ? (
                    // ─── Success state ───
                    <>
                      <h1 className="text-2xl font-semibold text-foreground mb-1">
                        You&apos;re all set!
                      </h1>
                      <p className="text-sm text-muted-foreground mb-6">
                        Your {growthPlan.trialDays}-day free trial has started.
                      </p>

                      <div className="rounded-2xl border border-border bg-card p-6 mb-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-muted">
                            <Check className="w-5 h-5 text-foreground" strokeWidth={2} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {organization?.name || workspaceName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Workspace created
                            </p>
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
                            <p className="text-sm text-muted-foreground">
                              {growthPlan.trialDays}-day free trial active
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button onClick={handleContinueToSurvey} className="w-full">
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  ) : (
                    // ─── Loading / in-progress state ───
                    <>
                      <h1 className="text-2xl font-semibold text-foreground mb-1">
                        Setting up your workspace
                      </h1>
                      <p className="text-sm text-muted-foreground mb-8">
                        This will only take a moment...
                      </p>

                      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                        {/* Creating organization */}
                        <ProvisionStepRow
                          label="Creating organization"
                          status={
                            provisionStatus === "creating_org"
                              ? "active"
                              : ["creating_workspace", "linking_stripe", "done"].includes(provisionStatus)
                                ? "done"
                                : "pending"
                          }
                        />
                        {/* Setting up workspace */}
                        <ProvisionStepRow
                          label="Setting up workspace"
                          status={
                            provisionStatus === "creating_workspace"
                              ? "active"
                              : ["linking_stripe", "done"].includes(provisionStatus)
                                ? "done"
                                : "pending"
                          }
                        />
                        {/* Activating subscription */}
                        <ProvisionStepRow
                          label="Activating subscription"
                          status={
                            provisionStatus === "linking_stripe"
                              ? "active"
                              : provisionStatus === "done"
                                ? "done"
                                : "pending"
                          }
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ═══════════════════════════════════════════════════
                  Step 4: Quick Survey
                  ═══════════════════════════════════════════════════ */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    Quick questions
                  </h1>
                  <p className="text-sm text-muted-foreground mb-6">
                    Help us personalize your experience.
                  </p>

                  <div className="space-y-6 mb-6">
                    {/* Website URL */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">
                        What&apos;s your website URL?
                      </p>
                      <Input
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="h-10"
                        type="url"
                      />
                    </div>

                    {/* What's your role? */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        What&apos;s your role?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ROLE_OPTIONS.map((role) => (
                          <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-sm transition-colors",
                              selectedRole === role.id
                                ? "border-foreground/30 bg-muted"
                                : "border-border hover:bg-muted/50"
                            )}
                          >
                            {role.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Team size */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        How big is your team?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TEAM_SIZE_OPTIONS.map((size) => (
                          <button
                            key={size.id}
                            onClick={() => setSelectedTeamSize(size.id)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg border text-sm transition-colors",
                              selectedTeamSize === size.id
                                ? "border-foreground/30 bg-muted"
                                : "border-border hover:bg-muted/50"
                            )}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* What CMS do you use? */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        What CMS does your website use?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {CMS_OPTIONS.map((cms) => (
                          <button
                            key={cms.id}
                            onClick={() => setSelectedCms(cms.id)}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors",
                              selectedCms === cms.id
                                ? "border-foreground/30 bg-muted"
                                : "border-border hover:bg-muted/50"
                            )}
                          >
                            {cms.icon && (
                              <Image src={cms.icon} alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                            )}
                            {cms.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* How did you hear about us? */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        How did you hear about us?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {REFERRAL_SOURCES.map((source) => (
                          <button
                            key={source.id}
                            onClick={() => setSelectedSource(source.id)}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors",
                              selectedSource === source.id
                                ? "border-foreground/30 bg-muted"
                                : "border-border hover:bg-muted/50"
                            )}
                          >
                            {source.icon && (
                              <Image src={source.icon} alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                            )}
                            {source.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleSubmitSurvey}
                      disabled={isSubmittingSurvey}
                      className="w-full"
                    >
                      {isSubmittingSurvey ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Go to Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleSkipSurvey}
                      className="w-full text-muted-foreground"
                    >
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Right Side - Step Illustration */}
      <div className="hidden lg:flex flex-1 bg-muted/30 items-center justify-center p-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {STEP_ILLUSTRATIONS[step] ? (
            <motion.div
              key={`illustration-${step}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl"
            >
              <Image
                src={STEP_ILLUSTRATIONS[step].src}
                alt={STEP_ILLUSTRATIONS[step].alt}
                width={900}
                height={750}
                className="w-full h-auto object-contain"
                priority={step === 1}
              />
            </motion.div>
          ) : (
            <motion.div
              key="illustration-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              {/* Placeholder for steps without illustrations */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function ProvisionStepRow({
  label,
  status,
}: {
  label: string;
  status: "pending" | "active" | "done";
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border",
          status === "done" && "border-border bg-muted",
          status === "active" && "border-primary bg-primary/10",
          status === "pending" && "border-border bg-background"
        )}
      >
        {status === "done" && (
          <Check className="w-5 h-5 text-foreground" strokeWidth={2} />
        )}
        {status === "active" && (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
        {status === "pending" && (
          <CircleDashed className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <p
        className={cn(
          "text-sm font-medium",
          status === "done" && "text-foreground",
          status === "active" && "text-foreground",
          status === "pending" && "text-muted-foreground"
        )}
      >
        {label}
      </p>
    </div>
  );
}
