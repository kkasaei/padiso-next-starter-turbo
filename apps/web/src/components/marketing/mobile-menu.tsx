'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BuildingIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon, LogOutIcon, SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser, useClerk, useOrganizationList } from '@clerk/nextjs';

import { FEATURE_FLAGS } from '@/feature_flags';
import { baseURL, getPathname } from '@/routes';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';
import { Button, buttonVariants } from '@workspace/ui/components/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@workspace/ui/components/collapsible';
import { Logo } from '@workspace/ui/components/logo';
import { Portal } from '@workspace/ui/components/portal';
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher';
import { RemoveScroll } from '@/lib/remove-scroll';
import { cn } from '@/lib/utils';

import { ExternalLink } from '@/components/shared/fragments/external-link';
import { DOCS_LINKS, MENU_LINKS } from '@/components/marketing/marketing-links';

function getInitials(name?: string | null): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function MobileMenu({
  className,
  ...other
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isDocs = pathname.startsWith(
    getPathname('/docs', baseURL)
  );

  React.useEffect(() => {
    const handleRouteChangeStart = () => {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      setOpen(false);
    };

    handleRouteChangeStart();
  }, [pathname]);

  const handleChange = () => {
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');
    setOpen((open) => (open ? !mediaQueryList.matches : false));
  };

  React.useEffect(() => {
    handleChange();
    const mediaQueryList = window.matchMedia('(min-width: 1024px)');
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  const handleToggleMobileMenu = (): void => {
    setOpen((open) => !open);
  };

  return (
    <>
      <div
        className={cn('flex items-center justify-between', className)}
        {...other}
      >
        <Link href='/'>
          <Logo />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          aria-expanded={open}
          aria-label="Toggle Mobile Menu"
          onClick={handleToggleMobileMenu}
          className="flex aspect-square h-fit select-none flex-col items-center justify-center rounded-full"
        >
          <motion.div
            className="w-5 origin-center border-t-2 border-primary"
            animate={
              open ? { rotate: '45deg', y: '5px' } : { rotate: '0deg', y: 0 }
            }
            transition={{ bounce: 0, duration: 0.1 }}
          />
          <motion.div
            className="w-5 origin-center border-t-2 border-primary"
            transition={{ bounce: 0, duration: 0.1 }}
            animate={
              open
                ? { rotate: '-45deg', y: '-5px' }
                : { rotate: '0deg', scaleX: 1, y: 0 }
            }
          />
        </Button>
      </div>
      {open && (
        <Portal asChild>
          <RemoveScroll
            allowPinchZoom
            enabled
          >
            {isDocs ? (
              <DocsMobileMenu onLinkClicked={handleToggleMobileMenu} />
            ) : (
              <MainMobileMenu onLinkClicked={handleToggleMobileMenu} />
            )}
          </RemoveScroll>
        </Portal>
      )}
    </>
  );
}

type MainMobileMenuProps = {
  onLinkClicked: () => void;
};

function MainMobileMenu({
  onLinkClicked
}: MainMobileMenuProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Get current organization slug from user's active membership
  const activeOrgSlug = user?.organizationMemberships?.find(
    (m) => m.organization.id === user?.organizationMemberships?.[0]?.organization.id
  )?.organization.slug;

  const dashboardUrl = '/dashboard';

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push('/');
    onLinkClicked();
  };

  const handleSwitchOrganization = async (orgId: string, orgSlug: string): Promise<void> => {
    if (setActive) {
      await setActive({ organization: orgId });
      // Navigate to the switched organization's dashboard
      const newDashboardUrl = '/dashboard';
      router.push(newDashboardUrl);
      onLinkClicked();
    }
  };

  return (
    <div className="fixed inset-0 z-50 mt-[69px] overflow-y-auto bg-background animate-in fade-in-0">
      <div className="flex size-full flex-col items-start space-y-3 p-4">
        {isSignedIn ? (
          <div className="flex w-full flex-col gap-2">
            <Link
              href={dashboardUrl}
              className="flex w-full items-center gap-3 rounded-xl border p-3"
              onClick={onLinkClicked}
            >
              <Avatar className="size-10">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? 'User'} />
                <AvatarFallback className="text-sm">
                  {getInitials(user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </Link>
            <Link
              href={dashboardUrl}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg'
                }),
                'w-full rounded-xl justify-start'
              )}
              onClick={onLinkClicked}
            >
              <SettingsIcon className="mr-2 size-4" />
              Dashboard
            </Link>
            {userMemberships && userMemberships.data && userMemberships.data.length > 1 && (
              <div className="w-full space-y-2 border-y border-border/40 py-2">
                <p className="px-2 text-xs font-medium text-muted-foreground">ORGANIZATIONS</p>
                {userMemberships.data.map((membership) => (
                  <button
                    key={membership.organization.id}
                    className={cn(
                      buttonVariants({
                        variant: 'ghost',
                        size: 'lg'
                      }),
                      'w-full justify-start'
                    )}
                    onClick={() => membership.organization.slug && handleSwitchOrganization(
                      membership.organization.id,
                      membership.organization.slug
                    )}
                  >
                    <BuildingIcon className="mr-2 size-4" />
                    <span className="flex-1 truncate text-left">{membership.organization.name}</span>
                    {membership.organization.id === user?.organizationMemberships?.[0]?.organization.id && (
                      <CheckIcon className="ml-2 size-4" />
                    )}
                  </button>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-xl justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOutIcon className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-2">
            <Link
              href={FEATURE_FLAGS.IS_WAITLIST ? '/waitlist' : '/signup'}
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'lg'
                }),
                'w-full rounded-xl'
              )}
              onClick={onLinkClicked}
            >
              {FEATURE_FLAGS.IS_WAITLIST ? 'Join Waitlist' : 'Get started'}
            </Link>
            <Link
              href='/signin'
              onClick={onLinkClicked}
              className={cn(
                buttonVariants({
                  variant: 'outline',
                  size: 'lg'
                }),
                'w-full rounded-xl'
              )}
            >
              Sign in
            </Link>
          </div>
        )}
        <ul className="w-full">
          {MENU_LINKS.map((item) => (
            <li
              key={item.title}
              className="py-2"
            >
              {item.items ? (
                <Collapsible
                  open={expanded[item.title.toLowerCase()]}
                  onOpenChange={(isOpen: boolean) =>
                    setExpanded((prev) => ({
                      ...prev,
                      [item.title.toLowerCase()]: isOpen
                    }))
                  }
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-9 w-full items-center justify-between px-4 text-left"
                    >
                      <span className="text-base font-medium">
                        {item.title}
                      </span>
                      {expanded[item.title.toLowerCase()] ? (
                        <ChevronUpIcon className="size-4" />
                      ) : (
                        <ChevronDownIcon className="size-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ul className="mt-2 pl-4">
                      {item.items.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            target={subItem.external ? '_blank' : undefined}
                            rel={
                              subItem.external
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className={cn(
                              buttonVariants({ variant: 'ghost' }),
                              'm-0 h-auto w-full justify-start gap-4 p-1.5'
                            )}
                            onClick={onLinkClicked}
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                              {subItem.icon}
                            </div>
                            <div>
                              <span className="text-sm font-medium">
                                {subItem.title}
                                {subItem.external && (
                                  <ExternalLink className="-mt-2 ml-1 inline size-2 text-muted-foreground" />
                                )}
                              </span>
                              {subItem.description && (
                                <p className="text-xs text-muted-foreground">
                                  {subItem.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full justify-start'
                  )}
                  onClick={onLinkClicked}
                >
                  <span className="text-base">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="flex w-full items-center justify-between gap-2 border-y border-border/40 p-4">
          <div className="text-base font-medium">Theme</div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}

type DocsMobileMenuProps = {
  onLinkClicked: () => void;
};

function DocsMobileMenu({
  onLinkClicked
}: DocsMobileMenuProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const pathname = usePathname();
  return (
    <div className="fixed inset-0 z-50 mt-[69px] overflow-y-auto bg-background animate-in fade-in-0">
      <div className="flex size-full flex-col items-start space-y-3 p-4">
        <ul className="w-full">
          {DOCS_LINKS.map((item) => (
            <li
              key={item.title}
              className="py-2"
            >
              <Collapsible
                open={expanded[item.title.toLowerCase()]}
                onOpenChange={(isOpen: boolean) =>
                  setExpanded((prev) => ({
                    ...prev,
                    [item.title.toLowerCase()]: isOpen
                  }))
                }
              >
                <CollapsibleTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex h-9 w-full items-center justify-between px-4 text-left"
                  >
                    <div className="flex flex-row items-center gap-2 text-base font-medium">
                      {item.icon}
                      {item.title}
                    </div>
                    {expanded[item.title.toLowerCase()] ? (
                      <ChevronUpIcon className="size-4" />
                    ) : (
                      <ChevronDownIcon className="size-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul className="mt-2 pl-4">
                    {item.items.map((subItem) => (
                      <li key={subItem.title}>
                        <Link
                          href={subItem.href}
                          className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            'm-0 h-auto w-full justify-start gap-4 p-1.5 text-sm font-medium',
                            pathname ===
                              getPathname(subItem.href, baseURL)
                              ? 'font-medium text-foreground bg-accent'
                              : 'text-muted-foreground'
                          )}
                          onClick={onLinkClicked}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
        <div className="flex w-full items-center justify-between gap-2 border-y border-border/40 p-4">
          <div className="text-base font-medium">Theme</div>
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
