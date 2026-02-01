/**
 * Server exports for @workspace/trpc
 * 
 * Usage:
 * ```ts
 * import { createTRPCInstance } from "@workspace/trpc/server";
 * import type { Context } from "./context";
 * 
 * const t = createTRPCInstance<Context>();
 * export const router = t.router;
 * export const publicProcedure = t.procedure;
 * ```
 */

export { createTRPCInstance, type InferContext } from "./trpc";
export { initTRPC, TRPCError } from "@trpc/server";
export type { AnyRouter } from "@trpc/server";
