import { db, isDbConnected } from "@/database";
import { users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  githubHandle?: string;
  role: "student" | "admin";
  department?: string;
  batch?: string;
  createdAt?: string;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "usr-ashiq",
    email: "mdsiaofficial@github.com",
    name: "Md Shoriful Islam Ashiq",
    avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
    githubHandle: "mdsiaofficial",
    role: "admin",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 60 (Convenor)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-admin",
    email: "admin@ossccu.org",
    name: "Rifat Mahmud",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubHandle: "rifat-oss",
    role: "admin",
    department: "Dept. of Computer Science & Engineering",
    batch: "Executive Board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-contributor",
    email: "contributor@ossccu.org",
    name: "Tanvir Ahmed",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubHandle: "tanvir-dev",
    role: "student",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    createdAt: new Date().toISOString(),
  },
];

const memoryUsers: UserProfile[] = [...DEFAULT_USERS];

export const userService = {
  async getUsers(): Promise<UserProfile[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(users).orderBy(desc(users.createdAt));
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: r.id,
            email: r.email,
            name: r.name,
            avatarUrl: r.avatarUrl || undefined,
            githubHandle: r.githubHandle || undefined,
            role: (r.role === "admin" ? "admin" : "student") as "student" | "admin",
            department: r.department || undefined,
            batch: r.batch || undefined,
            createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
          }));
        }
      } catch (err) {
        console.warn("Drizzle getUsers failed, using memory:", err);
      }
    }
    return [...memoryUsers];
  },

  async syncUser(data: {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    github_handle?: string;
    role?: "student" | "admin";
    department?: string;
    batch?: string;
  }): Promise<UserProfile> {
    const role = data.role || (data.email.includes("admin") || data.email.endsWith("@ossccu.org") ? "admin" : "student");
    const userObj: UserProfile = {
      id: data.id,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.email}`,
      githubHandle: data.github_handle,
      role,
      department: data.department || "Dept. of Computer Science & Engineering",
      batch: data.batch || "City University Student",
      createdAt: new Date().toISOString(),
    };

    if (isDbConnected && db) {
      try {
        await db
          .insert(users)
          .values({
            id: userObj.id,
            email: userObj.email,
            name: userObj.name,
            avatarUrl: userObj.avatarUrl || null,
            githubHandle: userObj.githubHandle || null,
            role: userObj.role,
            department: userObj.department || null,
            batch: userObj.batch || null,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              email: userObj.email,
              name: userObj.name,
              avatarUrl: userObj.avatarUrl || null,
              githubHandle: userObj.githubHandle || null,
            },
          });
      } catch (err) {
        console.warn("Drizzle syncUser failed, updating in-memory:", err);
      }
    }

    const idx = memoryUsers.findIndex((u) => u.id === userObj.id || u.email === userObj.email);
    if (idx >= 0) {
      memoryUsers[idx] = { ...memoryUsers[idx], ...userObj };
    } else {
      memoryUsers.unshift(userObj);
    }

    return userObj;
  },

  async toggleRole(userId: string, newRole: "student" | "admin"): Promise<boolean> {
    if (isDbConnected && db) {
      try {
        await db
          .update(users)
          .set({ role: newRole })
          .where(eq(users.id, userId));
      } catch (err) {
        console.warn("Drizzle toggleRole failed:", err);
      }
    }

    const target = memoryUsers.find((u) => u.id === userId);
    if (target) {
      target.role = newRole;
      return true;
    }
    return true;
  },
};
