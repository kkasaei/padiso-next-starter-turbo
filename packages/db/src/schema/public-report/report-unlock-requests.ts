import { pgTable, text, timestamp, uuid, boolean, integer, index } from "drizzle-orm/pg-core";
import { publicReports } from "./public-reports";

export const reportUnlockRequests = pgTable(
  "report_unlock_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    // Request details - references the public report
    domain: text("domain")
      .notNull()
      .references(() => publicReports.domain, { onDelete: "cascade" }), // The report domain they're unlocking
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    companyName: text("company_name").notNull(),

    // Tracking
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    unlocked: boolean("unlocked").notNull().default(false), // Whether they've been granted access
    unlockedAt: timestamp("unlocked_at"),

    // PDF Activity Tracking (separate generation vs download)
    pdfGeneratedCount: integer("pdf_generated_count").notNull().default(0), // How many times they triggered generation
    pdfDownloadCount: integer("pdf_download_count").notNull().default(0), // How many times they downloaded
    lastPdfGeneratedAt: timestamp("last_pdf_generated_at"), // Last time they generated
    lastPdfDownloadedAt: timestamp("last_pdf_downloaded_at"), // Last time they downloaded

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Performance Optimizations: Indexes
    domainEmailIdx: index("report_unlock_requests_domain_email_idx").on(table.domain, table.email),
    emailIdx: index("report_unlock_requests_email_idx").on(table.email),
    createdAtIdx: index("report_unlock_requests_created_at_idx").on(table.createdAt),
    domainIdx: index("report_unlock_requests_domain_idx").on(table.domain),
  })
);

export type ReportUnlockRequest = typeof reportUnlockRequests.$inferSelect;
export type NewReportUnlockRequest = typeof reportUnlockRequests.$inferInsert;
