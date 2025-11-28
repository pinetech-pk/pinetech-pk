import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
  uuid,
  boolean,
  date,
  integer,
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

// Secure Chat Rooms - Only metadata stored, NO messages
export const chatRooms = pgTable("chat_rooms", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  adminNote: text("admin_note"), // Persistent note from admin (always visible)
  clientNote: text("client_note"), // Persistent note from client (always visible)
  accessKey: uuid("access_key").defaultRandom().notNull(), // Client uses this to access
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Consultation Bookings - For scheduling calls with clients
export const consultationBookings = pgTable("consultation_bookings", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id"), // Optional link to user_submissions
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  bookingDate: date("booking_date").notNull(), // The date of the consultation
  timeSlot: varchar("time_slot", { length: 20 }).notNull(), // 'morning' or 'evening'
  callType: varchar("call_type", { length: 20 }).notNull(), // 'voice' or 'video'
  preferredTool: varchar("preferred_tool", { length: 20 }).notNull(), // 'phone', 'whatsapp', 'zoom'
  status: varchar("status", { length: 20 }).default("pending").notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  notes: text("notes"), // Additional notes from client
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types for TypeScript
export type TestSubmission = typeof testSubmissions.$inferSelect;
export type NewTestSubmission = typeof testSubmissions.$inferInsert;

export type UserSubmission = typeof userSubmissions.$inferSelect;
export type NewUserSubmission = typeof userSubmissions.$inferInsert;

export type ChatRoom = typeof chatRooms.$inferSelect;
export type NewChatRoom = typeof chatRooms.$inferInsert;

export type ConsultationBooking = typeof consultationBookings.$inferSelect;
export type NewConsultationBooking = typeof consultationBookings.$inferInsert;
