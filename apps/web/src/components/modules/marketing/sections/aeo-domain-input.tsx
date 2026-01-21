'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';
import { toast } from 'sonner';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { cn } from '@/lib/utils';
import { env } from '@/env';

// Business verticals/industries for better AI context
export const BUSINESS_VERTICALS = [
  { value: 'saas', label: 'SaaS / Software' },
  { value: 'ecommerce', label: 'E-commerce / Retail' },
  { value: 'agency', label: 'Agency / Consulting' },
  { value: 'fintech', label: 'Fintech / Finance' },
  { value: 'healthcare', label: 'Healthcare / Medical' },
  { value: 'education', label: 'Education / EdTech' },
  { value: 'media', label: 'Media / Publishing' },
  { value: 'travel', label: 'Travel / Hospitality' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'manufacturing', label: 'Manufacturing / Industrial' },
  { value: 'nonprofit', label: 'Non-profit / NGO' },
  { value: 'other', label: 'Other' },
] as const;

export type BusinessVertical = typeof BUSINESS_VERTICALS[number]['value'];

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .transform((val) => {
      // Remove protocol (http://, https://, etc.)
      let cleaned = val.replace(/^https?:\/\//i, '');
      // Remove www. prefix if present
      cleaned = cleaned.replace(/^www\./i, '');
      // Remove trailing slash
      cleaned = cleaned.replace(/\/.*$/, '');
      return cleaned;
    })
    .pipe(
      z
        .string()
        .regex(
          /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
          'Please enter a valid domain (e.g., example.com)'
        )
    ),
  vertical: z.string().min(1, 'Please select your business type')
});

type DomainFormValues = z.infer<typeof domainSchema>;

interface AEODomainInputProps {
  className?: string;
}

export function AEODomainInput({
  className
}: AEODomainInputProps): React.JSX.Element {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const turnstileRef = React.useRef<any>(null);

  // Check if Turnstile is enabled (disabled in dev by default)
  const isTurnstileEnabled = env.NEXT_PUBLIC_ENABLE_TURNSTILE && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const placeholders = [
    'example.com',
    'yourcompany.com',
    'acme.com',
    'yourdomain.com',
    'yoursite.com'
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
      vertical: ''
    }
  });

  const onSubmit = async (data: DomainFormValues): Promise<void> => {
    // Check Turnstile if enabled
    if (isTurnstileEnabled && !turnstileToken) {
      toast.error('Please complete the security check');
      return;
    }

    setIsLoading(true);

    try {
      // Navigate directly to report page with vertical as query param
      const url = `/report/${encodeURIComponent(data.domain)}?vertical=${encodeURIComponent(data.vertical)}`;
      router.push(url);
    } catch (error) {
      console.error('Error navigating to report:', error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
      className={cn('mx-auto w-full max-w-4xl', className)}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full"
      >
        {/* Combined Domain + Business Type Input */}
        <div className="relative flex w-full items-center rounded-full border-2 border-primary/20 bg-background shadow-lg shadow-primary/10 transition-all duration-300 hover:border-primary/40 hover:shadow-primary/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 sm:border-[3px]">
          {/* Domain Input */}
          <div className="relative flex-1">
            <Input
              placeholder=" "
              className="h-14 w-full border-0 bg-transparent py-4 pl-5 pr-2 text-base font-medium shadow-none focus-visible:ring-0 sm:h-16 sm:pl-6 sm:text-lg md:h-18 md:pl-8 md:text-xl lg:h-20 lg:pl-10 lg:text-xl xl:h-22 xl:pl-11 xl:text-2xl"
              {...form.register('domain')}
            />
            {!form.watch('domain') && (
              <motion.div
                key={placeholderIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-base font-medium text-muted-foreground/70 sm:left-6 sm:text-lg md:left-8 md:text-xl lg:left-10 lg:text-xl xl:left-11 xl:text-2xl"
              >
                {placeholders[placeholderIndex]}
              </motion.div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-border/60 sm:h-10 md:h-12" />

          {/* Business Type Selector */}
          <Select
            value={form.watch('vertical')}
            onValueChange={(value) => form.setValue('vertical', value)}
          >
            <SelectTrigger className="h-14 w-32 shrink-0 border-0 bg-transparent px-3 text-xs font-medium shadow-none focus:ring-0 sm:h-16 sm:w-40 sm:px-4 sm:text-sm md:h-18 md:w-48 md:text-base lg:h-20 lg:w-52 xl:h-22 xl:w-56">
              <SelectValue placeholder="Business type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {BUSINESS_VERTICALS.map((vertical) => (
                <SelectItem
                  key={vertical.value}
                  value={vertical.value}
                  className="cursor-pointer rounded-lg py-2.5 text-sm font-medium"
                >
                  {vertical.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Submit Button */}
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !form.watch('vertical')}
            className="mr-1.5 size-11 shrink-0 rounded-full bg-primary shadow-lg shadow-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-primary/60 disabled:opacity-50 disabled:hover:scale-100 sm:mr-2 sm:size-12 md:size-14 lg:size-16 xl:size-18"
          >
            <motion.div
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ArrowRight className="size-4 sm:size-5 md:size-5 lg:size-6 xl:size-6" />
            </motion.div>
          </Button>
        </div>

        {/* Error Messages */}
        {(form.formState.errors.domain || form.formState.errors.vertical) && (
          <p className="mt-3 w-full px-4 text-center text-sm font-medium text-destructive sm:mt-4 sm:text-base">
            {form.formState.errors.domain?.message || form.formState.errors.vertical?.message}
          </p>
        )}

        {/* Cloudflare Turnstile Captcha - Only if enabled */}
        {isTurnstileEnabled && (
          <>
            <div className="hidden">
              <Turnstile
                ref={turnstileRef}
                siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => {
                  setTurnstileToken(null);
                  toast.error('Security check failed. Please try again.');
                }}
                onExpire={() => {
                  setTurnstileToken(null);
                  toast.warning('Security check expired. Please try again.');
                }}
                options={{
                  theme: 'light',
                  size: 'invisible',
                }}
              />
            </div>
            
            {/* Protected by Cloudflare Badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-primary"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="font-medium">Protected by Cloudflare</span>
              <img 
                src="/icons/cloudflare-icon.svg" 
                alt="Cloudflare" 
                className="h-6 w-6"
              />
            </div>
          </>
        )}
      </form>
    </motion.div>
  );
}

