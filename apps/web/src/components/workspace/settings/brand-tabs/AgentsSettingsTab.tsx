"use client";

import { useState } from "react";
import { Plus, Save, Loader2 } from "lucide-react";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { Badge } from "@workspace/ui/components/badge";

interface AgentsSettingsTabProps {
  brandId: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  model: string;
}

export function AgentsSettingsTab({ brandId }: AgentsSettingsTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [defaultModel, setDefaultModel] = useState("gpt-4o");
  
  const [agents, setAgents] = useState<Agent[]>([
    { id: "content-writer", name: "Content Writer", description: "Generates blog posts and articles", icon: "/icons/openai.svg", enabled: true, model: "gpt-4o" },
    { id: "seo-optimizer", name: "SEO Optimizer", description: "Optimizes content for search engines", icon: "/icons/google.svg", enabled: true, model: "gpt-4o" },
    { id: "keyword-researcher", name: "Keyword Researcher", description: "Discovers relevant keywords", icon: "/icons/semrush.svg", enabled: true, model: "gpt-4o-mini" },
    { id: "analytics-reporter", name: "Analytics Reporter", description: "Generates insights from data", icon: "/icons/google-analytics.svg", enabled: false, model: "gpt-4o" },
    { id: "competitor-analyzer", name: "Competitor Analyzer", description: "Monitors competitor strategies", icon: "/icons/moz.svg", enabled: false, model: "gpt-4o" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const toggleAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, enabled: !a.enabled } : a));
  };

  const updateModel = (agentId: string, model: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, model } : a));
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Global Settings */}
      <section>
        <h3 className="text-sm font-medium mb-4">AI Settings</h3>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Default AI Model</Label>
          <select
            value={defaultModel}
            onChange={(e) => setDefaultModel(e.target.value)}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="gpt-4o">GPT-4o (Recommended)</option>
            <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="claude-3-opus">Claude 3 Opus</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          </select>
          <p className="text-xs text-muted-foreground">Default model for new agents</p>
        </div>
      </section>

      <hr className="border-border" />

      {/* Agents */}
      <section>
        <h3 className="text-sm font-medium mb-4">AI Agents</h3>
        <div className="space-y-1">
          {agents.map((agent) => (
            <div key={agent.id} className="py-4 border-b border-border last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <img 
                      src={agent.icon} 
                      alt={agent.name}
                      className="size-4 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{agent.name}</p>
                      {agent.enabled && <Badge variant="secondary" className="text-xs py-0">Active</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{agent.description}</p>
                    {agent.enabled && (
                      <div className="flex items-center gap-2 mt-2">
                        <select
                          value={agent.model}
                          onChange={(e) => updateModel(agent.id, e.target.value)}
                          className="h-7 px-2 text-xs rounded border border-input bg-background"
                        >
                          <option value="gpt-4o">GPT-4o</option>
                          <option value="gpt-4o-mini">GPT-4o Mini</option>
                          <option value="gpt-4-turbo">GPT-4 Turbo</option>
                          <option value="claude-3-opus">Claude 3 Opus</option>
                          <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                        </select>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Configure</Button>
                      </div>
                    )}
                  </div>
                </div>
                <Switch checked={agent.enabled} onCheckedChange={() => toggleAgent(agent.id)} />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full mt-3">
            <Plus className="size-4 mr-2" />
            Create Custom Agent
          </Button>
        </div>
      </section>

      <hr className="border-border" />

      {/* Usage */}
      <section>
        <h3 className="text-sm font-medium mb-4">Usage</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Today", value: "247" },
            { label: "This Month", value: "5,842" },
            { label: "Tokens Used", value: "1.2M" },
            { label: "Monthly Limit", value: "5M" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-lg font-medium">{item.value}</p>
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
