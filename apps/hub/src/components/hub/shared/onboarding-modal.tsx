'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@workspace/ui/components/dialog';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import {
  OnboardingData,
  INITIAL_ONBOARDING_DATA,
  UserRole,
  BusinessType,
  TeamSize,
  PrimaryGoal,
  HelpNeeded,
  FindSource,
  SupportChannel,
} from './onboarding-types';

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: OnboardingData) => void;
  onSkip?: () => void;
}

export function OnboardingModal({
  open,
  onOpenChange,
  onComplete,
  onSkip,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached(Math.max(maxStepReached, nextStep));
    } else {
      // Complete onboarding
      onComplete?.(data);
    }
  };

  const handleSkip = () => {
    onSkip?.();
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.role !== null;
      case 2:
        return data.businessType !== null;
      case 3:
        return data.teamSize !== null;
      case 4:
        return data.primaryGoal.length > 0;
      case 5:
        return data.helpNeeded.length > 0;
      case 6:
        return data.findSource !== null;
      case 7:
        return data.supportChannels.length > 0;
      default:
        return false;
    }
  };

  const getTitle = () => {
    switch (currentStep) {
      case 1: return "What's your role?";
      case 2: return "What type of business are you?";
      case 3: return "How large is your team?";
      case 4: return "What's your primary goal?";
      case 5: return "What do you need help with?";
      case 6: return "How did you find us?";
      case 7: return "Which support channels do you prefer?";
      default: return "";
    }
  };

  const getSubtitle = () => {
    switch (currentStep) {
      case 1: return "Help us understand your role";
      case 2: return "Help us understand your business model";
      case 3: return "This helps us tailor our recommendations";
      case 4: return "Select all that apply:";
      case 5: return "Select all that apply:";
      case 6: return "We'd love to know how you discovered us";
      case 7: return "Select all that apply:";
      default: return "";
    }
  };

  const isMultiSelect = currentStep === 4 || currentStep === 5 || currentStep === 7;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden min-h-[40vh] max-h-[90vh] flex flex-col" showCloseButton={false}>
        {/* Header - Fixed */}
        <div className="px-6 pt-6 pb-4 shrink-0">
          <p className="text-xs text-muted-foreground mb-3">
            Question {currentStep} of {totalSteps}
          </p>
          {/* Progress indicator */}
          <div className="flex items-center gap-1.5 max-w-[50%]">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const stepNumber = index + 1;
              const isClickable = stepNumber <= maxStepReached;
              const isActive = stepNumber <= currentStep;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => isClickable && setCurrentStep(stepNumber)}
                  disabled={!isClickable}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all",
                    isActive ? 'bg-foreground' : 'bg-muted',
                    isClickable && "cursor-pointer hover:opacity-70",
                    !isClickable && "cursor-default"
                  )}
                  aria-label={`Go to step ${stepNumber}`}
                />
              );
            })}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 overflow-y-auto flex-1">
          <h2 className="text-xl font-semibold mb-1">{getTitle()}</h2>
          <p className={cn(
            "text-sm text-muted-foreground mb-6",
            isMultiSelect && "italic"
          )}>
            {getSubtitle()}
          </p>

          <div className="mb-6">
            {currentStep === 1 && (
              <RoleStep
                value={data.role}
                onChange={(role) => setData({ ...data, role })}
              />
            )}

            {currentStep === 2 && (
              <BusinessTypeStep
                value={data.businessType}
                onChange={(businessType) => setData({ ...data, businessType })}
              />
            )}

            {currentStep === 3 && (
              <TeamSizeStep
                value={data.teamSize}
                onChange={(teamSize) => setData({ ...data, teamSize })}
              />
            )}

            {currentStep === 4 && (
              <PrimaryGoalStep
                value={data.primaryGoal}
                onChange={(primaryGoal) => setData({ ...data, primaryGoal })}
              />
            )}

            {currentStep === 5 && (
              <HelpNeededStep
                value={data.helpNeeded}
                onChange={(helpNeeded) => setData({ ...data, helpNeeded })}
              />
            )}

            {currentStep === 6 && (
              <FindSourceStep
                value={data.findSource}
                onChange={(findSource) => setData({ ...data, findSource })}
              />
            )}

            {currentStep === 7 && (
              <SupportChannelsStep
                value={data.supportChannels}
                onChange={(supportChannels) =>
                  setData({ ...data, supportChannels })
                }
              />
            )}
          </div>
          <div className="flex items-center justify-start">
            <div className="flex gap-2">
            <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={cn(
                  "gap-1 transition-all",
                  !canProceed() && "opacity-50 cursor-not-allowed"
                )}
                size="sm"
              >
                {currentStep === totalSteps ? 'Complete' : 'Continue'}
                {currentStep !== totalSteps && <ChevronRight className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" onClick={handleSkip} size="sm">
                Skip
              </Button>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Question Components

// For single-select questions - card style
interface CardOptionProps<T> {
  value: T;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

function CardOption<T>({
  label,
  selected,
  onClick,
}: CardOptionProps<T>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-start rounded-lg border px-4 py-2.5 text-left transition-all text-xs whitespace-nowrap",
        selected
          ? 'border-foreground/20 bg-muted'
          : 'border-border bg-background hover:bg-muted/50'
      )}
    >
      {label}
    </button>
  );
}

