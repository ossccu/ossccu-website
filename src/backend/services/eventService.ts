import { CommunityEvent, CommunityEventInput } from "@/frontend/types/event";
import { db, isDbConnected } from "@/database";
import { events } from "@/database/schema";
import { desc } from "drizzle-orm";

export const DEFAULT_EVENTS: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "OSSCCU Minihack 2025: Code & Create",
    description:
      "Join us for an exciting 48-hour minihackathon where open-source enthusiasts collaborate to build impactful community projects, win prizes, and showcase to tech mentors.",
    date: "March 15, 2025",
    time: "10:00 AM - 6:00 PM",
    venue: "Main Auditorium, City University Campus",
    type: "hackathon",
    status: "upcoming",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "evt-2",
    title: "Spring Semester Open-Source Kickoff",
    description:
      "Meet the OSSCCU core maintainers, learn about our active project roadmaps, and find your first 'good first issue' to jumpstart your open-source journey.",
    date: "January 20, 2025",
    time: "3:00 PM - 5:30 PM",
    venue: "CSE Seminar Room 402",
    type: "meetup",
    status: "upcoming",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-05T10:00:00.000Z",
  },
  {
    id: "evt-3",
    title: "Git & Open-Source Mastery Workshop",
    description:
      "Hands-on masterclass covering professional Git workflows, branching strategies, writing clean pull requests, and setting up automated CI/CD GitHub Actions.",
    date: "February 24, 2025",
    time: "2:00 PM - 4:30 PM",
    venue: "Computer Lab 3",
    type: "workshop",
    status: "upcoming",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2025-01-15T10:00:00.000Z",
  },
];

const STORAGE_KEY = "ossccu_community_events_v1";
let memoryEvents: CommunityEvent[] | null = null;

function loadEventsFromStorage(): CommunityEvent[] {
  if (typeof window === "undefined") {
    return DEFAULT_EVENTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EVENTS));
      return DEFAULT_EVENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_EVENTS;
  } catch {
    return DEFAULT_EVENTS;
  }
}

function saveEventsToStorage(items: CommunityEvent[]) {
  memoryEvents = items;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignored
    }
  }
}

export const eventService = {
  async getEvents(): Promise<CommunityEvent[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(events).orderBy(desc(events.createdAt));
        if (rows && rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            date: r.date,
            time: r.time || undefined,
            venue: r.venue || undefined,
            type: r.type as CommunityEvent["type"],
            status: r.status as CommunityEvent["status"],
            registrationUrl: r.registrationUrl || undefined,
            bannerImage: r.bannerImage || undefined,
            createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn("Drizzle event query failed, falling back to local store:", err);
      }
    }

    if (!memoryEvents) {
      memoryEvents = loadEventsFromStorage();
    }
    return [...memoryEvents];
  },

  async getUpcomingEvents(): Promise<CommunityEvent[]> {
    const all = await this.getEvents();
    return all.filter((e) => e.status === "upcoming" || e.status === "ongoing");
  },

  async createEvent(input: CommunityEventInput): Promise<CommunityEvent> {
    const now = new Date().toISOString();
    const newEvent: CommunityEvent = {
      ...input,
      id: `evt-${Date.now().toString(36)}`,
      createdAt: now,
    };

    if (isDbConnected && db) {
      try {
        const [inserted] = await db
          .insert(events)
          .values({
            title: input.title,
            description: input.description,
            date: input.date,
            time: input.time || null,
            venue: input.venue || null,
            type: input.type,
            status: input.status,
            registrationUrl: input.registrationUrl || null,
            bannerImage: input.bannerImage || null,
          })
          .returning();

        if (inserted) {
          return {
            id: inserted.id,
            title: inserted.title,
            description: inserted.description,
            date: inserted.date,
            time: inserted.time || undefined,
            venue: inserted.venue || undefined,
            type: inserted.type as CommunityEvent["type"],
            status: inserted.status as CommunityEvent["status"],
            registrationUrl: inserted.registrationUrl || undefined,
            bannerImage: inserted.bannerImage || undefined,
            createdAt: inserted.createdAt?.toISOString(),
          };
        }
      } catch (err) {
        console.warn("Drizzle event insert failed, saving locally:", err);
      }
    }

    const current = await this.getEvents();
    saveEventsToStorage([newEvent, ...current]);
    return newEvent;
  },
};
