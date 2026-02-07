'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useClerk, useOrganizationList } from '@clerk/nextjs';
import { LogOutIcon, SettingsIcon } from 'lucide-react';

import { FEATURE_FLAGS } from '@workspace/common';
import { baseURL, getPathname, routes } from '@workspace/common';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';
import { buttonVariants } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@workspace/ui/components/dropdown-menu';
import { Logo } from '@workspace/ui/components/logo';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@workspace/ui/components/navigation-menu';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@workspace/common/lib';

import { ExternalLink } from '@workspace/ui/components/fragments/ExternalLink';
import { MENU_LINKS } from '@/components/marketing/MarketingLinks';
import { MobileMenu } from '@/components/marketing/MobileMenu';

function getInitials(name?: string | null): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const dashboardUrl = '/dashboard';

  const handleSignOut = async (): Promise<void> => {
    await signOut();
    router.push('/');
  };

  return (
    <section className="sticky inset-x-0 top-0 z-40 border-b bg-background py-4">
      <div className="container">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-x-9">
            <Link
              href='/'
              className="flex items-center gap-2"
            >
              <Logo />
            </Link>
            <div className="flex items-center">
              <NavigationMenu
                style={
                  {
                    ['--radius']: '1rem'
                  } as React.CSSProperties
                }
              >
                <NavigationMenuList>
                  {MENU_LINKS.map((item, index) =>
                    item.items ? (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuTrigger
                          data-active={
                            item.items.some(
                              (subItem) =>
                                !subItem.external &&
                                subItem.href !== '#' &&
                                pathname.startsWith(
                                  getPathname(subItem.href, baseURL)
                                )
                            )
                              ? ''
                              : undefined
                          }
                          className="rounded-xl text-[15px] font-normal data-active:bg-accent"
                        >
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="w-96 list-none p-2">
                            {item.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                {'disabled' in subItem && subItem.disabled ? (
                                  <div className="group flex select-none flex-row items-center gap-4 rounded-md p-3 leading-none no-underline outline-none cursor-not-allowed opacity-50">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground">
                                      {subItem.icon}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 text-sm font-medium">
                                        {subItem.title}
                                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                          Soon
                                        </span>
                                      </div>
                                      <p className="text-sm leading-snug text-muted-foreground">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={subItem.href}
                                      target={
                                        subItem.external ? '_blank' : undefined
                                      }
                                      rel={
                                        subItem.external
                                          ? 'noopener noreferrer'
                                          : undefined
                                      }
                                      className="group flex select-none flex-row items-center gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                    >
                                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                                        {subItem.icon}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">
                                          {subItem.title}
                                          {subItem.external && (
                                            <ExternalLink className="-mt-2 ml-1 size-2 inline text-muted-foreground" />
                                          )}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      </div>
                                    </Link>
                                  </NavigationMenuLink>
                                )}
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ) : (
                      <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                          asChild
                          active={
                            !item.external &&
                            pathname.startsWith(
                              getPathname(item.href, baseURL)
                            )
                          }
                          className={cn(
                            navigationMenuTriggerStyle(),
                            'rounded-xl text-[15px] font-normal data-active:bg-accent'
                          )}
                        >
                          <Link
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={
                              item.external ? 'noopener noreferrer' : undefined
                            }
                          >
                            {item.title}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="rounded-xl border-none shadow-none" />
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl outline-none ring-offset-background transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-1">
                    <Avatar className="size-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? 'User'} />
                      <AvatarFallback className="text-xs">
                        {getInitials(user?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="truncate text-sm font-medium leading-none">
                        {user?.fullName}
                      </p>
                      <p className="truncate text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(dashboardUrl)}
                    >
                      <SettingsIcon className="mr-2 size-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href='/auth/sign-in'
                  className={cn(
                    buttonVariants({
                      variant: 'outline'
                    }),
                    'rounded-xl'
                  )}
                >
                  Sign in
                </Link>
                <Link
                  href={FEATURE_FLAGS.IS_WAITLIST ? '/waitlist' : '/auth/sign-up'}
                  className={cn(
                    buttonVariants({
                      variant: 'default'
                    }),
                    'rounded-xl'
                  )}
                >
                  {FEATURE_FLAGS.IS_WAITLIST ? 'Join Waitlist' : 'Get started'}
                </Link>
              </>
            )}
          </div>
        </nav>
        <MobileMenu className="lg:hidden" />
      </div>
    </section>
  );
}
