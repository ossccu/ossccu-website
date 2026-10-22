import { db, isDbConnected } from "@/database";
import { users } from "@/database/schema";
import { eq, desc, or } from "drizzle-orm";
import { ExecutiveRole } from "@/frontend/types/auth";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  studentId?: string;
  avatarUrl?: string;
  githubHandle?: string;
  gitlabHandle?: string;
  role: "member" | "admin";
  executiveRole?: ExecutiveRole;
  department?: string;
  batch?: string;
  linkedinUrl?: string;
  codeforcesHandle?: string;
  leetcodeHandle?: string;
  hackerrankHandle?: string;
  codechefHandle?: string;
  portfolioUrl?: string;
  pinnedProjectIds?: string[];
  bookmarkedProjectIds?: string[];
  createdAt?: string;
}

const DEFAULT_USERS: UserProfile[] = [
  {
    id: "usr-ashiq",
    email: "mdsiaofficial@github.com",
    name: "Md Shoriful Islam Ashiq",
    studentId: "2021-1-60-001",
    avatarUrl: "https://avatars.githubusercontent.com/u/22385106?v=4",
    githubHandle: "mdsiaofficial",
    role: "admin",
    executiveRole: "Convenor",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 60",
    linkedinUrl: "https://linkedin.com/in/mdsiaofficial",
    codeforcesHandle: "mdsiaofficial",
    portfolioUrl: "https://github.com/mdsiaofficial",
    pinnedProjectIds: ["proj-ashiq-1", "proj-ashiq-2"],
    bookmarkedProjectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-anik",
    email: "anik@ossccu.org",
    name: "Md. Anisur Rahman Anik",
    studentId: "2021-2-61-002",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    githubHandle: "anik-oss",
    role: "admin",
    executiveRole: "Joint Convenor",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 61",
    pinnedProjectIds: [],
    bookmarkedProjectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-tahsin",
    email: "tahsin@ossccu.org",
    name: "MD. Tahsin Ferdous",
    studentId: "2021-2-61-003",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    githubHandle: "tahsin-ferdous",
    role: "admin",
    executiveRole: "Member Secretary",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 61",
    pinnedProjectIds: [],
    bookmarkedProjectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-admin",
    email: "admin@ossccu.org",
    name: "Rifat Mahmud",
    studentId: "2020-1-56-010",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubHandle: "rifat-oss",
    role: "admin",
    executiveRole: "Assistant Organizing Secretary",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 56",
    pinnedProjectIds: [],
    bookmarkedProjectIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-contributor",
    email: "contributor@ossccu.org",
    name: "Tanvir Ahmed",
    studentId: "2019-3-54-042",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubHandle: "tanvir-dev",
    role: "member",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    pinnedProjectIds: ["proj-1"],
    bookmarkedProjectIds: [],
    createdAt: new Date().toISOString(),
  },
];

const memoryUsers: UserProfile[] = [...DEFAULT_USERS];

function mapDbRowToUserProfile(r: typeof users.$inferSelect): UserProfile {
  return {
    id: r.id,
    email: r.email,
    name: r.name,
    studentId: r.studentId || undefined,
    avatarUrl: r.avatarUrl || undefined,
    githubHandle: r.githubHandle || undefined,
    gitlabHandle: r.gitlabHandle || undefined,
    role: (r.role === "admin" ? "admin" : "member") as "member" | "admin",
    executiveRole: (r.executiveRole || null) as ExecutiveRole,
    department: r.department || undefined,
    batch: r.batch || undefined,
    linkedinUrl: r.linkedinUrl || undefined,
    codeforcesHandle: r.codeforcesHandle || undefined,
    leetcodeHandle: r.leetcodeHandle || undefined,
    hackerrankHandle: r.hackerrankHandle || undefined,
    codechefHandle: r.codechefHandle || undefined,
    portfolioUrl: r.portfolioUrl || undefined,
    pinnedProjectIds: (r.pinnedProjectIds as string[]) || [],
    bookmarkedProjectIds: (r.bookmarkedProjectIds as string[]) || [],
    createdAt: r.createdAt ? r.createdAt.toISOString() : undefined,
  };
}

