import { useState } from "react";
import { Plus, X, Globe, Info } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";
import { BusinessData } from "../types";

interface StepCompetitorsProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

export function StepCompetitors({ data, updateData }: StepCompetitorsProps) {
  const [competitorInput, setCompetitorInput] = useState("");
  const competitors = data.competitors || [];

  const addCompetitor = () => {
    if (competitorInput.trim()) {
      // Clean up the URL - just keep the domain
      let domain = competitorInput.trim()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
      
      if (domain && !competitors.includes(domain)) {
        updateData({ 
          competitors: [...competitors, domain] 
        });
      }
      setCompetitorInput("");
    }
  };

  const removeCompetitor = (index: number) => {
    const updated = competitors.filter((_, i) => i !== index);
    updateData({ competitors: updated });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCompetitor();
    }
  };

  // Suggested competitors for the example
  const suggestedCompetitors = [
    "Semrush.com",
    "Ayrefs.ai", 
    "searchmetrics.com",
    "backlinkmanager.io",
    "ranktracker.com"
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center size-2 rounded-full bg-red-500" />
        <span className="text-xs text-muted-foreground font-medium">Step 4 (Optional)</span>
        <span className="text-xs text-muted-foreground">Step 4 of 5</span>
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-2">Select your competitors</h2>
      <p className="text-sm text-muted-foreground mb-6">
        This step is optional. You can always add competitors later in settings.
      </p>

      <div className="space-y-6">
        {/* Info Box */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-muted text-sm text-muted-foreground">
          <Info className="size-4 shrink-0 mt-0.5" />
          <p>If you add competitors, we can better:</p>
        </div>

        {/* Competitor Input */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <Label className="text-sm font-medium flex items-center gap-1">
            Competitor Domains
            <Info className="size-3 text-muted-foreground" />
          </Label>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a competitor URL (optional)"
                className="h-10 pl-4 pr-10 bg-background border-border rounded-xl"
              />
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
            <Button 
              type="button"
              variant="outline" 
              size="icon"
              onClick={addCompetitor}
              className="h-10 w-10 rounded-xl"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {competitors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {competitors.map((competitor, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pl-3 pr-1 py-1.5 bg-background"
                >
                  <Globe className="size-3 text-muted-foreground" />
                  {competitor}
                  <button
                    type="button"
                    onClick={() => removeCompetitor(index)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Competitors */}
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Suggested competitors:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCompetitors.map((domain) => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    if (!competitors.includes(domain)) {
                      updateData({ competitors: [...competitors, domain] });
                    }
                  }}
                  className={`
                    text-xs px-3 py-1.5 rounded-full border border-dashed border-border 
                    text-muted-foreground hover:bg-background transition-colors
                    ${competitors.includes(domain) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={competitors.includes(domain)}
                >
                  + {domain}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
