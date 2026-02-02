import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  json,
  pgEnum,
  numeric,
} from "drizzle-orm/pg-core";
import { brands } from "../brands/brands";

/**
 * Content Status Enum
 */
export const contentStatusEnum = pgEnum("content_status", [
  "opportunity",
  "generating",
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
]);

/**
 * Content Type Enum
 */
export const contentTypeEnum = pgEnum("content_type", [
  "how_to",
  "listicle",
  "explainer",
  "comparison",
  "review",
  "case_study",
  "ultimate_guide",
  "roundup",
  "news",
  "faq",
  "checklist",
  "opinion",
  "tutorial",
  "glossary",
  "pillar",
]);

/**
 * Content Outline Section Type
 */
export type ContentOutlineSection = {
  title: string;
  points: string[];
};

/**
 * Content Outline Type
 */
export type ContentOutline = {
  sections: ContentOutlineSection[];
};

/**
 * Content Generated From Type
 */
export type ContentGeneratedFrom = {
  opportunityId?: string;
  keywords?: string[];
  theme?: string;
  sourceInsights?: string[];
  agentRunId?: string;
};

/**
 * Content Table
 *
 * Stores articles, content opportunities, and content plans.
 * Supports the full content lifecycle from opportunity to published.
 */
export const content = pgTable("content", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Brand relationship
  brandId: uuid("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),

  // Status and type
  status: contentStatusEnum("status").notNull().default("opportunity"),
  type: contentTypeEnum("type").notNull(),

  // Basic content
  title: text("title").notNull(),
  content: text("content"), // Markdown content

  // Featured image
  featuredImage: text("featured_image"), // Image URL
  featuredImageAlt: text("featured_image_alt"), // Alt text for SEO

  // Authorship
  authorId: text("author_id"), // Clerk user ID
  authorName: text("author_name"), // Display name

  // SEO fields
  slug: text("slug"),
  metaDescription: text("meta_description"),
  targetKeyword: text("target_keyword"),
  searchVolume: integer("search_volume"),
  keywordDifficulty: integer("keyword_difficulty"), // 0-100

  // AI generation
  promptInstructions: text("prompt_instructions"), // User instructions for AI
  outline: json("outline").$type<ContentOutline>(),
  generatedFrom: json("generated_from").$type<ContentGeneratedFrom>(),
  generationCost: numeric("generation_cost", { precision: 10, scale: 4 }),

  // Versioning for refinements
  version: integer("version").notNull().default(1),
  parentId: uuid("parent_id"), // FK to content (previous version) - self-reference

  // Article metrics
  wordCount: integer("word_count"),
  readTimeMinutes: integer("read_time_minutes"),
  keywordCount: integer("keyword_count"),
  imageCount: integer("image_count"),
  internalLinkCount: integer("internal_link_count"),
  externalLinkCount: integer("external_link_count"),
  articleScore: integer("article_score"), // SEO score 0-100

  // Custom fields for extensibility
  customFields: json("custom_fields").$type<Record<string, unknown>>(),

  // Scheduling
  plannedAt: timestamp("planned_at"), // Calendar date
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
