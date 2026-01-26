"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import { CreditCard, Receipt, Lightning, ChartBar, FileText, Code, Coins } from "@phosphor-icons/react/dist/ssr";

// Mock billing data
const billingData = {
  plan: "Pro Plan",
  price: "$99 USD / month",
  billingPeriod: "23 days remaining",
  nextBillingDate: "January 23, 2025",
  credits: 1250,
  usage: {
    reportsGenerated: { current: 45, limit: 100 },
    pdfDownloads: { current: 82, limit: 200 },
    apiCalls: { current: 3420, limit: 10000 },
  },
};

export function SettingsBilling() {
  const [allowMeteredUsage, setAllowMeteredUsage] = useState(true);

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
        <CardContent className="space-y-6">
          {/* Current Plan */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <span className="text-sm font-medium">Subscription</span>
              <p className="text-sm text-muted-foreground">{billingData.plan} - {billingData.price}</p>
            </div>
          </div>

          {/* Billing Period */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <span className="text-sm font-medium">Current billing period</span>
              <p className="text-sm text-muted-foreground">{billingData.billingPeriod}</p>
            </div>
            <Button variant="outline" size="sm">
              Manage Plan
            </Button>
          </div>

          {/* Next Billing Date */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <span className="text-sm font-medium">Next billing date</span>
            </div>
            <span className="text-sm">{billingData.nextBillingDate}</span>
          </div>

          {/* Cancel Subscription */}
          <div className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">Cancel subscription</span>
            <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
              Cancel Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Credits Balance Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Credits Balance</CardTitle>
              </div>
              <CardDescription>For metered usage beyond plan limits</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{billingData.credits.toLocaleString()}</span>
              <Button variant="outline" size="sm" className="ml-4">
                Purchase Credits
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Usage */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Current Usage</span>
              <span className="text-xs text-muted-foreground">This billing cycle</span>
            </div>

            {/* Reports Generated */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reports Generated</span>
                </div>
                <span className="text-sm">{billingData.usage.reportsGenerated.current} / {billingData.usage.reportsGenerated.limit}</span>
              </div>
              <Progress 
                value={(billingData.usage.reportsGenerated.current / billingData.usage.reportsGenerated.limit) * 100} 
                className="h-2"
              />
            </div>

            {/* PDF Downloads */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">PDF Downloads</span>
                </div>
                <span className="text-sm">{billingData.usage.pdfDownloads.current} / {billingData.usage.pdfDownloads.limit}</span>
              </div>
              <Progress 
                value={(billingData.usage.pdfDownloads.current / billingData.usage.pdfDownloads.limit) * 100} 
                className="h-2"
              />
            </div>

            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">API Calls</span>
                </div>
                <span className="text-sm">{billingData.usage.apiCalls.current.toLocaleString()} / {billingData.usage.apiCalls.limit.toLocaleString()}</span>
              </div>
              <Progress 
                value={(billingData.usage.apiCalls.current / billingData.usage.apiCalls.limit) * 100} 
                className="h-2"
              />
            </div>
          </div>

          <Separator />

          {/* Metered Usage Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Allow metered usage</span>
              <p className="text-xs text-muted-foreground">Use credits when exceeding plan limits</p>
            </div>
            <Switch checked={allowMeteredUsage} onCheckedChange={setAllowMeteredUsage} />
          </div>
        </CardContent>
      </Card>

      {/* Billing History Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Billing History</span>
              <p className="text-xs text-muted-foreground">View past invoices and payment history</p>
            </div>
            <Button variant="outline" size="sm">
              View Invoices
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
