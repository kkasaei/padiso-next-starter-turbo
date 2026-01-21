'use client';

import * as React from 'react';
import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { env } from '@/env';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAction } from 'next-safe-action/hooks';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { GridSection } from '@/components/modules/fragments/grid-section';
import { SiteHeading } from '@/components/modules/fragments/site-heading';
import { submitContactForm } from '@/actions/contact/submit-contact-form';

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const contactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// ============================================================
// CONTACT FORM COMPONENT
// ============================================================

export function Contact(): React.JSX.Element {
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  );
  const turnstileRef = React.useRef<any>(null);

  // Setup form with React Hook Form + Zod
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      message: '',
    },
  });

  // Setup server action
  const { execute, isPending } = useAction(submitContactForm, {
    onSuccess: ({ data }) => {
      toast.success(
        data?.message ||
          "Thank you for contacting us! We'll get back to you within 48 hours."
      );
      form.reset();

      // Reset Turnstile
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    },
    onError: ({ error }) => {
      toast.error(
        error.serverError || 'Failed to submit form. Please try again.'
      );

      // Reset Turnstile on error
      if (turnstileRef.current) {
        turnstileRef.current.reset();
        setTurnstileToken(null);
      }
    },
  });

  // Form submission handler
  const onSubmit = async (data: ContactFormValues): Promise<void> => {


    // Execute server action
    execute({
      ...data,
      turnstileToken: turnstileToken || 'dev-bypass', // Bypass token in dev
    });
  };

  return (
    <GridSection>
      <div className="container space-y-20 py-20">
        <SiteHeading
          badge="Contact"
          title={
            <>
              We&apos;d love to hear
              <br /> from you!
            </>
          }
        />
        <div className="lg:container lg:max-w-6xl">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:gap-20">
            {/* Left Column - Information */}
            <div className="order-2 space-y-8 text-center lg:order-1 lg:w-1/2 lg:text-left">
              <h3 className="hidden max-w-fit text-4xl font-semibold lg:block">
                Get in touch
              </h3>
              <p className="text-muted-foreground lg:max-w-[80%]">
                If you have any questions, don&apos;t hesitate to contact our
                team. We&apos;ll get back to you within 48 hours.
              </p>
              <div className="space-y-4">
                <h4 className="hidden text-lg font-medium lg:block">
                  Contact details
                </h4>
                <div className="flex flex-col items-center gap-3 lg:items-start">
                  <ContactInfo icon={PhoneIcon} text="+61 490 609 678" />
                  <ContactInfo icon={MailIcon} text="hi@searchfit.ai" />
                  <ContactInfo
                    icon={MapPinIcon}
                    text="81-83 Campbell St, Surry Hills, NSW, Australia"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <Card className="order-1 mx-auto w-full max-w-lg py-6 shadow-lg lg:order-2 lg:w-1/2 lg:py-10">
              <CardContent
                className="flex flex-col gap-6 px-6 lg:px-10"
                suppressHydrationWarning
              >
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        {...form.register('firstName')}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2 grid w-full items-center gap-1.5 sm:col-span-1">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        {...form.register('lastName')}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-destructive">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div
                    className="grid w-full items-center gap-1.5"
                    suppressHydrationWarning
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="johndoe@example.com"
                      {...form.register('email')}
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="grid w-full gap-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message here."
                      rows={6}
                      {...form.register('message')}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Cloudflare Turnstile - Visible Challenge */}
                  <div className="flex items-center justify-center py-2">
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={env.NEXT_PUBLIC_TURNSILE_SITE_KEY_CONTACT_FORM!}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => {
                          setTurnstileToken(null);
                          toast.error(
                            'Security check failed. Please try again.'
                          );
                        }}
                        onExpire={() => {
                          setTurnstileToken(null);
                          toast.warning(
                            'Security check expired. Please submit again.'
                          );
                        }}
                        options={{
                          theme: 'auto', // Matches your site theme (light/dark)
                          size: 'normal', // Full-size visible checkbox
                          appearance: 'always'
                        }}
                      />
                    </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isPending ||
                      Boolean(!turnstileToken)
                    }
                  >
                    {isPending ? 'Sending...' : 'Send message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </GridSection>
  );
}

// ============================================================
// CONTACT INFO COMPONENT
// ============================================================

type ContactInfoProps = {
  icon: React.ElementType;
  text: string;
};

function ContactInfo({
  icon: Icon,
  text,
}: ContactInfoProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 text-sm lg:w-64">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span>{text}</span>
    </div>
  );
}

