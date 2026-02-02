import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID ?? "proj_kguymfgychvolynufifv",
  runtime: "node",
  logLevel: "log",
  maxDuration: 3600,
  // Default machine size for all tasks (can be overridden per-task)
  // Options: "micro" | "small-1x" | "small-2x" | "medium-1x" | "medium-2x" | "large-1x" | "large-2x"
  machine: "medium-1x", // 1 vCPU, 2 GB RAM - good for AI processing tasks
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/tasks"],
});
