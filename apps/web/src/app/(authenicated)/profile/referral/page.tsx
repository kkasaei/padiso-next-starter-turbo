"use client";

import { useUser } from "@clerk/nextjs";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_REFERRALS = 5;

// Mock referral data
const MOCK_REFERRALS = [
  { id: "1", email: "john@example.com", status: "paid", date: "Jan 15" },
  { id: "2", email: "jane@company.io", status: "pending", date: "Jan 20" },
];

export default function ReferralPage() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);

  const referralCode = user?.id ? `SF-${user.id.slice(-8).toUpperCase()}` : "SF-XXXXXXXX";
  const referralLink = `https://searchfit.ai/invite/${referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast("Link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const totalReferrals = MOCK_REFERRALS.length;
  const paidReferrals = MOCK_REFERRALS.filter(r => r.status === "paid").length;
  const hasReachedLimit = totalReferrals >= MAX_REFERRALS;

  return (
    <div className="flex flex-1 items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-border bg-card">
          {/* Header */}
          <div className="p-6 pb-0">
            <h1 className="text-lg font-medium mb-1">Referral Program</h1>
            <p className="text-sm text-muted-foreground">
              Share your link and earn rewards.
            </p>
          </div>

          {!isLoaded ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Rewards */}
              <div className="p-6 pb-4">
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Referral</p>
                    <p className="font-medium">1 month free</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Social share</p>
                    <p className="font-medium">$25 credit</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Referral Link */}
              <div className="p-6 space-y-3">
                <p className="text-sm font-medium">Your Link</p>
                <div className="flex items-center gap-2">
                  <Input
                    value={referralLink}
                    readOnly
                    className="h-10 bg-muted/50 text-sm"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCopyLink}
                    className="h-10 px-4 shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Stats */}
              <div className="p-6">
                <div className="flex gap-6 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Referrals</p>
                    <p className="font-medium">{totalReferrals}/{MAX_REFERRALS}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Earned</p>
                    <p className="font-medium">{paidReferrals > 0 ? `${paidReferrals} month${paidReferrals > 1 ? 's' : ''}` : "—"}</p>
                  </div>
                </div>
                
                {hasReachedLimit && (
                  <p className="text-xs text-muted-foreground mb-4">You&apos;ve reached the maximum referrals</p>
                )}

                {/* Activity */}
                {MOCK_REFERRALS.length > 0 && (
                  <div className="space-y-1">
                    {MOCK_REFERRALS.map((referral) => (
                      <div 
                        key={referral.id}
                        className="flex items-center justify-between py-2 text-sm"
                      >
                        <span className="text-muted-foreground">{referral.email}</span>
                        <span className="text-muted-foreground text-xs">
                          {referral.status === "paid" ? "Earned" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
