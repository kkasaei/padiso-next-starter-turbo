import { pgTable, text, timestamp, uuid, boolean, index } from "drizzle-orm/pg-core";

export const contactRequests = pgTable(
  "contact_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    // Contact details
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    message: text("message").notNull(),

    // Tracking
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    // Response tracking
    responded: boolean("responded").notNull().default(false),
    respondedAt: timestamp("responded_at"),
    respondedBy: text("responded_by"), // Team member who responded

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Performance Optimizations: Indexes
    emailIdx: index("contact_requests_email_idx").on(table.email),
    createdAtIdx: index("contact_requests_created_at_idx").on(table.createdAt),
    respondedIdx: index("contact_requests_responded_idx").on(table.responded),
  })
);

export type ContactRequest = typeof contactRequests.$inferSelect;
export type NewContactRequest = typeof contactRequests.$inferInsert;
