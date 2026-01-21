export const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000';

export const routes = {
  marketing: {
    Home: '/',
    Pricing: '/pricing',
    Blog: '/blog',
    Story: '/story',
    Contact: '/contact',
    Docs: '/docs',
    Waitlist: '/waitlist',
  },
  dashboard: {
    Home: '/dashboard',
    auth: {
      SignIn: '/auth/sign-in',
      SignUp: '/auth/sign-up',
    },
  },
} as const;

export function getPathname(route: string, base: string = baseURL): string {
  // Handle anchor-only links or empty routes
  if (!route || route === '#' || route.startsWith('#')) {
    return route || '/';
  }

  // If route is already an absolute URL, parse it directly
  if (route.startsWith('http://') || route.startsWith('https://')) {
    return new URL(route).pathname;
  }

  // Use a fallback base if the provided one is invalid
  const validBase = base || 'http://localhost:3000';
  return new URL(route, validBase).pathname;
}