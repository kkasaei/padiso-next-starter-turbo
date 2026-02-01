import { router } from "../trpc";
import { brandsRouter } from "./brands";
import { tasksRouter } from "./tasks";
import { promptsRouter } from "./prompts";
import { workspacesRouter } from "./workspaces";

export const appRouter = router({
  brands: brandsRouter,
  tasks: tasksRouter,
  prompts: promptsRouter,
  workspaces: workspacesRouter,
});

export type AppRouter = typeof appRouter;
