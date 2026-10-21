import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  githubUrl: text("github_url").notNull(),
  demoUrl: text("demo_url"),
  coverImage: text("cover_image"),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  authorGithub: text("author_github"),
  authorAvatar: text("author_avatar"),
  featured: boolean("featured").default(false),
  status: text("status").default("pending").notNull(), // 'approved' | 'pending' | 'rejected'
  userId: text("user_id"),
  userEmail: text("user_email"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export type DbProject = typeof projects.$inferSelect;
export type DbNewProject = typeof projects.$inferInsert;
