"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProjects } from "@/frontend/hooks/useProjects";
import { useEvents } from "@/frontend/hooks/useEvents";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { Project, ProjectInput, ProjectStatus } from "@/frontend/types/project";
import { CommunityEvent, CommunityEventInput } from "@/frontend/types/event";
import { ExecutiveRole } from "@/frontend/types/auth";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Label } from "@/frontend/components/ui/label";
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
  Clock,
  XCircle,
  Check,
  X,
  Calendar,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

type TabFilter = "all" | "pending" | "approved" | "rejected";
type AdminSection = "projects" | "events" | "users";

const EXECUTIVE_ROLE_OPTIONS: { label: string; value: string }[] = [
  { label: "None (General Member)", value: "none" },
  { label: "Convenor", value: "Convenor" },
  { label: "Joint Convenor", value: "Joint Convenor" },
  { label: "Member Secretary", value: "Member Secretary" },
  { label: "Joint Member Secretary", value: "Joint Member Secretary" },
  { label: "Organizing Secretary", value: "Organizing Secretary" },
  { label: "Assistant Organizing Secretary", value: "Assistant Organizing Secretary" },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading, refreshProfile } = useAuth();
  const {
    projects,
    isLoading: isProjectsLoading,
    addProject,
    updateProject,
    approveProject,
    deleteProject,
    resetProjects,
  } = useProjects();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  // Active Admin Section
  const [adminSection, setAdminSection] = useState<AdminSection>("projects");

  // Filters & Tabs for Projects
  const [statusTab, setStatusTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal states for Projects
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Rejection Feedback Modal
  const [rejectingProject, setRejectingProject] = useState<Project | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [isSubmittingRejection, setIsSubmittingRejection] = useState(false);

  // Delete confirmation
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset confirmation
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Event Modal & Management State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | null>(null);
  const [eventFormData, setEventFormData] = useState<CommunityEventInput>({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    type: "workshop",
    status: "upcoming",
    registrationUrl: "",
    bannerImage: "",
  });

  // User Management State
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUserList(data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (adminSection === "users") {
      fetchUsers();
    }
  }, [adminSection]);

  // Strict Role Guard - No PIN passkey. Admins enter immediately; non-admins get booted to /dashboard.
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || (!user.isAdmin && user.role !== "admin")) {
        toast.error("Access Denied: Administrator role required to view console.");
        router.replace("/dashboard");
      }
    }
  }, [user, isAuthLoading, router]);

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

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) return userList;
    const q = userSearchQuery.toLowerCase().trim();
    return userList.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.studentId?.toLowerCase().includes(q) ||
        u.githubHandle?.toLowerCase().includes(q) ||
        u.batch?.toLowerCase().includes(q)
    );
  }, [userList, userSearchQuery]);

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

  const handleOpenRejectDialog = (project: Project) => {
    setRejectingProject(project);
    setRejectionFeedback(project.moderatorFeedback || "");
  };

  const handleConfirmRejection = async () => {
    if (!rejectingProject) return;
    try {
      setIsSubmittingRejection(true);
      await updateProject(rejectingProject.id, {
        status: "rejected",
        moderatorFeedback: rejectionFeedback.trim() || undefined,
      });
      toast.info(`Marked "${rejectingProject.title}" as rejected with moderator feedback.`);
      setRejectingProject(null);
      setRejectionFeedback("");
    } catch {
      toast.error("Failed to reject project.");
    } finally {
      setIsSubmittingRejection(false);
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

  // Event handlers
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      type: "workshop",
      status: "upcoming",
      registrationUrl: "",
      bannerImage: "",
    });
    setEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: CommunityEvent) => {
    setEditingEvent(evt);
    setEventFormData({
      title: evt.title,
      description: evt.description,
      date: evt.date,
      time: evt.time || "",
      venue: evt.venue || "",
      type: evt.type,
      status: evt.status,
      registrationUrl: evt.registrationUrl || "",
      bannerImage: evt.bannerImage || "",
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventFormData);
        toast.success("Event updated successfully!");
      } else {
        await addEvent(eventFormData);
        toast.success("Event created successfully!");
      }
      setEventModalOpen(false);
      setEditingEvent(null);
    } catch {
      toast.error("Failed to save event.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(id);
      toast.success("Event deleted successfully.");
    }
  };

  const handleToggleEventStatus = async (evt: CommunityEvent, newStatus: "upcoming" | "ongoing" | "past") => {
    try {
      await updateEvent(evt.id, { status: newStatus });
      toast.success(`Event status set to ${newStatus}`);
    } catch {
      toast.error("Failed to update event status.");
    }
  };

  // User Role & Executive Role handlers
  const handleUpdateUserRole = async (userId: string, newRole: "member" | "admin") => {
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        toast.success(`User role set to ${newRole}`);
        fetchUsers();
        if (user?.id === userId) {
          refreshProfile();
        }
      } else {
        toast.error("Failed to update user role");
      }
    } catch {
      toast.error("Error updating user role");
    }
  };

  const handleUpdateExecutiveRole = async (userId: string, execRole: string) => {
    const value: ExecutiveRole = execRole === "none" ? null : (execRole as ExecutiveRole);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, executiveRole: value }),
      });
      if (res.ok) {
        toast.success(`Executive committee title updated!`);
        fetchUsers();
        if (user?.id === userId) {
          refreshProfile();
        }
      } else {
        toast.error("Failed to update executive role");
      }
    } catch {
      toast.error("Error updating executive role");
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

  // Role Gate Loading Screen
  if (isAuthLoading || !user || (!user.isAdmin && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Verifying administrator authorization...</p>
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
              <span className="font-extrabold text-white text-lg tracking-wide font-mono">
                OSSCCU
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
            {adminSection === "projects" && (
              <>
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
              </>
            )}

            {adminSection === "events" && (
              <Button
                onClick={handleOpenAddEvent}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs gap-1.5 h-9 shadow-md shadow-primary/20"
              >
                <Plus size={16} />
                <span>Create Event</span>
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-white text-xs gap-1.5 h-9 px-2.5"
            >
              <Link href="/dashboard">
                <Users size={14} />
                <span className="hidden lg:inline">My Contributor Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="container py-8 sm:py-10">
        {/* Module Switcher */}
        <div className="flex items-center gap-2 mb-8 bg-card/70 p-1.5 rounded-xl border border-primary/20 max-w-fit overflow-x-auto">
          <button
            onClick={() => setAdminSection("projects")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              adminSection === "projects"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-foreground/70 hover:text-white hover:bg-primary/10"
            }`}
          >
            <Code2 size={15} />
            <span>Projects Moderation</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setAdminSection("events")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              adminSection === "events"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-foreground/70 hover:text-white hover:bg-primary/10"
            }`}
          >
            <Calendar size={15} />
            <span>Events Management</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {events.length}
            </span>
          </button>

          <button
            onClick={() => setAdminSection("users")}
            className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              adminSection === "users"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-foreground/70 hover:text-white hover:bg-primary/10"
            }`}
          >
            <Users size={15} />
            <span>User Roles & Directory</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
              {userList.length}
            </span>
          </button>
        </div>

        {adminSection === "projects" && (
          <div>
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
            {isProjectsLoading ? (
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
                        : project.status === "rejected"
                        ? "border-rose-500/30 bg-rose-500/5"
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

                        {/* Rejection feedback notice if present */}
                        {project.status === "rejected" && project.moderatorFeedback && (
                          <div className="mb-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                            <MessageSquare size={13} className="shrink-0 mt-0.5 text-rose-400" />
                            <span>
                              <strong>Feedback provided:</strong> {project.moderatorFeedback}
                            </span>
                          </div>
                        )}

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
                            onClick={() => handleOpenRejectDialog(project)}
                            className="border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs h-9 px-3 gap-1"
                          >
                            <X size={14} />
                            <span>Reject</span>
                          </Button>
                        </>
                      )}

                      {/* Re-approve / Update feedback for Rejected Projects */}
                      {project.status === "rejected" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(project)}
                            className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs h-9 px-3 gap-1"
                          >
                            <Check size={14} />
                            <span>Re-Approve</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenRejectDialog(project)}
                            className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs h-9 px-2.5 gap-1"
                          >
                            <MessageSquare size={13} />
                            <span>Edit Reason</span>
                          </Button>
                        </>
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
          </div>
        )}

        {/* Events Management Module */}
        {adminSection === "events" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  Community <span className="text-primary">Events & Workshops</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Schedule upcoming bootcamps, manage ongoing hackathons, and archive past community highlights.
                </p>
              </div>
              <Button
                onClick={handleOpenAddEvent}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 text-xs"
              >
                <Plus size={16} />
                <span>Create New Event</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-card/80 border border-primary/20 hover:border-primary/60 rounded-2xl p-6 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] uppercase font-mono">
                        {evt.type}
                      </Badge>
                      <Badge
                        className={`text-[10px] uppercase font-mono ${
                          evt.status === "upcoming"
                            ? "bg-secondary/20 text-secondary border border-secondary/40"
                            : evt.status === "ongoing"
                            ? "bg-emerald-500 text-slate-950 font-bold animate-pulse"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {evt.status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-foreground/70 mb-4 line-clamp-3">
                      {evt.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-muted-foreground font-mono pt-3 border-t border-primary/15 mb-4">
                      <div className="flex items-center gap-2 text-secondary">
                        <Clock size={12} />
                        <span>{evt.date} {evt.time ? `• ${evt.time}` : ""}</span>
                      </div>
                      {evt.venue && (
                        <div className="truncate">
                          📍 {evt.venue}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-primary/15">
                    {/* Status Toggler */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono mr-1">Status:</span>
                      <button
                        onClick={() => handleToggleEventStatus(evt, "upcoming")}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono transition-all ${
                          evt.status === "upcoming"
                            ? "bg-secondary text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        Upcoming
                      </button>
                      <button
                        onClick={() => handleToggleEventStatus(evt, "ongoing")}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono transition-all ${
                          evt.status === "ongoing"
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        Ongoing
                      </button>
                      <button
                        onClick={() => handleToggleEventStatus(evt, "past")}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono transition-all ${
                          evt.status === "past"
                            ? "bg-slate-700 text-white font-bold"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        Past
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditEvent(evt)}
                        className="flex-1 border-primary/30 text-xs h-8 gap-1 text-primary hover:bg-primary/15"
                      >
                        <Edit2 size={12} /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteEvent(evt.id)}
                        className="border-destructive/30 text-xs h-8 px-2.5 text-destructive hover:bg-destructive/15"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Management Module */}
        {adminSection === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  Community <span className="text-primary">Directory & Permissions</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage member roles, assign Executive Committee titles (Convenor, Joint Convenor, Secretaries), and grant admin capabilities.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={isLoadingUsers}
                className="border-primary/40 text-primary hover:bg-primary/10 gap-1.5 text-xs h-9"
              >
                <RotateCcw size={14} className={isLoadingUsers ? "animate-spin" : ""} />
                <span>Refresh Directory</span>
              </Button>
            </div>

            {/* Search Filter for Users */}
            <div className="bg-card/60 border border-primary/20 p-3 rounded-xl max-w-md">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filter by name, email, student ID, batch, or handle..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9 bg-background/80 border-primary/30 text-xs h-9"
                />
              </div>
            </div>

            <div className="bg-card/80 border border-primary/25 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-primary/10 border-b border-primary/20 text-muted-foreground font-mono uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Member Identity</th>
                      <th className="p-4">Student ID & Batch</th>
                      <th className="p-4">External Profiles</th>
                      <th className="p-4">Platform Role</th>
                      <th className="p-4">Executive Committee Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10 text-foreground">
                    {filteredUsers.map((u) => {
                      const isAdminRole = u.role === "admin";
                      const currentExec = u.executiveRole || "none";

                      return (
                        <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-900 border border-primary/30 overflow-hidden shrink-0">
                                <img
                                  src={u.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email}`}
                                  alt={u.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    href={`/${u.githubHandle || u.id}`}
                                    className="font-bold text-white text-sm hover:text-primary transition-colors flex items-center gap-1"
                                  >
                                    {u.name}
                                    <ExternalLink size={12} className="opacity-60" />
                                  </Link>
                                  {isAdminRole && (
                                    <Badge className="bg-primary text-primary-foreground text-[9px] px-1.5 py-0 font-mono">
                                      Admin
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-[11px] font-mono">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <p className="font-mono text-cyan-300 font-semibold">{u.studentId || "—"}</p>
                            <p className="text-muted-foreground text-[11px]">{u.batch || "City University"} • {u.department || "CSE"}</p>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              {u.githubHandle && (
                                <span className="text-cyan-400">GH: @{u.githubHandle}</span>
                              )}
                              {u.gitlabHandle && (
                                <span className="text-amber-400">GL: @{u.gitlabHandle}</span>
                              )}
                              {!u.githubHandle && !u.gitlabHandle && (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            <Select
                              value={u.role || "member"}
                              onValueChange={(val: "member" | "admin") => handleUpdateUserRole(u.id, val)}
                            >
                              <SelectTrigger className="w-32 bg-background/80 border-primary/30 text-xs h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-primary/30 text-foreground">
                                <SelectItem value="member">
                                  <span className="flex items-center gap-1 text-emerald-300">
                                    <UserCheck size={12} /> Member
                                  </span>
                                </SelectItem>
                                <SelectItem value="admin">
                                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                                    <ShieldCheck size={12} /> Admin
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>

                          <td className="p-4">
                            <Select
                              value={currentExec}
                              onValueChange={(val) => handleUpdateExecutiveRole(u.id, val)}
                            >
                              <SelectTrigger className="w-56 bg-background/80 border-primary/30 text-xs h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-primary/30 text-foreground">
                                {EXECUTIVE_ROLE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rejection Feedback Dialog */}
      <Dialog open={!!rejectingProject} onOpenChange={(open) => !open && setRejectingProject(null)}>
        <DialogContent className="max-w-md bg-card/95 border-rose-500/40 text-foreground backdrop-blur-xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
              <XCircle className="text-rose-400" size={20} />
              Reject & Provide Contributor Feedback
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide constructive guidance on what the author needs to change (e.g. missing demo, incomplete documentation, or broken dependencies).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-3">
            <div>
              <p className="text-xs font-semibold text-slate-300 mb-1">
                Project: <span className="text-white font-bold">{rejectingProject?.title}</span>
              </p>
              <textarea
                rows={4}
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                placeholder="e.g. Please provide an active live deployment link and ensure the README contains setup instructions."
                className="w-full bg-background/80 border border-primary/30 rounded-lg p-3 text-xs text-foreground resize-y outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectingProject(null)}
              disabled={isSubmittingRejection}
              className="border-primary/30 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRejection}
              disabled={isSubmittingRejection}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs"
            >
              {isSubmittingRejection ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Add/Edit Dialog */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto w-full p-6 bg-card/95 border-primary/30 text-foreground backdrop-blur-xl shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingEvent ? "Edit Community Event" : "Create Community Event"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Add details for the hackathon, workshop, or seminar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEvent} className="space-y-4 mt-3">
            <div>
              <Label className="text-xs">Event Title</Label>
              <Input
                required
                value={eventFormData.title}
                onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                placeholder="e.g. Next.js Masterclass"
                className="bg-background/80 border-primary/30 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Description</Label>
              <textarea
                required
                rows={3}
                value={eventFormData.description}
                onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                placeholder="Event overview, objectives, and prerequisites..."
                className="w-full bg-background/80 border border-primary/30 rounded-lg p-2.5 text-xs text-foreground resize-y outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input
                  required
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                  placeholder="e.g. November 15, 2026"
                  className="bg-background/80 border-primary/30 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Time</Label>
                <Input
                  value={eventFormData.time || ""}
                  onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                  placeholder="e.g. 2:00 PM - 5:00 PM"
                  className="bg-background/80 border-primary/30 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs">Venue / Location</Label>
              <Input
                value={eventFormData.venue || ""}
                onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
                placeholder="e.g. Campus Lab 4 / Google Meet"
                className="bg-background/80 border-primary/30 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Event Type</Label>
                <select
                  value={eventFormData.type}
                  onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value as any })}
                  className="w-full h-9 bg-background/80 border border-primary/30 rounded-lg px-2 text-xs text-foreground outline-none"
                >
                  <option value="workshop">Workshop</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="meetup">Meetup</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Status</Label>
                <select
                  value={eventFormData.status}
                  onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value as any })}
                  className="w-full h-9 bg-background/80 border border-primary/30 rounded-lg px-2 text-xs text-foreground outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Registration / Details URL</Label>
              <Input
                value={eventFormData.registrationUrl || ""}
                onChange={(e) => setEventFormData({ ...eventFormData, registrationUrl: e.target.value })}
                placeholder="https://discord.gg/ossccu or form link"
                className="bg-background/80 border-primary/30 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Banner Image URL</Label>
              <Input
                value={eventFormData.bannerImage || ""}
                onChange={(e) => setEventFormData({ ...eventFormData, bannerImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-background/80 border-primary/30 text-xs"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold text-xs h-10 mt-2"
            >
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
