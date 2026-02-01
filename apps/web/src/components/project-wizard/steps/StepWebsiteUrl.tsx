import { Globe, ChevronRight, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

interface StepWebsiteUrlProps {
  value?: string;
  onChange: (url: string) => void;
  onContinue: () => void;
  onClose: () => void;
}

export function StepWebsiteUrl({ value, onChange, onContinue, onClose }: StepWebsiteUrlProps) {
  const isValidUrl = value && value.length > 0;

  return (
    <div className="bg-muted relative rounded-3xl size-full" data-name="Card">
      <div className="size-full">
        <div className="content-stretch flex flex-col gap-6 items-start overflow-clip pb-4 pt-6 px-6 relative size-full">
          
          {/* Header */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-start justify-between size-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-2 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground font-medium">Let's begin</span>
                  <span className="text-xs text-muted-foreground">Step 1 of 5</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">Insert Your Website URL</h2>
                <p className="text-sm text-muted-foreground">
                  Enter your website URL and we'll try to guess.
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="w-full space-y-3">
            <div className="relative">
              <Input
                type="url"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your website (example.com)"
                className="h-12 pl-4 pr-10 text-sm bg-background border-border rounded-xl"
              />
              <Globe className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            </div>
          </div>

          {/* Footer */}
          <div className="content-stretch flex items-center justify-center relative shrink-0 w-full mt-auto" data-name="Card / Footer">
            <Button
              type="button"
              onClick={onContinue}
              disabled={!isValidUrl}
              className="h-10 px-6 rounded-xl gap-2 w-full"
            >
              <span className="text-sm font-medium">Continue</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Close Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-3 opacity-70 hover:opacity-100 rounded-xl"
          >
            <X className="size-4 text-muted-foreground" />
          </Button>

        </div>
      </div>
    </div>
  );
}
