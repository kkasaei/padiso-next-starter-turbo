"use client"

import { useState } from "react"
import Image from "next/image"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { 
  Loader2,
  Settings as SettingsIcon,
  CheckSquare,
  MessageSquare,
  Package,
  FileText,
  BarChart3,
  Brain,
  Link as LinkIcon,
  Wrench,
  Ear,
  Globe,
  Search,
  X,
} from "lucide-react"
import { trpc } from "@/lib/trpc/client"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import type { AdminSetting } from "@workspace/db"

type SettingValue = Record<string, any>

type PendingChange = {
  setting: AdminSetting
  path: string[]
  newValue: any
  confirmationMessage: string
  confirmationTitle: string
}

export default function SettingsPage() {
  const { user } = useUser()
  const utils = trpc.useUtils()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  
  // Fetch all admin settings
  const { data: allSettings, isLoading } = trpc.adminSettings.getAll.useQuery()
  const updateSettingMutation = trpc.adminSettings.updateValue.useMutation({
    onSuccess: () => {
      utils.adminSettings.getAll.invalidate()
      toast.success("Setting updated")
    },
    onError: () => {
      toast.error("Failed to update setting")
    },
  })

  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null)

  const updateNestedValue = async (
    setting: AdminSetting,
    path: string[],
    newValue: any
  ) => {
    const updatedValue = JSON.parse(JSON.stringify(setting.value))
    let current = updatedValue

    // Navigate to the nested property
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
    }

    // Update the value
    current[path[path.length - 1]] = newValue

    await updateSettingMutation.mutateAsync({
      key: setting.key,
      value: updatedValue,
      updatedBy: user?.id,
    })
  }

  const requiresConfirmation = (
    setting: AdminSetting,
    path: string[],
    newValue: any
  ): { required: boolean; title: string; message: string } => {
    // Auth mode changes require confirmation
    if (setting.key === "auth_mode" && path[0] === "use_waitlist_mode") {
      const modeLabel = newValue === true ? "Waitlist Mode" : "Open Signup"
      const currentLabel = !newValue ? "Waitlist Mode" : "Open Signup"
      
      return {
        required: true,
        title: "Change Authentication Mode?",
        message: `Are you sure you want to change authentication from "${currentLabel}" to "${modeLabel}"? ${newValue ? 'Users will need to join the waitlist.' : 'Users can sign up freely.'}`,
      }
    }

    // Enabling maintenance mode requires confirmation
    if (
      setting.key === "maintenance_mode" &&
      path[0] === "enabled" &&
      newValue === true
    ) {
      return {
        required: true,
        title: "Enable Maintenance Mode?",
        message:
          "Are you sure you want to enable maintenance mode? This will make the platform unavailable to users. You can still configure which subsections are affected.",
      }
    }

    return { required: false, title: "", message: "" }
  }

  const getFeatureIcon = (key: string) => {
    // Icon mapping for features (use Lucide icons)
    const featureIconMap: Record<string, any> = {
      tasks: CheckSquare,
      workspace_prompts: MessageSquare,
      content: FileText,
      analytics: BarChart3,
      ai_tracking: Brain,
      backlinks: LinkIcon,
      technical_audit: Wrench,
      social_listening: Ear,
    }
    
    return featureIconMap[key]
  }

  const getIntegrationCategory = (key: string): string => {
    const categories: Record<string, string> = {
      // Search & Knowledge
      google: "Search & Knowledge",
      microsoft: "Search & Knowledge",
      
      // Communication
      slack: "Communication",
      microsoft_teams: "Communication",
      
      // Project Management
      linear: "Project Management",
      
      // Analytics
      adobe_analytics: "Analytics",
      mixpanel: "Analytics",
      
      // Content & CMS
      wordpress: "Content & CMS",
      webflow: "Content & CMS",
      
      // Version Control
      github: "Version Control",
      
      // Social Media
      twitter: "Social Media",
      linkedin: "Social Media",
      discord: "Social Media",
      tiktok: "Social Media",
      
      // SEO Tools
      ahrefs: "SEO Tools",
      moz: "SEO Tools",
      semrush: "SEO Tools",
      kw_finder: "SEO Tools",
      
      // Automation
      zapier: "Automation",
      make: "Automation",
      n8n: "Automation",
      
      // E-commerce
      shopify: "E-commerce",
      
      // Advertisement
      meta_ads: "Advertisement",
      
      // AI & Platforms
      api: "Developer Tools",
      mcp: "Developer Tools",
      webhooks: "Developer Tools",
      
      // Platforms
      davinci: "Platforms",
      fabriq: "Platforms",
      klaviyo: "Platforms",
      apifox: "Platforms",
      airtable: "Platforms",
      
      // CRM & Sales
      salesforce: "CRM & Sales",
      intercom: "CRM & Sales",
      hubspot: "CRM & Sales",
      
      // AI Search
      perplexity: "AI Search",
      gemini: "AI Search",
      chatgpt: "AI Search",
    }
    
    return categories[key] || "Other"
  }

  const getIntegrationIcon = (key: string) => {
    // Icon mapping for integrations (use image paths from /public/icons)
    const iconMap: Record<string, string> = {
      // Search & Knowledge
      google: "google-drive.svg",
      microsoft: "microsoft.svg",
      
      // Communication
      slack: "slack.svg",
      microsoft_teams: "microsoft.svg",
      
      // Project Management
      linear: "linear.svg",
      
      // Analytics
      adobe_analytics: "adobe.svg",
      mixpanel: "mixpanel.svg",
      
      // Content & CMS
      wordpress: "wordpress.svg",
      webflow: "webflow.svg",
      
      // Version Control
      github: "github.svg",
      
      // Social Media
      twitter: "twitter.svg",
      linkedin: "linkedin.svg",
      discord: "discord.svg",
      tiktok: "tiktok.svg",
      
      // SEO Tools
      ahrefs: "ahrefs.svg",
      moz: "moz.svg",
      semrush: "semrush.svg",
      kw_finder: "searchapi.svg", // fallback to search icon
      
      // Automation
      zapier: "zapier.svg",
      make: "make.svg",
      n8n: "n8n-text.svg",
      
      // E-commerce
      shopify: "shopify_glyph_black.svg",
      
      // Advertisement
      meta_ads: "meta.svg",
      
      // AI & Platforms
      api: "openai-text.svg",
      mcp: "claude.svg", // fallback to claude
      webhooks: "webhook.svg",
      
      // Platforms
      davinci: "claude.svg", // fallback
      fabriq: "figma.svg", // fallback
      klaviyo: "klaviyo.svg",
      apifox: "openai-text.svg", // fallback
      airtable: "airtable.svg",
      
      // CRM & Sales
      salesforce: "salesforce.svg",
      intercom: "copilot-color.svg", // fallback
      hubspot: "huggingface-text.svg", // fallback
      
      // AI Search
      perplexity: "perplexity-color.svg",
      gemini: "gemini.svg",
      chatgpt: "openai-text.svg",
    }
    
    return iconMap[key] || "globe.svg" // default fallback
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      authentication: "Authentication",
      maintenance: "Maintenance",
      system: "System",
      security: "Security",
      notifications: "Notifications",
      experimental: "Experimental",
      api: "API",
      mcp: "MCP",
      features: "Features",
      integrations: "Integrations",
    }
    return labels[category] || category
  }

  const getSettingLabel = (key: string, path?: string[]) => {
    if (path && path.length > 0) {
      return path.join(" > ").replace(/_/g, " ")
    }
    return key.replace(/_/g, " ")
  }

  // Flatten all settings into toggle-able items
  const flattenSettings = (settings: AdminSetting[]) => {
    const items: Array<{
      settingKey: string
      category: string
      label: string
      description?: string
      path: string[]
      value: boolean
      setting: AdminSetting
      type: "toggle" | "button-group"
      options?: Array<{ value: string; label: string; description: string }>
      selectedValue?: string
      icon?: any
      iconType?: "lucide" | "image"
      iconPath?: string
      integrationCategory?: string
    }> = []

    settings.forEach((setting) => {
      const value = setting.value as SettingValue

      // Handle auth_mode as a simple toggle
      if (setting.key === "auth_mode") {
        items.push({
          settingKey: setting.key,
          category: setting.category,
          label: "Waitlist Mode",
          description: "Enable waitlist mode to require approval for new signups. When OFF, users can sign up freely.",
          path: ["use_waitlist_mode"],
          value: value.use_waitlist_mode === true,
          setting,
          type: "toggle",
        })
      }
      // Handle maintenance_mode
      else if (setting.key === "maintenance_mode") {
        items.push({
          settingKey: setting.key,
          category: setting.category,
          label: "Global Maintenance",
          description: "Enable maintenance mode for entire platform",
          path: ["enabled"],
          value: value.enabled as boolean,
          setting,
          type: "toggle",
        })

        // Add subsections
        if (value.subsections) {
          Object.entries(value.subsections as Record<string, boolean>).forEach(
            ([subkey, subvalue]) => {
              items.push({
                settingKey: setting.key,
                category: setting.category,
                label: `Maintenance: ${subkey}`,
                description: `Enable maintenance mode for ${subkey}`,
                path: ["subsections", subkey],
                value: subvalue,
                setting,
                type: "toggle",
              })
            }
          )
        }
      }
      // Handle data_source
      else if (setting.key === "data_source") {
        items.push({
          settingKey: setting.key,
          category: setting.category,
          label: "Use Mock Data",
          description: "Toggle between mock data and real production data",
          path: ["use_mock_data"],
          value: value.use_mock_data as boolean,
          setting,
          type: "toggle",
        })
      }
      // Handle app_features
      else if (setting.key === "app_features") {
        // Core features
        if (value.tasks !== undefined) {
          items.push({
            settingKey: setting.key,
            category: setting.category,
            label: "Tasks",
            description: "Enable task management features",
            path: ["tasks"],
            value: value.tasks as boolean,
            setting,
            type: "toggle",
            icon: getFeatureIcon("tasks"),
            iconType: "lucide",
          })
        }
        if (value.workspace_prompts !== undefined) {
          items.push({
            settingKey: setting.key,
            category: setting.category,
            label: "Workspace Prompts",
            description: "Enable workspace-level AI prompts",
            path: ["workspace_prompts"],
            value: value.workspace_prompts as boolean,
            setting,
            type: "toggle",
            icon: getFeatureIcon("workspace_prompts"),
            iconType: "lucide",
          })
        }

        // Brand features
        if (value.brands) {
          const brandsValue = value.brands as Record<string, boolean>
          
          if (brandsValue.content !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Content",
              description: "Enable content management for brands",
              path: ["brands", "content"],
              value: brandsValue.content,
              setting,
              type: "toggle",
              icon: getFeatureIcon("content"),
              iconType: "lucide",
            })
          }
          if (brandsValue.analytics !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Analytics",
              description: "Enable analytics for brands",
              path: ["brands", "analytics"],
              value: brandsValue.analytics,
              setting,
              type: "toggle",
              icon: getFeatureIcon("analytics"),
              iconType: "lucide",
            })
          }
          if (brandsValue.ai_tracking !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: AI Tracking",
              description: "Enable AI tracking for brands",
              path: ["brands", "ai_tracking"],
              value: brandsValue.ai_tracking,
              setting,
              type: "toggle",
              icon: getFeatureIcon("ai_tracking"),
              iconType: "lucide",
            })
          }
          if (brandsValue.backlinks !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Backlinks",
              description: "Enable backlink tracking for brands",
              path: ["brands", "backlinks"],
              value: brandsValue.backlinks,
              setting,
              type: "toggle",
              icon: getFeatureIcon("backlinks"),
              iconType: "lucide",
            })
          }
          if (brandsValue.technical_audit !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Technical Audit",
              description: "Enable technical SEO audit for brands",
              path: ["brands", "technical_audit"],
              value: brandsValue.technical_audit,
              setting,
              type: "toggle",
              icon: getFeatureIcon("technical_audit"),
              iconType: "lucide",
            })
          }
          if (brandsValue.social_listening !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Social Listening",
              description: "Enable social listening for brands",
              path: ["brands", "social_listening"],
              value: brandsValue.social_listening,
              setting,
              type: "toggle",
              icon: getFeatureIcon("social_listening"),
              iconType: "lucide",
            })
          }
          if (brandsValue.tasks !== undefined) {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: "Brands: Tasks",
              description: "Enable task management within brands",
              path: ["brands", "tasks"],
              value: brandsValue.tasks,
              setting,
              type: "toggle",
              icon: getFeatureIcon("tasks"),
              iconType: "lucide",
            })
          }
        }
      }
      // Handle integrations
      else if (setting.key === "integrations") {
        if (typeof value === "object" && !Array.isArray(value)) {
          Object.entries(value).forEach(([key, val]) => {
            if (typeof val === "boolean") {
              const iconPath = getIntegrationIcon(key)
              items.push({
                settingKey: setting.key,
                category: "integrations",
                label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
                description: `Enable ${key.replace(/_/g, " ")} integration`,
                path: [key],
                value: val,
                setting,
                type: "toggle",
                iconPath: iconPath,
                iconType: "image",
                integrationCategory: getIntegrationCategory(key),
              })
            }
          })
        }
      }
      // Generic: Extract all boolean fields
      else if (typeof value === "object" && !Array.isArray(value)) {
        Object.entries(value).forEach(([key, val]) => {
          if (typeof val === "boolean") {
            items.push({
              settingKey: setting.key,
              category: setting.category,
              label: `${setting.key}: ${key}`,
              description: setting.description,
              path: [key],
              value: val,
              setting,
              type: "toggle",
            })
          }
        })
      }
    })

    return items
  }

  const handleToggle = async (
    setting: AdminSetting,
    path: string[],
    currentValue: boolean
  ) => {
    const newValue: any = !currentValue
    
    const confirmation = requiresConfirmation(setting, path, newValue)

    if (confirmation.required) {
      setPendingChange({
        setting,
        path,
        newValue,
        confirmationTitle: confirmation.title,
        confirmationMessage: confirmation.message,
      })
    } else {
      await updateNestedValue(setting, path, newValue)
    }
  }

  const handleButtonGroupChange = async (
    setting: AdminSetting,
    path: string[],
    newValue: string
  ) => {
    const confirmation = requiresConfirmation(setting, path, newValue)

    if (confirmation.required) {
      setPendingChange({
        setting,
        path,
        newValue,
        confirmationTitle: confirmation.title,
        confirmationMessage: confirmation.message,
      })
    } else {
      await updateNestedValue(setting, path, newValue)
    }
  }

  const confirmPendingChange = async () => {
    if (pendingChange) {
      await updateNestedValue(
        pendingChange.setting,
        pendingChange.path,
        pendingChange.newValue
      )
      setPendingChange(null)
    }
  }

  const cancelPendingChange = () => {
    setPendingChange(null)
  }

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Add mock settings for features and integrations if they don't exist
  const getMockSettings = (): AdminSetting[] => {
    const mockSettings: AdminSetting[] = []
    
    // Check if app_features exists
    const hasFeatures = allSettings?.some(s => s.key === "app_features")
    if (!hasFeatures) {
      mockSettings.push({
        id: "mock-features",
        key: "app_features",
        category: "features",
        description: "Enable or disable app features - disabled features show as 'Coming Soon'",
        value: {
          tasks: true, // ✅ Enabled by default
          workspace_prompts: true, // ✅ Enabled by default
          brands: {
            content: true, // ✅ Enabled by default
            analytics: true, // ✅ Enabled by default
            ai_tracking: true, // ✅ Enabled by default
            backlinks: false, // ❌ Disabled by default
            technical_audit: true, // ✅ Enabled by default
            social_listening: true, // ✅ Enabled by default
            tasks: true, // ✅ Enabled by default
          },
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
        metadata: {},
      } as AdminSetting)
    }
    
    // Check if integrations exists
    const hasIntegrations = allSettings?.some(s => s.key === "integrations")
    if (!hasIntegrations) {
      mockSettings.push({
        id: "mock-integrations",
        key: "integrations",
        category: "integrations",
        description: "Enable or disable third-party integrations - disabled integrations show as 'Coming Soon'",
        value: {
          // Search & Knowledge
          google: true, // ✅ Enabled by default
          microsoft: false,
          
          // Communication
          slack: false,
          microsoft_teams: false,
          
          // Project Management
          linear: false,
          
          // Analytics
          adobe_analytics: false,
          mixpanel: false,
          
          // Content & CMS
          wordpress: true, // ✅ Enabled by default
          webflow: true, // ✅ Enabled by default
          
          // Version Control
          github: false,
          
          // Social Media & Commerce
          twitter: false,
          linkedin: false,
          discord: false,
          tiktok: false,
          
          // SEO Tools
          ahrefs: false,
          moz: false,
          semrush: false,
          kw_finder: false,
          
          // Automation & Integrations
          zapier: false,
          make: false,
          n8n: false,
          
          // E-commerce
          shopify: true, // ✅ Enabled by default
          
          // Advertisement
          meta_ads: false,
          
          // AI & Platforms
          api: false,
          mcp: false,
          webhooks: true, // ✅ Enabled by default
          
          // Platforms
          davinci: false,
          fabriq: false,
          klaviyo: false,
          apifox: false,
          airtable: false,
          
          // CRM & Sales
          salesforce: false,
          intercom: false,
          hubspot: false,
          
          // AI Search
          perplexity: false,
          gemini: false,
          chatgpt: false,
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: null,
        metadata: {},
      } as AdminSetting)
    }
    
    return mockSettings
  }

  const allSettingsWithMock = [...(allSettings || []), ...getMockSettings()]
  const flatItems = allSettingsWithMock ? flattenSettings(allSettingsWithMock) : []

  // Filter items based on search query and category
  const filteredItems = flatItems.filter(item => {
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Apply category filter for integrations only
    if (item.category === "integrations") {
      const matchesCategory = categoryFilter === "all" || 
        item.integrationCategory === categoryFilter
      return matchesSearch && matchesCategory
    }
    
    return matchesSearch
  })

  // Group by category for visual organization
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof flatItems>)

  // Sort integrations: enabled first, then disabled
  if (itemsByCategory.integrations) {
    itemsByCategory.integrations.sort((a, b) => {
      // Enabled (true) comes before disabled (false)
      if (a.value === b.value) {
        // If same status, sort alphabetically by label
        return a.label.localeCompare(b.label)
      }
      return a.value ? -1 : 1
    })
  }

  // Get unique integration categories for filter
  const integrationCategories = Array.from(
    new Set(
      flatItems
        .filter(item => item.category === "integrations")
        .map(item => item.integrationCategory)
        .filter(Boolean)
    )
  ).sort()

  return (
    <div className="mt-10">
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Platform configuration and global settings
          </p>
        </div>

        {/* Settings List */}
        {Object.entries(itemsByCategory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(itemsByCategory)
              .sort(([a], [b]) => {
                const order = [
                  "authentication",
                  "maintenance",
                  "system",
                  "security",
                  "notifications",
                  "experimental",
                  "features",
                  "integrations",
                ]
                return order.indexOf(a) - order.indexOf(b)
              })
              .map(([category, items]) => (
                <div key={category} className="space-y-3">
                  {/* Category Header */}
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {getCategoryLabel(category)}
                  </h2>

                  {/* Search and Filter for Integrations */}
                  {category === "integrations" && (
                    <div className="space-y-3 mb-4">
                      {/* Search Bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search integrations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 pr-9"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant={categoryFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCategoryFilter("all")}
                        >
                          All
                        </Button>
                        {integrationCategories.map((cat) => (
                          <Button
                            key={cat}
                            variant={categoryFilter === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCategoryFilter(cat as string)}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Toggles and Button Groups */}
                  <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                    {items.map((item, index) => (
                      <div
                        key={`${item.settingKey}-${item.path.join("-")}-${index}`}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between hover:bg-muted/30 transition-colors p-1 -m-1 rounded">
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2">
                              {item.iconType === "lucide" && item.icon && (
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                              )}
                              {item.iconType === "image" && item.iconPath && (
                                <div className="relative h-4 w-4 flex-shrink-0">
                                  <Image
                                    src={`/icons/${item.iconPath}`}
                                    alt={item.label}
                                    width={16}
                                    height={16}
                                    className="object-contain"
                                  />
                                </div>
                              )}
                              <Label
                                htmlFor={`toggle-${item.settingKey}-${item.path.join("-")}`}
                                className="text-base font-medium capitalize cursor-pointer"
                              >
                                {getSettingLabel(item.settingKey, item.path)}
                              </Label>
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <Switch
                            id={`toggle-${item.settingKey}-${item.path.join("-")}`}
                            checked={item.value}
                            onCheckedChange={() =>
                              handleToggle(item.setting, item.path, item.value)
                            }
                            disabled={updateSettingMutation.isPending}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No settings found</p>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AlertDialog open={!!pendingChange} onOpenChange={() => setPendingChange(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{pendingChange?.confirmationTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingChange?.confirmationMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelPendingChange}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmPendingChange}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
