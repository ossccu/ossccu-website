import { Project, ProjectInput } from "@/frontend/types/project";
import { db, isDbConnected } from "@/database";
import { projects } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

const STORAGE_KEY = "ossccu_community_projects_v3";
const LEGACY_STORAGE_KEY = "ossccu_community_projects_v2";

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-ashiq-1",
    title: "nmclean (Node Modules Cleaner)",
    description:
      "A fast and lightweight CLI tool built in C and Node.js to recursively find and delete bloated node_modules directories across project repositories to recover disk space.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["Node.js", "CLI", "C", "NPM", "DevTools"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Software Engineer & Maintainer",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/nmclean",
    demoUrl: "https://www.npmjs.com/package/nmclean",
    featured: true,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-01-10T10:00:00.000Z",
    createdAt: "2025-01-10T10:00:00.000Z",
  },
  {
    id: "proj-ashiq-2",
    title: "folderly (CLI File Organizer)",
    description:
      "A fast and intuitive Command Line Interface (CLI) file organizer that automatically sorts and categorizes files into clean directory hierarchies by file extension and date.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["C", "CLI", "File System", "Automation", "NPM"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Software Engineer & Maintainer",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/folderly",
    demoUrl: "https://www.npmjs.com/package/folderly",
    featured: true,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-01-12T11:00:00.000Z",
    createdAt: "2025-01-12T11:00:00.000Z",
  },
  {
    id: "proj-ashiq-3",
    title: "ats-resume (ATS Resume Generator)",
    description:
      "A developer CLI tool designed to parse structured JSON resume configurations and compile clean, ATS-optimized (Applicant Tracking System) PDF resumes.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["JavaScript", "PDF", "Resume", "CLI", "ATS", "JSON"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Software Engineer & Maintainer",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/ats-resume",
    demoUrl: "https://www.npmjs.com/package/ats-resume",
    featured: true,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-01-15T12:00:00.000Z",
    createdAt: "2025-01-15T12:00:00.000Z",
  },
  {
    id: "proj-ashiq-4",
    title: "bKash Payment Gateway for Next.js",
    description:
      "Complete merchant payment integration toolkit and webhook handler for Next.js App Router applications, facilitating seamless bKash tokenized checkout.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["Next.js", "bKash", "Payment Gateway", "FinTech", "TypeScript"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Software Engineer & Maintainer",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/bKash-with-nextjs",
    demoUrl: "https://github.com/mdsiaofficial/bKash-with-nextjs",
    featured: true,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-01-20T14:30:00.000Z",
    createdAt: "2025-01-20T14:30:00.000Z",
  },
  {
    id: "proj-ashiq-5",
    title: "ICPC Bangladesh Competitive Archive",
    description:
      "Curated repository of competitive programming problem solutions, algorithmic templates, and editorial discussions for ICPC Bangladesh regional contests.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["C++", "Algorithms", "ICPC", "Competitive Programming", "Data Structures"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Competitive Programmer",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/icpc-bangladesh",
    demoUrl: "https://codeforces.com/blog/entry/111795",
    featured: false,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-01-25T16:00:00.000Z",
    createdAt: "2025-01-25T16:00:00.000Z",
  },
  {
    id: "proj-ashiq-6",
    title: "Open Source Software Guides",
    description:
      "A comprehensive open-source playbook detailing contribution guidelines, repo governance, licensing best practices, and effective pull request workflows.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["Open Source", "Documentation", "Git", "Community", "Guides"],
    author: {
      name: "Md Shoriful Islam Ashiq",
      role: "Open Source Contributor",
      avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
      githubUsername: "mdsiaofficial",
    },
    githubUrl: "https://github.com/mdsiaofficial/open-source-software-guides",
    demoUrl: "https://github.com/mdsiaofficial/open-source-software-guides",
    featured: false,
    status: "approved",
    userId: "usr-ashiq",
    userEmail: "mdsiaofficial@github.com",
    submittedAt: "2025-02-01T09:00:00.000Z",
    createdAt: "2025-02-01T09:00:00.000Z",
  },
  {
    id: "proj-1",
    title: "Study Companion",
    description:
      "A collaborative peer-learning platform built for university students to share curated open-source study guides, track semester roadmaps, and organize study squads.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["React", "Node.js", "MongoDB", "TailwindCSS"],
    author: {
      name: "Tanvir Ahmed",
      role: "Lead Frontend Contributor",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      githubUsername: "tanvir-dev",
    },
    githubUrl: "https://github.com/ossccu/study-companion",
    demoUrl: "https://study.ossccu.org",
    featured: true,
    status: "approved",
    userId: "usr-demo-contributor",
    userEmail: "contributor@ossccu.org",
    submittedAt: "2025-01-15T10:00:00.000Z",
    createdAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "proj-2",
    title: "Code Collab IDE",
    description:
      "Ultra-low latency web-based collaborative code editor powering live pair-programming sessions and instant code-sharing for coding hackathons.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["TypeScript", "WebSocket", "React", "Monaco Editor"],
    author: {
      name: "Nusrat Jahan",
      role: "Full-Stack Maintainer",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      githubUsername: "nusrat-jahan",
    },
    githubUrl: "https://github.com/ossccu/code-collab",
    demoUrl: "https://collab.ossccu.org",
    featured: true,
    status: "approved",
    userId: "usr-demo-contributor",
    userEmail: "contributor@ossccu.org",
    submittedAt: "2025-02-01T12:30:00.000Z",
    createdAt: "2025-02-01T12:30:00.000Z",
  },
  {
    id: "proj-3",
    title: "OSS Impact Dashboard",
    description:
      "Real-time analytics engine and visual dashboard tracking City University students' Git commits, pull requests, and community milestones across open-source orgs.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    category: "AI/ML",
    tags: ["Python", "Django", "D3.js", "GitHub GraphQL"],
    author: {
      name: "Rifat Mahmud",
      role: "Core Club Organizer",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      githubUsername: "rifat-oss",
    },
    githubUrl: "https://github.com/ossccu/oss-dashboard",
    demoUrl: "https://dashboard.ossccu.org",
    featured: true,
    status: "approved",
    userId: "usr-demo-admin",
    userEmail: "admin@ossccu.org",
    submittedAt: "2025-02-18T14:15:00.000Z",
    createdAt: "2025-02-18T14:15:00.000Z",
  },
  {
    id: "proj-4",
    title: "Campus IoT Node & Lab Sensor",
    description:
      "ESP32 and Raspberry Pi environmental monitor deployed across campus labs to measure ambient temperature, lab occupancy, and air quality telemetry in real-time.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    category: "IoT/Robotics",
    tags: ["IoT", "C++", "ESP32", "MQTT", "Python"],
    author: {
      name: "Shahriar Hasan",
      role: "Hardware & IoT Lead",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      githubUsername: "shahriar-iot",
    },
    githubUrl: "https://github.com/ossccu/campus-iot-sensor",
    demoUrl: "",
    featured: false,
    status: "approved",
    submittedAt: "2025-03-02T09:00:00.000Z",
    createdAt: "2025-03-02T09:00:00.000Z",
  },
  {
    id: "proj-5",
    title: "Community Discord & Telegram Bot",
    description:
      "Modular Discord & Telegram automation bot managing weekly challenge rollouts, hackathon registrations, role assignments, and open-source issue alerts.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    category: "Tools",
    tags: ["Python", "Discord.py", "PostgreSQL", "Docker"],
    author: {
      name: "Fatima Noor",
      role: "Backend Contributor",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      githubUsername: "fatima-noor",
    },
    githubUrl: "https://github.com/ossccu/community-bot",
    demoUrl: "",
    featured: false,
    status: "approved",
    submittedAt: "2025-03-05T16:20:00.000Z",
    createdAt: "2025-03-05T16:20:00.000Z",
  },
  {
    id: "proj-6",
    title: "Open Resource Learning Hub",
    description:
      "Interactive knowledge base and syllabus companion with curated guides, setup checklists, and tutorials tailored for first-time open-source contributors.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    category: "Web",
    tags: ["Next.js", "Markdown", "TailwindCSS", "Algolia"],
    author: {
      name: "Sabbir Hossain",
      role: "Documentation Advocate",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      githubUsername: "sabbir-docs",
    },
    githubUrl: "https://github.com/ossccu/learning-hub",
    demoUrl: "https://learn.ossccu.org",
    featured: false,
    status: "approved",
    submittedAt: "2025-03-10T11:45:00.000Z",
    createdAt: "2025-03-10T11:45:00.000Z",
  },
];

