"use client";

import { useState } from "react";
import { Plus, Trash2, Upload, ExternalLink, Save, Loader2, Globe, FileText, BookOpen } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";

interface ContextSettingsTabProps {
  brandId: string;
}

interface ContextSource {
  id: string;
  type: "url" | "document" | "text";
  title: string;
  lastUpdated: string;
}

export function ContextSettingsTab({ brandId }: ContextSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [includeWebsite, setIncludeWebsite] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  
  const [contextSources, setContextSources] = useState<ContextSource[]>([
    { id: "1", type: "url", title: "https://example.com/about", lastUpdated: "2 days ago" },
    { id: "2", type: "document", title: "Brand Guidelines.pdf", lastUpdated: "1 week ago" },
    { id: "3", type: "text", title: "Product Information", lastUpdated: "3 days ago" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      setContextSources(prev => [...prev, {
        id: Date.now().toString(),
        type: "url",
        title: urlInput.trim(),
        lastUpdated: "Just now",
      }]);
      setUrlInput("");
    }
  };

  const handleRemove = (id: string) => {
    setContextSources(prev => prev.filter(s => s.id !== id));
  };

  const getIcon = (type: string) => {
    if (type === "url") return <Globe className="size-4 text-muted-foreground" />;
    if (type === "document") return <FileText className="size-4 text-muted-foreground" />;
    return <BookOpen className="size-4 text-muted-foreground" />;
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Settings */}
      <section>
        <h3 className="text-sm font-medium mb-4">Context Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add context sources to help AI understand your brand better.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">Include website content</p>
              <p className="text-xs text-muted-foreground">Crawl and index your website</p>
            </div>
            <Switch checked={includeWebsite} onCheckedChange={setIncludeWebsite} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm">Auto-sync sources</p>
              <p className="text-xs text-muted-foreground">Periodically refresh URL sources</p>
            </div>
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Add Sources */}
      <section>
        <h3 className="text-sm font-medium mb-4">Add Context Source</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Add URL</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/page"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
              />
              <Button onClick={handleAddUrl} variant="outline" size="icon">
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Upload Document</Label>
            <label className="flex items-center justify-center h-20 border border-dashed border-border rounded-md cursor-pointer hover:border-foreground/30 transition-colors">
              <div className="text-center">
                <Upload className="size-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT (max 10MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.docx,.txt" />
            </label>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Add Text</Label>
            <Textarea placeholder="Paste additional context..." className="min-h-[80px] resize-none" />
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="size-4 mr-2" />
              Add Text
            </Button>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* Sources List */}
      <section>
        <h3 className="text-sm font-medium mb-4">Context Sources ({contextSources.length})</h3>
        {contextSources.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No context sources added yet</p>
        ) : (
          <div className="space-y-1">
            {contextSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  {getIcon(source.type)}
                  <div className="min-w-0">
                    <p className="text-sm truncate">{source.title}</p>
                    <p className="text-xs text-muted-foreground">{source.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {source.type === "url" && (
                    <Button variant="ghost" size="icon" className="size-8">
                      <ExternalLink className="size-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive" onClick={() => handleRemove(source.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
