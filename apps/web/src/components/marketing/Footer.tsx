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
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
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
    </footer>
  );
}
