"use client";

import { useState } from "react";
import { OrganizationProfile } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Download } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";

export function SettingsOverview() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsExporting(false);
    toast.success("Data export started. You will receive a download link via email.");
  };

  return (
    <div className="w-full space-y-6">
      <OrganizationProfile 
        appearance={{
          elements: {
            rootBox: "w-full",
            cardBox: "w-full shadow-none border border-border rounded-xl",
            navbar: "border-r border-border",
            pageScrollBox: "p-0",
          },
        }}
      />

      {/* Export Data */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">Export Data</span>
                <p className="text-xs text-muted-foreground">Download all your organization data</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
