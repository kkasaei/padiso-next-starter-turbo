import { router, publicProcedure } from "../trpc";
import { db, publicReports, contactRequests, reportUnlockRequests } from "@workspace/db";
import { desc, count } from "drizzle-orm";

export const adminRouter = router({
  // Get dashboard stats
  getStats: publicProcedure.query(async () => {
    const [publicReportsCount] = await db
      .select({ count: count() })
      .from(publicReports);
    
    const [contactRequestsCount] = await db
      .select({ count: count() })
      .from(contactRequests);
    
    const [waitlistCount] = await db
      .select({ count: count() })
      .from(reportUnlockRequests);

    return {
      publicReports: publicReportsCount?.count ?? 0,
      contactRequests: contactRequestsCount?.count ?? 0,
      waitlistRequests: waitlistCount?.count ?? 0,
    };
  }),

  // Get all public reports
  getPublicReports: publicProcedure.query(async () => {
    const reports = await db
      .select()
      .from(publicReports)
      .orderBy(desc(publicReports.createdAt));
    
    return reports;
  }),

  // Get all contact requests
  getContactRequests: publicProcedure.query(async () => {
    const contacts = await db
      .select()
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt));
    
    return contacts;
  }),

  // Get all waitlist/unlock requests
  getWaitlistRequests: publicProcedure.query(async () => {
    const requests = await db
      .select()
      .from(reportUnlockRequests)
      .orderBy(desc(reportUnlockRequests.createdAt));
    
    return requests;
  }),
});
