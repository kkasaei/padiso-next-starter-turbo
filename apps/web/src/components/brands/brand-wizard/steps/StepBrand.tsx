import { useState, useEffect, useMemo } from "react";
import { Globe, Info, Check, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { BusinessData } from "../types";

interface StepBrandProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

// Preset brand colors
const BRAND_COLORS = [
  { id: "red", value: "#EF4444", label: "Red" },
  { id: "orange", value: "#F97316", label: "Orange" },
  { id: "amber", value: "#F59E0B", label: "Amber" },
  { id: "yellow", value: "#EAB308", label: "Yellow" },
  { id: "lime", value: "#84CC16", label: "Lime" },
  { id: "green", value: "#22C55E", label: "Green" },
  { id: "emerald", value: "#10B981", label: "Emerald" },
  { id: "teal", value: "#14B8A6", label: "Teal" },
  { id: "cyan", value: "#06B6D4", label: "Cyan" },
  { id: "sky", value: "#0EA5E9", label: "Sky" },
  { id: "blue", value: "#3B82F6", label: "Blue" },
  { id: "indigo", value: "#6366F1", label: "Indigo" },
  { id: "violet", value: "#8B5CF6", label: "Violet" },
  { id: "purple", value: "#A855F7", label: "Purple" },
  { id: "fuchsia", value: "#D946EF", label: "Fuchsia" },
  { id: "pink", value: "#EC4899", label: "Pink" },
  { id: "rose", value: "#F43F5E", label: "Rose" },
  { id: "slate", value: "#64748B", label: "Slate" },
];

// Derive a capitalised brand name from a domain hostname
// e.g. "padiso.co" -> "Padiso", "my-brand.com" -> "My Brand"
function domainToBrandName(websiteUrl?: string): string {
  if (!websiteUrl) return "";
  try {
    let raw = websiteUrl.trim();
    if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
    const hostname = new URL(raw).hostname;
    // Strip www. and take the part before the TLD
    const name = hostname.replace(/^www\./i, "").split(".")[0] || "";
    return name
      .split(/[-_]/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } catch {
    return "";
  }
}

// Pick a deterministic color from the palette based on the domain name
function pickDefaultColor(websiteUrl?: string): string {
  if (!websiteUrl) return BRAND_COLORS[10]!.value; // blue fallback
  let hash = 0;
  for (let i = 0; i < websiteUrl.length; i++) {
    hash = (hash * 31 + websiteUrl.charCodeAt(i)) | 0;
  }
  return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length]!.value;
}

export function StepBrand({ data, updateData }: StepBrandProps) {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [autoPopulated, setAutoPopulated] = useState(false);

  // Derive a suggested sitemap URL from the website URL
  const suggestedSitemapUrl = useMemo(() => {
    if (!data.websiteUrl) return "";
    try {
      let raw = data.websiteUrl.trim();
      if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
      const hostname = new URL(raw).hostname;
      return `${hostname}/sitemap.xml`;
    } catch {
      return "";
    }
  }, [data.websiteUrl]);

  // Auto-populate brand name, color, and sitemap URL once when the step first mounts
  useEffect(() => {
    if (autoPopulated) return;

    const updates: Partial<BusinessData> = {};

    if (!data.brandName) {
      const suggested = domainToBrandName(data.websiteUrl);
      if (suggested) updates.brandName = suggested;
    }

    if (!data.brandColor) {
      updates.brandColor = pickDefaultColor(data.websiteUrl);
    }

    if (!data.sitemapUrl && suggestedSitemapUrl) {
      updates.sitemapUrl = suggestedSitemapUrl;
    }

    if (Object.keys(updates).length > 0) {
      updateData(updates);
    }

    setAutoPopulated(true);
  }, [autoPopulated, data.brandName, data.brandColor, data.sitemapUrl, data.websiteUrl, suggestedSitemapUrl, updateData]);

  // Validate the sitemap URL
  const sitemapUrl = data.sitemapUrl?.trim() || "";
  const { data: sitemapCheck, isFetching: isCheckingSitemap } =
    trpc.brands.checkSitemap.useQuery(
      { url: sitemapUrl },
      {
        enabled: sitemapUrl.length > 5 && sitemapUrl.includes("."),
        staleTime: 60_000,
        retry: false,
      }
    );

  const isCustomColor = data.brandColor && !BRAND_COLORS.some(c => c.value === data.brandColor);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-2 rounded-full bg-red-500" />
          <span className="text-xs text-muted-foreground font-medium">Step 5 (Optional)</span>
        </div>
        <span className="text-xs text-muted-foreground">Brand 1 of 5</span>
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-6">Let us know your brand</h2>

      <div className="space-y-6">
        {/* Brand Info Box */}
        <div className="space-y-2 p-4 rounded-xl bg-muted text-sm">
          <ul className="space-y-1 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Brand name is used in every inquiry to get the best</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Example: where to add the to help finding an alternative and a price</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-foreground">•</span>
              <span>Adding brand identifier is optional but the identifier will get score of your brand</span>
            </li>
          </ul>
        </div>

        {/* Brand Name */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <Label className="text-sm font-medium flex items-center gap-1">
            Brand name
            <Info className="size-3 text-muted-foreground" />
          </Label>
          
          <Input
            value={data.brandName || ""}
            onChange={(e) => updateData({ brandName: e.target.value })}
            placeholder="Your brand name"
            className="h-10 bg-background border-border rounded-xl"
          />

          <p className="text-xs text-muted-foreground">
            Once set, everyone using the brand's content will...
          </p>
        </div>

        {/* Brand Color */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <Label className="text-sm font-medium flex items-center gap-1">
            Brand color (optional)
            <Info className="size-3 text-muted-foreground" />
          </Label>
          
          {/* Color Swatches */}
          <div className="flex flex-wrap gap-2">
            {BRAND_COLORS.map((color) => {
              const isSelected = data.brandColor === color.value;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => updateData({ brandColor: color.value })}
                  className={cn(
                    "size-8 rounded-lg transition-all flex items-center justify-center",
                    "hover:scale-110 hover:shadow-md",
                    isSelected && "ring-2 ring-offset-2 ring-offset-muted ring-foreground"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                >
                  {isSelected && (
                    <Check className="size-4 text-white drop-shadow-md" strokeWidth={3} />
                  )}
                </button>
              );
            })}
            
            {/* Custom Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCustomColor(!showCustomColor)}
                className={cn(
                  "size-8 rounded-lg border-2 border-dashed border-border bg-background transition-all",
                  "hover:border-foreground/50 flex items-center justify-center text-muted-foreground",
                  isCustomColor && "ring-2 ring-offset-2 ring-offset-muted ring-foreground"
                )}
                style={isCustomColor ? { backgroundColor: data.brandColor } : undefined}
                title="Custom color"
              >
                {isCustomColor ? (
                  <Check className="size-4 text-white drop-shadow-md" strokeWidth={3} />
                ) : (
                  <span className="text-xs font-medium">#</span>
                )}
              </button>
            </div>
          </div>

          {/* Custom Color Input */}
          {(showCustomColor || isCustomColor) && (
            <div className="flex items-center gap-2 mt-2">
              <div 
                className="size-8 rounded-lg border border-border shrink-0"
                style={{ backgroundColor: data.brandColor || '#000000' }}
              />
              <Input
                type="text"
                value={data.brandColor || ""}
                onChange={(e) => {
                  let value = e.target.value;
                  // Add # if not present
                  if (value && !value.startsWith('#')) {
                    value = '#' + value;
                  }
                  updateData({ brandColor: value });
                }}
                placeholder="#000000"
                className="h-8 w-28 bg-background border-border rounded-lg font-mono text-sm"
                maxLength={7}
              />
              <input
                type="color"
                value={data.brandColor || "#000000"}
                onChange={(e) => updateData({ brandColor: e.target.value })}
                className="size-8 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
              />
            </div>
          )}

          {data.brandColor && (
            <button
              type="button"
              onClick={() => updateData({ brandColor: undefined })}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear color
            </button>
          )}
        </div>

        {/* Sitemap */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <Label className="text-sm font-medium flex items-center gap-1">
            Sitemap URL (optional)
            <Info className="size-3 text-muted-foreground" />
          </Label>
          
          <div className="relative">
            <Input
              value={data.sitemapUrl || ""}
              onChange={(e) => updateData({ sitemapUrl: e.target.value })}
              placeholder={suggestedSitemapUrl || "yourbrandname.com/sitemap.xml"}
              className={cn(
                "h-10 pl-4 pr-10 bg-background border-border rounded-xl",
                sitemapUrl && sitemapCheck && !isCheckingSitemap && (
                  sitemapCheck.exists
                    ? "border-emerald-500 focus-visible:ring-emerald-500"
                    : "border-red-400 focus-visible:ring-red-400"
                )
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingSitemap ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : sitemapUrl && sitemapCheck ? (
                sitemapCheck.exists ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <XCircle className="size-4 text-red-400" />
                )
              ) : (
                <Globe className="size-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {sitemapUrl && sitemapCheck && !isCheckingSitemap && (
            <p className={cn(
              "text-xs",
              sitemapCheck.exists ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
            )}>
              {sitemapCheck.exists
                ? "Sitemap found and reachable"
                : "Sitemap not found at this URL. Double-check the path or leave blank to skip."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
