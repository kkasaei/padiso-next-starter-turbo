"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Eye, EyeOff, Copy, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { toast } from "sonner";

export interface IntegrationField {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "password" | "url" | "select";
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface IntegrationConfig {
  id: string;
  name: string;
  icon: string;
  fields: IntegrationField[];
  docsUrl?: string;
}

// OAuth integrations - these redirect to OAuth flow instead of showing a dialog
export const OAUTH_INTEGRATIONS = new Set(["google"]);

// Integration configurations (for non-OAuth integrations)
export const INTEGRATION_CONFIGS: Record<string, IntegrationConfig> = {
  wordpress: {
    id: "wordpress",
    name: "WordPress",
    icon: "/icons/wordpress.svg",
    docsUrl: "https://docs.searchfit.ai/integrations/wordpress",
    fields: [
      { id: "webhookUrl", label: "Webhook URL", placeholder: "https://webhook-url.com", type: "url", required: true },
      { id: "accessToken", label: "Access Token (Bearer token)", placeholder: "access-token", type: "password", required: true },
      { id: "authorId", label: "Author ID", placeholder: "e.g. 1", type: "text", required: false },
      { id: "postStatus", label: "Post Status", placeholder: "Select status", type: "select", required: false, options: [
        { value: "publish", label: "Published" },
        { value: "draft", label: "Draft" },
        { value: "pending", label: "Pending Review" },
        { value: "private", label: "Private" },
        { value: "future", label: "Scheduled" },
      ]},
    ],
  },
  webflow: {
    id: "webflow",
    name: "Webflow",
    icon: "/icons/webflow.svg",
    docsUrl: "https://docs.searchfit.ai/integrations/webflow",
    fields: [
      { id: "apiKey", label: "API Key", placeholder: "Your Webflow API Key", type: "password", required: true },
    ],
  },
  webhook: {
    id: "webhook",
    name: "Webhooks",
    icon: "/icons/webhook.svg",
    docsUrl: "https://docs.searchfit.ai/integrations/webhooks",
    fields: [
      { id: "webhookUrl", label: "Webhook URL", placeholder: "https://your-endpoint.com/webhook", type: "url", required: true },
      { id: "secret", label: "Secret (optional)", placeholder: "Webhook signing secret", type: "password", required: false },
    ],
  },
  shopify: {
    id: "shopify",
    name: "Shopify",
    icon: "/icons/shopify_glyph_black.svg",
    docsUrl: "https://docs.searchfit.ai/integrations/shopify",
    fields: [
      { id: "storeName", label: "Store Name (e.g. 'my-store')", placeholder: "my-store", type: "text", required: true },
      { id: "clientId", label: "Client ID", placeholder: "Your app's Client ID", type: "password", required: true },
      { id: "secret", label: "Secret", placeholder: "shpss_...", type: "password", required: true },
      { id: "blog", label: "Blog", placeholder: "Select a blog", type: "select", required: false, options: [] },
      { id: "author", label: "Author", placeholder: "Author name", type: "text", required: false },
      { id: "publishStatus", label: "Publish Status", placeholder: "Select status", type: "select", required: false, options: [
        { value: "publish", label: "Publish Immediately" },
        { value: "draft", label: "Save as Draft" },
      ]},
    ],
  },
};

interface IntegrationConnectDialogProps {
  integrationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (integrationId: string, data: Record<string, string>) => Promise<void>;
  isManaging?: boolean;
  initialConfig?: Record<string, string>;
}

export function IntegrationConnectDialog({
  integrationId,
  open,
  onOpenChange,
  onConnect,
  isManaging = false,
  initialConfig,
}: IntegrationConnectDialogProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const config = integrationId ? INTEGRATION_CONFIGS[integrationId] : null;

  // Pre-populate form with initial config when managing
  useEffect(() => {
    if (open && initialConfig && isManaging) {
      // Convert all values to strings for the form
      const stringifiedConfig: Record<string, string> = {};
      Object.entries(initialConfig).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          stringifiedConfig[key] = String(value);
        }
      });
      setFormData(stringifiedConfig);
    } else if (!open) {
      setFormData({});
      setShowPasswords({});
    }
  }, [open, initialConfig, isManaging]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const copyToClipboard = async (fieldId: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConnect = async () => {
    if (!config || !integrationId) return;

    // Validate required fields
    const missingFields = config.fields
      .filter(f => f.required && !formData[f.id]?.trim())
      .map(f => f.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return;
    }

    setIsConnecting(true);
    try {
      await onConnect(integrationId, formData);
      toast.success(`${config.name} ${isManaging ? "updated" : "connected"} successfully`);
      onOpenChange(false);
      // Reset is handled by useEffect when open becomes false
    } catch (error) {
      toast.error(`Failed to connect: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset is handled by useEffect when open becomes false
  };

  if (!config) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
              <img
                src={config.icon}
                alt={config.name}
                className="size-5 object-contain"
              />
            </div>
            {isManaging ? "Manage" : "Connect"} {config.name}
          </DialogTitle>
        </DialogHeader>

        {config.docsUrl && (
          <Button
            variant="outline"
            size="sm"
            className="w-fit text-xs"
            asChild
          >
            <a href={config.docsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3 mr-1.5" />
              View setup instructions
            </a>
          </Button>
        )}

        <div className="space-y-4 py-4">
          {config.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="text-sm">
                {field.label}
                {!field.required && <span className="text-muted-foreground ml-1">(optional)</span>}
              </Label>
              <div className="relative">
                {field.type === "select" && field.options ? (
                  <select
                    value={formData[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    type={field.type === "password" && !showPasswords[field.id] ? "password" : "text"}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="pr-20"
                  />
                )}
                {field.type === "password" && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {formData[field.id] && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => copyToClipboard(field.id, formData[field.id])}
                      >
                        {copiedField === field.id ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => togglePasswordVisibility(field.id)}
                    >
                      {showPasswords[field.id] ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? (isManaging ? "Saving..." : "Connecting...") : (isManaging ? "Save" : "Connect")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
