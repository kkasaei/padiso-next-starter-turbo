"use client"

import { useState } from "react"
import { Switch } from "@workspace/ui/components/switch"
import { Label } from "@workspace/ui/components/label"
import { Button } from "@workspace/ui/components/button"
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
    if (setting.key === "auth_mode" && path[0] === "mode") {
      const currentMode = (setting.value as SettingValue).mode
      const modeLabel = newValue === "waitlist" ? "Waitlist" : "Open Signup"
      const currentLabel = currentMode === "waitlist" ? "Waitlist" : "Open Signup"
      
      if (currentMode !== newValue) {
        return {
          required: true,
          title: "Change Authentication Mode?",
          message: `Are you sure you want to change authentication from "${currentLabel}" to "${modeLabel}"? This will affect how users sign up and access the platform.`,
        }
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
    }> = []

    settings.forEach((setting) => {
      const value = setting.value as SettingValue

      // Handle auth_mode as a toggle (open vs waitlist)
      if (setting.key === "auth_mode") {
        items.push({
          settingKey: setting.key,
          category: setting.category,
          label: "Waitlist Mode",
          description: "Control user registration: OFF = Open signup enabled, ON = Waitlist (require approval)",
          path: ["mode"],
          value: value.mode === "waitlist",
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
    let newValue: any = !currentValue
    
    // Special handling for auth_mode - convert boolean to mode string
    if (setting.key === "auth_mode" && path[0] === "mode") {
      newValue = currentValue ? "open" : "waitlist"
    }
    
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

  const flatItems = allSettings ? flattenSettings(allSettings) : []

  // Group by category for visual organization
  const itemsByCategory = flatItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof flatItems>)

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
                ]
                return order.indexOf(a) - order.indexOf(b)
              })
              .map(([category, items]) => (
                <div key={category} className="space-y-3">
                  {/* Category Header */}
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {getCategoryLabel(category)}
                  </h2>

                  {/* Toggles and Button Groups */}
                  <div className="rounded-2xl border border-border bg-card divide-y divide-border">
                    {items.map((item, index) => (
                      <div
                        key={`${item.settingKey}-${item.path.join("-")}-${index}`}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between hover:bg-muted/30 transition-colors p-1 -m-1 rounded">
                          <div className="flex-1 pr-4">
                            <Label
                              htmlFor={`toggle-${item.settingKey}-${item.path.join("-")}`}
                              className="text-base font-medium capitalize cursor-pointer"
                            >
                              {getSettingLabel(item.settingKey, item.path)}
                            </Label>
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
