import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { projects, events, users } from "./schema";

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

const SEED_PROJECTS = [
  {
    title: "Study Companion",
    description:
      "A collaborative peer-learning platform built for university students to share curated open-source study guides, track semester roadmaps, and organize study squads.",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    authorName: "Tanvir Ahmed",
    authorRole: "Lead Frontend Contributor",
    authorAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    authorGithub: "tanvir-dev",
    githubUrl: "https://github.com/ossccu/study-companion",
    demoUrl: "https://study.ossccu.org",
    featured: true,
    status: "approved",
    userEmail: "contributor@ossccu.org",
  },
  {
    title: "Code Collab IDE",
    description:
      "Ultra-low latency web-based collaborative code editor powering live pair-programming sessions and instant code-sharing for coding hackathons.",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["TypeScript", "WebSocket", "React", "Monaco Editor"],
    authorName: "Nusrat Jahan",
    authorRole: "Full-Stack Maintainer",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    authorGithub: "nusrat-jahan",
    githubUrl: "https://github.com/ossccu/code-collab",
    demoUrl: "https://collab.ossccu.org",
    featured: true,
    status: "approved",
    userEmail: "contributor@ossccu.org",
  },
  {
    title: "OSS Impact Dashboard",
    description:
      "Real-time analytics engine and visual dashboard tracking City University students' Git commits, pull requests, and community milestones across open-source orgs.",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "AI/ML",
    tags: ["Python", "Django", "D3.js", "GitHub GraphQL"],
    authorName: "Rifat Mahmud",
    authorRole: "Core Club Organizer",
    authorAvatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    authorGithub: "rifat-oss",
    githubUrl: "https://github.com/ossccu/oss-dashboard",
    demoUrl: "https://dashboard.ossccu.org",
    featured: true,
    status: "approved",
    userEmail: "admin@ossccu.org",
  },
  {
    title: "Campus IoT Node & Lab Sensor",
    description:
      "ESP32 and Raspberry Pi environmental monitor deployed across campus labs to measure ambient temperature, lab occupancy, and air quality telemetry in real-time.",
    coverImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "IoT/Robotics",
    tags: ["IoT", "C++", "ESP32", "MQTT", "Python"],
    authorName: "Shahriar Hasan",
    authorRole: "Hardware & IoT Lead",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    authorGithub: "shahriar-iot",
    githubUrl: "https://github.com/ossccu/campus-iot-sensor",
    demoUrl: "",
    featured: false,
    status: "approved",
  },
  {
    title: "Community Discord & Telegram Bot",
    description:
      "Modular Discord & Telegram automation bot managing weekly challenge rollouts, hackathon registrations, role assignments, and open-source issue alerts.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["Python", "Discord.py", "PostgreSQL", "Docker"],
    authorName: "Fatima Noor",
    authorRole: "Backend Contributor",
    authorAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    authorGithub: "fatima-noor",
    githubUrl: "https://github.com/ossccu/community-bot",
    demoUrl: "",
    featured: false,
    status: "approved",
  },
  {
    title: "Open Resource Learning Hub",
    description:
      "Interactive knowledge base and syllabus companion with curated guides, setup checklists, and tutorials tailored for first-time open-source contributors.",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["Next.js", "Markdown", "TailwindCSS", "Algolia"],
    authorName: "Sabbir Hossain",
    authorRole: "Documentation Advocate",
    authorAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    authorGithub: "sabbir-docs",
    githubUrl: "https://github.com/ossccu/learning-hub",
    demoUrl: "https://learn.ossccu.org",
    featured: false,
    status: "approved",
  },
];

const SEED_EVENTS = [
  {
    title: "OSSCCU Minihack 2026: Code & Create",
    description:
      "Join us for an exciting 48-hour minihackathon where open-source enthusiasts collaborate to build impactful community projects, win prizes, and showcase to tech mentors.",
    date: "March 15, 2026",
    time: "10:00 AM - 6:00 PM",
    venue: "Main Auditorium, City University Campus",
    type: "hackathon",
    status: "upcoming",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Git & GitHub Open Source Bootcamp",
    description:
      "Hands-on masterclass covering professional Git workflows, branching strategies, writing clean pull requests, and setting up automated CI/CD GitHub Actions.",
    date: "February 24, 2026",
    time: "2:00 PM - 5:00 PM",
    venue: "Computer Lab 3, CSE Department",
    type: "workshop",
    status: "upcoming",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Spring Open-Source Kickoff & Tech Meetup",
    description:
      "Meet the OSSCCU core maintainers, learn about our active project roadmaps, and find your first 'good first issue' to jumpstart your open-source journey.",
    date: "January 20, 2026",
    time: "3:00 PM - 5:30 PM",
    venue: "Seminar Room 402",
    type: "meetup",
    status: "past",
    registrationUrl: "#contact",
    bannerImage:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
  },
];

const SEED_USERS = [
  {
    id: "usr-demo-admin",
    email: "admin@ossccu.org",
    name: "Rifat Mahmud",
    avatarUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubHandle: "rifat-oss",
    role: "admin",
    department: "Computer Science & Engineering",
    batch: "Executive Board",
  },
  {
    id: "usr-demo-contributor",
    email: "contributor@ossccu.org",
    name: "Tanvir Ahmed",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubHandle: "tanvir-dev",
    role: "student",
    department: "Computer Science & Engineering",
    batch: "Batch 54",
  },
];

async function seed() {
  console.log("🌱 OSSCCU Database Seeder starting...");

  if (!connectionString || !connectionString.startsWith("postgres")) {
    console.log(
      "ℹ️ No PostgreSQL connection string found in DATABASE_URL or POSTGRES_URL."
    );
    console.log(
      "   Platform is operating in standalone / offline mode using memory & localStorage fallback."
    );
    console.log("   Default projects and events are ready to run!");
    return;
  }

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  try {
    console.log("📡 Connected to PostgreSQL database. Seeding data...");

    // Seed users
    for (const u of SEED_USERS) {
      await db.insert(users).values(u).onConflictDoNothing();
    }
    console.log(`✅ Seeded ${SEED_USERS.length} core community users`);

    // Seed projects
    for (const p of SEED_PROJECTS) {
      await db.insert(projects).values(p);
    }
    console.log(`✅ Seeded ${SEED_PROJECTS.length} approved OSSCCU projects`);

    // Seed events
    for (const e of SEED_EVENTS) {
      await db.insert(events).values(e);
    }
    console.log(`✅ Seeded ${SEED_EVENTS.length} community events`);

    console.log("🚀 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error while seeding database:", error);
  } finally {
    await client.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
