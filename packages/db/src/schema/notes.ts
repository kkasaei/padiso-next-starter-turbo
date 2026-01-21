import { pgTable, text, timestamp, uuid, pgEnum, integer } from "drizzle-orm/pg-core";
import { projects } from "./projects";
import { users } from "./users";

export const noteTypeEnum = pgEnum("note_type", [
  "general",
  "meeting",
  "audio",
]);

export const noteStatusEnum = pgEnum("note_status", [
  "completed",
  "processing",
]);

export const notes = pgTable("notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  content: text("content"),
  noteType: noteTypeEnum("note_type").notNull(),
  status: noteStatusEnum("status").notNull(),
  addedById: uuid("added_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addedDate: timestamp("added_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const audioNoteDataTable = pgTable("audio_note_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  noteId: uuid("note_id")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" })
    .unique(),
  duration: text("duration").notNull(),
  fileName: text("file_name").notNull(),
  aiSummary: text("ai_summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Alias for easier imports
export const audioNoteData = audioNoteDataTable;

export const audioNoteKeyPoints = pgTable("audio_note_key_points", {
  id: uuid("id").defaultRandom().primaryKey(),
  audioNoteId: uuid("audio_note_id")
    .notNull()
    .references(() => audioNoteDataTable.id, { onDelete: "cascade" }),
  keyPoint: text("key_point").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const audioNoteInsights = pgTable("audio_note_insights", {
  id: uuid("id").defaultRandom().primaryKey(),
  audioNoteId: uuid("audio_note_id")
    .notNull()
    .references(() => audioNoteDataTable.id, { onDelete: "cascade" }),
  insight: text("insight").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transcriptSegments = pgTable("transcript_segments", {
  id: uuid("id").defaultRandom().primaryKey(),
  audioNoteId: uuid("audio_note_id")
    .notNull()
    .references(() => audioNoteDataTable.id, { onDelete: "cascade" }),
  speaker: text("speaker").notNull(),
  timestamp: text("timestamp").notNull(),
  text: text("text").notNull(),
  segmentOrder: integer("segment_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type AudioNoteData = typeof audioNoteDataTable.$inferSelect;
export type NewAudioNoteData = typeof audioNoteDataTable.$inferInsert;
export type AudioNoteKeyPoint = typeof audioNoteKeyPoints.$inferSelect;
export type NewAudioNoteKeyPoint = typeof audioNoteKeyPoints.$inferInsert;
export type AudioNoteInsight = typeof audioNoteInsights.$inferSelect;
export type NewAudioNoteInsight = typeof audioNoteInsights.$inferInsert;
export type TranscriptSegment = typeof transcriptSegments.$inferSelect;
export type NewTranscriptSegment = typeof transcriptSegments.$inferInsert;
