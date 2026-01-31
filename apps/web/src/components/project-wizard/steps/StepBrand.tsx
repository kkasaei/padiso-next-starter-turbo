import { useState } from "react";
import { Globe, Info, Check } from "@phosphor-icons/react/dist/ssr";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
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

export function StepBrand({ data, updateData }: StepBrandProps) {
  const [showCustomColor, setShowCustomColor] = useState(false);

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
                    <Check className="size-4 text-white drop-shadow-md" weight="bold" />
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
                  <Check className="size-4 text-white drop-shadow-md" weight="bold" />
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
              placeholder="yourbrandname.com/sitemap.xml"
              className="h-10 pl-4 pr-10 bg-background border-border rounded-xl"
            />
            <Globe className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
