"use client";

import { useState } from "react";
import { Upload, Save, Loader2 } from "lucide-react";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { Progress } from "@workspace/ui/components/progress";

interface AssetsSettingsTabProps {
  brandId: string;
}

export function AssetsSettingsTab({ brandId }: AssetsSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [generateAltText, setGenerateAltText] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState("10");
  const [imageFormat, setImageFormat] = useState("webp");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const storageUsed = 2.4;
  const storageLimit = 10;
  const storagePercent = (storageUsed / storageLimit) * 100;

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Storage */}
      <section>
        <h3 className="text-sm font-medium mb-4">Storage</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Storage used</span>
            <span>{storageUsed} GB / {storageLimit} GB</span>
          </div>
          <Progress value={storagePercent} className="h-1.5" />
          <div className="grid grid-cols-4 gap-3 pt-2">
            {[
              { label: "Images", value: "1.8 GB", count: "234 files" },
              { label: "Videos", value: "420 MB", count: "12 files" },
              { label: "Documents", value: "180 MB", count: "56 files" },
              { label: "Other", value: "20 MB", count: "8 files" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Upload Settings */}
      <section>
        <h3 className="text-sm font-medium mb-4">Upload Settings</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Maximum file size</Label>
            <select
              value={maxFileSize}
              onChange={(e) => setMaxFileSize(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="5">5 MB</option>
              <option value="10">10 MB</option>
              <option value="25">25 MB</option>
              <option value="50">50 MB</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Preferred image format</Label>
            <select
              value={imageFormat}
              onChange={(e) => setImageFormat(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="webp">WebP (Recommended)</option>
              <option value="jpg">JPEG</option>
              <option value="png">PNG</option>
              <option value="original">Keep original</option>
            </select>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Image Processing */}
      <section>
        <h3 className="text-sm font-medium mb-4">Image Processing</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">Auto-optimize images</p>
              <p className="text-xs text-muted-foreground">Compress and optimize uploaded images</p>
            </div>
            <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">Generate alt text with AI</p>
              <p className="text-xs text-muted-foreground">Auto-generate descriptive alt text</p>
            </div>
            <Switch checked={generateAltText} onCheckedChange={setGenerateAltText} />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Brand Assets */}
      <section>
        <h3 className="text-sm font-medium mb-4">Brand Assets</h3>
        <div className="space-y-3">
          {[
            { name: "Primary Logo", desc: "No file uploaded" },
            { name: "Favicon", desc: "No file uploaded" },
            { name: "Social Media Image", desc: "No file uploaded" },
          ].map((asset) => (
            <div key={asset.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-md bg-muted" />
                <div>
                  <p className="text-sm">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.desc}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Upload className="size-3 mr-1.5" />
                Upload
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