// For multi-select questions - pill style
interface PillOptionProps<T> {
  value: T;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function PillOption<T>({
  label,
  selected,
  onClick,
}: PillOptionProps<T>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm font-normal transition-all whitespace-nowrap",
        selected
          ? 'border-foreground/20 bg-muted'
          : 'border-border bg-background hover:bg-muted/50'
      )}
    >
      {label}
    </button>
  );
}

// Step 1: Role
function RoleStep({
  value,
  onChange,
}: {
  value: UserRole | null;
  onChange: (value: UserRole) => void;
}) {
  const options: Array<{ value: UserRole; label: string }> = [
    { value: 'founder', label: 'Founder / CEO' },
    { value: 'marketing-manager', label: 'Marketing Manager' },
    { value: 'seo-specialist', label: 'SEO Specialist' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'agency-owner', label: 'Agency Owner' },
    { value: 'content-creator', label: 'Content Creator' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <CardOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

// Step 2: Business Type
function BusinessTypeStep({
  value,
  onChange,
}: {
  value: BusinessType | null;
  onChange: (value: BusinessType) => void;
}) {
  const options: Array<{ value: BusinessType; label: string }> = [
    { value: 'saas', label: 'SaaS' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'agency', label: 'Agency' },
    { value: 'b2b-services', label: 'B2B Services' },
    { value: 'local-business', label: 'Local Business' },
    { value: 'content-media', label: 'Content/Media' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'finance', label: 'Finance' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'travel-hospitality', label: 'Travel & Hospitality' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <CardOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

// Step 3: Team Size
function TeamSizeStep({
  value,
  onChange,
}: {
  value: TeamSize | null;
  onChange: (value: TeamSize) => void;
}) {
  const options: Array<{ value: TeamSize; label: string }> = [
    { value: 'solo', label: 'Just me (Solo)' },
    { value: '2-5', label: '2-5 people' },
    { value: '6-20', label: '6-20 people' },
    { value: '21-50', label: '21-50 people' },
    { value: '51-200', label: '51-200 people' },
    { value: '200+', label: '200+ people' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <CardOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

// Step 4: Primary Goal (Multi-select)
function PrimaryGoalStep({
  value,
  onChange,
}: {
  value: PrimaryGoal[];
  onChange: (value: PrimaryGoal[]) => void;
}) {
  const options: Array<{ value: PrimaryGoal; label: string }> = [
    { value: 'track-visibility', label: 'Track AI search visibility' },
    { value: 'improve-rankings', label: 'Improve AEO rankings' },
    { value: 'monitor-competitors', label: 'Monitor competitors' },
    { value: 'generate-reports', label: 'Generate AEO reports' },
    { value: 'understand-mentions', label: 'Understand AI mentions' },
    { value: 'all', label: 'All of the above' },
  ];

  const toggleOption = (option: PrimaryGoal) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <PillOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value.includes(option.value)}
          onClick={() => toggleOption(option.value)}
        />
      ))}
    </div>
  );
}

// Step 5: Help Needed (Multi-select)
function HelpNeededStep({
  value,
  onChange,
}: {
  value: HelpNeeded[];
  onChange: (value: HelpNeeded[]) => void;
}) {
  const options: Array<{ value: HelpNeeded; label: string }> = [
    { value: 'aeo-basics', label: 'Understanding AEO basics' },
    { value: 'performance-metrics', label: 'Tracking performance metrics' },
    { value: 'competitor-analysis', label: 'Competitor analysis' },
    { value: 'content-optimization', label: 'Content optimization' },
    { value: 'reporting', label: 'Reporting to stakeholders' },
    { value: 'ai-trends', label: 'Staying ahead of AI trends' },
  ];

  const toggleOption = (option: HelpNeeded) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <PillOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value.includes(option.value)}
          onClick={() => toggleOption(option.value)}
        />
      ))}
    </div>
  );
}

// Step 6: Find Source
function FindSourceStep({
  value,
  onChange,
}: {
  value: FindSource | null;
  onChange: (value: FindSource) => void;
}) {
  const options: Array<{ value: FindSource; label: string }> = [
    { value: 'ai-search', label: 'ChatGPT, Perplexity, or AI search' },
    { value: 'google-search', label: 'Google/Traditional search engine' },
    { value: 'social-media', label: 'Social media' },
    { value: 'recommendation', label: 'Recommended by colleague/friend' },
    { value: 'blog-article', label: 'Blog post or article' },
    { value: 'youtube-podcast', label: 'YouTube or podcast' },
    { value: 'product-hunt', label: 'Product Hunt or directory' },
    { value: 'newsletter-email', label: 'Newsletter or email' },
    { value: 'ad', label: 'Ad or sponsored content' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <CardOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value === option.value}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

// Step 7: Support Channels (Multi-select)
function SupportChannelsStep({
  value,
  onChange,
}: {
  value: SupportChannel[];
  onChange: (value: SupportChannel[]) => void;
}) {
  const options: Array<{ value: SupportChannel; label: string }> = [
    { value: 'live-chat', label: 'Live chat' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'social-media', label: 'Social media' },
    { value: 'other', label: 'Other' },
  ];

  const toggleOption = (option: SupportChannel) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <PillOption
          key={option.value}
          value={option.value}
          label={option.label}
          selected={value.includes(option.value)}
          onClick={() => toggleOption(option.value)}
        />
      ))}
    </div>
  );
}

