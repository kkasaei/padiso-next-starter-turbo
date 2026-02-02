"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { BrandSettingsTab } from "./brand-tabs/BrandSettingsTab";
import { IntegrationsSettingsTab } from "./brand-tabs/IntegrationsSettingsTab";

export function BrandSettingsPageV2({ brandId }: { brandId: string }) {
  const [activeTab, setActiveTab] = useState("brand");

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
            <TabsList className="bg-transparent ring-0 dark:bg-transparent dark:ring-0 p-1 gap-2 w-max md:w-auto">
              <TabsTrigger
                value="brand"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Brand
              </TabsTrigger>
              <TabsTrigger
                value="integrations"
                className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-none px-4 whitespace-nowrap"
              >
                Integrations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="brand" className="space-y-6">
            <BrandSettingsTab brandId={brandId} />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsSettingsTab brandId={brandId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
