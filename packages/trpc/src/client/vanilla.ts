import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AnyRouter } from "@trpc/server";
import { getBaseUrl } from "../env";

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

// Re-export getBaseUrl for convenience
export { getBaseUrl };
