'use client';

import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@workspace/common/constants';
import { Button } from '@workspace/ui/components/button';
import { Logo } from '@workspace/ui/components/logo';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

import { ExternalLink } from '@workspace/ui/components/fragments/ExternalLink';
import { FOOTER_LINKS, SOCIAL_LINKS } from '@/components/marketing/MarketingLinks';

export function Footer(): React.JSX.Element {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('[Newsletter] Error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <footer className="px-2 pb-10 pt-20 sm:container">
      <h2 className="sr-only">Footer</h2>
      <div className="container">
        <div className="xl:grid xl:grid-cols-6 xl:gap-8">
          <div className="hidden xl:block">
            <Logo />
            <p className="mt-3 text-xs text-muted-foreground">
              To make every business discoverable across all search platforms through intelligent automation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-3">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-2"
                >
                  {group.links.map((link) => (
                    <li key={link.name}>
                      {'disabled' in link && link.disabled ? (
                        <span className="relative inline-flex items-center gap-2 text-sm text-muted-foreground/50 cursor-not-allowed">
                          {link.name}
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/40">
                            Soon
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={link.href}
                          title={link.name}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          className="relative text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.name}
                          {link.external && (
                            <ExternalLink className="absolute right-[-10px] top-[2px] opacity-80" />
                          )}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 space-y-4 lg:col-span-2 xl:mt-0">
            <h3 className="text-sm font-semibold text-foreground">
              Subscribe to our newsletter
            </h3>
            <form
              onSubmit={handleSubscribe}
              suppressHydrationWarning
            >
              <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-background shadow-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-9 w-[180px] sm:w-[220px] pl-4 pr-2 rounded-full bg-transparent border-0 text-sm focus:outline-none focus:ring-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button type="submit" className="rounded-full h-9 px-4" disabled={isLoading}>
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
            </form>
            <h3 className="text-sm font-semibold text-foreground !mt-6">
              Connect with us
            </h3>
            <div className="flex flex-row items-center gap-4">
              {SOCIAL_LINKS.map((link) => (
                <Link
                  key={link.name}
                  title={link.name}
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{link.name}</span>
                  {link.icon}
                </Link>
              ))}
              <Separator
                orientation="vertical"
                className="h-4"
              />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Giant brand block */}
      <div className="mt-16 overflow-hidden">
        <div className="container flex w-full items-center gap-[3%]" style={{ containerType: 'inline-size' }}>
          {/* Large icon - scales proportionally */}
          <div className="shrink-0" style={{ width: '15%' }}>
            <div className="aspect-square w-full flex items-center justify-center rounded-full bg-foreground/10 text-background">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '75%', height: '75%' }}
              >
                <path d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12.2324 4.34375C10.8984 4.34376 9.80873 4.57424 8.96387 5.03418C8.13396 5.47928 7.5193 6.08794 7.11914 6.85938C6.73387 7.63075 6.54107 8.48345 6.54102 9.41797C6.54102 10.4417 6.8597 11.2808 7.49707 11.9336C8.14924 12.5714 9.20878 13.024 10.6758 13.291L12.499 13.6465C12.9882 13.7207 13.3593 13.8845 13.6113 14.1367C13.8779 14.3888 14.0116 14.6854 14.0117 15.0264C14.0117 15.4862 13.8112 15.8501 13.4111 16.1172C13.0257 16.3843 12.4618 16.5176 11.7207 16.5176C11.1575 16.5175 10.5056 16.3766 9.76465 16.0947C9.02361 15.8129 8.23051 15.4128 7.38574 14.8936L6.0957 17.7646C6.98495 18.4322 7.87443 18.9142 8.76367 19.2109C9.6529 19.5076 10.6388 19.6562 11.7207 19.6562C13.7366 19.6562 15.2642 19.2105 16.3018 18.3203C17.3538 17.4153 17.8798 16.1693 17.8799 14.582C17.8799 13.5731 17.5536 12.6827 16.9014 11.9111C16.2492 11.1396 15.1967 10.6206 13.7441 10.3535L11.9209 9.99707C11.4319 9.92287 11.0539 9.78952 10.7871 9.59668C10.5351 9.4038 10.4092 9.13617 10.4092 8.79492C10.4092 8.37961 10.5581 8.0604 10.8545 7.83789C11.1658 7.60071 11.6622 7.48242 12.3438 7.48242C12.8329 7.48243 13.4035 7.60054 14.0557 7.83789C14.7078 8.07526 15.4045 8.39439 16.1455 8.79492L17.4355 5.92383C16.5314 5.30067 15.6488 4.88546 14.7891 4.67773C13.9295 4.45525 13.0772 4.34375 12.2324 4.34375Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          {/* Huge wordmark - fills remaining space */}
          <span
            className="min-w-0 flex-1 overflow-hidden whitespace-nowrap font-extrabold tracking-tighter text-foreground/10 select-none leading-none"
            style={{ fontSize: '18cqw' }}
          >
            {APP_NAME}
          </span>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
