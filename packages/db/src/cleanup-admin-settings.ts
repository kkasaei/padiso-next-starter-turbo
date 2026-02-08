import { db, adminSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

async function cleanupSettings() {
  console.log("🧹 Cleaning up admin settings...");

  // 1. Clean up data_source - remove mock_data_scope
  console.log("\n📦 Cleaning data_source...");
  const [dataSourceSetting] = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, "data_source"))
    .limit(1);

  if (dataSourceSetting) {
    const cleanedValue = {
      use_mock_data: dataSourceSetting.value.use_mock_data || false,
    };

    await db
      .update(adminSettings)
      .set({
        value: cleanedValue,
        updatedAt: new Date(),
      })
      .where(eq(adminSettings.key, "data_source"));

    console.log("✅ Removed mock_data_scope, mock_data_settings, and environments from data_source");
  } else {
    console.log("⚠️  data_source setting not found");
  }

  // 2. Clean up maintenance_mode - remove admin and auth from subsections
  console.log("\n🔧 Cleaning maintenance_mode...");
  const [maintenanceSetting] = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, "maintenance_mode"))
    .limit(1);

  if (maintenanceSetting) {
    const currentValue = maintenanceSetting.value as any;
    const cleanedSubsections = {
      dashboard: currentValue.subsections?.dashboard || false,
      marketing: currentValue.subsections?.marketing || false,
      api: currentValue.subsections?.api || false,
      mcp: currentValue.subsections?.mcp || false,
    };

    const cleanedMessages = {
      default: currentValue.message?.default || "We're performing scheduled maintenance. Back soon!",
      dashboard: currentValue.message?.dashboard || "Dashboard is temporarily unavailable",
      marketing: currentValue.message?.marketing || "Site is under maintenance",
      api: currentValue.message?.api || "API is under maintenance",
      mcp: currentValue.message?.mcp || "MCP server is temporarily unavailable",
    };

    const cleanedValue = {
      enabled: currentValue.enabled || false,
      scope: currentValue.scope || "all",
      subsections: cleanedSubsections,
      message: cleanedMessages,
      estimated_end: currentValue.estimated_end || null,
      allowed_ips: currentValue.allowed_ips || [],
      show_countdown: currentValue.show_countdown || false,
    };

    await db
      .update(adminSettings)
      .set({
        value: cleanedValue,
        updatedAt: new Date(),
      })
      .where(eq(adminSettings.key, "maintenance_mode"));

    console.log("✅ Removed admin and auth from maintenance_mode subsections");
  } else {
    console.log("⚠️  maintenance_mode setting not found");
  }

  console.log("\n✨ Cleanup completed!");
}

cleanupSettings()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