let memoryProjects: Project[] | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("Error in project service subscriber", e);
    }
  });
}

function mapDbRowToProject(row: typeof projects.$inferSelect): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category as Project["category"],
    tags: row.tags || [],
    githubUrl: row.githubUrl,
    demoUrl: row.demoUrl || undefined,
    thumbnailUrl: row.coverImage || "",
    author: {
      name: row.authorName,
      role: row.authorRole,
      githubUsername: row.authorGithub || undefined,
      avatarUrl: row.authorAvatar || undefined,
    },
    featured: Boolean(row.featured),
    status: (row.status || "approved") as Project["status"],
    userId: row.userId || undefined,
    userEmail: row.userEmail || undefined,
    submittedAt: row.submittedAt ? row.submittedAt.toISOString() : undefined,
    createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : undefined,
  };
}

function loadProjectsFromStorage(): Project[] {
  if (typeof window === "undefined") {
    return DEFAULT_PROJECTS;
  }

  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        raw = legacy;
      }
    }

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const normalized: Project[] = parsed.map((p) => ({
        ...p,
        status: p.status || "approved",
        submittedAt: p.submittedAt || p.createdAt || new Date().toISOString(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  } catch (err) {
    console.error("Failed to read projects from localStorage", err);
    return DEFAULT_PROJECTS;
  }
}

function saveProjectsToStorage(items: Project[]): void {
  memoryProjects = items;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("ossccu_projects_updated"));
    } catch (err) {
      console.error("Failed to save projects to localStorage", err);
    }
  }
  notifyListeners();
}