export const userService = {
  async getUsers(): Promise<UserProfile[]> {
    if (isDbConnected && db) {
      try {
        const rows = await db.select().from(users).orderBy(desc(users.createdAt));
        if (rows.length > 0) {
          return rows.map(mapDbRowToUserProfile);
        }
      } catch (err) {
        console.warn("Drizzle getUsers failed, using memory:", err);
      }
    }
    return [...memoryUsers];
  },

  async getUserById(id: string): Promise<UserProfile | null> {
    if (isDbConnected && db) {
      try {
        const [row] = await db.select().from(users).where(eq(users.id, id));
        if (row) return mapDbRowToUserProfile(row);
      } catch (err) {
        console.warn("Drizzle getUserById failed:", err);
      }
    }
    const found = memoryUsers.find((u) => u.id === id);
    return found || null;
  },

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const clean = email.toLowerCase().trim();
    if (isDbConnected && db) {
      try {
        const [row] = await db.select().from(users).where(eq(users.email, clean));
        if (row) return mapDbRowToUserProfile(row);
      } catch (err) {
        console.warn("Drizzle getUserByEmail failed:", err);
      }
    }
    const found = memoryUsers.find((u) => u.email.toLowerCase() === clean);
    return found || null;
  },

  async getUserByUsername(username: string): Promise<UserProfile | null> {
    const clean = username.toLowerCase().trim().replace(/^@/, "");

    if (isDbConnected && db) {
      try {
        const rows = await db
          .select()
          .from(users)
          .where(
            or(
              eq(users.githubHandle, clean),
              eq(users.gitlabHandle, clean),
              eq(users.id, clean)
            )
          );
        if (rows.length > 0) {
          return mapDbRowToUserProfile(rows[0]);
        }
      } catch (err) {
        console.warn("Drizzle getUserByUsername failed:", err);
      }
    }

    const found = memoryUsers.find((u) => {
      if (u.githubHandle?.toLowerCase() === clean) return true;
      if (u.gitlabHandle?.toLowerCase() === clean) return true;
      if (u.id.toLowerCase() === clean) return true;
      if (u.name.toLowerCase().replace(/\s+/g, "-") === clean) return true;
      return false;
    });

    return found || null;
  },

  async syncUser(data: {
    id: string;
    email: string;
    name: string;
    student_id?: string;
    avatar_url?: string;
    github_handle?: string;
    gitlab_handle?: string;
    role?: "member" | "admin";
    executive_role?: ExecutiveRole;
    department?: string;
    batch?: string;
  }): Promise<UserProfile> {
    const role =
      data.role ||
      (data.email.includes("admin") || data.email.endsWith("@ossccu.org") ? "admin" : "member");

    const userObj: UserProfile = {
      id: data.id,
      email: data.email,
      name: data.name,
      studentId: data.student_id,
      avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${data.email}`,
      githubHandle: data.github_handle,
      gitlabHandle: data.gitlab_handle,
      role,
      executiveRole: data.executive_role,
      department: data.department || "Dept. of Computer Science & Engineering",
      batch: data.batch || "City University Student",
      pinnedProjectIds: [],
      bookmarkedProjectIds: [],
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
            studentId: userObj.studentId || null,
            avatarUrl: userObj.avatarUrl || null,
            githubHandle: userObj.githubHandle || null,
            gitlabHandle: userObj.gitlabHandle || null,
            role: userObj.role,
            executiveRole: userObj.executiveRole || null,
            department: userObj.department || null,
            batch: userObj.batch || null,
          })
          .onConflictDoUpdate({
            target: users.id,
            set: {
              email: userObj.email,
              avatarUrl: userObj.avatarUrl || null,
              githubHandle: userObj.githubHandle || null,
              gitlabHandle: userObj.gitlabHandle || null,
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

  async updateUser(userId: string, data: Partial<UserProfile>): Promise<UserProfile | null> {
    if (isDbConnected && db) {
      try {
        const updatePayload: any = {};
        if (data.avatarUrl !== undefined) updatePayload.avatarUrl = data.avatarUrl;
        if (data.githubHandle !== undefined) updatePayload.githubHandle = data.githubHandle;
        if (data.gitlabHandle !== undefined) updatePayload.gitlabHandle = data.gitlabHandle;
        if (data.linkedinUrl !== undefined) updatePayload.linkedinUrl = data.linkedinUrl;
        if (data.codeforcesHandle !== undefined) updatePayload.codeforcesHandle = data.codeforcesHandle;
        if (data.leetcodeHandle !== undefined) updatePayload.leetcodeHandle = data.leetcodeHandle;
        if (data.hackerrankHandle !== undefined) updatePayload.hackerrankHandle = data.hackerrankHandle;
        if (data.codechefHandle !== undefined) updatePayload.codechefHandle = data.codechefHandle;
        if (data.portfolioUrl !== undefined) updatePayload.portfolioUrl = data.portfolioUrl;
        if (data.pinnedProjectIds !== undefined) updatePayload.pinnedProjectIds = data.pinnedProjectIds;
        if (data.bookmarkedProjectIds !== undefined) updatePayload.bookmarkedProjectIds = data.bookmarkedProjectIds;

        // Admin-only updates
        if (data.role !== undefined) updatePayload.role = data.role;
        if (data.executiveRole !== undefined) updatePayload.executiveRole = data.executiveRole;
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.studentId !== undefined) updatePayload.studentId = data.studentId;
        if (data.department !== undefined) updatePayload.department = data.department;
        if (data.batch !== undefined) updatePayload.batch = data.batch;

        await db.update(users).set(updatePayload).where(eq(users.id, userId));
      } catch (err) {
        console.warn("Drizzle updateUser failed:", err);
      }
    }

    const target = memoryUsers.find((u) => u.id === userId);
    if (target) {
      Object.assign(target, data);
      return target;
    }
    return null;
  },

  async toggleRole(userId: string, newRole: "member" | "admin"): Promise<boolean> {
    return !!(await this.updateUser(userId, { role: newRole }));
  },

  async setExecutiveRole(userId: string, executiveRole: ExecutiveRole): Promise<boolean> {
    return !!(await this.updateUser(userId, { executiveRole }));
  },
};
