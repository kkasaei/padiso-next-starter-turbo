"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Check, Settings, Trash2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { IntegrationConnectDialog, INTEGRATION_CONFIGS, OAUTH_INTEGRATIONS } from "./IntegrationConnectDialog";
import { useIntegrations, useConnectIntegration, useDisconnectIntegration } from "@/hooks/use-integrations";

// OAuth redirect URLs for different providers
const getOAuthConnectUrl = (brandId: string, provider: string) => {
  // This should point to your OAuth initiation endpoint
  return `/api/integrations/oauth/${provider}/connect?brandId=${brandId}`;
};

interface IntegrationsSettingsTabProps {
  brandId: string;
}

interface AvailableIntegration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  comingSoon: boolean;
}

const AVAILABLE_INTEGRATIONS: AvailableIntegration[] = [
  // Google (covers all Google services)
  { id: "google", name: "Google", description: "Search Console, Analytics, Ads, Drive, Docs", icon: "/icons/google.svg", category: "Google Services", comingSoon: false },
  
  // Search & Webmaster
  { id: "microsoft", name: "Microsoft", description: "Bing Webmaster, OneDrive, SharePoint", icon: "/icons/microsoft.svg", category: "Search & Webmaster", comingSoon: true },
  { id: "yandex", name: "Yandex", description: "Yandex Webmaster Tools", icon: "/icons/yandex.svg", category: "Search & Webmaster", comingSoon: true },
  
  // Communication
  { id: "slack", name: "Slack", description: "Real-time alerts and notifications", icon: "/icons/slack.svg", category: "Communication", comingSoon: true },
  { id: "teams", name: "Microsoft Teams", description: "Enterprise notifications", icon: "/icons/teams.svg", category: "Communication", comingSoon: true },
  
  // Project Management
  { id: "linear", name: "Linear", description: "Sync tasks and track issues", icon: "/icons/linear.svg", category: "Project Management", comingSoon: true },
  
  // Analytics
  { id: "adobe-analytics", name: "Adobe Analytics", description: "Enterprise analytics", icon: "/icons/adobe.svg", category: "Analytics", comingSoon: true },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics", icon: "/icons/mixpanel.svg", category: "Analytics", comingSoon: true },
  { id: "amplitude", name: "Amplitude", description: "User behavior analytics", icon: "/icons/amplitude.svg", category: "Analytics", comingSoon: true },
  { id: "posthog", name: "PostHog", description: "Open source product analytics", icon: "/icons/posthog.svg", category: "Analytics", comingSoon: true },
  
  // Content & CMS
  { id: "wordpress", name: "WordPress", description: "Publish and import content", icon: "/icons/wordpress.svg", category: "Content & CMS", comingSoon: false },
  { id: "webflow", name: "Webflow", description: "Publish to Webflow sites", icon: "/icons/webflow.svg", category: "Content & CMS", comingSoon: false },
  { id: "ghost", name: "Ghost", description: "Headless CMS integration", icon: "/icons/ghost.svg", category: "Content & CMS", comingSoon: true },
  { id: "notion", name: "Notion", description: "Import and sync content", icon: "/icons/notion.svg", category: "Content & CMS", comingSoon: true },
  { id: "github", name: "GitHub", description: "Markdown content from repos", icon: "/icons/github.svg", category: "Content & CMS", comingSoon: true },
  { id: "dropbox", name: "Dropbox", description: "File storage and sync", icon: "/icons/dropbox.svg", category: "Content & CMS", comingSoon: true },
  
  // Social & Communities
  { id: "x", name: "X / Twitter", description: "Monitor brand mentions", icon: "/icons/x.svg", category: "Social & Communities", comingSoon: true },
  { id: "linkedin", name: "LinkedIn", description: "Professional mentions", icon: "/icons/linkedin.svg", category: "Social & Communities", comingSoon: true },
  { id: "reddit", name: "Reddit", description: "Community monitoring", icon: "/icons/reddit.svg", category: "Social & Communities", comingSoon: true },
  { id: "youtube", name: "YouTube", description: "Video mentions and comments", icon: "/icons/youtube.svg", category: "Social & Communities", comingSoon: true },
  { id: "discord", name: "Discord", description: "Community monitoring", icon: "/icons/discord.svg", category: "Social & Communities", comingSoon: true },
  { id: "tiktok", name: "TikTok", description: "Short form video trends", icon: "/icons/tiktok.svg", category: "Social & Communities", comingSoon: true },
  
  // SEO Tools
  { id: "semrush", name: "SEMrush", description: "Competitor analysis", icon: "/icons/semrush.svg", category: "SEO Tools", comingSoon: true },
  { id: "moz", name: "Moz", description: "Domain authority and backlinks", icon: "/icons/moz.svg", category: "SEO Tools", comingSoon: true },
  
  // E-Commerce
  { id: "shopify", name: "Shopify", description: "Product SEO and store data", icon: "/icons/shopify_glyph_black.svg", category: "E-Commerce", comingSoon: false },
  { id: "bigcommerce", name: "BigCommerce", description: "E-commerce platform integration", icon: "/icons/bigcommerce.svg", category: "E-Commerce", comingSoon: true },
  
  // Advertising
  { id: "meta-ads", name: "Meta Ads", description: "Facebook/Instagram ad data", icon: "/icons/meta-ads.svg", category: "Advertising", comingSoon: true },
  
  // Automation & Developer
  { id: "searchfit-extension", name: "SearchFit Browser Extension", description: "Capture and analyze content from any webpage", icon: "/icons/searchfit.svg", category: "Automation & Developer", comingSoon: true },
  { id: "api", name: "API", description: "Generate API keys for programmatic access", icon: "/icons/api.svg", category: "Automation & Developer", comingSoon: true },
  { id: "mcp", name: "MCP", description: "Connect to Claude as a remote MCP server", icon: "/icons/mcp.svg", category: "Automation & Developer", comingSoon: true },
  { id: "webhook", name: "Webhooks", description: "Send data to custom endpoints", icon: "/icons/webhook.svg", category: "Automation & Developer", comingSoon: true },
  { id: "zapier", name: "Zapier", description: "Connect to 5000+ apps", icon: "/icons/zapier.svg", category: "Automation & Developer", comingSoon: true },
  { id: "make", name: "Make", description: "Advanced automation workflows", icon: "/icons/make.svg", category: "Automation & Developer", comingSoon: true },
  { id: "n8n", name: "n8n", description: "Open source workflow automation", icon: "/icons/n8n.svg", category: "Automation & Developer", comingSoon: true },
  
  // AI Platforms
  { id: "openai", name: "OpenAI", description: "Monitor ChatGPT mentions", icon: "/icons/openai.svg", category: "AI Platforms", comingSoon: true },
  { id: "anthropic", name: "Anthropic", description: "Monitor Claude mentions", icon: "/icons/anthropic.svg", category: "AI Platforms", comingSoon: true },
  { id: "perplexity", name: "Perplexity", description: "Monitor Perplexity citations", icon: "/icons/perplexity.svg", category: "AI Platforms", comingSoon: true },
  { id: "open-router", name: "OpenRouter", description: "Unified API for AI models", icon: "/icons/open-router.svg", category: "AI Platforms", comingSoon: true },
  { id: "vercel-ai", name: "Vercel AI Gateway", description: "AI gateway for model routing", icon: "/icons/vercel.svg", category: "AI Platforms", comingSoon: true },
  { id: "deepseek", name: "DeepSeek", description: "Monitor DeepSeek AI mentions", icon: "/icons/deepseek.svg", category: "AI Platforms", comingSoon: true },
  { id: "grok", name: "Grok", description: "Monitor xAI Grok mentions", icon: "/icons/grok.svg", category: "AI Platforms", comingSoon: true },
  { id: "aws-bedrock", name: "AWS Bedrock", description: "Amazon's AI foundation models", icon: "/icons/bedrock-color.svg", category: "AI Platforms", comingSoon: true },
];

