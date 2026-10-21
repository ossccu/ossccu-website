import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  githubHandle: text("github_handle"),
  role: text("role").default("student").notNull(), // 'student' | 'admin'
  department: text("department"),
  batch: text("batch"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type DbUser = typeof users.$inferSelect;
export type DbNewUser = typeof users.$inferInsert;
