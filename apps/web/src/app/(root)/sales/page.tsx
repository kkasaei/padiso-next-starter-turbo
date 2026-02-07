"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Building2, Users, TrendingUp, Zap, Shield, Headphones, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import { env } from '@/env';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';

export default function SalesPage(): React.JSX.Element {
  const router = useRouter();

  return (
    <div className="grid lg:grid-cols-2">
      {/* Left Column - Information */}
      <div className="flex flex-col bg-background px-8 py-12 lg:px-20 lg:py-16 xl:px-28 lg:sticky lg:top-0 lg:h-screen lg:justify-center">
        <div className="mx-auto w-full max-w-xl space-y-12">
          {/* Back Link */}
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Go back</span>
          </button>

          {/* Header Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Building2 className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Custom Solutions
              </span>
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl">
                Custom Package{' '}
                <span className="text-primary">
                  Built for Your Business
                </span>
              </h1>
              <p className="text-xl leading-snug text-foreground/90">
                Get a tailored AI search optimization solution with dedicated support, custom integrations, and advanced features.
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Zap className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Unlimited Everything</h3>
                <p className="mt-1 text-sm text-muted-foreground">No limits on projects, keywords, reports, or AI queries. Scale without constraints.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Users className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dedicated Account Manager</h3>
                <p className="mt-1 text-sm text-muted-foreground">A dedicated success manager to help you maximize ROI and achieve your goals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Custom Integrations</h3>
                <p className="mt-1 text-sm text-muted-foreground">Connect SearchFit to your existing tools via API, webhooks, or custom integrations.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Shield className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Advanced Security</h3>
                <p className="mt-1 text-sm text-muted-foreground">Built on SOC 2 compliant infrastructure, custom SLAs, and advanced security features. Compliance certification in progress.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Headphones className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Priority Support</h3>
                <p className="mt-1 text-sm text-muted-foreground">24/7 priority support with guaranteed response times and direct access to our engineering team.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="size-3 text-primary" strokeWidth={3} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">White-Label Options</h3>
                <p className="mt-1 text-sm text-muted-foreground">Custom branding, white-label reporting, and reseller opportunities available.</p>
              </div>
            </div>
          </div>

          {/* Stat Callout */}
          <div className="border-l-2 border-primary pl-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">Custom plan clients see an average 3.5x increase</span> in AI search visibility within 90 days
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Custom Package Form */}
      <div className="flex items-start justify-center bg-muted/30 px-8 py-12 lg:px-16 lg:py-16">
        <div className="w-full max-w-md">
          <CustomPackageForm />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Custom Package Form Component
// ============================================================
function CustomPackageForm(): React.JSX.Element {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    phoneNumber: '',
    teamSize: '',
    monthlySearchVolume: '',
    requirements: '',
    budget: '',
    preferredContactMethod: 'email' as 'email' | 'phone' | 'video-call',
    timeline: '',
  });

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const turnstileRef = React.useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact/custom-package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          turnstileToken: turnstileToken || 'dev-bypass',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      toast.success("Inquiry submitted successfully!");
      setIsSubmitted(true);

      // Reset Turnstile
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit inquiry. Please try again.");

      // Reset Turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <Check className="size-8 text-primary" strokeWidth={2.5} />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription className="text-base">
            We&apos;ve received your inquiry and will be in touch within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="w-full"
          >
            Submit Another Inquiry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Request a Custom Package</CardTitle>
        <CardDescription>
          Fill out the form below and our sales team will reach out within 24 hours to discuss your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Acme Inc."
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Company Website */}
          <div className="space-y-2">
            <Label htmlFor="companyWebsite">Company Website</Label>
            <Input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              placeholder="https://example.com"
              value={formData.companyWebsite}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size *</Label>
            <Select
              value={formData.teamSize}
              onValueChange={(value) => handleSelectChange('teamSize', value)}
              required
            >
              <SelectTrigger id="teamSize">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="500+">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Search Volume */}
          <div className="space-y-2">
            <Label htmlFor="monthlySearchVolume">Estimated Monthly Search Volume *</Label>
            <Select
              value={formData.monthlySearchVolume}
              onValueChange={(value) => handleSelectChange('monthlySearchVolume', value)}
              required
            >
              <SelectTrigger id="monthlySearchVolume">
                <SelectValue placeholder="Select search volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<10k">Less than 10k</SelectItem>
                <SelectItem value="10k-50k">10k - 50k</SelectItem>
                <SelectItem value="50k-100k">50k - 100k</SelectItem>
                <SelectItem value="100k-500k">100k - 500k</SelectItem>
                <SelectItem value="500k+">500k+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Budget</Label>
            <Select
              value={formData.budget}
              onValueChange={(value) => handleSelectChange('budget', value)}
            >
              <SelectTrigger id="budget">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<$500/mo">Less than $500/month</SelectItem>
                <SelectItem value="$500-$1k/mo">$500 - $1,000/month</SelectItem>
                <SelectItem value="$1k-$5k/mo">$1,000 - $5,000/month</SelectItem>
                <SelectItem value="$5k-$10k/mo">$5,000 - $10,000/month</SelectItem>
                <SelectItem value="$10k+/mo">$10,000+/month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Tell Us About Your Requirements *</Label>
            <Textarea
              id="requirements"
              name="requirements"
              placeholder="Describe your AI search optimization needs, goals, and any specific features you're looking for..."
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters
            </p>
          </div>

          {/* Preferred Contact Method */}
          <div className="space-y-2">
            <Label htmlFor="preferredContactMethod">Preferred Contact Method *</Label>
            <Select
              value={formData.preferredContactMethod}
              onValueChange={(value) => handleSelectChange('preferredContactMethod', value)}
              required
            >
              <SelectTrigger id="preferredContactMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video-call">Video Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline">When Do You Need This? *</Label>
            <Select
              value={formData.timeline}
              onValueChange={(value) => handleSelectChange('timeline', value)}
              required
            >
              <SelectTrigger id="timeline">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate (ASAP)</SelectItem>
                <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                <SelectItem value="1-month">1 month</SelectItem>
                <SelectItem value="2-3-months">2-3 months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Cloudflare Turnstile - Security Check */}
          {env.NEXT_PUBLIC_TURNSILE_SITE_KEY_CONTACT_FORM && (
            <div className="flex items-center justify-center py-2">
              <Turnstile
                ref={turnstileRef}
                siteKey={env.NEXT_PUBLIC_TURNSILE_SITE_KEY_CONTACT_FORM}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => {
                  setTurnstileToken(null);
                  toast.error('Security check failed. Please try again.');
                }}
                onExpire={() => {
                  setTurnstileToken(null);
                  toast.warning('Security check expired. Please submit again.');
                }}
                options={{
                  theme: 'auto',
                  size: 'normal',
                  appearance: 'always',
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              isSubmitting ||
              (!!env.NEXT_PUBLIC_TURNSILE_SITE_KEY_CONTACT_FORM && !turnstileToken)
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Inquiry'
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By submitting this form, you agree to be contacted by our sales team.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
