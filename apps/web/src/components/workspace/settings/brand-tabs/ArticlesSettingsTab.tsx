"use client";

import { useState } from "react";
import { Plus, Save, Loader2 } from "lucide-react";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";

interface ArticlesSettingsTabProps {
  brandId: string;
}

export function ArticlesSettingsTab({ brandId }: ArticlesSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  
  const [defaultLanguage, setDefaultLanguage] = useState("en-US");
  const [autoPublish, setAutoPublish] = useState(false);
  const [aiEnhancements, setAiEnhancements] = useState(true);
  const [seoOptimization, setSeoOptimization] = useState(true);
  const [defaultWordCount, setDefaultWordCount] = useState("1500");
  const [publishSchedule, setPublishSchedule] = useState("manual");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Defaults */}
      <section>
        <h3 className="text-sm font-medium mb-4">Article Defaults</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Default Language</Label>
            <select
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Target Word Count</Label>
            <select
              value={defaultWordCount}
              onChange={(e) => setDefaultWordCount(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="500">~500 words (Short)</option>
              <option value="1000">~1000 words (Medium)</option>
              <option value="1500">~1500 words (Standard)</option>
              <option value="2000">~2000 words (Long)</option>
              <option value="3000">~3000 words (Comprehensive)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Publish Schedule</Label>
            <select
              value={publishSchedule}
              onChange={(e) => setPublishSchedule(e.target.value)}
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="manual">Manual publish</option>
              <option value="immediate">Publish immediately when ready</option>
              <option value="scheduled">Use scheduled publishing</option>
            </select>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* AI Features */}
      <section>
        <h3 className="text-sm font-medium mb-4">AI Features</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">AI Content Enhancements</p>
              <p className="text-xs text-muted-foreground">Allow AI to suggest improvements</p>
            </div>
            <Switch checked={aiEnhancements} onCheckedChange={setAiEnhancements} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">SEO Optimization</p>
              <p className="text-xs text-muted-foreground">Automatically optimize for search engines</p>
            </div>
            <Switch checked={seoOptimization} onCheckedChange={setSeoOptimization} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">Auto-publish approved content</p>
              <p className="text-xs text-muted-foreground">Automatically publish after approval</p>
            </div>
            <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Templates */}
      <section>
        <h3 className="text-sm font-medium mb-4">Content Templates</h3>
        <div className="space-y-2">
          {[
            { name: "Blog Post", desc: "Standard blog article format" },
            { name: "How-to Guide", desc: "Step-by-step tutorial format" },
            { name: "Product Review", desc: "Product comparison and review" },
          ].map((template) => (
            <div key={template.name} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.desc}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">Configure</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Plus className="size-4 mr-2" />
            Add Template
          </Button>
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