const CATEGORIES = [
  "All Categories",
  "Google Services",
  "Search & Webmaster",
  "Communication",
  "Project Management",
  "Analytics",
  "Content & CMS",
  "Social & Communities",
  "SEO Tools",
  "E-Commerce",
  "Advertising",
  "Automation & Developer",
  "AI Platforms",
];

export function IntegrationsSettingsTab({ brandId }: IntegrationsSettingsTabProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "coming-soon">("all");
  const [activeTab, setActiveTab] = useState<"connected" | "available">("available");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [managingIntegration, setManagingIntegration] = useState<string | null>(null);

  // Fetch connected integrations
  const { data: connectedIntegrations, isLoading, refetch } = useIntegrations(brandId);

  // Handle OAuth callback status from URL params
  useEffect(() => {
    const integration = searchParams.get('integration');
    const status = searchParams.get('status');

    if (integration && status === 'connected') {
      toast.success(`${integration.charAt(0).toUpperCase() + integration.slice(1)} connected successfully!`);
      // Refetch integrations to show the new connection
      refetch();
      // Clear URL params
      router.replace(`/dashboard/brands/${brandId}/settings?tab=integrations`);
    }
  }, [searchParams, brandId, router, refetch]);
  const connectIntegration = useConnectIntegration();
  const disconnectIntegration = useDisconnectIntegration();

  // Create a map of connected integration types for quick lookup and config access
  const connectedIntegrationsMap = useMemo(() => {
    const map = new Map<string, typeof connectedIntegrations extends (infer T)[] | undefined ? T : never>();
    connectedIntegrations?.forEach(i => map.set(i.type, i));
    return map;
  }, [connectedIntegrations]);

  const connectedTypes = useMemo(() => {
    return new Set(connectedIntegrations?.map(i => i.type) || []);
  }, [connectedIntegrations]);

  // Merge available integrations with connected status
  const integrations = useMemo(() => {
    return AVAILABLE_INTEGRATIONS.map(integration => ({
      ...integration,
      connected: connectedTypes.has(integration.id),
    }));
  }, [connectedTypes]);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === "All Categories" || integration.category === selectedCategory;
    const matchesAvailability = 
      availabilityFilter === "all" || 
      (availabilityFilter === "available" && !integration.comingSoon) ||
      (availabilityFilter === "coming-soon" && integration.comingSoon);
    const matchesTab = 
      activeTab === "connected" ? integration.connected : true;
    
    return matchesSearch && matchesCategory && matchesAvailability && matchesTab;
  });

  const groupedIntegrations = filteredIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, (AvailableIntegration & { connected: boolean })[]>);

  const connectedCount = connectedIntegrations?.length || 0;

  const handleConnectClick = (integrationId: string) => {
    // OAuth integrations redirect to OAuth flow
    if (OAUTH_INTEGRATIONS.has(integrationId)) {
      window.location.href = getOAuthConnectUrl(brandId, integrationId);
      return;
    }
    
    // Non-OAuth integrations open the dialog
    if (INTEGRATION_CONFIGS[integrationId]) {
      setSelectedIntegration(integrationId);
      setConnectDialogOpen(true);
    }
  };

  const handleManageClick = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setManagingIntegration(integrationId);
    setConnectDialogOpen(true);
  };

  const handleConnect = async (integrationId: string, data: Record<string, string>) => {
    await connectIntegration.mutateAsync({
      brandId,
      type: integrationId as any,
      config: data,
    });
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectIntegration.mutateAsync({
        brandId,
        type: integrationId as any,
      });
      toast.success("Integration disconnected");
    } catch (error) {
      toast.error("Failed to disconnect integration");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        <button
          onClick={() => setActiveTab("connected")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "connected"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Connected {connectedCount > 0 && `(${connectedCount})`}
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            activeTab === "available"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Available
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search integrations..."
            className="pl-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value as "all" | "available" | "coming-soon")}
          className="h-9 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="all">All Status</option>
          <option value="available">Available Now</option>
          <option value="coming-soon">Coming Soon</option>
        </select>
      </div>

      {/* Connected empty state */}
      {activeTab === "connected" && connectedCount === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No integrations connected yet</p>
          <p className="text-xs mt-1">Browse available integrations to get started</p>
        </div>
      )}

      {/* Connected Integrations List */}
      {activeTab === "connected" && connectedCount > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIntegrations.filter(i => i.connected).map((integration) => (
            <IntegrationCard 
              key={integration.id} 
              integration={{ ...integration, connected: true }}
              onConnect={() => handleConnectClick(integration.id)}
              onManage={() => handleManageClick(integration.id)}
              onDisconnect={() => handleDisconnect(integration.id)}
              isDisconnecting={disconnectIntegration.isPending}
            />
          ))}
        </div>
      )}

      {/* Available Integrations List */}
      {activeTab === "available" && (
        <div className="space-y-10">
          {Object.entries(groupedIntegrations).map(([category, categoryIntegrations]) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryIntegrations.map((integration) => (
                  <IntegrationCard 
                    key={integration.id} 
                    integration={integration}
                    onConnect={() => handleConnectClick(integration.id)}
                    onManage={() => handleManageClick(integration.id)}
                    onDisconnect={() => handleDisconnect(integration.id)}
                    isDisconnecting={disconnectIntegration.isPending}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {filteredIntegrations.length === 0 && activeTab === "available" && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No integrations found</p>
          <p className="text-xs mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Connect Dialog */}
      <IntegrationConnectDialog
        integrationId={selectedIntegration}
        open={connectDialogOpen}
        onOpenChange={(open) => {
          setConnectDialogOpen(open);
          if (!open) {
            setManagingIntegration(null);
            setSelectedIntegration(null);
          }
        }}
        onConnect={handleConnect}
        isManaging={!!managingIntegration}
        initialConfig={
          managingIntegration && connectedIntegrationsMap.get(managingIntegration)?.config
            ? (connectedIntegrationsMap.get(managingIntegration)?.config as Record<string, string>)
            : undefined
        }
      />
    </div>
  );
}

interface IntegrationCardProps {
  integration: AvailableIntegration & { connected: boolean };
  onConnect: () => void;
  onManage: () => void;
  onDisconnect: () => void;
  isDisconnecting?: boolean;
}

function IntegrationCard({ integration, onConnect, onManage, onDisconnect, isDisconnecting }: IntegrationCardProps) {
  const isOAuth = OAUTH_INTEGRATIONS.has(integration.id);
  
  return (
    <div className="group relative rounded-xl border border-border bg-background hover:shadow-sm transition-all">
      <div className="p-5">
        {/* Header with Icon */}
        <div className="flex items-start gap-3 mb-3">
          <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <img 
              src={integration.icon} 
              alt={integration.name}
              className="size-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {integration.name}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
              {integration.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          {integration.connected ? (
            <>
              <Badge variant="secondary" className="gap-1 text-xs">
                <Check className="size-3" />
                Connected
              </Badge>
              <div className="flex items-center gap-1">
                {!isOAuth && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onManage}>
                    <Settings className="size-3 mr-1" />
                    Manage
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                  onClick={onDisconnect}
                  disabled={isDisconnecting}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </>
          ) : integration.comingSoon ? (
            <>
              <span className="text-xs text-muted-foreground">Coming Soon</span>
              <span />
            </>
          ) : (
            <>
              {isOAuth && (
                <span className="text-xs text-muted-foreground">OAuth</span>
              )}
              {!isOAuth && <span />}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={onConnect}
              >
                {isOAuth ? `Connect with ${integration.name}` : "Connect"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
