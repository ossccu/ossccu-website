import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  studentId: text("student_id"),
  batch: text("batch"),
  department: text("department"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("member").notNull(), // 'member' | 'admin'
  executiveRole: text("executive_role"), // 'Convenor' | 'Joint Convenor' | 'Member Secretary' | 'Joint Member Secretary' | 'Organizing Secretary' | 'Assistant Organizing Secretary' | null
  githubHandle: text("github_handle"),
  gitlabHandle: text("gitlab_handle"),
  linkedinUrl: text("linkedin_url"),
  codeforcesHandle: text("codeforces_handle"),
  leetcodeHandle: text("leetcode_handle"),
  hackerrankHandle: text("hackerrank_handle"),
  codechefHandle: text("codechef_handle"),
  portfolioUrl: text("portfolio_url"),
  pinnedProjectIds: text("pinned_project_ids").array().default([]),
  bookmarkedProjectIds: text("bookmarked_project_ids").array().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type DbUser = typeof users.$inferSelect;
export type DbNewUser = typeof users.$inferInsert;