/**
 * Project Service Layer (Drizzle ORM with Local Cache Fallback)
 */
export const projectService = {
  /**
   * Fetch all projects (sorted by featured, then newest)
   */
  async getProjects(): Promise<Project[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
        if (rows && rows.length > 0) {
          return rows.map(mapDbRowToProject).sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
        }
      } catch (err) {
        console.warn("Drizzle project query failed, falling back to local memory:", err);
      }
    }

    if (memoryProjects === null) {
      memoryProjects = loadProjectsFromStorage();
    }

    return [...memoryProjects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  /**
   * Fetch only approved projects for public showcase using Drizzle where(eq)
   */
  async getApprovedProjects(): Promise<Project[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(projects)
          .where(eq(projects.status, "approved"))
          .orderBy(desc(projects.createdAt));

        if (rows && rows.length > 0) {
          return rows.map(mapDbRowToProject);
        }
      } catch (err) {
        console.warn("Drizzle approved query failed, using local fallback:", err);
      }
    }

    const all = await this.getProjects();
    return all.filter((p) => p.status === "approved");
  },

  /**
   * Get project by ID
   */
  async getProjectById(id: string): Promise<Project | null> {
    if (isDbConnected && db) {
      try {
        const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
        if (row) return mapDbRowToProject(row);
      } catch (err) {
        console.warn("Drizzle findById failed:", err);
      }
    }

    const projectsList = await this.getProjects();
    return projectsList.find((p) => p.id === id) || null;
  },

  /**
   * Fetch projects created by or associated with a specific user
   */
  async getUserProjects(userId?: string, userEmail?: string, githubUsername?: string): Promise<Project[]> {
    if (isDbConnected && db && userId) {
      try {
        const rows = await db
          .select()
          .from(projects)
          .where(eq(projects.userId, userId))
          .orderBy(desc(projects.createdAt));

        if (rows && rows.length > 0) {
          return rows.map(mapDbRowToProject);
        }
      } catch (err) {
        console.warn("Drizzle getUserProjects failed, using local fallback:", err);
      }
    }

    const all = await this.getProjects();
    if (!userId && !userEmail && !githubUsername) return [];

    return all.filter((p) => {
      if (userId && p.userId === userId) return true;
      if (userEmail && p.userEmail && p.userEmail.toLowerCase() === userEmail.toLowerCase()) return true;
      if (githubUsername && p.author.githubUsername && p.author.githubUsername.toLowerCase() === githubUsername.toLowerCase()) return true;
      return false;
    });
  },

  /**
   * Create a new project via Drizzle insert
   */
  async createProject(input: ProjectInput): Promise<Project> {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...input,
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      status: input.status || "pending",
      userId: input.userId,
      userEmail: input.userEmail,
      submittedAt: input.submittedAt || now,
      createdAt: now,
      updatedAt: now,
    };

    if (isDbConnected && db) {
      try {
        const [inserted] = await db
          .insert(projects)
          .values({
            title: input.title,
            description: input.description,
            category: input.category,
            tags: input.tags,
            githubUrl: input.githubUrl,
            demoUrl: input.demoUrl || null,
            coverImage: input.thumbnailUrl || null,
            authorName: input.author.name,
            authorRole: input.author.role,
            authorGithub: input.author.githubUsername || null,
            authorAvatar: input.author.avatarUrl || null,
            featured: Boolean(input.featured),
            status: input.status || "pending",
            userId: input.userId || null,
            userEmail: input.userEmail || null,
          })
          .returning();

        if (inserted) {
          notifyListeners();
          return mapDbRowToProject(inserted);
        }
      } catch (err) {
        console.warn("Drizzle insert failed, saving to local fallback:", err);
      }
    }

    const current = await this.getProjects();
    const updated = [newProject, ...current];
    saveProjectsToStorage(updated);
    return newProject;
  },

  /**
   * Update an existing project via Drizzle update
   */
  async updateProject(id: string, updates: Partial<ProjectInput>): Promise<Project> {
    if (isDbConnected && db) {
      try {
        const [updatedRow] = await db
          .update(projects)
          .set({
            ...(updates.title && { title: updates.title }),
            ...(updates.description && { description: updates.description }),
            ...(updates.category && { category: updates.category }),
            ...(updates.tags && { tags: updates.tags }),
            ...(updates.githubUrl && { githubUrl: updates.githubUrl }),
            ...(updates.demoUrl !== undefined && { demoUrl: updates.demoUrl || null }),
            ...(updates.thumbnailUrl && { coverImage: updates.thumbnailUrl }),
            ...(updates.author?.name && { authorName: updates.author.name }),
            ...(updates.author?.role && { authorRole: updates.author.role }),
            ...(updates.author?.githubUsername !== undefined && { authorGithub: updates.author.githubUsername || null }),
            ...(updates.author?.avatarUrl !== undefined && { authorAvatar: updates.author.avatarUrl || null }),
            ...(updates.featured !== undefined && { featured: updates.featured }),
            ...(updates.status && { status: updates.status }),
            ...(updates.userId !== undefined && { userId: updates.userId || null }),
            ...(updates.userEmail !== undefined && { userEmail: updates.userEmail || null }),
            updatedAt: new Date(),
          })
          .where(eq(projects.id, id))
          .returning();

        if (updatedRow) {
          notifyListeners();
          return mapDbRowToProject(updatedRow);
        }
      } catch (err) {
        console.warn("Drizzle update failed, updating local fallback:", err);
      }
    }

    const current = await this.getProjects();
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Project with ID ${id} not found.`);
    }

    const updatedProject: Project = {
      ...current[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...current];
    updatedList[index] = updatedProject;
    saveProjectsToStorage(updatedList);
    return updatedProject;
  },

  /**
   * Approve a pending submission
   */
  async approveProject(id: string): Promise<Project> {
    return this.updateProject(id, { status: "approved" });
  },

  /**
   * Reject a submission
   */
  async rejectProject(id: string): Promise<Project> {
    return this.updateProject(id, { status: "rejected" });
  },

  /**
   * Delete a project via Drizzle delete
   */
  async deleteProject(id: string): Promise<boolean> {
    if (isDbConnected && db) {
      try {
        await db.delete(projects).where(eq(projects.id, id));
        notifyListeners();
        return true;
      } catch (err) {
        console.warn("Drizzle delete failed, deleting from local fallback:", err);
      }
    }

    const current = await this.getProjects();
    const filtered = current.filter((p) => p.id !== id);
    if (filtered.length === current.length) {
      return false;
    }
    saveProjectsToStorage(filtered);
    return true;
  },

  /**
   * Reset store back to default OSSCCU projects
   */
  async resetToDefaultProjects(): Promise<Project[]> {
    saveProjectsToStorage(DEFAULT_PROJECTS);
    return [...DEFAULT_PROJECTS];
  },

  /**
   * Subscribe to project updates
   */
  subscribe(listener: () => void): () => void {
    listeners.add(listener);

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        memoryProjects = null;
        listener();
      }
    };

    const handleCustomEvent = () => {
      listener();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageEvent);
      window.addEventListener("ossccu_projects_updated", handleCustomEvent);
    }

    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageEvent);
        window.removeEventListener("ossccu_projects_updated", handleCustomEvent);
      }
    };
  },
};
