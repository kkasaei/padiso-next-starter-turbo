"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { Stepper } from "./Stepper";
import { BusinessData } from "./types";
import { StepWebsiteUrl } from "./steps/StepWebsiteUrl";
import { StepLanguage } from "./steps/StepLanguage";
import { StepBusinessDescription } from "./steps/StepBusinessDescription";
import { StepCompetitors } from "./steps/StepCompetitors";
import { StepBrand } from "./steps/StepBrand";
import { StepSurvey } from "./steps/StepSurvey";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ProjectWizardProps {
  onClose: () => void;
  onCreate?: (data: BusinessData) => void;
}

export function ProjectWizard({ onClose, onCreate }: ProjectWizardProps) {
  const [step, setStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [data, setData] = useState<BusinessData>({
    websiteUrl: '',
    languages: [],
    description: '',
    targetAudiences: [],
    businessKeywords: [],
    competitors: [],
    brandName: '',
    brandColor: undefined,
    sitemapUrl: '',
    referralSource: undefined,
  });

  // Step 0: Website URL (full-width card like StepMode)
  // Steps 1-5: Guided steps with stepper sidebar
  // 1: Language
  // 2: Business Description
  // 3: Competitors (Optional)
  // 4: Brand
  // 5: Survey (Optional)

  const updateData = (updates: Partial<BusinessData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setStep(prev => {
      const next = prev + 1;
      setMaxStepReached(m => Math.max(m, next));
      return next;
    });
  };

  const prevStep = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const jumpToStep = (s: number) => {
    // Adjust because stepper index 0 maps to internal step 1
    setStep(s + 1);
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: // Languages
        return !data.languages || data.languages.length === 0;
      case 2: // Business Description
        return !data.description || data.description.trim().length === 0 || 
               !data.targetAudiences || data.targetAudiences.length < 2;
      default:
        return false;
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleCreate = () => {
    onCreate?.(data);
    toast.success("Business profile created successfully");
    onClose();
  };

  // Define steps for the stepper (excluding Website URL entry)
  const steps = [
    "Languages",
    "Business details",
    "Competitors",
    "Brand",
    "Survey"
  ];

  const isLastStep = step === 5;
  const isOptionalStep = step === 3 || step === 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex w-full max-w-[900px] overflow-hidden rounded-[24px] bg-background shadow-2xl",
          step === 0 ? "max-w-[480px]" : ""
        )}
      >
        {step === 0 ? (
          <StepWebsiteUrl 
            value={data.websiteUrl}
            onChange={(url) => updateData({ websiteUrl: url })}
            onContinue={nextStep}
            onClose={handleClose}
          />
        ) : (
          <>
            {/* Left Sidebar (Stepper) */}
            <div className="hidden w-64 border-r border-border bg-background px-6 py-7 md:flex md:flex-col md:gap-7">
              <div>
                <p className="text-sm font-semibold text-foreground">Add Business</p>
                <p className="text-xs text-muted-foreground mt-1">{data.websiteUrl}</p>
              </div>
              <Stepper 
                currentStep={step - 1} 
                steps={steps} 
                onStepClick={jumpToStep}
                maxStepReached={maxStepReached - 1}
              />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
              {/* Header: Close button */}
              <div className="flex items-start justify-end px-8 pt-6 pb-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 pt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    {step === 1 && (
                      <StepLanguage 
                        value={data.languages} 
                        onChange={(langs) => updateData({ languages: langs })} 
                        onContinue={nextStep}
                        onBack={prevStep}
                      />
                    )}
                    {step === 2 && (
                      <StepBusinessDescription 
                        data={data} 
                        updateData={updateData} 
                      />
                    )}
                    {step === 3 && (
                      <StepCompetitors 
                        data={data} 
                        updateData={updateData} 
                      />
                    )}
                    {step === 4 && (
                      <StepBrand 
                        data={data} 
                        updateData={updateData} 
                      />
                    )}
                    {step === 5 && (
                      <StepSurvey 
                        value={data.referralSource}
                        onChange={(source) => updateData({ referralSource: source })}
                        brandName={data.brandName}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between bg-background p-6 border-t border-border">
                <div>
                  <Button variant="outline" onClick={prevStep}>
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>

                <div className="flex gap-3">
                  {isOptionalStep && !isLastStep && (
                    <Button 
                      variant="ghost"
                      onClick={nextStep}
                    >
                      Skip
                    </Button>
                  )}
                  {isLastStep ? (
                    <Button onClick={handleCreate}>
                      Create business
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextStep} 
                      disabled={isNextDisabled()}
                    >
                      {isOptionalStep ? "Continue" : "Next"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
