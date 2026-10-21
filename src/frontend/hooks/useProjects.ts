"use client";

import { useEffect, useState, useCallback } from "react";
import { Project, ProjectInput } from "@/frontend/types/project";

const STORAGE_KEY = "ossccu_community_projects_v2";

interface UseProjectsOptions {
  onlyApproved?: boolean;
}

export function useProjects(options?: UseProjectsOptions) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);

      // Attempt to fetch from API
      try {
        const url = options?.onlyApproved ? "/api/projects" : "/api/projects?all=true";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProjects(data);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              } catch {
                // Quota fallback
              }
            }
            setError(null);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to local storage if API is unreachable
      }

      // Local storage fallback
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const filtered = options?.onlyApproved
            ? parsed.filter((p: Project) => p.status === "approved")
            : parsed;
          setProjects(filtered);
        }
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, [options?.onlyApproved]);

  useEffect(() => {
    fetchProjects();

    const handleUpdated = () => {
      fetchProjects();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("ossccu_projects_updated", handleUpdated);
      window.addEventListener("storage", handleUpdated);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("ossccu_projects_updated", handleUpdated);
        window.removeEventListener("storage", handleUpdated);
      }
    };
  }, [fetchProjects]);

  const addProject = async (input: ProjectInput): Promise<Project> => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const created = await res.json();
        setProjects((prev) => [created, ...prev]);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ossccu_projects_updated"));
        }
        return created;
      }
    } catch {
      // Offline fallback
    }

    // Local optimistic creation
    const localCreated: Project = {
      ...input,
      id: `proj-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      status: input.status || "pending",
      submittedAt: input.submittedAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => {
      const next = [localCreated, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("ossccu_projects_updated"));
      }
      return next;
    });

    return localCreated;
  };

  const updateProject = async (id: string, updates: Partial<ProjectInput>): Promise<Project> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ossccu_projects_updated"));
        }
        return updated;
      }
    } catch {
      // Offline fallback
    }

    let updatedProject: Project | null = null;
    setProjects((prev) => {
      const next = prev.map((p) => {
        if (p.id === id) {
          updatedProject = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updatedProject;
        }
        return p;
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("ossccu_projects_updated"));
      }
      return next;
    });

    if (!updatedProject) throw new Error("Project not found");
    return updatedProject;
  };

  const approveProject = async (id: string) => {
    return updateProject(id, { status: "approved" });
  };

  const rejectProject = async (id: string) => {
    return updateProject(id, { status: "rejected" });
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("ossccu_projects_updated"));
        }
        return true;
      }
    } catch {
      // Offline fallback
    }

    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("ossccu_projects_updated"));
      }
      return next;
    });

    return true;
  };

  const resetProjects = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("ossccu_projects_updated"));
    }
    await fetchProjects();
    return projects;
  };

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects,
    addProject,
    updateProject,
    approveProject,
    rejectProject,
    deleteProject,
    resetProjects,
  };
}
