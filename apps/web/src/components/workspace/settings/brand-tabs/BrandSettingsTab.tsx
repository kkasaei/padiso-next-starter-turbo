"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X, Check, Save, Loader2, Upload, Trash2 } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useBrand, useUpdateBrand } from "@/hooks/use-brands";
import { toast } from "sonner";

// Helper to get favicon URL from a website URL
function getFaviconUrl(websiteUrl: string): string | null {
  try {
    const url = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return null;
  }
}

interface BrandSettingsTabProps {
  brandId: string;
}

const BRAND_COLORS = [
  { id: "red", value: "#EF4444" },
  { id: "orange", value: "#F97316" },
  { id: "amber", value: "#F59E0B" },
  { id: "lime", value: "#84CC16" },
  { id: "green", value: "#22C55E" },
  { id: "teal", value: "#14B8A6" },
  { id: "cyan", value: "#06B6D4" },
  { id: "blue", value: "#3B82F6" },
  { id: "indigo", value: "#6366F1" },
  { id: "violet", value: "#8B5CF6" },
  { id: "purple", value: "#A855F7" },
  { id: "pink", value: "#EC4899" },
  { id: "slate", value: "#64748B" },
];

const LANGUAGES = [
  { id: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { id: 'en-GB', label: 'English (UK)', flag: '🇬🇧' },
  { id: 'es', label: 'Spanish', flag: '🇪🇸' },
  { id: 'fr', label: 'French', flag: '🇫🇷' },
  { id: 'de', label: 'German', flag: '🇩🇪' },
  { id: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { id: 'it', label: 'Italian', flag: '🇮🇹' },
  { id: 'nl', label: 'Dutch', flag: '🇳🇱' },
  { id: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { id: 'ko', label: 'Korean', flag: '🇰🇷' },
];

export function BrandSettingsTab({ brandId }: BrandSettingsTabProps) {
  const { data: brand, isLoading } = useBrand(brandId);
  const updateBrand = useUpdateBrand();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [brandName, setBrandName] = useState("");
  const [brandColor, setBrandColor] = useState<string | undefined>();
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [audienceInput, setAudienceInput] = useState("");
  const [targetAudiences, setTargetAudiences] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);

  // Populate form when brand data loads
  useEffect(() => {
    if (brand) {
      setBrandName(brand.brandName || "");
      setBrandColor(brand.brandColor || undefined);
      setIconUrl(brand.iconUrl || null);
      setWebsiteUrl(brand.websiteUrl || "");
      setSitemapUrl(brand.sitemapUrl || "");
      setDescription(brand.description || "");
      setSelectedLanguages(brand.languages || []);
      setTargetAudiences(brand.targetAudiences || []);
      setKeywords(brand.businessKeywords || []);
      setCompetitors(brand.competitors || []);
    }
  }, [brand]);

  // Get the display icon: custom iconUrl > favicon from website
  const displayIconUrl = iconUrl || (websiteUrl ? getFaviconUrl(websiteUrl) : null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, create a local URL - in production this would upload to a file service
      const localUrl = URL.createObjectURL(file);
      setIconUrl(localUrl);
      toast.info("Icon preview updated. Save to apply changes.");
    }
  };

  const handleRemoveIcon = () => {
    setIconUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    updateBrand.mutate({
      id: brandId,
      brandName,
      brandColor,
      iconUrl: iconUrl,
      websiteUrl: websiteUrl || undefined,
      sitemapUrl: sitemapUrl || undefined,
      description: description || undefined,
      languages: selectedLanguages,
      targetAudiences,
      businessKeywords: keywords,
      competitors,
    }, {
      onSuccess: () => {
        toast.success("Brand settings saved");
      },
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
      },
    });
  };

  const toggleLanguage = (langId: string) => {
    setSelectedLanguages(prev => 
      prev.includes(langId) ? prev.filter(l => l !== langId) : [...prev, langId]
    );
  };

  const addItem = (
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    listSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      listSetter(prev => [...prev, value.trim()]);
      setter("");
    }
  };

  const removeItem = (index: number, listSetter: React.Dispatch<React.SetStateAction<string[]>>) => {
    listSetter(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-8">
        <section>
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="size-7 rounded-md" />
              ))}
            </div>
          </div>
        </section>
        <Skeleton className="h-px w-full" />
        <section>
          <Skeleton className="h-4 w-20 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Brand Identity */}
      <section>
        <h3 className="text-sm font-medium mb-4">Brand Identity</h3>
        <div className="space-y-4">
          {/* Brand Icon */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Brand icon</Label>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
                {displayIconUrl ? (
                  <img 
                    src={displayIconUrl} 
                    alt="Brand icon" 
                    className="size-12 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-2xl font-medium text-muted-foreground">
                    {brandName?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-3 mr-1.5" />
                  Upload icon
                </Button>
                {iconUrl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground"
                    onClick={handleRemoveIcon}
                  >
                    <Trash2 className="size-3 mr-1.5" />
                    Remove
                  </Button>
                )}
                {!iconUrl && websiteUrl && (
                  <p className="text-xs text-muted-foreground">Using favicon from website</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Brand name</Label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Your brand name"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Brand color</Label>
            <div className="flex flex-wrap gap-2">
              {BRAND_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setBrandColor(color.value)}
                  className={cn(
                    "size-7 rounded-md transition-all flex items-center justify-center",
                    "hover:scale-110",
                    brandColor === color.value && "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                  )}
                  style={{ backgroundColor: color.value }}
                >
                  {brandColor === color.value && (
                    <Check className="size-3.5 text-white" strokeWidth={3} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Website */}
      <section>
        <h3 className="text-sm font-medium mb-4">Website</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Website URL</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourbrand.com"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Sitemap URL (optional)</Label>
            <Input
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              placeholder="https://yourbrand.com/sitemap.xml"
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Languages */}
      <section>
        <h3 className="text-sm font-medium mb-4">Languages</h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => toggleLanguage(lang.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-sm transition-colors",
                selectedLanguages.includes(lang.id)
                  ? "border-foreground/20 bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* Description */}
      <section>
        <h3 className="text-sm font-medium mb-4">Business Description</h3>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your business, products, services..."
          className="min-h-[100px] resize-none"
        />
      </section>

      <hr className="border-border" />

      {/* Target Audiences */}
      <section>
        <h3 className="text-sm font-medium mb-4">Target Audiences</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={audienceInput}
              onChange={(e) => setAudienceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem(audienceInput, setAudienceInput, targetAudiences, setTargetAudiences))}
              placeholder="e.g. small business owners"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => addItem(audienceInput, setAudienceInput, targetAudiences, setTargetAudiences)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {targetAudiences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targetAudiences.map((item, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1">
                  {item}
                  <button onClick={() => removeItem(index, setTargetAudiences)} className="ml-1 hover:bg-muted rounded p-0.5">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Keywords */}
      <section>
        <h3 className="text-sm font-medium mb-4">Business Keywords</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem(keywordInput, setKeywordInput, keywords, setKeywords))}
              placeholder="Add a keyword..."
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => addItem(keywordInput, setKeywordInput, keywords, setKeywords)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((item, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1">
                  {item}
                  <button onClick={() => removeItem(index, setKeywords)} className="ml-1 hover:bg-muted rounded p-0.5">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="border-border" />

      {/* Competitors */}
      <section>
        <h3 className="text-sm font-medium mb-4">Competitors</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem(competitorInput, setCompetitorInput, competitors, setCompetitors))}
              placeholder="e.g. competitor.com"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => addItem(competitorInput, setCompetitorInput, competitors, setCompetitors)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
          {competitors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {competitors.map((item, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pl-2.5 pr-1 py-1">
                  {item}
                  <button onClick={() => removeItem(index, setCompetitors)} className="ml-1 hover:bg-muted rounded p-0.5">
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={updateBrand.isPending}>
          {updateBrand.isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
          {updateBrand.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
