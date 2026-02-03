"use client";

import { Sparkles, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import Link from "next/link";

export interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The type of resource that has reached its limit */
  resourceType: "brand" | "prompt" | "competitor" | "keyword" | "integration" | "team member";
  /** Current usage count */
  current: number;
  /** Maximum limit */
  limit: number;
}

const resourceLabels: Record<UpgradePlanModalProps["resourceType"], { singular: string; plural: string }> = {
  brand: { singular: "brand", plural: "brands" },
  prompt: { singular: "prompt", plural: "prompts" },
  competitor: { singular: "competitor", plural: "competitors" },
  keyword: { singular: "keyword", plural: "keywords" },
  integration: { singular: "integration", plural: "integrations" },
  "team member": { singular: "team member", plural: "team members" },
};

export function UpgradePlanModal({
  open,
  onOpenChange,
  resourceType,
  current,
  limit,
}: UpgradePlanModalProps) {
  const labels = resourceLabels[resourceType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle>Upgrade your plan</DialogTitle>
          <DialogDescription className="pt-2">
            You've reached your {labels.singular} limit ({current}/{limit} {labels.plural}).
            Upgrade to add more {labels.plural} and unlock additional features.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 pt-4">
          <Button asChild>
            <Link href="/dashboard/settings?tab=billing">
              <Sparkles className="mr-2 h-4 w-4" />
              View Plans
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
