"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import type { AnyRouter } from "@trpc/server";
import { getBaseUrl } from "./vanilla";

/**
 * Configuration options for TRPCReactProvider
 */
export interface TRPCReactProviderConfig {
  /**
   * Base URL for the tRPC API
   * Defaults to getBaseUrl() which handles browser/SSR/Vercel environments
   */
  baseUrl?: string;
  /**
   * Custom headers to include in requests
   */
  headers?: () => Record<string, string> | Promise<Record<string, string>>;
  /**
   * QueryClient default options
   */
  queryClientConfig?: {
    defaultOptions?: {
      queries?: {
        staleTime?: number;
        refetchOnWindowFocus?: boolean;
      };
    };
  };
}

/**
 * Create a tRPC React context
 * This should be called once per app with your AppRouter type
 * 
 * @example
 * ```ts
 * // lib/trpc/client.ts
 * import { createTRPCReact } from "@workspace/trpc/react";
 * import type { AppRouter } from "@/server/trpc/routers/_app";
 * 
 * export const trpc = createTRPCReact<AppRouter>();
 * ```
 */
export { createTRPCReact };

/**
 * Create a tRPC React Provider factory
 * Returns a provider component configured for your app
 */
export function createTRPCProvider<TRouter extends AnyRouter>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trpc: any,
  config?: TRPCReactProviderConfig
) {
  return function TRPCReactProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              staleTime: config?.queryClientConfig?.defaultOptions?.queries?.staleTime ?? 5 * 1000,
              refetchOnWindowFocus:
                config?.queryClientConfig?.defaultOptions?.queries?.refetchOnWindowFocus ?? false,
            },
          },
        })
    );

    const [trpcClient] = useState(() =>
      trpc.createClient({
        links: [
          httpBatchLink({
            url: `${config?.baseUrl ?? getBaseUrl()}/api/trpc`,
            async headers() {
              return config?.headers ? await config.headers() : {};
            },
          }),
        ],
      })
    );

    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {props.children}
        </QueryClientProvider>
      </trpc.Provider>
    );
  };
}
