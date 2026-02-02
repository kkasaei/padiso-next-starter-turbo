"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { SettingsOverview } from "./tabs/SettingsOverview";
import { SettingsBilling } from "./tabs/SettingsBilling";
import { SettingsNotifications } from "./tabs/SettingsNotifications";
import { SettingsBetaProgram } from "./tabs/SettingsBetaProgram";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <p className="text-base font-medium text-foreground">Organization Settings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
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
