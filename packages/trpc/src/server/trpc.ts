import { initTRPC, type inferAsyncReturnType } from "@trpc/server";
import { ZodError } from "zod";

/**
 * Create a tRPC instance with standard error formatting
 * This should be called once per app with your context type
 * 
 * @example
 * ```ts
 * // server/trpc/trpc.ts
 * import { createTRPCInstance } from "@workspace/trpc/server";
 * import type { Context } from "./context";
 * 
 * const t = createTRPCInstance<Context>();
 * export const router = t.router;
 * export const publicProcedure = t.procedure;
 * ```
 */
export function createTRPCInstance<
  TContext extends Record<string, any> = Record<string, never>
>() {
  const t = initTRPC.context<TContext>().create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

  return {
    /**
     * Create a server-side caller.
     * @see https://trpc.io/docs/v11/server/server-side-calls
     */
    createCallerFactory: t.createCallerFactory,

    /**
     * Router factory
     */
    router: t.router,

    /**
     * Middleware factory
     */
    middleware: t.middleware,

    /**
     * Public (unauthenticated) procedure
     * This is the base piece you use to build new queries and mutations on your tRPC API.
     */
    procedure: t.procedure,

    /**
     * Merge multiple routers together
     */
    mergeRouters: t.mergeRouters,
  };
}

/**
 * Helper type to infer context from a context creator function
 */
export type InferContext<TContextFn extends (...args: any[]) => any> =
  inferAsyncReturnType<TContextFn>;
