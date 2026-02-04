'use client';

import * as React from 'react';
import { ArrowRight, Check, Lock, Mail, User, Building2, X, Sparkles, PartyPopper } from 'lucide-react';
import Confetti from 'react-confetti';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

import { unlockReport } from '@/actions/report/unlock-report';

// Custom hook for window size
function useWindowSize() {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

interface UnlockReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  sections?: readonly string[];
  domain?: string;
  downloadIntent?: boolean; // Whether user clicked download button
}

export function UnlockReportModal({
  open,
  onOpenChange,
  onSuccess,
  sections = [
    'Full Competitor Analysis',
    'Strategic Insights & Recommendations',
    'Brand Narrative Themes',
    'AI-Powered Content Ideas'
  ],
  domain,
  downloadIntent = false
}: UnlockReportModalProps): React.JSX.Element {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: ''
  });

  const { width, height } = useWindowSize();

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!open) {
      // Delay reset to allow animations to complete
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setError(null);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          companyName: ''
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await unlockReport({
        domain: domain || '',
        ...formData,
      });

      if (result.success) {
        setShowSuccess(true);

        // If download intent, close immediately and trigger download
        if (downloadIntent) {
          setTimeout(() => {
            onOpenChange(false);
            onSuccess?.();
          }, 1500); // Shorter delay for download intent
        } else {
          // Otherwise show success message longer
          onSuccess?.();
          setTimeout(() => {
            onOpenChange(false);
          }, 3000);
        }
      } else {
        setError(result.error || 'Failed to unlock report');
      }
    } catch (err) {
      console.error('Unlock error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:max-w-[90vw] md:max-w-3xl lg:max-w-4xl">
        {/* Success Confetti */}
        {showSuccess && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        {showSuccess ? (
          // Success State
          <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-6 inline-flex size-20 items-center justify-center rounded-full bg-green-500/10 animate-in zoom-in-95 duration-300">
              <PartyPopper className="size-10 text-green-600" />
            </div>
            <h3 className="mb-3 text-3xl font-bold animate-in slide-in-from-bottom-4 duration-500">
              🎉 Report Unlocked!
            </h3>
            <p className="mb-6 max-w-md text-lg text-muted-foreground animate-in slide-in-from-bottom-4 duration-500 delay-75">
              Your PDF is being generated and will download automatically in a moment.
            </p>
            <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500 delay-150">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="size-4 text-primary" />
                <span>Generating your PDF report...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Report link sent to your email
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            {/* Left Column - Form */}
            <div className="p-6 md:p-8">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Lock className="size-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Unlock Full Report
              </DialogTitle>
              <DialogDescription className="text-base">
                Enter your email to view the complete report and generate a downloadable PDF
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange('firstName')}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange('lastName')}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Work Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@company.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium">
                  Company Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Inc."
                    required
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block size-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    <span className="ml-2">Unlocking Report...</span>
                  </>
                ) : (
                  <>
                    Unlock Report & Download PDF
                    <ArrowRight className="ml-2 size-5" />
                  </>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/20">
                  {error}
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                By submitting, you agree to receive occasional emails about SearchFit. Unsubscribe anytime.
              </p>
            </form>
          </div>

          {/* Right Column - Benefits */}
          <div className="hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:flex md:flex-col md:justify-center md:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  INCLUDES:
                </h4>
                <div className="space-y-3">
                  {sections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <Check className="size-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium leading-tight">
                        {section}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 rounded-lg border border-primary/20 bg-background/50 p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-500/10 p-1.5">
                    <Check className="size-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold">View Full Report + PDF Download</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  No credit card. Unlock to view all insights and generate a downloadable PDF report.
                </p>
              </div>

              <div className="space-y-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Trusted by 500+ companies
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="size-4 fill-yellow-400 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
