import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  venue: text("venue"),
  type: text("type").notNull(), // 'hackathon' | 'workshop' | 'seminar' | 'meetup'
  status: text("status").default("upcoming").notNull(), // 'upcoming' | 'ongoing' | 'past'
  registrationUrl: text("registration_url"),
  bannerImage: text("banner_image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type DbEvent = typeof events.$inferSelect;
export type DbNewEvent = typeof events.$inferInsert;
