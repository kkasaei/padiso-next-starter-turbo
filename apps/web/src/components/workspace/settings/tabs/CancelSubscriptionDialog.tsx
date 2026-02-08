"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Heart } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";

type Step = "reason" | "confirm";

const CANCEL_REASONS = [
  { id: "too-expensive", label: "It's too expensive for my budget" },
  { id: "not-using", label: "I'm not using it enough" },
  { id: "missing-features", label: "It's missing features I need" },
  { id: "switching", label: "I'm switching to another tool" },
  { id: "temporary", label: "I just need a break — I might come back" },
  { id: "other", label: "Other reason" },
] as const;

type CancelSubscriptionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, feedback: string) => void;
  isPending: boolean;
  periodEndDate?: string | null;
};

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  periodEndDate,
}: CancelSubscriptionDialogProps) {
  const [step, setStep] = useState<Step>("reason");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [feedback, setFeedback] = useState("");

  const handleClose = () => {
    if (isPending) return;
    onOpenChange(false);
    // Reset state after close animation
    setTimeout(() => {
      setStep("reason");
      setSelectedReason("");
      setFeedback("");
    }, 200);
  };

  const handleContinue = () => {
    if (!selectedReason) return;
    setStep("confirm");
  };

  const handleConfirm = () => {
    onConfirm(selectedReason, feedback);
  };

  const formattedEndDate = periodEndDate
    ? new Date(periodEndDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "the end of your billing period";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === "reason" ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <DialogTitle className="text-center text-xl">
                We're sorry to see you go
              </DialogTitle>
              <DialogDescription className="text-center">
                Before you leave, could you share why? Your feedback helps us
                improve for everyone.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  onClick={() => setSelectedReason(reason.id)}
                  className={cn(
                    "flex w-full items-center rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    selectedReason === reason.id
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-border hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "mr-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      selectedReason === reason.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {selectedReason === reason.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  {reason.label}
                </button>
              ))}

              <div className="pt-2">
                <Label
                  htmlFor="cancel-feedback"
                  className="text-sm text-muted-foreground"
                >
                  Anything else you'd like to share? (optional)
                </Label>
                <Textarea
                  id="cancel-feedback"
                  placeholder="Tell us more about your experience..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button
                onClick={handleContinue}
                disabled={!selectedReason}
                variant="destructive"
                className="w-full rounded-xl"
              >
                Continue with Cancellation
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                className="w-full rounded-xl"
              >
                Never mind, I'll stay
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <DialogTitle className="text-center text-xl">
                Confirm Cancellation
              </DialogTitle>
              <DialogDescription className="text-center">
                Your subscription will remain active until{" "}
                <span className="font-medium text-foreground">
                  {formattedEndDate}
                </span>
                . After that:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>
                &bull; You'll lose access to all features and data
              </p>
              <p>
                &bull; Your brands, prompts, and tracking history will be
                preserved for 30 days in case you return
              </p>
              <p>
                &bull; You can reactivate anytime before{" "}
                <span className="font-medium text-foreground">
                  {formattedEndDate}
                </span>{" "}
                to keep your subscription
              </p>
            </div>

            <DialogFooter className="flex-col gap-2 pt-2 sm:flex-col">
              <Button
                onClick={handleConfirm}
                disabled={isPending}
                variant="destructive"
                className="w-full rounded-xl"
              >
                {isPending ? "Cancelling..." : "Yes, Cancel My Subscription"}
              </Button>
              <Button
                onClick={() => setStep("reason")}
                variant="ghost"
                className="w-full rounded-xl"
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
