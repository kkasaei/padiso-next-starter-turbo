import { router } from "../trpc";
import { brandsRouter } from "./brands";
import { tasksRouter } from "./tasks";
import { taskTagsRouter } from "./task-tags";
import { promptsRouter } from "./prompts";
import { workspacesRouter } from "./workspaces";
import { publicReportRouter } from "./public-report";
import { subscriptionsRouter } from "./subscriptions";
import { contentRouter } from "./content";
import { integrationsRouter } from "./integrations";
import { redditRouter } from "./reddit";
import { adminRouter } from "./admin";
import { adminSettingsRouter } from "./admin-settings";
import { adminPromptsRouter } from "./admin-prompts";

export const appRouter = router({
  brands: brandsRouter,
  tasks: tasksRouter,
  taskTags: taskTagsRouter,
  prompts: promptsRouter,
  workspaces: workspacesRouter,
  publicReport: publicReportRouter,
  subscriptions: subscriptionsRouter,
  content: contentRouter,
  integrations: integrationsRouter,
  reddit: redditRouter,
  admin: adminRouter,
  adminSettings: adminSettingsRouter,
  adminPrompts: adminPromptsRouter,
});

export type AppRouter = typeof appRouter;
