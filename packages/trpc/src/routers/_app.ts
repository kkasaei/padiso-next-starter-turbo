import { router } from "../trpc";
import { brandsRouter } from "./brands";
import { tasksRouter } from "./tasks";
import { promptsRouter } from "./prompts";
import { workspacesRouter } from "./workspaces";
import { publicReportRouter } from "./public-report";
import { subscriptionsRouter } from "./subscriptions";

export const appRouter = router({
  brands: brandsRouter,
  tasks: tasksRouter,
  prompts: promptsRouter,
  workspaces: workspacesRouter,
  publicReport: publicReportRouter,
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;
