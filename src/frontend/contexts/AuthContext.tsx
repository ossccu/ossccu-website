"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthUser, AuthContextType } from "@/frontend/types/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";

const LOCAL_STORAGE_AUTH_KEY = "ossccu_auth_user_v1";

const DEMO_USERS: Record<"contributor" | "admin", AuthUser> = {
  contributor: {
    id: "usr-demo-contributor",
    email: "contributor@ossccu.org",
    name: "Tanvir Ahmed",
    role: "Lead Frontend Contributor",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    githubUsername: "tanvir-dev",
    department: "Computer Science & Engineering",
    batch: "Batch 54 (CSE)",
    isAdmin: false,
  } as AuthUser & { role: string },
  admin: {
    id: "usr-demo-admin",
    email: "admin@ossccu.org",
    name: "Rifat Mahmud",
    role: "Core Executive Organizer",
    avatarUrl:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    githubUsername: "rifat-oss",
    department: "Computer Science & Engineering",
    batch: "Executive Board 2025-2026",
    isAdmin: true,
  } as AuthUser & { role: string },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function syncUserToDatabase(user: AuthUser) {
  try {
    await fetch("/api/users/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatarUrl,
        github_handle: user.githubUsername,
        role: user.isAdmin ? "admin" : "student",
        department: user.department,
        batch: user.batch,
      }),
    });
  } catch (e) {
    console.warn("Post-auth sync to public.users failed:", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            const rawUser = session.user;
            const meta = rawUser.user_metadata || {};
            const email = rawUser.email || "";
            const isAdmin =
              email.includes("admin") ||
              email.endsWith("@ossccu.org") ||
              Boolean(meta.is_admin);

            const mappedUser: AuthUser = {
              id: rawUser.id,
              email,
              name: meta.full_name || meta.name || email.split("@")[0],
              avatarUrl: meta.avatar_url || (meta.user_name ? `https://github.com/${meta.user_name}.png` : undefined),
              githubUsername: meta.user_name || meta.preferred_username,
              department: meta.department || "Computer Science & Engineering",
              batch: meta.batch || "Student Member",
              isAdmin,
            };
            setUser(mappedUser);
            syncUserToDatabase(mappedUser);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Supabase auth check failed:", err);
        }

        // Listen for auth state change
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            const rawUser = session.user;
            const meta = rawUser.user_metadata || {};
            const email = rawUser.email || "";
            const isAdmin =
              email.includes("admin") ||
              email.endsWith("@ossccu.org") ||
              Boolean(meta.is_admin);

            const mappedUser: AuthUser = {
              id: rawUser.id,
              email,
              name: meta.full_name || meta.name || email.split("@")[0],
              avatarUrl: meta.avatar_url || (meta.user_name ? `https://github.com/${meta.user_name}.png` : undefined),
              githubUsername: meta.user_name || meta.preferred_username,
              department: meta.department || "Computer Science & Engineering",
              batch: meta.batch || "Student Member",
              isAdmin,
            };
            setUser(mappedUser);
            syncUserToDatabase(mappedUser);
          } else {
            setUser(null);
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

  const saveLocalUser = (authUser: AuthUser | null) => {
    setUser(authUser);
    if (authUser) {
      syncUserToDatabase(authUser);
    }
    if (typeof window !== "undefined") {
      if (authUser) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authUser));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      }
    }
  };

  const signInWithGitHub = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
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

    // Local fallback
    saveLocalUser(DEMO_USERS.contributor);
    toast.success("Signed in with GitHub (Local Preview Mode)");
  }, []);

  const signInWithEmail = useCallback(async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase && password) {
      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        toast.error(error.message);
        throw error;
      }
      return;
    }

    // Local fallback
    const isAdmin = cleanEmail.includes("admin") || cleanEmail.endsWith("@ossccu.org");
    const name = cleanEmail.split("@")[0].replace(/[._]/g, " ");
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const newUser: AuthUser = {
      id: `usr-${Date.now().toString(36)}`,
      email: cleanEmail,
      name: formattedName,
      department: "Computer Science & Engineering",
      batch: "City University Student",
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
      isAdmin,
    };

    saveLocalUser(newUser);
    toast.success(`Welcome back, ${formattedName}!`);
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, name: string, password?: string) => {
      const cleanEmail = email.trim().toLowerCase();

      if (isSupabaseConfigured && supabase && password) {
        const { error } = await supabase.auth.signUp({
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
        toast.success("Account created! Please check your email to confirm.");
        return;
      }

      // Local fallback
      const isAdmin = cleanEmail.includes("admin") || cleanEmail.endsWith("@ossccu.org");
      const newUser: AuthUser = {
        id: `usr-${Date.now().toString(36)}`,
        email: cleanEmail,
        name: name.trim(),
        department: "Computer Science & Engineering",
        batch: "New Community Contributor",
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
        isAdmin,
      };

      saveLocalUser(newUser);
      toast.success(`Welcome to OSSCCU, ${name}!`);
    },
    []
  );

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
    isAdmin: Boolean(user?.isAdmin),
    signInWithGitHub,
    signInWithEmail,
    signUpWithEmail,
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
