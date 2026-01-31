import { useState } from "react";
import { Plus, X, Sparkle, Question } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { BusinessData } from "../types";

interface StepBusinessDescriptionProps {
  data: BusinessData;
  updateData: (updates: Partial<BusinessData>) => void;
}

export function StepBusinessDescription({ data, updateData }: StepBusinessDescriptionProps) {
  const [audienceInput, setAudienceInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      updateData({
        description: "We are a leading provider of SEO and content optimization solutions, helping businesses improve their online visibility and organic search rankings. Our platform uses AI-powered tools to analyze content, identify optimization opportunities, and track performance across search engines.",
        targetAudiences: [
          "Marketing managers",
          "SEO specialists", 
          "Content creators",
          "Small business owners",
          "E-commerce brands"
        ],
        businessKeywords: [
          "SEO",
          "content optimization",
          "search rankings",
          "organic traffic",
          "AI-powered analytics"
        ]
      });
      setIsGenerating(false);
    }, 800);
  };

  const audiences = data.targetAudiences || [];
  const keywords = data.businessKeywords || [];

  const addAudience = () => {
    if (audienceInput.trim()) {
      updateData({ 
        targetAudiences: [...audiences, audienceInput.trim()] 
      });
      setAudienceInput("");
    }
  };

  const removeAudience = (index: number) => {
    const updated = audiences.filter((_, i) => i !== index);
    updateData({ targetAudiences: updated });
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      updateData({ 
        businessKeywords: [...keywords, keywordInput.trim()] 
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    const updated = keywords.filter((_, i) => i !== index);
    updateData({ businessKeywords: updated });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center size-2 rounded-full bg-red-500" />
        <span className="text-xs text-muted-foreground font-medium">Step 3</span>
        <span className="text-xs text-muted-foreground">Step 3 of 5</span>
      </div>
      
      <h2 className="text-lg font-semibold text-foreground mb-6">Describe Your Business</h2>

      <div className="space-y-6">
        {/* Description */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-medium">Description</Label>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      type="button" 
                      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                    >
                      <Question className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[280px] text-xs">
                    <p>Describe what your business does, the products or services you offer, and what makes you unique.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
            >
              <Sparkle className={cn("size-3", isGenerating && "animate-spin")} />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
          <Textarea
            value={data.description || ""}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Give us a brief description of your business..."
            className="min-h-[120px] resize-none bg-background border-border rounded-xl"
          />
        </div>

        {/* Target Audiences */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <div className="flex items-center gap-1.5">
            <Label className="text-sm font-medium">Target Audiences (min 2)</Label>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    type="button" 
                    className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                  >
                    <Question className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[280px] text-xs">
                  <p>Who are your ideal customers? Add specific audience segments you want to target.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={audienceInput}
              onChange={(e) => setAudienceInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addAudience)}
              placeholder="e.g. lawyers in Florida"
              className="flex-1 h-10 bg-background border-border rounded-xl"
            />
            <Button 
              type="button"
              variant="outline" 
              size="icon"
              onClick={addAudience}
              className="h-10 w-10 rounded-xl"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {audiences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {audiences.map((audience, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pl-3 pr-1 py-1 bg-background"
                >
                  {audience}
                  <button
                    type="button"
                    onClick={() => removeAudience(index)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Business Keywords */}
        <div className="space-y-3 p-4 rounded-xl bg-muted">
          <Label className="text-sm font-medium">Business Keywords</Label>
          
          <div className="flex gap-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, addKeyword)}
              placeholder="Add a keyword..."
              className="flex-1 h-10 bg-background border-border rounded-xl"
            />
            <Button 
              type="button"
              variant="outline" 
              size="icon"
              onClick={addKeyword}
              className="h-10 w-10 rounded-xl"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="gap-1 pl-3 pr-1 py-1 bg-background"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Keywords */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["businessowners", "digitalmarketers", "seospecialists", "contentcreators"].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => {
                  if (!keywords.includes(keyword)) {
                    updateData({ businessKeywords: [...keywords, keyword] });
                  }
                }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:bg-muted transition-colors",
                  keywords.includes(keyword) && "opacity-50 cursor-not-allowed"
                )}
                disabled={keywords.includes(keyword)}
              >
                + {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
