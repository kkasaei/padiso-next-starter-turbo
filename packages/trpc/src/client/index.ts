/**
 * Client exports for @workspace/trpc
 * 
 * Usage:
 * ```ts
 * import { createTRPCReact } from "@workspace/trpc/client";
 * import type { AppRouter } from "@/server/trpc/routers/_app";
 * 
 * export const trpc = createTRPCReact<AppRouter>();
 * ```
 */

export { createTRPCReact } from "@trpc/react-query";
export { createVanillaClient, getBaseUrl } from "./vanilla";
export type { TRPCReactProviderConfig } from "./react";
