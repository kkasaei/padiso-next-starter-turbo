"use client";

import { createTRPCProvider } from "@workspace/trpc/react";
import { trpc } from "./client";

export const TRPCReactProvider = createTRPCProvider(trpc, {
  // Optional: customize configuration
  // baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // headers: async () => ({
  //   authorization: getAuthCookie(),
  // }),
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  },
});
