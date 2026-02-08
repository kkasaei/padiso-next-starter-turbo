import { db, adminSettings } from "@workspace/db";
import { eq } from "drizzle-orm";

async function cleanupAuthMode() {
  console.log("🧹 Cleaning up auth_mode settings...");

  const [authModeSetting] = await db
    .select()
    .from(adminSettings)
    .where(eq(adminSettings.key, "auth_mode"))
    .limit(1);

  if (authModeSetting) {
    const currentValue = authModeSetting.value as any;
    const currentMode = currentValue.mode;

    // If current mode is invite_only or closed, change it to open
    let newMode = currentMode;
    if (currentMode === "invite_only" || currentMode === "closed") {
      newMode = "open";
      console.log(`⚠️  Current mode "${currentMode}" is being removed, changing to "open"`);
    }

    const cleanedValue = {
      mode: newMode,
      settings: {
        waitlist: currentValue.settings?.waitlist || {
          enabled: false,
          message: "Join our waitlist to get early access!",
          success_message: "Thank you! We'll notify you when your account is approved.",
          auto_approve: false,
          manual_approval: true,
          approval_notification_email: true,
          max_approvals_per_day: 100,
          priority_domains: [],
          collect_additional_info: {
            company: false,
            use_case: true,
            referral_source: true,
            team_size: false,
          },
        },
        open_signup: currentValue.settings?.open_signup || {
          enabled: true,
          require_email_verification: true,
          allowed_domains: [],
          blocked_domains: ["tempmail.com", "throwaway.email"],
        },
      },
    };

    await db
      .update(adminSettings)
      .set({
        value: cleanedValue,
        updatedAt: new Date(),
      })
      .where(eq(adminSettings.key, "auth_mode"));

    console.log("✅ Removed invite_only and closed from auth_mode");
    console.log("✅ Now only has: open and waitlist");
  } else {
    console.log("⚠️  auth_mode setting not found");
  }

  console.log("\n✨ Cleanup completed!");
}

cleanupAuthMode()
  .catch((error) => {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
