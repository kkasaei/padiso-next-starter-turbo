import { db, adminSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

async function verify() {
  console.log("🔍 Verifying settings cleanup...\n");

  const [maintenance] = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, "maintenance_mode"))
    .limit(1);

  console.log("✅ Maintenance subsections:");
  console.log(JSON.stringify(maintenance.value.subsections, null, 2));
  console.log("\nShould have 4 subsections: dashboard, marketing, api, mcp");

  const [dataSource] = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, "data_source"))
    .limit(1);

  console.log("\n✅ Data source value:");
  console.log(JSON.stringify(dataSource.value, null, 2));
  console.log("\nShould only have: use_mock_data");
}

verify()
  .catch((error) => {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
