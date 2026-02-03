"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { SettingsOverview } from "./tabs/SettingsOverview";
import { SettingsBilling } from "./tabs/SettingsBilling";
import { SettingsBrands } from "./tabs/SettingsBrands";
import { SettingsNotifications } from "./tabs/SettingsNotifications";
import { SettingsBetaProgram } from "./tabs/SettingsBetaProgram";

const VALID_TABS = ["overview", "billing", "brands", "notifications", "beta"] as const;
type TabValue = typeof VALID_TABS[number];

export function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  
  // Validate and set initial tab from URL or default to "overview"
  const initialTab = tabParam && VALID_TABS.includes(tabParam as TabValue) 
    ? (tabParam as TabValue) 
    : "overview";
  
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  // Sync URL when tab changes
  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    setActiveTab(newTab);
    
    // Update URL without full navigation
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === "overview") {
      params.delete("tab");
    } else {
      params.set("tab", newTab);
    }
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  };

  // Update tab when URL changes externally
  useEffect(() => {
    if (tabParam && VALID_TABS.includes(tabParam as TabValue)) {
      setActiveTab(tabParam as TabValue);
    }
  }, [tabParam]);

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-foreground">Workspace Settings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-4xl mx-auto">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Billing & Subscription
              </TabsTrigger>
              <TabsTrigger
                value="brands"
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Brand Access
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="beta"
                className="data-[state=active]:bg-gray-100 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Beta Program
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <SettingsOverview />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <SettingsBilling />
          </TabsContent>

          <TabsContent value="brands" className="space-y-6">
            <SettingsBrands />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <SettingsNotifications />
          </TabsContent>

          <TabsContent value="beta" className="space-y-6">
            <SettingsBetaProgram />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
