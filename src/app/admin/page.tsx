"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useProjects } from "@/frontend/hooks/useProjects";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Project, ProjectInput, ProjectStatus } from "@/frontend/types/project";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import { Spinner } from "@/frontend/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Search,
  Sparkles,
  Edit2,
  Trash2,
  Github,
  ExternalLink,
  RotateCcw,
  Code2,
  Users,
  Layers,
  Star,
  CheckCircle2,
  Lock,
  Unlock,
  LogOut,
  Clock,
  XCircle,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";

const AUTH_STORAGE_KEY = "ossccu_admin_session_auth_v1";
const EXPECTED_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "ossccu2026";

type TabFilter = "all" | "pending" | "approved" | "rejected";

export default function AdminPage() {
  const {
    projects,
    isLoading,
    addProject,
    updateProject,
    approveProject,
    rejectProject,
    deleteProject,
    resetProjects,
  } = useProjects();
  const { user } = useAuth();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Filters & Tabs
  const [statusTab, setStatusTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete confirmation
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset confirmation
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Check session on mount or if user is verified admin
  useEffect(() => {
    if (user?.isAdmin) {
      setIsAuthenticated(true);
      return;
    }
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(stored === "true");
    } catch {
      setIsAuthenticated(false);
    }
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === EXPECTED_PIN) {
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
      } catch {
        // Fallback for private mode
      }
      setIsAuthenticated(true);
      setPinError(false);
      toast.success("Welcome, Administrator!");
    } else {
      setPinError(true);
      toast.error("Incorrect Passkey. Please verify your PIN.");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignored
    }
    setIsAuthenticated(false);
    setPinInput("");
    toast.info("Logged out from Admin Console.");
  };

  // Counts by status
  const statusCounts = useMemo(() => {
    const pending = projects.filter((p) => p.status === "pending").length;
    const approved = projects.filter((p) => p.status === "approved").length;
    const rejected = projects.filter((p) => p.status === "rejected").length;
    return { all: projects.length, pending, approved, rejected };
  }, [projects]);

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Status Tab filter
      if (statusTab !== "all" && p.status !== statusTab) {
        return false;
      }

      // Category filter
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      if (!matchesCategory) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, statusTab, categoryFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const featuredCount = projects.filter((p) => p.featured && p.status === "approved").length;
    const uniqueAuthors = new Set(projects.map((p) => p.author.name.trim())).size;
    const categoriesCount = new Set(projects.map((p) => p.category)).size;
    return { total, featuredCount, uniqueAuthors, categoriesCount };
  }, [projects]);

  const handleOpenAddDialog = () => {
    setEditingProject(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setEditingProject(project);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: ProjectInput) => {
    if (editingProject) {
      await updateProject(editingProject.id, data);
    } else {
      await addProject(data);
    }
  };

  const handleApprove = async (project: Project) => {
    try {
      await approveProject(project.id);
      toast.success(`Approved "${project.title}"! It is now live on the public showcase.`);
    } catch {
      toast.error("Failed to approve project.");
    }
  };

  const handleReject = async (project: Project) => {
    try {
      await rejectProject(project.id);
      toast.info(`Marked "${project.title}" as rejected.`);
    } catch {
      toast.error("Failed to reject project.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete.id);
      toast.success(`Removed "${projectToDelete.title}"`);
      setProjectToDelete(null);
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetConfirm = async () => {
    try {
      setIsResetting(true);
      await resetProjects();
      toast.success("Community projects restored to defaults.");
      setResetDialogOpen(false);
    } catch {
      toast.error("Failed to reset projects.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      const newStatus = !project.featured;
      await updateProject(project.id, { featured: newStatus });
      toast.success(
        newStatus
          ? `Marked "${project.title}" as featured!`
          : `Removed featured status from "${project.title}"`
      );
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // Helper for Status Badge
  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 gap-1">
            <CheckCircle2 size={11} />
            Approved
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 gap-1 animate-pulse">
            <Clock size={11} />
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 gap-1">
            <XCircle size={11} />
            Rejected
          </Badge>
        );
    }
  };

  // Render Passkey Gate if not authenticated
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md bg-card/90 border border-primary/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_25px_rgba(0,217,255,0.25)]">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              OSS<span className="text-primary">CCU</span> Admin Access
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              Enter the authorized executive passkey to manage community repositories.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="passkey"
                className="block text-xs font-bold uppercase tracking-wider text-slate-300"
              >
                Admin Passkey / PIN
              </label>
              <Input
                id="passkey"
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter passkey (e.g. ossccu2026)"
                className={`bg-background/80 text-sm h-11 text-center font-mono tracking-widest ${
                  pinError
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-primary/40 focus-visible:border-primary"
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-destructive mt-1 text-center">
                  Invalid passkey. Try again or check with the executive team.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 neon-button text-sm tracking-wide gap-2"
            >
              <Unlock size={16} />
              Unlock Console
            </Button>

            <div className="pt-2 text-center">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-white"
              >
                <Link href="/">
                  <ArrowLeft size={14} className="mr-1" /> Return to Website
                </Link>
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-card/85 backdrop-blur-md border-b border-primary/20">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary gap-1 px-2.5"
            >
              <Link href="/">
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back to Platform</span>
              </Link>
            </Button>
            <div className="h-4 w-px bg-primary/20" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-lg tracking-wide">
                OSS<span className="text-primary">CCU</span>
              </span>
              <Badge
                variant="outline"
                className="border-primary/40 text-primary text-[10px] uppercase font-mono tracking-wider py-0 px-2"
              >
                Admin Console
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetDialogOpen(true)}
              className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs gap-1.5 h-9"
              title="Reset to default seed projects"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Reset Defaults</span>
            </Button>

            <Button
              onClick={handleOpenAddDialog}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-1.5 h-9 shadow-md shadow-primary/20"
            >
              <Plus size={16} />
              <span>Add Project</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-rose-400 text-xs gap-1 h-9 px-2.5"
              title="Log out of Admin Console"
            >
              <LogOut size={15} />
              <span className="hidden lg:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="container py-8 sm:py-10">
        {/* Page Title & Intro */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Project Moderation & <span className="text-primary">Management</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Review community submissions, approve student repositories, and curate the official
            OSSCCU showcase.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Total Catalog
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Layers size={20} />
            </div>
          </div>

          <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Pending Review
              </p>
              <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${statusCounts.pending > 0 ? "text-amber-400" : "text-white"}`}>
                {statusCounts.pending}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Approved (Live)
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                {statusCounts.approved}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Contributors
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-1">
                {stats.uniqueAuthors}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Users size={20} />
            </div>
          </div>
        </div>

        {/* Status Moderation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-3 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setStatusTab("all")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === "all"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-foreground/70 hover:text-white hover:bg-primary/10"
            }`}
          >
            <span>All Projects</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {statusCounts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusTab("pending")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === "pending"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-foreground/70 hover:text-white hover:bg-amber-500/10"
            }`}
          >
            <Clock size={14} />
            <span>Pending Review</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                statusCounts.pending > 0
                  ? "bg-amber-400 text-slate-950 animate-pulse"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {statusCounts.pending}
            </span>
          </button>

          <button
            onClick={() => setStatusTab("approved")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === "approved"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                : "text-foreground/70 hover:text-white hover:bg-emerald-500/10"
            }`}
          >
            <CheckCircle2 size={14} />
            <span>Approved</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {statusCounts.approved}
            </span>
          </button>

          <button
            onClick={() => setStatusTab("rejected")}
            className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              statusTab === "rejected"
                ? "bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20"
                : "text-foreground/70 hover:text-white hover:bg-rose-500/10"
            }`}
          >
            <XCircle size={14} />
            <span>Rejected</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {statusCounts.rejected}
            </span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-card/60 p-4 rounded-xl border border-primary/20">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, description, or author..."
              className="pl-9 bg-background/80 border-primary/30 text-sm h-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-44">
              <Select
                value={categoryFilter}
                onValueChange={(val) => setCategoryFilter(val)}
              >
                <SelectTrigger className="bg-background/80 border-primary/30 text-sm h-10">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 text-foreground">
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="AI/ML">AI/ML</SelectItem>
                  <SelectItem value="IoT/Robotics">IoT/Robotics</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Project List */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground font-mono">
              Loading administration records...
            </p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`bg-card/75 border rounded-xl p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group ${
                  project.status === "pending"
                    ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-400"
                    : "border-primary/20 hover:border-primary/50"
                }`}
              >
                {/* Left: Banner & Info */}
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 border border-primary/20 shrink-0 relative">
                    {project.thumbnailUrl ? (
                      <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/40">
                        <Code2 size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">
                        {project.title}
                      </h3>
                      {renderStatusBadge(project.status)}
                      <Badge
                        variant="outline"
                        className="border-primary/40 text-primary text-[10px] px-2 py-0"
                      >
                        {project.category}
                      </Badge>
                      {project.featured && (
                        <Badge className="bg-secondary/90 text-secondary-foreground text-[10px] px-2 py-0 font-bold flex items-center gap-1">
                          <Sparkles size={10} />
                          Featured
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-foreground/70 line-clamp-2 mb-2 max-w-2xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Author:{" "}
                        <strong className="text-slate-200">{project.author.name}</strong> (
                        {project.author.role})
                      </span>
                      <span>•</span>
                      <span>
                        Submitted:{" "}
                        {new Date(project.submittedAt || project.createdAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-primary/10 text-cyan-300 px-1.5 py-0.2 rounded text-[10px]"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:self-center shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-primary/15">
                  {/* Moderation Actions for Pending Projects */}
                  {project.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(project)}
                        className="bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs h-9 px-3 gap-1 shadow-md shadow-emerald-500/20"
                      >
                        <Check size={14} />
                        <span>Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(project)}
                        className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs h-9 px-3 gap-1"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </Button>
                    </>
                  )}

                  {/* Re-approve for Rejected Projects */}
                  {project.status === "rejected" && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(project)}
                      className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs h-9 px-3 gap-1"
                    >
                      <Check size={14} />
                      <span>Re-Approve</span>
                    </Button>
                  )}

                  {/* External Links */}
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-primary/30 text-primary hover:bg-primary/10 text-xs h-9 px-2.5 gap-1"
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open GitHub"
                    >
                      <Github size={14} />
                      <span className="hidden sm:inline">Repo</span>
                    </a>
                  </Button>

                  {project.demoUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs h-9 px-2.5 gap-1"
                    >
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open Live Demo"
                      >
                        <ExternalLink size={14} />
                        <span className="hidden sm:inline">Demo</span>
                      </a>
                    </Button>
                  )}

                  {/* Toggle Featured */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(project)}
                    className={`text-xs h-9 px-2.5 gap-1.5 ${
                      project.featured
                        ? "border-secondary/40 text-secondary hover:bg-secondary/10"
                        : "border-slate-700 text-slate-400 hover:text-white"
                    }`}
                    title={project.featured ? "Remove featured status" : "Make featured"}
                  >
                    <Star
                      size={14}
                      className={project.featured ? "fill-secondary text-secondary" : ""}
                    />
                  </Button>

                  {/* Edit */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(project)}
                    className="border-primary/40 text-primary hover:bg-primary/20 text-xs h-9 px-2.5 gap-1"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProjectToDelete(project)}
                    className="border-destructive/40 text-destructive hover:bg-destructive/15 text-xs h-9 px-2.5 gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-card/30 border border-dashed border-primary/30 rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white mb-2">
              No {statusTab !== "all" ? statusTab : ""} projects found
            </h3>
            <p className="text-sm text-foreground/70 mb-6">
              No project records match the active criteria. Add a new project or change your filters.
            </p>
            <Button
              onClick={handleOpenAddDialog}
              className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5"
            >
              <Plus size={16} />
              Add Project Now
            </Button>
          </div>
        )}
      </main>

      {/* Project Add / Edit Dialog (in admin mode) */}
      <ProjectFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        projectToEdit={editingProject}
        onSubmit={handleFormSubmit}
        isAdmin={true}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Project &quot;{projectToDelete?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete this project? This will remove it permanently from the
              catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="border-primary/30 text-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Spinner className="size-4" /> Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation Alert */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent className="bg-card border-primary/30 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Reset Projects to Factory Defaults?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will reset the local project catalog back to the initial set of official OSSCCU
              projects. All custom submissions will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isResetting}
              className="border-primary/30 text-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetConfirm}
              disabled={isResetting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {isResetting ? (
                <>
                  <Spinner className="size-4" /> Resetting...
                </>
              ) : (
                "Reset Store"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
