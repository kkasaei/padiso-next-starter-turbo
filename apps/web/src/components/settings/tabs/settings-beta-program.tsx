"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";
import { Flask, Sparkle, Eye, Target, ChartLineUp, FileText } from "@phosphor-icons/react/dist/ssr";

type FeatureToggle = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  badge?: string;
};

const initialFeatures: FeatureToggle[] = [
  {
    id: "ai-overviews",
    title: "AI Overviews Tracking",
    description: "Monitor your brand's visibility in Google AI Overviews and AI-powered search results",
    enabled: true,
  },
  {
    id: "competitor",
    title: "Competitor Tracking",
    description: "Track and analyze your competitors' SEO performance and AI visibility",
    enabled: true,
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    description: "Access advanced SEO metrics, predictive insights, and AI-powered recommendations",
    enabled: false,
    badge: "Beta",
  },
  {
    id: "automated-reporting",
    title: "Automated Reporting",
    description: "Generate and schedule automated SEO reports with AI-powered insights and recommendations",
    enabled: false,
    badge: "Beta",
  },
];

export function SettingsBetaProgram() {
  const [betaProgramEnabled, setBetaProgramEnabled] = useState(false);
  const [features, setFeatures] = useState(initialFeatures);

  const toggleFeature = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((feature) =>
        feature.id === featureId ? { ...feature, enabled: !feature.enabled } : feature
      )
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Flask className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Features & Beta Program</CardTitle>
          </div>
          <CardDescription>Join our beta program to trial new features and help shape the future of SearchFit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {/* Beta Program Toggle */}
          <div className="flex items-start justify-between py-4 border-b border-border">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Join Beta Program</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Get early access to new features, exclusive insights, and help us improve SearchFit. 
                You'll receive invitations to test cutting-edge AI search optimization tools before general release.
              </p>
            </div>
            <Switch checked={betaProgramEnabled} onCheckedChange={setBetaProgramEnabled} />
          </div>

          {/* Feature Toggles Header */}
          <div className="py-3 bg-muted/50 px-4 -mx-6 mt-4">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider">
              FEATURE TOGGLES
            </span>
          </div>

          {/* Feature Toggles */}
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex items-center justify-between py-4 border-b border-border last:border-0"
            >
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{feature.title}</span>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
              </div>
              <Switch
                checked={feature.enabled}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Features Preview */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkle className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Coming Soon</CardTitle>
          </div>
          <CardDescription>Features currently in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Eye,
                title: "Real-time SERP Monitoring",
                description: "Live tracking of search result changes as they happen",
              },
              {
                icon: Target,
                title: "Intent-based Optimization",
                description: "AI-powered content recommendations based on search intent",
              },
              {
                icon: ChartLineUp,
                title: "Predictive Rankings",
                description: "ML models to predict future ranking changes",
              },
              {
                icon: FileText,
                title: "Content Gap Analysis",
                description: "Identify content opportunities your competitors are missing",
              },
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
