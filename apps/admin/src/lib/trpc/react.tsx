"use client";

import { createTRPCProvider } from "@workspace/trpc/react";
import { trpc } from "./client";

export const TRPCReactProvider = createTRPCProvider(trpc, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  },
});
