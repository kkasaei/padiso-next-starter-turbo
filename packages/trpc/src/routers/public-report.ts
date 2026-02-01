import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { db } from "@workspace/db";
import { reportUnlockRequests } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

// Schema for checking unlock status
const checkUnlockSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
});

export const publicReportRouter = router({
  /**
   * Check if user has unlocked the report
   *
   * Checks both:
   * 1. Cookie-based session (for current user)
   * 2. Database record (for email verification)
   */
  checkUnlockStatus: publicProcedure
    .input(checkUnlockSchema)
    .query(async ({ input }) => {
      try {
        // Normalize domain
        const normalizedDomain = input.domain
          .toLowerCase()
          .replace(/^www\./, "");

        // Check if there's a cookie with unlock info
        const cookieStore = await cookies();
        const unlockCookie = cookieStore.get(`report_unlocked_${normalizedDomain}`);

        if (unlockCookie) {
          try {
            const unlockData = JSON.parse(unlockCookie.value);

            // Verify in database that this email actually unlocked this domain
            const dbRecord = await db.query.reportUnlockRequests.findFirst({
              where: and(
                eq(reportUnlockRequests.domain, normalizedDomain),
                eq(reportUnlockRequests.email, unlockData.email.toLowerCase()),
                eq(reportUnlockRequests.unlocked, true)
              ),
              columns: {
                email: true,
                firstName: true,
                lastName: true,
              },
            });

            if (dbRecord) {
              return {
                unlocked: true,
                email: dbRecord.email,
                firstName: dbRecord.firstName,
                lastName: dbRecord.lastName,
              };
            }
          } catch (e) {
            // Invalid cookie, continue to check database
            console.error("Invalid unlock cookie:", e);
          }
        }

        // No valid cookie, return locked
        return { unlocked: false };
      } catch (error) {
        console.error("Error checking unlock status:", error);
        throw new Error("Failed to check unlock status");
      }
    }),
});
