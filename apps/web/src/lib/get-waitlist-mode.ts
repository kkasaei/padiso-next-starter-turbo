import { isWaitlistMode } from "@workspace/db";
import { cache } from "react";

/**
 * Server-side function to check if waitlist mode is enabled
 * Uses React cache to dedupe multiple calls within a single render
 */
export const getWaitlistMode = cache(async (): Promise<boolean> => {
  return await isWaitlistMode();
});
