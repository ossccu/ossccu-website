"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useProjects } from "@/frontend/hooks/useProjects";
import { Project, ProjectInput, ProjectStatus } from "@/frontend/types/project";
import { ProjectFormDialog } from "@/frontend/components/ProjectFormDialog";
import { AuthModal } from "@/frontend/components/AuthModal";
import { Navbar } from "@/frontend/components/Navbar";
import { Footer } from "@/frontend/components/Footer";
import { ProjectCard } from "@/frontend/components/ProjectCard";
import { storageService } from "@/backend/services/storageService";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
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
  Sparkles,
  PlusCircle,
  Edit2,
  Trash2,
  Github,
  ExternalLink,
  Code2,
  Clock,
  CheckCircle2,
  XCircle,
  Star,
  User,
  GraduationCap,
  Layers,
  LogIn,
  Camera,
  Lock,
  Bookmark,
  Pin,
  ShieldCheck,
  Award,
  KeyRound,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { fetchGitHubStats } from "@/backend/services/githubService";

type MainView = "projects" | "bookmarks" | "profile" | "security";
type ProjectTab = "all" | "approved" | "pending" | "rejected";

export default function DashboardPage() {
  const {
    user,
    isLoading: authLoading,
    updateUserProfile,
    togglePinnedProject,
  } = useAuth();
  const {
    projects,
    isLoading: projectsLoading,
    addProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [mainView, setMainView] = useState<MainView>("projects");
  const [projectTab, setProjectTab] = useState<ProjectTab>("all");

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [totalStars, setTotalStars] = useState(0);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile Handles Form
  const [profileForm, setProfileForm] = useState({
    githubUsername: "",
    gitlabUsername: "",
    linkedinUrl: "",
    codeforcesHandle: "",
    leetcodeHandle: "",
    hackerrankHandle: "",
    codechefHandle: "",
    portfolioUrl: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password Change Form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        githubUsername: user.githubUsername || "",
        gitlabUsername: user.gitlabUsername || "",
        linkedinUrl: user.linkedinUrl || "",
        codeforcesHandle: user.codeforcesHandle || "",
        leetcodeHandle: user.leetcodeHandle || "",
        hackerrankHandle: user.hackerrankHandle || "",
        codechefHandle: user.codechefHandle || "",
        portfolioUrl: user.portfolioUrl || "",
      });
    }
  }, [user]);

  // Filter projects belonging to this user
  const userProjects = useMemo(() => {
    if (!user) return [];
    return projects.filter((p) => {
      if (p.userId && p.userId === user.id) return true;
      if (p.userEmail && p.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
      if (user.githubUsername && p.author.githubUsername?.toLowerCase() === user.githubUsername.toLowerCase()) return true;
      if (p.author.name.toLowerCase() === user.name.toLowerCase()) return true;
      return false;
    });
  }, [projects, user]);

  // Bookmarked projects
  const bookmarkedProjects = useMemo(() => {
    if (!user?.bookmarkedProjectIds || user.bookmarkedProjectIds.length === 0) return [];
    return projects.filter((p) => user.bookmarkedProjectIds?.includes(p.id));
  }, [projects, user]);

  // Tab filtered projects
  const filteredProjects = useMemo(() => {
    if (projectTab === "all") return userProjects;
    return userProjects.filter((p) => p.status === projectTab);
  }, [userProjects, projectTab]);

  // Counts
  const counts = useMemo(() => {
    const approved = userProjects.filter((p) => p.status === "approved").length;
    const pending = userProjects.filter((p) => p.status === "pending").length;
    const rejected = userProjects.filter((p) => p.status === "rejected").length;
    return { all: userProjects.length, approved, pending, rejected };
  }, [userProjects]);

  // Aggregate stars earned
  useEffect(() => {
    let isMounted = true;
    async function calculateStars() {
      let starsCount = 0;
      for (const p of userProjects) {
        if (p.githubUrl) {
          const stats = await fetchGitHubStats(p.githubUrl);
          if (stats.loaded) {
            starsCount += stats.stars;
          }
        }
      }
      if (isMounted) setTotalStars(starsCount);
    }
    if (userProjects.length > 0) {
      calculateStars();
    }
    return () => {
      isMounted = false;
    };
  }, [userProjects]);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormDialogOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormDialogOpen(true);
  };

  const handleFormSubmit = async (data: ProjectInput) => {
    if (editingProject) {
      // If editing a rejected project, resubmit to pending review
      if (editingProject.status === "rejected") {
        data.status = "pending";
        data.moderatorFeedback = undefined;
      }
      await updateProject(editingProject.id, data);
      toast.success("Project updated and submitted for moderation!");
    } else {
      await addProject(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete.id);
      toast.success(`Removed "${projectToDelete.title}" from your portfolio.`);
      setProjectToDelete(null);
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploadingAvatar(true);
      const res = await storageService.uploadAvatar(file, user.id);
      if (res.success && res.url) {
        await updateUserProfile({ avatarUrl: res.url });
        toast.success("Profile photo updated successfully!");
      } else {
        toast.error(res.error || "Failed to upload avatar.");
      }
    } catch {
      toast.error("An error occurred while uploading avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfileHandles = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      await updateUserProfile(profileForm);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsChangingPassword(true);
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
          toast.error(error.message);
          return;
        }
      }
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] px-2 py-0.5 gap-1">
            <CheckCircle2 size={11} /> Approved & Live
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 gap-1 animate-pulse">
            <Clock size={11} /> Under Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] px-2 py-0.5 gap-1">
            <XCircle size={11} /> Rejected
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <Navbar onOpenSubmitModal={handleOpenAdd} />

      <main className="container flex-1 py-10 sm:py-12">
        {authLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground font-mono">Loading contributor profile...</p>
          </div>
        ) : !user ? (
          /* Not Signed In Guard */
          <div className="max-w-md mx-auto my-12 text-center bg-card/80 border border-primary/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_20px_rgba(0,217,255,0.2)]">
              <User size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Portfolio</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Connect your account to access your personal project portfolio, submit new repositories,
              and track community moderation reviews.
            </p>
            <Button
              onClick={() => setAuthModalOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 neon-button gap-2 text-sm"
            >
              <LogIn size={16} /> Sign In or Register
            </Button>
          </div>
        ) : (
          /* Contributor Portfolio Dashboard */
          <>
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-card/90 via-slate-900 to-card/90 border border-primary/30 rounded-2xl p-6 sm:p-8 mb-8 backdrop-blur-md shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Avatar with Upload Hover Button */}
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-[0_0_20px_rgba(0,217,255,0.25)] bg-slate-900">
                      <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isUploadingAvatar}
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1 cursor-pointer"
                      title="Upload new avatar"
                    >
                      {isUploadingAvatar ? (
                        <Spinner className="size-4" />
                      ) : (
                        <>
                          <Camera size={16} />
                          <span>Change</span>
                        </>
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handleAvatarFileChange}
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {user.name}
                      </h1>
                      {user.role === "admin" ? (
                        <Badge className="bg-primary/20 text-primary border border-primary/40 text-[11px] font-semibold flex items-center gap-1">
                          <ShieldCheck size={12} /> Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold">
                          Community Member
                        </Badge>
                      )}
                      {user.executiveRole && (
                        <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
                          <Award size={12} className="text-amber-400" />
                          {user.executiveRole}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <GraduationCap size={15} className="text-secondary shrink-0" />
                      <span>{user.batch || "City University"} • {user.department || "Computer Science & Engineering"}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/80 font-mono">
                      <span>{user.email}</span>
                      {user.studentId && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-300">ID: {user.studentId}</span>
                        </>
                      )}
                      {user.githubUsername && (
                        <>
                          <span>•</span>
                          <span className="text-primary flex items-center gap-1">
                            <Github size={13} />
                            @{user.githubUsername}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-primary/40 text-primary hover:bg-primary/10 text-xs h-10 gap-1.5"
                  >
                    <Link href={`/${user.githubUsername || user.id}`}>
                      <ExternalLink size={14} />
                      <span>View Public Profile</span>
                    </Link>
                  </Button>

                  <Button
                    onClick={handleOpenAdd}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-10 px-4 neon-button gap-2 text-xs shadow-md shadow-primary/20"
                  >
                    <PlusCircle size={15} /> Submit Project
                  </Button>
                </div>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    My Submissions
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {counts.all}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <Layers size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Approved & Live
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                    {counts.approved}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Pending Review
                  </p>
                  <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${counts.pending > 0 ? "text-amber-400" : "text-white"}`}>
                    {counts.pending}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock size={20} />
                </div>
              </div>

              <div className="bg-card border border-primary/20 p-5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    Stars Earned
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">
                    {totalStars}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  <Star size={20} className="fill-amber-300" />
                </div>
              </div>
            </div>

            {/* Main Section Navigation Switcher */}
            <div className="flex items-center gap-2 mb-6 border-b border-primary/20 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setMainView("projects")}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mainView === "projects"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <Code2 size={15} />
                <span>My Projects</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setMainView("bookmarks")}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mainView === "bookmarks"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <Bookmark size={15} />
                <span>Saved Bookmarks</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
                  {bookmarkedProjects.length}
                </span>
              </button>

              <button
                onClick={() => setMainView("profile")}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mainView === "profile"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <User size={15} />
                <span>Handles & Profiles</span>
              </button>

              <button
                onClick={() => setMainView("security")}
                className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  mainView === "security"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-foreground/70 hover:text-white hover:bg-primary/10"
                }`}
              >
                <KeyRound size={15} />
                <span>Account Security</span>
              </button>
            </div>

            {/* VIEW 1: MY PROJECTS */}
            {mainView === "projects" && (
              <div>
                {/* Status Sub-tabs */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setProjectTab("all")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        projectTab === "all"
                          ? "bg-primary/20 text-primary border border-primary/40 font-bold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      All ({counts.all})
                    </button>
                    <button
                      onClick={() => setProjectTab("approved")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        projectTab === "approved"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      Approved & Live ({counts.approved})
                    </button>
                    <button
                      onClick={() => setProjectTab("pending")}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        projectTab === "pending"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      Under Review ({counts.pending})
                    </button>
                    {counts.rejected > 0 && (
                      <button
                        onClick={() => setProjectTab("rejected")}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          projectTab === "rejected"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                            : "text-muted-foreground hover:text-white"
                        }`}
                      >
                        Drafts / Rejected ({counts.rejected})
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground hidden sm:block font-mono">
                    You can pin up to 2 flagship projects to your profile.
                  </p>
                </div>

                {/* Projects Grid */}
                {projectsLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <Spinner className="size-8 text-primary" />
                    <p className="text-sm text-muted-foreground font-mono">Loading repositories...</p>
                  </div>
                ) : filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => {
                      const isPinned = user.pinnedProjectIds?.includes(project.id);

                      return (
                        <div
                          key={project.id}
                          className={`bg-card/85 border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,217,255,0.18)] ${
                            project.status === "rejected"
                              ? "border-rose-500/40"
                              : project.status === "pending"
                              ? "border-amber-500/30"
                              : "border-primary/20 hover:border-primary/60"
                          }`}
                        >
                          <div>
                            {/* Banner */}
                            <div className="relative w-full h-44 bg-slate-950 overflow-hidden border-b border-primary/15">
                              {project.thumbnailUrl ? (
                                <img
                                  src={project.thumbnailUrl}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-primary/40">
                                  <Code2 size={40} />
                                </div>
                              )}
                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className="bg-background/80 backdrop-blur-md border-primary/40 text-primary text-[10px]"
                                >
                                  {project.category}
                                </Badge>
                                {renderStatusBadge(project.status)}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                                {project.title}
                              </h3>
                              <p className="text-xs text-foreground/75 line-clamp-3 mb-4 leading-relaxed">
                                {project.description}
                              </p>

                              {/* Rejection / Moderator Feedback Callout */}
                              {project.status === "rejected" && project.moderatorFeedback && (
                                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                                  <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                                    <MessageSquare size={13} />
                                    <span>Reviewer Feedback:</span>
                                  </div>
                                  <p className="leading-relaxed">{project.moderatorFeedback}</p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {project.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-cyan-300 border border-primary/20 font-mono"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="p-5 pt-0 border-t border-primary/10 mt-auto">
                            <div className="flex items-center justify-between gap-2 pt-3">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1"
                                >
                                  <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open GitHub"
                                  >
                                    <Github size={13} />
                                    <span>Repo</span>
                                  </a>
                                </Button>

                                {/* Flagship Pin Button (max 2) */}
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => togglePinnedProject(project.id)}
                                  className={`h-8 px-2 text-xs transition-colors ${
                                    isPinned
                                      ? "border-secondary/60 bg-secondary/15 text-secondary"
                                      : "border-primary/25 text-muted-foreground hover:text-white"
                                  }`}
                                  title={isPinned ? "Unpin from Flagship showcase" : "Pin to Flagship showcase"}
                                >
                                  <Pin size={12} className={isPinned ? "fill-secondary text-secondary" : ""} />
                                </Button>
                              </div>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenEdit(project)}
                                  className="h-8 px-2.5 text-xs border-primary/40 text-primary hover:bg-primary/20 gap-1"
                                >
                                  <Edit2 size={12} />
                                  <span>{project.status === "rejected" ? "Resubmit" : "Edit"}</span>
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setProjectToDelete(project)}
                                  className="h-8 px-2 text-xs border-destructive/40 text-destructive hover:bg-destructive/15"
                                  title="Delete project"
                                >
                                  <Trash2 size={13} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-card/30 border border-dashed border-primary/30 rounded-2xl p-8 max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No projects in this view</h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      {projectTab === "all"
                        ? "You haven't submitted any repositories yet. Share your open-source projects with the community!"
                        : `No projects found with status "${projectTab}".`}
                    </p>
                    <Button
                      onClick={handleOpenAdd}
                      className="bg-primary text-primary-foreground font-semibold text-xs gap-1.5"
                    >
                      <PlusCircle size={15} /> Submit Your First Project
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: SAVED BOOKMARKS */}
            {mainView === "bookmarks" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Saved Repositories</h2>
                    <p className="text-xs text-muted-foreground">
                      Projects you bookmarked across the OSSCCU community catalogue for quick reference.
                    </p>
                  </div>
                </div>

                {bookmarkedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedProjects.map((p) => (
                      <ProjectCard key={p.id} project={p} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-card/30 border border-dashed border-primary/30 rounded-2xl p-8 max-w-md mx-auto">
                    <Bookmark size={30} className="text-primary/40 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">No Saved Projects</h3>
                    <p className="text-xs text-muted-foreground mb-5">
                      You haven&apos;t bookmarked any projects yet. Click the ribbon bookmark icon on any project card in the showcase to save it here.
                    </p>
                    <Button asChild className="bg-primary text-primary-foreground font-semibold text-xs">
                      <Link href="/projects">Explore Showcase</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: PROFILE & HANDLES */}
            {mainView === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Locked Institutional Credentials Card */}
                <div className="bg-card/75 border border-primary/20 rounded-2xl p-6 backdrop-blur-md h-fit">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Institutional Credentials
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-5 leading-relaxed">
                    University student records, official batches, and executive committee roles are verified and read-only.
                  </p>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <Label className="text-[11px] text-muted-foreground">Full Name</Label>
                      <Input
                        disabled
                        value={user.name}
                        className="bg-background/40 border-primary/20 text-slate-300 font-medium cursor-not-allowed text-xs h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">Student ID</Label>
                      <Input
                        disabled
                        value={user.studentId || "Verified Student"}
                        className="bg-background/40 border-primary/20 text-cyan-300 font-mono font-bold cursor-not-allowed text-xs h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">University Email</Label>
                      <Input
                        disabled
                        value={user.email}
                        className="bg-background/40 border-primary/20 text-slate-300 font-mono cursor-not-allowed text-xs h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">Department & Batch</Label>
                      <Input
                        disabled
                        value={`${user.department || "CSE"} • ${user.batch || "City University"}`}
                        className="bg-background/40 border-primary/20 text-slate-300 cursor-not-allowed text-xs h-9"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] text-muted-foreground">Platform Role</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border border-primary/30 text-xs">
                          {user.role}
                        </Badge>
                        {user.executiveRole && (
                          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs">
                            {user.executiveRole}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Coding Handles & Portfolios Form */}
                <div className="lg:col-span-2 bg-card/75 border border-primary/20 rounded-2xl p-6 backdrop-blur-md">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">
                    External Handles & Competitive Profiles
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Connect your GitHub, GitLab, competitive programming platforms, and portfolio to showcase them on your public contributor card.
                  </p>

                  <form onSubmit={handleSaveProfileHandles} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                          <Github size={13} className="text-primary" /> GitHub Handle
                        </Label>
                        <Input
                          value={profileForm.githubUsername}
                          onChange={(e) => setProfileForm({ ...profileForm, githubUsername: e.target.value })}
                          placeholder="e.g. torvalds"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 fill-[#FC6D26]" viewBox="0 0 24 24">
                            <path d="m23.6 9.57-1.12-3.45a1.1 1.1 0 0 0-2.1 0L19.26 9.6H4.74L3.62 6.12a1.1 1.1 0 0 0-2.1 0L.4 9.57a1.32 1.32 0 0 0 .48 1.48L12 19.38l11.12-8.33a1.32 1.32 0 0 0 .48-1.48Z" />
                          </svg>
                          GitLab Handle
                        </Label>
                        <Input
                          value={profileForm.gitlabUsername}
                          onChange={(e) => setProfileForm({ ...profileForm, gitlabUsername: e.target.value })}
                          placeholder="e.g. gitlab-dev"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">LinkedIn Profile URL</Label>
                        <Input
                          value={profileForm.linkedinUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/username"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Codeforces Handle</Label>
                        <Input
                          value={profileForm.codeforcesHandle}
                          onChange={(e) => setProfileForm({ ...profileForm, codeforcesHandle: e.target.value })}
                          placeholder="e.g. tourist"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">LeetCode Handle</Label>
                        <Input
                          value={profileForm.leetcodeHandle}
                          onChange={(e) => setProfileForm({ ...profileForm, leetcodeHandle: e.target.value })}
                          placeholder="e.g. leetcode_champ"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">HackerRank Handle</Label>
                        <Input
                          value={profileForm.hackerrankHandle}
                          onChange={(e) => setProfileForm({ ...profileForm, hackerrankHandle: e.target.value })}
                          placeholder="e.g. hackerrank_id"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">CodeChef Handle</Label>
                        <Input
                          value={profileForm.codechefHandle}
                          onChange={(e) => setProfileForm({ ...profileForm, codechefHandle: e.target.value })}
                          placeholder="e.g. chef_coder"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs text-slate-300">Personal Website / Portfolio</Label>
                        <Input
                          value={profileForm.portfolioUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                          placeholder="https://yourname.dev"
                          className="bg-background/80 border-primary/30 text-xs h-9"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-primary text-primary-foreground font-bold text-xs h-10 px-5 mt-2 neon-button"
                    >
                      {isSavingProfile ? "Saving Updates..." : "Save Profile Changes"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* VIEW 4: SECURITY & PASSWORD */}
            {mainView === "security" && (
              <div className="max-w-md bg-card/75 border border-primary/20 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={18} className="text-primary" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Change Password
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-5">
                  Update your account password for secure access to the OSSCCU platform.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-background/80 border-primary/30 text-xs h-10"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-300">Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-background/80 border-primary/30 text-xs h-10"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full bg-primary text-primary-foreground font-bold text-xs h-10 neon-button mt-2"
                  >
                    {isChangingPassword ? "Updating Password..." : "Update Password"}
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        projectToEdit={editingProject}
        onSubmit={handleFormSubmit}
      />

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!projectToDelete}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <AlertDialogContent className="bg-card border-destructive/40 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Remove &quot;{projectToDelete?.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to remove this project from your portfolio? It will also be
              removed from the public showcase.
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
    </div>
  );
}
