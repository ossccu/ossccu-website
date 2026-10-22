"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthUser, AuthContextType } from "@/frontend/types/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

const LOCAL_STORAGE_AUTH_KEY = "ossccu_auth_user_v2";

const DEMO_USERS: Record<"contributor" | "admin", AuthUser> = {
  contributor: {
    id: "usr-demo-contributor",
    email: "contributor@ossccu.org",
    name: "Tanvir Ahmed",
    studentId: "2019-3-54-042",
    role: "member",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubUsername: "tanvir-dev",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 54",
    pinnedProjectIds: ["proj-1"],
    bookmarkedProjectIds: [],
    isAdmin: false,
  },
  admin: {
    id: "usr-demo-admin",
    email: "admin@ossccu.org",
    name: "Rifat Mahmud",
    studentId: "2020-1-56-010",
    role: "admin",
    executiveRole: "Assistant Organizing Secretary",
    avatarUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubUsername: "rifat-oss",
    department: "Dept. of Computer Science & Engineering",
    batch: "Batch 56",
    pinnedProjectIds: [],
    bookmarkedProjectIds: [],
    isAdmin: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapDbProfileToAuthUser(profile: any, fallbackUser?: Partial<AuthUser>): AuthUser {
  const isAdmin = profile.role === "admin" || fallbackUser?.email?.includes("admin") || fallbackUser?.email?.endsWith("@ossccu.org") || false;
  return {
    id: profile.id || fallbackUser?.id || `usr-${Date.now().toString(36)}`,
    email: profile.email || fallbackUser?.email || "",
    name: profile.name || fallbackUser?.name || "Member",
    studentId: profile.studentId || fallbackUser?.studentId,
    avatarUrl: profile.avatarUrl || fallbackUser?.avatarUrl,
    githubUsername: profile.githubHandle || fallbackUser?.githubUsername,
    gitlabUsername: profile.gitlabHandle || fallbackUser?.gitlabUsername,
    role: profile.role === "admin" ? "admin" : "member",
    executiveRole: profile.executiveRole || fallbackUser?.executiveRole || null,
    department: profile.department || fallbackUser?.department || "Dept. of Computer Science & Engineering",
    batch: profile.batch || fallbackUser?.batch || "City University Student",
    linkedinUrl: profile.linkedinUrl || fallbackUser?.linkedinUrl,
    codeforcesHandle: profile.codeforcesHandle || fallbackUser?.codeforcesHandle,
    leetcodeHandle: profile.leetcodeHandle || fallbackUser?.leetcodeHandle,
    hackerrankHandle: profile.hackerrankHandle || fallbackUser?.hackerrankHandle,
    codechefHandle: profile.codechefHandle || fallbackUser?.codechefHandle,
    portfolioUrl: profile.portfolioUrl || fallbackUser?.portfolioUrl,
    pinnedProjectIds: Array.isArray(profile.pinnedProjectIds) ? profile.pinnedProjectIds : fallbackUser?.pinnedProjectIds || [],
    bookmarkedProjectIds: Array.isArray(profile.bookmarkedProjectIds) ? profile.bookmarkedProjectIds : fallbackUser?.bookmarkedProjectIds || [],
    isAdmin,
  };
}

async function syncAndFetchDbProfile(id: string, email: string, meta?: any): Promise<AuthUser | null> {
  try {
    // 1. First sync to guarantee record exists
    if (meta) {
      await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          email,
          name: meta.full_name || meta.name || email.split("@")[0],
          avatar_url: meta.avatar_url || (meta.user_name ? `https://github.com/${meta.user_name}.png` : undefined),
          github_handle: meta.user_name || meta.preferred_username,
          gitlab_handle: meta.gitlab_username,
          role: email.includes("admin") || email.endsWith("@ossccu.org") ? "admin" : "member",
          department: meta.department || "Dept. of Computer Science & Engineering",
          batch: meta.batch || "City University Student",
        }),
      }).catch(() => null);
    }

    // 2. Fetch authoritative profile from /api/users/me
    const res = await fetch("/api/users/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email }),
    });

    if (res.ok) {
      const data = await res.json();
      return mapDbProfileToAuthUser(data, { id, email });
    }
  } catch (err) {
    console.warn("DB profile sync/fetch error:", err);
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveLocalUser = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (typeof window !== "undefined") {
      if (authUser) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      }
    }
  };

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const fresh = await syncAndFetchDbProfile(user.id, user.email);
      if (fresh) {
        saveLocalUser(fresh);
      }
    } catch (err) {
      console.warn("Failed to refresh profile:", err);
    }
  }, [user]);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured && supabase) {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session?.user && mounted) {
            const raw = session.user;
            const meta = raw.user_metadata || {};
            const email = raw.email || "";

            // Fetch latest DB profile
            const dbUser = await syncAndFetchDbProfile(raw.id, email, meta);
            if (dbUser && mounted) {
              saveLocalUser(dbUser);
              setIsLoading(false);
              return;
            }

            const fallback: AuthUser = {
              id: raw.id,
              email,
              name: meta.full_name || meta.name || email.split("@")[0],
              avatarUrl: meta.avatar_url || (meta.user_name ? `https://github.com/${meta.user_name}.png` : undefined),
              githubUsername: meta.user_name || meta.preferred_username,
              department: meta.department || "Dept. of Computer Science & Engineering",
              batch: meta.batch || "City University Student",
              role: (email.includes("admin") || email.endsWith("@ossccu.org") || Boolean(meta.is_admin)) ? "admin" : "member",
              isAdmin: (email.includes("admin") || email.endsWith("@ossccu.org") || Boolean(meta.is_admin)),
            };
            saveLocalUser(fallback);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Supabase auth check failed:", err);
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const raw = session.user;
            const meta = raw.user_metadata || {};
            const email = raw.email || "";

            const dbUser = await syncAndFetchDbProfile(raw.id, email, meta);
            if (dbUser) {
              saveLocalUser(dbUser);
            } else {
              const fallback: AuthUser = {
                id: raw.id,
                email,
                name: meta.full_name || meta.name || email.split("@")[0],
                avatarUrl: meta.avatar_url,
                githubUsername: meta.user_name || meta.preferred_username,
                department: meta.department || "Dept. of Computer Science & Engineering",
                batch: meta.batch || "City University Student",
                role: (email.includes("admin") || email.endsWith("@ossccu.org") || Boolean(meta.is_admin)) ? "admin" : "member",
                isAdmin: (email.includes("admin") || email.endsWith("@ossccu.org") || Boolean(meta.is_admin)),
              };
              saveLocalUser(fallback);
            }
          } else {
            saveLocalUser(null);
          }
        });

        return () => subscription.unsubscribe();
      }

      // Local storage fallback for demo / offline mode
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (err) {
        console.error("Local auth storage read error:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithOAuth = useCallback(async (provider: "github" | "gitlab") => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      return;
    }

    // Local preview fallback
    if (provider === "github") {
      saveLocalUser(DEMO_USERS.contributor);
      toast.success("Signed in with GitHub (Demo Preview Mode)");
    } else {
      const gitlabUser: AuthUser = {
        ...DEMO_USERS.contributor,
        id: "usr-demo-gitlab",
        name: "Sami Ahmed",
        gitlabUsername: "sami-gitlab",
        githubUsername: undefined,
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      };
      saveLocalUser(gitlabUser);
      toast.success("Signed in with GitLab (Demo Preview Mode)");
    }
  }, []);

  const signInWithGitHub = useCallback(async () => {
    return signInWithOAuth("github");
  }, [signInWithOAuth]);

  const signInWithGitLab = useCallback(async () => {
    return signInWithOAuth("gitlab");
  }, [signInWithOAuth]);

  const signInWithEmail = useCallback(async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      if (data?.user) {
        const profile = await syncAndFetchDbProfile(data.user.id, cleanEmail, data.user.user_metadata);
        if (profile) saveLocalUser(profile);
      }
      toast.success("Signed in successfully!");
      return;
    }

    // Local preview fallback
    const isAdmin = cleanEmail.includes("admin") || cleanEmail.endsWith("@ossccu.org");
    const name = cleanEmail.split("@")[0].replace(/[._]/g, " ");
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      email: cleanEmail,
      name: formattedName,
      department: "Dept. of Computer Science & Engineering",
      batch: "City University Student",
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
      role: isAdmin ? "admin" : "member",
      isAdmin,
    };

    saveLocalUser(newUser);
    toast.success(`Welcome back, ${formattedName}!`);
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, name: string, password?: string): Promise<{ needsOtp: boolean }> => {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) {
          toast.error(error.message);
          throw error;
        }

        // If user is returned and session is empty, email verification is required
        if (data.user && !data.session) {
          toast.info("A 6-digit confirmation code has been sent to your email!");
          return { needsOtp: true };
        }

        // If session exists immediately (e.g. email confirmations turned off in Supabase)
        if (data.session?.user) {
          const profile = await syncAndFetchDbProfile(data.session.user.id, cleanEmail, { full_name: name });
          if (profile) saveLocalUser(profile);
          toast.success("Account created and signed in!");
          return { needsOtp: false };
        }

        return { needsOtp: true };
      }

      // Offline / Local fallback: store temporary draft and return needsOtp = true
      const isAdmin = cleanEmail.includes("admin") || cleanEmail.endsWith("@ossccu.org");
      const tempUser: AuthUser = {
        id: `usr-${Date.now().toString(36)}`,
        email: cleanEmail,
        name: name.trim(),
        department: "Dept. of Computer Science & Engineering",
        batch: "City University Contributor",
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
        role: isAdmin ? "admin" : "member",
        isAdmin,
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("ossccu_pending_signup", JSON.stringify(tempUser));
      }
      toast.info("Please enter the verification code sent to your email (Demo Code: 123456)");
      return { needsOtp: true };
    },
    []
  );

  const verifyEmailOtp = useCallback(async (email: string, token: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanToken = token.trim();

    if (isSupabaseConfigured && supabase) {
      // 1. Try signup OTP
      let { data, error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "signup",
      });

      // 2. Try email verification fallback
      if (error) {
        const retry = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanToken,
          type: "email",
        });
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        toast.error(error.message || "Invalid or expired OTP code");
        return false;
      }

      if (data?.user) {
        const profile = await syncAndFetchDbProfile(data.user.id, cleanEmail, data.user.user_metadata);
        if (profile) saveLocalUser(profile);
      }
      toast.success("Email verified! Welcome to OSSCCU.");
      return true;
    }

    // Local / Offline demo verification
    if (cleanToken === "123456" || cleanToken.length === 6) {
      if (typeof window !== "undefined") {
        const pendingStr = sessionStorage.getItem("ossccu_pending_signup");
        if (pendingStr) {
          const parsed = JSON.parse(pendingStr);
          saveLocalUser(parsed);
          sessionStorage.removeItem("ossccu_pending_signup");
          toast.success(`Verification complete! Welcome to OSSCCU, ${parsed.name}.`);
          return true;
        }
      }
      toast.success("Verification successful!");
      return true;
    }

    toast.error("Invalid verification code. Please enter 123456 for offline demo.");
    return false;
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<AuthUser>) => {
    if (!user) return;

    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, ...data }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to update profile");
      }

      const updatedUser: AuthUser = {
        ...user,
        ...data,
      };
      saveLocalUser(updatedUser);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
      throw err;
    }
  }, [user]);

  const toggleBookmark = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error("Please log in to bookmark projects");
      return;
    }

    const currentBookmarks = user.bookmarkedProjectIds || [];
    const isBookmarked = currentBookmarks.includes(projectId);
    const nextBookmarks = isBookmarked
      ? currentBookmarks.filter((id) => id !== projectId)
      : [...currentBookmarks, projectId];

    await updateUserProfile({ bookmarkedProjectIds: nextBookmarks });
    toast.success(isBookmarked ? "Project removed from bookmarks" : "Project bookmarked!");
  }, [user, updateUserProfile]);

  const togglePinnedProject = useCallback(async (projectId: string) => {
    if (!user) {
      toast.error("Please log in to manage pinned projects");
      return;
    }

    const currentPinned = user.pinnedProjectIds || [];
    const isPinned = currentPinned.includes(projectId);

    if (!isPinned && currentPinned.length >= 2) {
      toast.error("You can only pin up to 2 flagship projects to your profile!");
      return;
    }

    const nextPinned = isPinned
      ? currentPinned.filter((id) => id !== projectId)
      : [...currentPinned, projectId];

    await updateUserProfile({ pinnedProjectIds: nextPinned });
    toast.success(isPinned ? "Project unpinned" : "Project pinned to flagship showcase!");
  }, [user, updateUserProfile]);

  const signInWithDemo = useCallback((role: "contributor" | "admin") => {
    const demo = DEMO_USERS[role];
    saveLocalUser(demo);
    toast.success(`Signed in as ${demo.name} (${role === "admin" ? "Executive Admin" : "Contributor"})`);
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    saveLocalUser(null);
    toast.info("Signed out from OSSCCU Platform.");
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAdmin: Boolean(user?.isAdmin || user?.role === "admin"),
    signInWithOAuth,
    signInWithGitHub,
    signInWithGitLab,
    signInWithEmail,
    signUpWithEmail,
    verifyEmailOtp,
    updateUserProfile,
    toggleBookmark,
    togglePinnedProject,
    refreshProfile,
    signInWithDemo,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
