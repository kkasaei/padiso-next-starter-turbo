'use client';

import * as React from 'react';
import { Lock, ArrowRight, Check } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { UnlockReportModal } from './unlock-report-modal';

interface MegaUnlockOverlayProps {
  children: React.ReactNode;
  sections?: readonly string[];
  domain?: string;
  unlocked?: boolean; // Set to true to bypass the overlay (for development/testing)
  onUnlockSuccess?: () => void; // Callback when unlock succeeds
}

export function MegaUnlockOverlay({
  children,
  sections = [
    'Full Competitor Analysis',
    'Strategic Insights & Recommendations',
    'Brand Narrative Themes',
    'AI-Powered Content Ideas'
  ],
  domain,
  unlocked = false,
  onUnlockSuccess
}: MegaUnlockOverlayProps): React.JSX.Element {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [isUnlocked, setIsUnlocked] = React.useState(unlocked);

  // Sync with parent prop
  React.useEffect(() => {
    setIsUnlocked(unlocked);
  }, [unlocked]);

  const handleSuccess = () => {
    // Unlock the content locally
    setIsUnlocked(true);
    // Notify parent component
    onUnlockSuccess?.();
  };

  // If unlocked, just render children without overlay
  if (isUnlocked) {
    return <div className="space-y-16">{children}</div>;
  }

  return (
    <div className="relative">
      {/* Blurred content with controlled height */}
      <div className="pointer-events-none relative h-[800px] overflow-hidden rounded-lg md:h-[1000px]">
        <div className="blur-sm">{children}</div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/98 to-background/60" />

        {/* CTA content */}
        <div className="pointer-events-auto absolute inset-0 flex items-start justify-center p-6 pt-12">
          <div className="w-full max-w-lg space-y-6 rounded-xl border-2 border-primary/20 bg-card/95 px-8 py-10 text-center shadow-2xl backdrop-blur-sm">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Lock className="size-10 text-primary" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Unlock Full Report</h3>
              <p className="text-sm text-muted-foreground">
                View the complete report and generate a downloadable PDF
              </p>
            </div>

            {/* Section List */}
            <div className="space-y-3 border-y py-6">
              <p className="text-sm font-semibold text-muted-foreground">
                INCLUDES:
              </p>
              <div className="space-y-2.5">
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                      <Check className="size-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{section}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full text-base"
              onClick={() => {
                console.log('Button clicked! Opening modal...');
                setModalOpen(true);
              }}
            >
              Unlock Report with Email
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Capture Modal */}
      <UnlockReportModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
        sections={sections}
        domain={domain}
      />
    </div>
  );
}
