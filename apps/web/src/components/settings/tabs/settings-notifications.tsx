"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";
import { Bell } from "lucide-react";

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type NotificationCategory = {
  title: string;
  settings: NotificationSetting[];
};

const initialNotifications: NotificationCategory[] = [
  {
    title: "SEO & SEARCH PERFORMANCE",
    settings: [
      { id: "ranking", title: "Ranking changes", description: "Notify when your keywords move up or down significantly in search rankings", enabled: true },
      { id: "keywords", title: "Keyword alerts", description: "Receive alerts when new keyword opportunities are discovered", enabled: true },
      { id: "competitor", title: "Competitor movement", description: "Get notified when competitors make significant ranking changes", enabled: true },
    ],
  },
  {
    title: "AI & VISIBILITY",
    settings: [
      { id: "ai-mentions", title: "AI mentions", description: "Alert when your brand is mentioned in AI-powered search results", enabled: true },
      { id: "visibility", title: "Visibility score changes", description: "Notify when your AI visibility score changes significantly", enabled: true },
    ],
  },
  {
    title: "REPORTS & ANALYTICS",
    settings: [
      { id: "weekly", title: "Weekly performance reports", description: "Receive a summary of your SEO performance every week", enabled: true },
      { id: "monthly", title: "Monthly comprehensive reports", description: "Get detailed monthly analytics and insights", enabled: true },
      { id: "custom-reports", title: "Custom report completion", description: "Notify when your custom AEO reports are ready", enabled: true },
    ],
  },
  {
    title: "MONITORING & ISSUES",
    settings: [
      { id: "technical", title: "Technical SEO issues", description: "Alert when technical issues are detected on your website", enabled: true },
      { id: "crawl", title: "Crawl errors", description: "Notify when search engines encounter errors crawling your site", enabled: true },
      { id: "performance", title: "Performance alerts", description: "Get alerted when page speed or Core Web Vitals drop below thresholds", enabled: true },
    ],
  },
  {
    title: "BILLING & ACCOUNT",
    settings: [
      { id: "subscription", title: "Subscription updates", description: "Notify about subscription renewals, changes, and billing events", enabled: true },
      { id: "usage", title: "Usage limit warnings", description: "Alert when approaching or exceeding plan limits", enabled: true },
    ],
  },
];

export function SettingsNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleNotification = (categoryIndex: number, settingId: string) => {
    setNotifications((prev) =>
      prev.map((category, i) =>
        i === categoryIndex
          ? {
              ...category,
              settings: category.settings.map((setting) =>
                setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
              ),
            }
          : category
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>Manage email and in-app notification preferences for your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {notifications.map((category, categoryIndex) => (
            <div key={category.title}>
              <div className="py-3 bg-muted/50 px-4 -mx-6 first:-mt-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-wider">
                  {category.title}
                </span>
              </div>
              {category.settings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div className="pr-4">
                    <span className="text-sm font-medium">{setting.title}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleNotification(categoryIndex, setting.id)}
                  />
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
