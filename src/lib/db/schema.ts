import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
} from "drizzle-orm/pg-core";

// Test table for database connection verification
export const testSubmissions = pgTable("test_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Main table for "Let's Work Together" form submissions
export const userSubmissions = pgTable("user_submissions", {
  id: serial("id").primaryKey(),
  userType: varchar("user_type", { length: 20 }).notNull(), // 'developer', 'investor', 'entrepreneur'
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message"),

  // Journey tracking - store responses as JSON
  stepResponses: jsonb("step_responses"), // All 5 steps stored as JSON object

  // Metadata
  submissionType: varchar("submission_type", { length: 20 }).notNull(), // 'form' or 'appointment'
  status: varchar("status", { length: 20 }).default("new").notNull(), // 'new', 'contacted', 'converted', 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript
export type TestSubmission = typeof testSubmissions.$inferSelect;
export type NewTestSubmission = typeof testSubmissions.$inferInsert;

export type UserSubmission = typeof userSubmissions.$inferSelect;
export type NewUserSubmission = typeof userSubmissions.$inferInsert;
