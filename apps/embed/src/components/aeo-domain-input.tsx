'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Turnstile } from '@marsidev/react-turnstile';

// Business verticals
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

export type BusinessVertical = (typeof BUSINESS_VERTICALS)[number]['value'];

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain is required')
    .transform((val) => {
      let cleaned = val.replace(/^https?:\/\//i, '');
      cleaned = cleaned.replace(/^www\./i, '');
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
  vertical: z.string().min(1, 'Please select your business type'),
});

type DomainFormValues = z.infer<typeof domainSchema>;

export interface AEODomainInputProps {
  className?: string;
  turnstileKey?: string;
  redirectUrl?: string;
  theme?: 'light' | 'dark';
  buttonText?: string;
  showVerticals?: boolean;
  placeholder?: string;
  onSubmit?: (data: { domain: string; vertical: string }) => void;
}

// Inline styles to avoid CSS injection issues
const getStyles = (isDark: boolean) => ({
  root: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5,
    color: isDark ? '#f8fafc' : '#1e293b',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  form: {
    width: '100%',
    maxWidth: '56rem',
    margin: '0 auto',
  },
  container: {
    position: 'relative' as const,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    borderRadius: '9999px',
    border: `3px solid ${isDark ? 'rgba(248,250,252,0.2)' : 'rgba(30,41,59,0.2)'}`,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  },
  inputWrapper: {
    position: 'relative' as const,
    flex: 1,
    height: '4rem',
  },
  input: {
    position: 'relative' as const,
    height: '4rem',
    width: '100%',
    border: 'none',
    background: 'transparent',
    padding: '0 0.5rem 0 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 500,
    outline: 'none',
    boxShadow: 'none',
    color: isDark ? '#f8fafc' : '#1e293b',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
    lineHeight: '4rem',
    zIndex: 2,
  },
  placeholder: {
    position: 'absolute' as const,
    left: '1.5rem',
    top: 0,
    height: '4rem',
    lineHeight: '4rem',
    fontSize: '1.125rem',
    fontWeight: 500,
    color: isDark ? '#94a3b8' : '#94a3b8',
    pointerEvents: 'none' as const,
    margin: 0,
    padding: 0,
    zIndex: 1,
  },
  divider: {
    height: '2.5rem',
    width: '1px',
    backgroundColor: isDark ? 'rgba(248,250,252,0.2)' : 'rgba(30,41,59,0.2)',
    flexShrink: 0,
  },
  selectWrapper: {
    position: 'relative' as const,
  },
  selectTrigger: {
    height: '4rem',
    minWidth: '10rem',
    flexShrink: 0,
    border: 'none',
    background: 'transparent',
    padding: '0 1rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    color: isDark ? '#f8fafc' : '#1e293b',
    fontFamily: 'inherit',
    gap: '0.5rem',
  },
  selectContent: {
    position: 'absolute' as const,
    right: 0,
    top: '100%',
    marginTop: '0.25rem',
    minWidth: '12rem',
    maxHeight: '15rem',
    overflow: 'auto',
    borderRadius: '0.75rem',
    border: `1px solid ${isDark ? 'rgba(248,250,252,0.2)' : 'rgba(30,41,59,0.2)'}`,
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    padding: '0.25rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
    zIndex: 9999,
  },
  selectItem: {
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none' as const,
    alignItems: 'center',
    borderRadius: '0.5rem',
    padding: '0.625rem 0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: isDark ? '#f8fafc' : '#1e293b',
    border: 'none',
    background: 'transparent',
    width: '100%',
    textAlign: 'left' as const,
  },
  selectItemHover: {
    backgroundColor: isDark ? 'rgba(248,250,252,0.1)' : 'rgba(30,41,59,0.1)',
  },
  submitBtn: {
    marginRight: '0.5rem',
    height: '3rem',
    width: '3rem',
    flexShrink: 0,
    borderRadius: '9999px',
    backgroundColor: isDark ? '#f8fafc' : '#1e293b',
    color: isDark ? '#1e293b' : '#f8fafc',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  submitBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  error: {
    marginTop: '0.75rem',
    width: '100%',
    padding: '0 1rem',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#ef4444',
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9998,
  },
});

export function AEODomainInput({
  className,
  turnstileKey,
  redirectUrl = 'https://searchfit.ai/report',
  theme = 'light',
  showVerticals = true,
  placeholder,
  onSubmit: onSubmitCallback,
}: AEODomainInputProps): React.JSX.Element {
  const isDark = theme === 'dark';
  const styles = getStyles(isDark);
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);
  const [selectOpen, setSelectOpen] = React.useState(false);
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const turnstileRef = React.useRef<any>(null);

  const placeholders = placeholder
    ? [placeholder]
    : ['example.com', 'yourcompany.com', 'acme.com', 'yourdomain.com', 'yoursite.com'];

  React.useEffect(() => {
    if (placeholders.length <= 1) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: '',
      vertical: showVerticals ? '' : 'other',
    },
  });

  const handleSubmit = async (data: DomainFormValues): Promise<void> => {
    const requiresTurnstile = turnstileKey && turnstileKey.length > 10 && !turnstileKey.includes('xxxxx');
    
    if (requiresTurnstile && !turnstileToken) {
      if (turnstileRef.current?.reset) {
        turnstileRef.current.reset();
      }
      alert('Please wait for security check to complete and try again.');
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmitCallback) {
        onSubmitCallback({ domain: data.domain, vertical: data.vertical });
      }

      const event = new CustomEvent('aeo-domain-submitted', {
        detail: { domain: data.domain, vertical: data.vertical, token: turnstileToken },
        bubbles: true,
        composed: true,
      });
      document.dispatchEvent(event);

      const baseUrl = redirectUrl.replace(/\/$/, '');
      const url = `${baseUrl}/${encodeURIComponent(data.domain)}?vertical=${encodeURIComponent(data.vertical)}`;
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const verticalValue = form.watch('vertical');
  const domainValue = form.watch('domain');
  const selectedVertical = BUSINESS_VERTICALS.find(v => v.value === verticalValue);
  const isDisabled = isLoading || (showVerticals && !verticalValue);

  return (
    <div style={styles.root} className={className}>
      <form onSubmit={form.handleSubmit(handleSubmit)} style={styles.form}>
        {/* Main pill container */}
        <div style={styles.container}>
          {/* Domain Input */}
          <div style={styles.inputWrapper}>
            <input
              type="text"
              style={styles.input}
              placeholder={placeholders[placeholderIndex]}
              {...form.register('domain')}
            />
          </div>

          {/* Vertical Divider & Business Type Selector */}
          {showVerticals && (
            <>
              <div style={styles.divider} />
              <div style={styles.selectWrapper}>
                <button
                  type="button"
                  style={styles.selectTrigger}
                  onClick={() => setSelectOpen(!selectOpen)}
                >
                  <span style={{ opacity: selectedVertical ? 1 : 0.6 }}>
                    {selectedVertical?.label || 'Business type'}
                  </span>
                  <ChevronDown style={{ width: '1rem', height: '1rem', opacity: 0.5 }} />
                </button>
                
                {selectOpen && (
                  <>
                    <div 
                      style={styles.overlay} 
                      onClick={() => setSelectOpen(false)} 
                    />
                    <div style={styles.selectContent}>
                      {BUSINESS_VERTICALS.map((vertical) => (
                        <div
                          key={vertical.value}
                          style={{
                            ...styles.selectItem,
                            ...(hoveredItem === vertical.value || verticalValue === vertical.value 
                              ? styles.selectItemHover 
                              : {}),
                          }}
                          onMouseEnter={() => setHoveredItem(vertical.value)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onClick={() => {
                            form.setValue('vertical', vertical.value);
                            setSelectOpen(false);
                          }}
                        >
                          {vertical.label}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled}
            style={{
              ...styles.submitBtn,
              ...(isDisabled ? styles.submitBtnDisabled : {}),
            }}
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </motion.div>
          </button>
        </div>

        {/* Error Messages */}
        {(form.formState.errors.domain || form.formState.errors.vertical) && (
          <p style={styles.error}>
            {form.formState.errors.domain?.message || form.formState.errors.vertical?.message}
          </p>
        )}

        {/* Cloudflare Turnstile */}
        {turnstileKey && turnstileKey.length > 10 && !turnstileKey.includes('xxxxx') && (
          <div style={{ display: 'none' }}>
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileKey}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
              options={{ theme: 'light', size: 'invisible' }}
            />
          </div>
        )}
      </form>
    </div>
  );
}
