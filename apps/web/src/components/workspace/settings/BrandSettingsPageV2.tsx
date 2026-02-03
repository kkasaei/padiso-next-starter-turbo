"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { BrandSettingsTab } from "./brand-tabs/BrandSettingsTab";
import { IntegrationsSettingsTab } from "./brand-tabs/IntegrationsSettingsTab";

const VALID_TABS = ["brand", "integrations"] as const;
type TabValue = typeof VALID_TABS[number];

export function BrandSettingsPageV2({ brandId }: { brandId: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const tabFromUrl = searchParams.get("tab");
  const initialTab = tabFromUrl && VALID_TABS.includes(tabFromUrl as TabValue) 
    ? (tabFromUrl as TabValue) 
    : "brand";
  
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);

  // Sync tab state with URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && VALID_TABS.includes(tabFromUrl as TabValue)) {
      setActiveTab(tabFromUrl as TabValue);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-1 flex-col min-w-0">
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
