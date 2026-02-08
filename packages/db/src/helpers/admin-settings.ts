import { db, adminSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

/**
 * Check if waitlist mode is enabled
 * Returns true if use_waitlist_mode is true, false otherwise
 * 
 * Security: Defaults to TRUE (waitlist/closed) on error to fail-safe
 */
export async function isWaitlistMode(): Promise<boolean> {
  try {
    const [authModeSetting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, "auth_mode"))
      .limit(1);

    if (!authModeSetting || !authModeSetting.isActive) {
      return false; // Default to open mode if setting doesn't exist
    }

    const use_waitlist_mode = (authModeSetting.value as any).use_waitlist_mode;
    return use_waitlist_mode === true;
  } catch (error) {
    console.error("Error checking waitlist mode:", error);
    // Fail-closed: default to waitlist mode for security
    return true;
  }
}

/**
 * Check if maintenance mode is enabled
 * Can optionally check specific subsection
 */
export async function isMaintenanceMode(subsection?: "dashboard" | "marketing" | "api" | "mcp"): Promise<boolean> {
  try {
    const [maintenanceSetting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, "maintenance_mode"))
      .limit(1);

    if (!maintenanceSetting || !maintenanceSetting.isActive) {
      return false;
    }

    const value = maintenanceSetting.value as any;
    const globalEnabled = value.enabled as boolean;

    if (!globalEnabled) {
      return false;
    }

    // If checking specific subsection
    if (subsection) {
      return value.subsections?.[subsection] === true;
    }

    // Global maintenance mode
    return true;
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    return false;
  }
}

/**
 * Check if mock data should be used
 */
export async function useMockData(): Promise<boolean> {
  try {
    const [dataSourceSetting] = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, "data_source"))
      .limit(1);

    if (!dataSourceSetting || !dataSourceSetting.isActive) {
      return false;
    }

    const value = dataSourceSetting.value as any;
    return value.use_mock_data === true;
  } catch (error) {
    console.error("Error checking mock data setting:", error);
    return false;
  }
}
