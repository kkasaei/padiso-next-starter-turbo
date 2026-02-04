import { createTRPCReact } from "@workspace/trpc/client";
import { type AppRouter } from "@workspace/trpc/routers";

export const trpc = createTRPCReact<AppRouter>();
