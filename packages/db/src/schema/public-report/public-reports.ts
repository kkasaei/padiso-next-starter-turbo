import { pgTable, text, timestamp, uuid, pgEnum, json, integer, real, index } from "drizzle-orm/pg-core";

export const reportStatusEnum = pgEnum("report_status", [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
]);

export const publicReports = pgTable(
  "public_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    // Domain fields
    domain: text("domain").notNull().unique(), // Normalized domain (lowercase, no www)
    domainURL: text("domain_url").notNull(), // Original domain as entered by user
    status: reportStatusEnum("status").notNull().default("PENDING"),

    // Report Data (JSON structure matching AEOReport schema)
    data: json("data"),

    // LLM Execution Tracking
    llmResults: json("llm_results"), // {chatgpt: {status, data, error}, perplexity: {...}, gemini: {...}}

    // Performance Metrics
    generationTimeMs: integer("generation_time_ms"), // Total time to generate report
    totalCost: real("total_cost"), // USD cost for all LLM calls

    // Cache Management
    expiresAt: timestamp("expires_at").notNull(), // When cache expires (7 days from generation)
    lastViewedAt: timestamp("last_viewed_at"),
    viewCount: integer("view_count").notNull().default(0),
    regeneratedAt: timestamp("regenerated_at"), // Last time report was regenerated

    // PDF Generation & Storage
    pdfUrl: text("pdf_url"), // Public CDN URL to generated PDF
    pdfGeneratedAt: timestamp("pdf_generated_at"), // When PDF was last generated

    // OG Image Generation & Storage
    ogImageUrl: text("og_image_url"), // Public CDN URL to Open Graph image
    ogImageGeneratedAt: timestamp("og_image_generated_at"), // When OG image was last generated

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Performance Optimizations: Indexes
    // Note: .unique() on domain already creates an index
    statusIdx: index("public_reports_status_idx").on(table.status),
    expiresAtIdx: index("public_reports_expires_at_idx").on(table.expiresAt),
    statusExpiresAtIdx: index("public_reports_status_expires_at_idx").on(table.status, table.expiresAt),
    createdAtIdx: index("public_reports_created_at_idx").on(table.createdAt),
    domainPdfUrlIdx: index("public_reports_domain_pdf_url_idx").on(table.domain, table.pdfUrl),
  })
);

export type PublicReport = typeof publicReports.$inferSelect;
export type NewPublicReport = typeof publicReports.$inferInsert;
