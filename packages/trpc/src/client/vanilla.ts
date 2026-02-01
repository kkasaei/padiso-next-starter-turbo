import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";

/**
 * Get the base URL for tRPC requests
 * Works in both browser and server-side rendering
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Browser should use relative path
    return "";
  }
  if (process.env.VERCEL_URL) {
    // SSR should use vercel url
    return `https://${process.env.VERCEL_URL}`;
  }
  // dev SSR should use localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Create a vanilla tRPC client
 * Useful for server-side calls or non-React contexts
 */
export function createVanillaClient<TRouter extends AnyRouter>(options?: {
  baseUrl?: string;
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
}) {
  const linkOptions = {
    url: `${options?.baseUrl ?? getBaseUrl()}/api/trpc`,
    ...(options?.headers && {
      headers: options.headers,
    }),
  };

  return createTRPCClient<TRouter>({
    links: [httpBatchLink(linkOptions as any)],
  });
}
