import { db } from "@workspace/db";

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createInnerContext() {
  return {
    db,
  };
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext() {
  const innerContext = createInnerContext();
  return {
    ...innerContext,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
